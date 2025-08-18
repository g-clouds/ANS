import { v4 as uuid } from 'uuid';
import { base58btc } from 'multiformats/bases/base58';
import { CID } from 'multiformats/cid';
import { sha256 } from 'multiformats/hashes/sha2';

export async function generateDID(agentId, pem) {
  const didId = `did:ans:${uuid()}`;
  const hash = await sha256.digest(new TextEncoder().encode(pem));
  const cid = CID.create(1, 0x70, hash);
  const multihash = cid.multihash.bytes;
  const did = `${didId}:${base58btc.encode(multihash)}`;
  return did;
}
