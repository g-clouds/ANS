import requests
import json
from datetime import datetime, timezone
from collections import OrderedDict
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.asymmetric import ec, utils
from cryptography.hazmat.primitives import serialization
from pydantic import ValidationError
from .models import AgentRegistrationPayload

class ANSClient:
    """Client for interacting with the Agent Network System (ANS)."""

    def __init__(self, base_url="https://ans-register-390011077376.us-central1.run.app"):
        self.base_url = base_url

    @staticmethod
    def generate_key_pair():
        private_key = ec.generate_private_key(ec.SECP256R1())
        public_key = private_key.public_key()

        private_pem = private_key.private_bytes(
            encoding=serialization.Encoding.PEM,
            format=serialization.PrivateFormat.PKCS8,
            encryption_algorithm=serialization.NoEncryption()
        ).decode('utf-8')

        public_pem = public_key.public_bytes(
            encoding=serialization.Encoding.PEM,
            format=serialization.PublicFormat.SubjectPublicKeyInfo
        ).decode('utf-8')

        return public_pem, private_pem

    def register(self, agent_payload: dict, private_key_pem: str):
        try:
            validated_payload_model = AgentRegistrationPayload(**agent_payload)
            payload_to_process = validated_payload_model.model_dump(mode='json', exclude_unset=True)
        except ValidationError as e:
            raise ValueError(f"Agent payload validation failed: {e}") from e

        private_key = serialization.load_pem_private_key(private_key_pem.encode('utf-8'), password=None)

        key_order = [
            "agent_id", "name", "description", "organization", "logo_url",
            "website", "tags", "capabilities", "endpoints", "verification_level",
            "public_key", "data_residency", "critical_registration",
            "private_claims", "supply_chain"
        ]

        payload_to_sign_dict = OrderedDict()
        for key in key_order:
            if key in payload_to_process:
                payload_to_sign_dict[key] = payload_to_process[key]

        payload_to_sign_str = json.dumps(payload_to_sign_dict, separators=(',', ':')).encode('utf-8')

        signature_der = private_key.sign(payload_to_sign_str, ec.ECDSA(hashes.SHA256()))
        signature_hex = signature_der.hex()

        full_payload = {
            **payload_to_process,
            "proofOfOwnership": {
                "signature": signature_hex,
                "timestamp": datetime.now(timezone.utc).isoformat().replace('+00:00', 'Z')
            }
        }

        response = requests.post(f"{self.base_url}/register", json=full_payload)
        response.raise_for_status()
        return response.json()

    def lookup(self, params):
        response = requests.get(f"{self.base_url}/lookup", params=params)
        response.raise_for_status()
        return response.json()