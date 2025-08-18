package com.ans.sdk.model;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;
import java.util.Map;

public class Agent {
    @JsonProperty("agent_id")
    private String agentId;
    private String name;
    private String description;
    private String organization;
    private List<String> capabilities;
    private Endpoints endpoints;
    @JsonProperty("public_key")
    private String publicKey;
    @JsonProperty("proofOfOwnership")
    private ProofOfOwnership proofOfOwnership;

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

    public Endpoints getEndpoints() {
        return endpoints;
    }

    public void setEndpoints(Endpoints endpoints) {
        this.endpoints = endpoints;
    }

    public String getPublicKey() {
        return publicKey;
    }

    public void setPublicKey(String publicKey) {
        this.publicKey = publicKey;
    }

    public ProofOfOwnership getProofOfOwnership() {
        return proofOfOwnership;
    }

    public void setProofOfOwnership(ProofOfOwnership proofOfOwnership) {
        this.proofOfOwnership = proofOfOwnership;
    }

    public static class Endpoints {
        private String a2a;
        private String rest;

        public String getA2a() {
            return a2a;
        }

        public void setA2a(String a2a) {
            this.a2a = a2a;
        }

        public String getRest() {
            return rest;
        }

        public void setRest(String rest) {
            this.rest = rest;
        }
    }
}
