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
  const { query, capabilities, trust_level, limit = 10, policy_requirements, agent_id } = params;
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

  if (capabilities) {
    q = q.where('capabilities', 'array-contains-any', capabilities);
  }

  // Apply policy verification_status in query if possible, as it's an exact match and more efficient.
  if (policy_requirements && policy_requirements.verification_status) {
      q = q.where('verification_status', '==', policy_requirements.verification_status);
  }

  const snap = await q.limit(Number(limit)).get();

  const results = snap.docs
    .map(d => d.data())
    .filter(agent => {
      // In-memory filtering for the main capabilities query (AND logic)
      if (capabilities && capabilities.length > 0) {
        if (!capabilities.every(cap => agent.capabilities?.includes(cap))) {
          return false;
        }
      }

      // In-memory filtering for policy capabilities is handled by the checkPolicyCompatibility function
      // during the final mapping. No separate filter step is needed here.

      return true;
    })
    .map(agent => {
      return {
        agent_id: agent.agent_id,
        did: agent.did,
        name: agent.name,
        description: agent.description,
        organization: agent.organization,
        endpoints: agent.endpoints,
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
    next_page_token: snap.docs.length === Number(limit) ? snap.docs.at(-1).id : null,
  };
}

export async function lookupHandler(req, res) {
  const results = await performLookup(req.query);
  res.send(results);
}
