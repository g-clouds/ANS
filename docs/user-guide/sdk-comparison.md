# SDK Feature Comparison

The Agent Network System (ANS) provides Software Development Kits (SDKs) for multiple languages to help you build agents and integrate with the ANS ecosystem. This guide provides a detailed comparison of the features available in each SDK to help you choose the one that best fits your project's requirements.

### Summary

The **JavaScript/Node.js SDK is currently the most feature-complete**, implementing all core API methods and offering the most capable `anslookup` CLI tool. The **Python SDK** provides the essential registration and lookup features, while the **Java SDK** is primarily focused on the agent registration workflow.

**Recommendation:**
*   For **full-featured applications** or if you need access to the entire ANS feature set, use the **JavaScript/Node.js SDK**.
*   For **Python-based projects** that primarily need to register and discover agents, the **Python SDK** is a solid choice.
*   For **Java-based projects** that only require agent registration, the **Java SDK** provides the basic functionality.

### Detailed Feature Comparison

| Feature | JavaScript (`sdk-js`) | Python (`sdk-python`) | Java (`sdk-java`) |
| :--- | :--- | :--- | :--- |
| **Version** | `0.0.5` | `0.0.6` | `0.0.3` |
| **Package Manager** | npm (`@ans-project/sdk-js`) | PyPI (`ans-project-sdk`) | Maven (Build from source) |
| **`ANSClient` Methods** | | | |
| `register` | ✅ Yes | ✅ Yes | ✅ Yes |
| `lookup` | ✅ Yes | ✅ Yes | ✅ Yes |
| `verify` | ✅ Yes | ❌ No | ❌ No |
| `generateKeyPair` | ✅ Yes | ✅ Yes | ✅ Yes |
| **CLI Tool (`anslookup`)** | ✅ Yes | ✅ Yes | ❌ No |
| **CLI Features** | | | |
| `--query` | ✅ Yes | ✅ Yes | N/A |
| `--capabilities` | ✅ Yes | ✅ Yes | N/A |
| `--trust-level` | ✅ Yes | ✅ Yes | N/A |
| `--policy-requirements`| ✅ Yes | ❌ No | N/A |
| **Key Features** | Most complete API | Client-side validation (Pydantic) | Basic registration & lookup |
| **Maturity** | **Most Mature** | **Core Features Implemented** | **Least Mature** |


