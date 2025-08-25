// packages/sdk/src/index.ts
import axios, { AxiosInstance } from 'axios';
import crypto from 'crypto';

export interface AgentPayload {
  agent_id: string;
  name: string;
  description?: string;
  capabilities: string[];
  endpoints: { a2a?: string; rest?: string; policy_negotiation?: string };
  verification_level?: 'basic' | 'standard' | 'blockchain';
  data_residency?: string[];
  critical_registration?: boolean;
  public_key: string;
  private_claims?: Record<string, any>;
  supply_chain?: any;
}

export class ANSClient {
  private api: AxiosInstance;
  constructor(baseURL: string, apiKey?: string) {
    this.api = axios.create({ baseURL, headers: apiKey ? { Authorization: `Bearer ${apiKey}` } : {} });
  }

  async register(payload: AgentPayload, privateKeyPEM: string) {
    const sign = crypto.createSign('SHA256');
    sign.update(JSON.stringify(payload));
    const signature = sign.sign(privateKeyPEM, 'hex');

    const res = await this.api.post('/register', { ...payload, proofOfOwnership: { signature, timestamp: new Date().toISOString() } });
    return res.data;
  }

  async lookup(params: { query?: string; agent_id?: string; capabilities?: string[]; trust_level?: string; limit?: number; policy_requirements?: { verification_status?: string; capabilities?: string[]; }; }) {
    const res = await this.api.get('/lookup', { params: params });
    return res.data;
  }

  static generateKeyPair() {
    const { publicKey, privateKey } = crypto.generateKeyPairSync('ec', { namedCurve: 'prime256v1' });
    return {
      publicKey: publicKey.export({ format: 'pem', type: 'spki' }) as string,
      privateKey: privateKey.export({ format: 'pem', type: 'pkcs8' }) as string // Export private key as PEM
    };
  }
}