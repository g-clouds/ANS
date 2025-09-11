from typing import List, Optional, Dict, Any
from pydantic import BaseModel, HttpUrl

class Endpoints(BaseModel):
    a2a: Optional[HttpUrl] = None
    rest: Optional[HttpUrl] = None
    policy_negotiation: Optional[HttpUrl] = None

class VerificationAttestation(BaseModel):
    type: Optional[str] = None
    issuer: Optional[str] = None
    certificate_id: Optional[str] = None
    validity_url: Optional[HttpUrl] = None
    valid_until: Optional[str] = None

class SupplyChain(BaseModel):
    aibom_url: Optional[HttpUrl] = None
    aibom_hash: Optional[str] = None
    verification_attestations: Optional[List[VerificationAttestation]] = None

class AgentRegistrationPayload(BaseModel):
    agent_id: str
    name: str
    description: Optional[str] = None
    organization: Optional[str] = None
    logo_url: Optional[HttpUrl] = None
    website: Optional[HttpUrl] = None
    tags: Optional[List[str]] = None
    capabilities: Optional[List[str]] = None
    endpoints: Optional[Endpoints] = None
    verification_level: Optional[str] = None
    public_key: str
    data_residency: Optional[List[str]] = None
    critical_registration: Optional[bool] = None
    private_claims: Optional[Dict[str, Any]] = None
    supply_chain: Optional[SupplyChain] = None

    class Config:
        extra = 'forbid'
