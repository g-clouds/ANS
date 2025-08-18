import Joi from 'joi';

export const registerSchema = Joi.object({
  agent_id: Joi.string().required(),
  name: Joi.string().required(),
  description: Joi.string(),
  organization: Joi.string(),
  logo_url: Joi.string().uri(),
  website: Joi.string().uri(),
  tags: Joi.array().items(Joi.string()),
  capabilities: Joi.array().items(Joi.string()),
  endpoints: Joi.object({
    a2a: Joi.string().uri(),
    rest: Joi.string().uri(),
    policy_negotiation: Joi.string().uri(),
  }),
  verification_level: Joi.string(),
  public_key: Joi.string().required(),
  data_residency: Joi.array().items(Joi.string()),
  critical_registration: Joi.boolean(),
  private_claims: Joi.object(),
  supply_chain: Joi.object({
    aibom_url: Joi.string().uri(),
    aibom_hash: Joi.string(),
    verification_attestations: Joi.array().items(
      Joi.object({
        type: Joi.string(),
        issuer: Joi.string(),
        certificate_id: Joi.string(),
        validity_url: Joi.string().uri(),
        valid_until: Joi.string().isoDate(),
      })
    ),
  }),
  proofOfOwnership: Joi.object({ signature: Joi.string().hex(), timestamp: Joi.string().isoDate() }).required(),
});
