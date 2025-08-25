import { Firestore } from '@google-cloud/firestore';
const db = new Firestore();

export async function didDocumentHandler(req, res) {
  const { id } = req.params; // did:ans:<agent_id>
  const agentId = id.replace('did:ans:', '');
  const doc = await db.collection('agents').doc(agentId).get();
  if (!doc.exists) return res.status(404).send({});

  const { did, endpoints } = doc.data();
  res.type('application/did+json').send({
    '@context': ['https://www.w3.org/ns/did/v1'],
    id: did.id,
    controller: did.controller,
    verificationMethod: did.verificationMethod,
    service: [
      {
        id: `${did.id}#a2a`,
        type: 'AgentToAgentService',
        serviceEndpoint: endpoints?.a2a || '',
      },
    ],
  });
}
