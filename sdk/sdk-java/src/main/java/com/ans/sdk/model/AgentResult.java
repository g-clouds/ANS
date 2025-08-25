package com.ans.sdk.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;
import java.util.Map;

public class AgentResult {
    @JsonProperty("agent_id")
    private String agentId;
    private String name;
    private String description;
    private String organization;
    private List<String> capabilities;
    private Map<String, String> endpoints;
    private Verification verification;
    @JsonProperty("policy_compatibility")
    private boolean policyCompatibility;
    private String did;

    // Getters and Setters
    public String getAgentId() {
        return agentId;
    }

    public void setAgentId(String agentId) {
        this.agentId = agentId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getOrganization() {
        return organization;
    }

    public void setOrganization(String organization) {
        this.organization = organization;
    }

    public List<String> getCapabilities() {
        return capabilities;
    }

    public void setCapabilities(List<String> capabilities) {
        this.capabilities = capabilities;
    }

    public Map<String, String> getEndpoints() {
        return endpoints;
    }

    public void setEndpoints(Map<String, String> endpoints) {
        this.endpoints = endpoints;
    }

    public Verification getVerification() {
        return verification;
    }

    public void setVerification(Verification verification) {
        this.verification = verification;
    }

    public boolean isPolicyCompatibility() {
        return policyCompatibility;
    }

    public void setPolicyCompatibility(boolean policyCompatibility) {
        this.policyCompatibility = policyCompatibility;
    }

    public String getDid() {
        return did;
    }

    public void setDid(String did) {
        this.did = did;
    }

    public static class Verification {
        private String level;
        private String timestamp;
        @JsonProperty("blockchain_proof")
        private Map<String, String> blockchainProof;

        // Getters and Setters
        public String getLevel() {
            return level;
        }

        public void setLevel(String level) {
            this.level = level;
        }

        public String getTimestamp() {
            return timestamp;
        }

        public void setTimestamp(String timestamp) {
            this.timestamp = timestamp;
        }

        public Map<String, String> getBlockchainProof() {
            return blockchainProof;
        }

        public void setBlockchainProof(Map<String, String> blockchainProof) {
            this.blockchainProof = blockchainProof;
        }
    }
}
