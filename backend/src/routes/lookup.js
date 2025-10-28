import { Firestore } from '@google-cloud/firestore';
const db = new Firestore();

function checkPolicyCompatibility(agent, policy_requirements) {
  if (!policy_requirements) {
    return true;
  }

  if (policy_requirements.verification_status && agent.verification_status !== policy_requirements.verification_status) {
    return false;
  }

  if (policy_requirements.capabilities && !policy_requirements.capabilities.every(cap => agent.capabilities?.includes(cap))) {
    return false;
  }

  return true;
}


export async function performLookup(params) {
  // Filter out empty string, null, and undefined parameters from params
  const filteredParams = Object.fromEntries(
    Object.entries(params).filter(([_, value]) => value !== '' && value !== undefined && value !== null)
  );

  const { query, trust_level, limit = 10, agent_id } = filteredParams;
  let policy_requirements = filteredParams.policy_requirements;

  if (policy_requirements && typeof policy_requirements === 'string') {
    try {
      policy_requirements = JSON.parse(policy_requirements);
    } catch (e) {
      // Not a valid JSON string, treat as a simple string or ignore
      console.error('Could not parse policy_requirements:', e);
      policy_requirements = undefined;
    }
  }
  let capabilities = filteredParams.capabilities;
  let q = db.collection('agents');

  if (agent_id) {
    q = q.where('agent_id', '==', agent_id);
  }

  if (trust_level) {
    q = q.where('verification_status', '==', trust_level);
  }

  if (query) {
    // Firestore doesn't support full-text search, so we'll do a simple prefix search
    q = q.where('name', '>=', query).where('name', '<=', query + '\uf8ff');
  }

  // Normalize capabilities so both comma-separated strings and array formats work
  let cleanedCapabilities = [];
  if (Array.isArray(capabilities)) {
    // If it's already an array, flatten and split any comma-separated values inside
    cleanedCapabilities = capabilities
      .flatMap(cap => (typeof cap === 'string' ? cap.split(',') : []))
      .map(cap => cap.trim())
      .filter(cap => cap !== '');
  } else if (typeof capabilities === 'string' && capabilities.trim() !== '') {
    // If it's a single string, allow comma-separated values
    cleanedCapabilities = capabilities.split(',')
      .map(cap => cap.trim())
      .filter(cap => cap !== '');
  }

  if (cleanedCapabilities.length > 0) {
    q = q.where('capabilities', 'array-contains-any', cleanedCapabilities);
  }

  // Apply policy verification_status in query if possible, as it's an exact match and more efficient.
  if (policy_requirements && policy_requirements.verification_status) {
      q = q.where('verification_status', '==', policy_requirements.verification_status);
  }

  let actualLimit = Number(limit);
  if (isNaN(actualLimit) || actualLimit <= 0) {
    actualLimit = 10; // Default limit
  }
  const snap = await q.limit(actualLimit).get();

  const results = snap.docs
    .map(d => d.data())
    .filter(agent => {
      // In-memory filtering for the main capabilities query (AND logic)
      if (cleanedCapabilities.length > 0) {
        // Ensure agent.capabilities is an array before checking includes
        const agentCaps = Array.isArray(agent.capabilities) ? agent.capabilities : [];
        if (!cleanedCapabilities.every(cap => agentCaps.includes(cap))) {
          return false;
        }
      }

      // In-memory filtering for policy capabilities is handled by the checkPolicyCompatibility function
      // during the final mapping. No separate filter step is needed here.

      return true;
    })
    .map(agent => {
      // Manually reconstruct the endpoints object to ensure it's a plain, serializable object.
      // This handles any protocol (a2a, ap2, acp, mcp, etc.) that might be present.
      const endpoints = agent.endpoints ? { ...agent.endpoints } : {};

      return {
        agent_id: agent.agent_id,
        did: agent.did,
        name: agent.name,
        description: agent.description,
        organization: agent.organization,
        public_key: agent.public_key,
        endpoints: endpoints,
        capabilities: agent.capabilities,
        verification: {
          level: agent.verification_status,
          timestamp: agent.updated_at, // Assuming updated_at is the verification timestamp
          blockchain_proof: agent.blockchain_proof,
        },
        policy_compatibility: checkPolicyCompatibility(agent, policy_requirements),
      };
    });

  return {
    status: 'success',
    results,
    total_matches: results.length, // Reflects the count after in-memory filtering
    next_page_token: snap.docs.length === actualLimit ? snap.docs.at(-1).id : null,
  };
}

export async function lookupHandler(req, res) {
  const results = await performLookup(req.query);
  res.send(results);
}
