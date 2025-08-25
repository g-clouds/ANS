import supertest from 'supertest';
import { expect } from 'chai';
import express from 'express';
import { registerHandler, db, syncTopic } from '../src/routes/register.js';
import crypto from 'crypto';
import sinon from 'sinon';

const app = express();
app.use(express.json());
app.post('/register', registerHandler);

describe('API Tests', () => {
  let dbStub, syncTopicStub;

  beforeEach(() => {
    dbStub = sinon.stub(db, 'collection').returns({
      doc: sinon.stub().returns({
        set: sinon.stub().resolves(),
      }),
    });
    syncTopicStub = sinon.stub(syncTopic, 'publishJSON').resolves();
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should register an agent', function(done) {
    this.timeout(10000);
    const keyPair = crypto.generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: { type: 'spki', format: 'pem' },
      privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
    });
    const agentData = {
      agent_id: 'test-agent',
      name: 'Test Agent',
      public_key: keyPair.publicKey,
    };
    const sign = crypto.createSign('SHA256');
    sign.update(JSON.stringify(agentData));
    sign.end();
    const signature = sign.sign(keyPair.privateKey, 'hex');

    supertest(app)
      .post('/register')
      .send({ ...agentData, proofOfOwnership: { signature, timestamp: new Date().toISOString() } })
      .end((err, res) => {
        expect(res.status).to.equal(202);
        expect(res.body.status).to.equal('success');
        done();
      });
  });
});
