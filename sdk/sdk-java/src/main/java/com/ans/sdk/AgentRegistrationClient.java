package com.ans.sdk;

import com.ans.sdk.model.Agent;
import com.ans.sdk.model.ProofOfOwnership;
import com.ans.sdk.model.LookupResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import okhttp3.*;

import java.io.IOException;
import java.security.*;
import java.security.spec.ECGenParameterSpec;
import java.time.Instant;
import java.util.Base64;
import java.util.List;
import java.util.Map;

public class AgentRegistrationClient {

    private final OkHttpClient httpClient;
    private final ObjectMapper objectMapper;
    private final String cloudRunEndpoint;

    public AgentRegistrationClient(String cloudRunEndpoint) {
        this.cloudRunEndpoint = cloudRunEndpoint;
        this.httpClient = new OkHttpClient();
        this.objectMapper = new ObjectMapper();
    }

    public KeyPair generateKeyPair() throws NoSuchAlgorithmException, InvalidAlgorithmParameterException {
        KeyPairGenerator keyGen = KeyPairGenerator.getInstance("EC");
        ECGenParameterSpec ecSpec = new ECGenParameterSpec("secp256r1"); // prime256v1 is secp256r1
        keyGen.initialize(ecSpec, new SecureRandom());
        return keyGen.generateKeyPair();
    }

    public String exportPublicKeyToPem(PublicKey publicKey) {
        // Export public key to PEM format (SPKI)
        return "-----BEGIN PUBLIC KEY-----\n" +
               Base64.getMimeEncoder().encodeToString(publicKey.getEncoded()) +
               "\n-----END PUBLIC KEY-----\n";
    }

    public String exportPrivateKeyToPem(PrivateKey privateKey) throws IOException {
        // Export private key to PEM format (PKCS#8)
        // This is a simplified export. For production, consider using Bouncy Castle for full PKCS#8 encoding
        // with proper headers and footers if not already handled by getEncoded()
        return "-----BEGIN PRIVATE KEY-----" + "\n" +
               Base64.getMimeEncoder().encodeToString(privateKey.getEncoded()) +
               "\n" + "-----END PRIVATE KEY-----";
    }

    public String signPayload(PrivateKey privateKey, Agent agentData) throws Exception {
        // Convert agentData to JSON string for signing
        // Exclude proofOfOwnership for signing
        Map<String, Object> agentMap = objectMapper.convertValue(agentData, Map.class);
        agentMap.remove("proofOfOwnership"); // Ensure this field is not included in the signed message

        String message = objectMapper.writeValueAsString(agentMap);

        Signature signature = Signature.getInstance("SHA256withECDSA");
        signature.initSign(privateKey);
        signature.update(message.getBytes("UTF-8"));
        return bytesToHex(signature.sign());
    }

    public String registerAgent(Agent agent) throws IOException {
        String jsonPayload = objectMapper.writeValueAsString(agent);

        RequestBody body = RequestBody.create(jsonPayload, MediaType.get("application/json"));

        Request request = new Request.Builder()
                .url(cloudRunEndpoint + "/register")
                .post(body)
                .build();

        try (Response response = httpClient.newCall(request).execute()) {
            if (!response.isSuccessful()) {
                throw new IOException("Unexpected code " + response + "\n" + response.body().string());
            }
            return response.body().string();
        }
    }

    public LookupResponse lookup(Map<String, String> params) throws IOException {
        HttpUrl.Builder urlBuilder = HttpUrl.parse(cloudRunEndpoint + "/lookup").newBuilder();
        if (params != null) {
            for (Map.Entry<String, String> entry : params.entrySet()) {
                urlBuilder.addQueryParameter(entry.getKey(), entry.getValue());
            }
        }
        String url = urlBuilder.build().toString();

        Request request = new Request.Builder()
                .url(url)
                .get()
                .build();

        try (Response response = httpClient.newCall(request).execute()) {
            if (!response.isSuccessful()) {
                throw new IOException("Unexpected code " + response + "\n" + response.body().string());
            }
            return objectMapper.readValue(response.body().string(), LookupResponse.class);
        }
    }

    private String bytesToHex(byte[] bytes) {
        StringBuilder sb = new StringBuilder();
        for (byte b : bytes) {
            sb.append(String.format("%02x", b));
        }
        return sb.toString();
    }
}