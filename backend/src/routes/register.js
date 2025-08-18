import { Firestore } from '@google-cloud/firestore';
import { PubSub } from '@google-cloud/pubsub';
import crypto from 'crypto';
import { generateDID } from '../utils/did.js';
import { registerSchema } from '../models/schemas.js';

const db = new Firestore();
const pubsub = new PubSub();
const syncTopic = pubsub.topic('ans-sync');

export { db, syncTopic };

export async function registerHandler(req, res) {
  try {
    const { error, value: payload } = registerSchema.validate(req.body);
    if (error) return res.status(400).send({ success: false, message: error.message });

    const { proofOfOwnership, ...agent } = payload;

    // Verify proof-of-ownership
    const verify = crypto.createVerify('SHA256');
    verify.update(JSON.stringify(agent));
    verify.end();
    const pubKey = crypto.createPublicKey(agent.public_key);
    const ok = verify.verify(pubKey, proofOfOwnership.signature, 'hex');
    if (!ok) return res.status(401).send({ success: false, message: 'Invalid proof' });

    // Enrich
    const enriched = {
      ...agent,
      did: String(await generateDID(agent.agent_id, agent.public_key)), // Explicitly convert to String
      verification_status: 'provisional',
      created_at: new Date(),
    };

    await db.collection('agents').doc(agent.agent_id).set(enriched);

    // Emit async sync
    await syncTopic.publishJSON({
      type: 'agent_register',
      agent_id: agent.agent_id,
      priority: agent.critical_registration ? 'priority' : 'standard',
    });

    res.status(202).send({
      status: 'success',
      registration: {
        agent_id: agent.agent_id,
        provisional_status: 'registered',
        verification_pending: true,
        verification_id: crypto.randomUUID(),
        estimated_verification_time: '30s',
        data_residency_confirmed: agent.data_residency || [],
        private_claims: { commitments_recorded: Object.keys(agent.private_claims || {}).length },
        attestation_verification: { status: 'in_progress' },
      },
    });
  } catch (e) {
    res.status(500).send({ success: false, message: e.message });
  }
}
