# Agent Network System (ANS) Specification

[![Documentation Status](https://img.shields.io/website?url=https%3A%2F%2Fg-clouds.github.io%2FANS%2F&label=docs&style=flat-square)](https://g-clouds.github.io/ANS/)
[![GitHub release (latest by date)](https://img.shields.io/github/v/release/g-clouds/ans?style=flat-square)](https://github.com/g-clouds/ans/releases/latest)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg?style=flat-square)](https://opensource.org/licenses/Apache-2.0)

An open specification for a foundational hybrid architecture enabling secure discovery, multi-level trust, and confidential verification for AI agent ecosystems. ANS provides the critical infrastructure for agents to find and establish trust with each other, complementing a wide range of agent communication protocols like Google's A2A, IBM's ACP, the Model Context Protocol (MCP), and future interoperability standards.

The Agent Network System (ANS) addresses a fundamental need as AI agents proliferate: a reliable and secure way for agents to discover, verify, and connect. While various protocols define *how* agents communicate, ANS defines the underlying network services that make such communication scalable and trustworthy across diverse organizational and technical boundaries.

**ANS enables agents to:**

*   **Discover** other agents by human-readable identifiers or capabilities, regardless of the underlying communication protocol they use.
*   **Verify** the identity, authenticity, and attested capabilities of other agents through multiple trust levels.
*   **Connect** with confidence, leveraging cryptographic proofs and (optionally) blockchain-based verification, before engaging in protocol-specific interactions.
*   **Maintain** data sovereignty and control over agent interactions.
*   **Operate** within a zero-trust security model.

## Why ANS?

As the vision of interconnected AI agents becomes a reality, the limitations of ad-hoc discovery and manual trust establishment become apparent. ANS aims to:

*   **Bridge the Discovery Gap:** Provide a global, standardized discovery mechanism, analogous to DNS for the internet, but for AI agents using any communication standard.
*   **Establish Verifiable Trust:** Introduce robust, multi-level verification processes, from basic signatures to blockchain consensus, ensuring trustworthy interactions for any agent-to-agent engagement.
*   **Enable a True Agent Ecosystem:** Foster interoperability and collaboration by allowing agents built on different platforms, by different entities, and using various communication protocols (e.g., A2A, ACP, MCP) to securely find and interact with each other.
*   **Complement All Agent Communication Protocols:** Provide the "who is this agent?" and "are they trustworthy?" layers that any agent communication protocol can build upon for its specific interaction patterns.

## Key Features of ANS

*   **Hybrid Architecture:** Combines high-performance centralized services for discovery with a decentralized trust layer (e.g., blockchain) for verification.
*   **Progressive Trust:** Multi-level verification (Basic, Standard, Blockchain) to balance performance and security needs.
*   **Global Discovery & High Performance:** Milliseconds-level lookups at global scale.
*   **Zero-Trust Security:** Continuous verification at all levels, with no implicit trust.
*   **Sovereignty Enablement:** Mechanisms for data residency and organizational control.
*   **Standards Alignment:** Designed for integration with DIDs, DNS-SD, gRPC, OpenAPI, and to support emerging agent protocols.
*   **AI Supply Chain Verification:** Support for AIBOMs and verification of agent components.
*   **Protocol Agnostic:** Designed to support discovery and verification for agents regardless of the specific communication protocol they implement.

## Getting Started

📚 **Explore the Full Specification:** Visit the **[Agent Network System (ANS) Documentation Site](https://g-clouds.github.io/ANS/)** for the complete specification, architectural details, core operations, algorithms, and API examples.

## Relationship to Agent Communication Protocols

ANS is designed as a foundational layer that enhances and supports a diverse range of agent communication and interaction protocols by providing essential discovery and verification services:

*   **Google's Agent2Agent (A2A):** While A2A defines how agents communicate *after* discovery, ANS provides the mechanisms for agents to *find and verify* each other before initiating A2A sessions. (See Section 7.1 in the specification).
*   **IBM's Agent Communication Protocol (ACP):** ANS can serve as the discovery and trust establishment layer for agents intending to use ACP for broader communication, delegation, and orchestration.
*   **Model Context Protocol (MCP):** ANS can help agents discover and verify MCP servers and the tools they offer, ensuring trusted access to external capabilities for AI models. (See Section 7.2 in the specification).
*   **Future Protocols:** ANS's extensible design aims to support discovery and verification for new and emerging agent interoperability standards.

ANS provides the trust and discovery infrastructure, while specific protocols like A2A, ACP, and MCP handle the direct communication formats and interaction patterns.

## Contributing

This ANS specification is currently a **Version [![GitHub release (latest by date)](https://img.shields.io/github/v/release/g-clouds/ans?style=flat-square)](https://github.com/g-clouds/ans/releases/latest) – Request for Comment**. We actively welcome community contributions, feedback, and collaboration from developers, researchers, and organizations working across the AI agent landscape to refine and evolve this foundational standard.

A summary of changes can be found in the [CHANGELOG.md](CHANGELOG.md) file.


*   **Questions & Discussions:** Join our [GitHub Discussions](https://github.com/g-clouds/ans/discussions)
*   **Issues & Feedback:** Report errors, suggest improvements, or propose changes via [GitHub Issues](https://github.com/g-clouds/ans/issues).
*   **Contribution Guide:** (Consider creating a `CONTRIBUTING.md` file detailing how to contribute).

## What's Next (Roadmap Highlights)

The ANS specification is an evolving standard. Key areas for future work include:

*   Formalization through a recognized standards body.
*   Development of open-source reference implementations.
*   Establishment of a cross-industry governance model.
*   Creation of conformance test suites and certification processes.
*   Further development of the Validator Reputation System and Zero-Knowledge Proof System.
*   Refinement of the policy language and AIBOM format.

(Refer to Section 11: Milestone-Driven Roadmap in the full specification for more details.)

## Building Locally

The documentation site is built using [MkDocs](https://www.mkdocs.org/) with the [Material for MkDocs](https://squidfunk.github.io/mkdocs-material/) theme.

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/g-clouds/ans.git
    cd ans
    ```
2.  **Install dependencies:**
    (Ensure you have Python and pip installed)
    ```bash
    pip install mkdocs mkdocs-material pymdown-extensions
    ```
3.  **Serve the site:**
    ```bash
    mkdocs serve
    ```
    The site will be available at `http://127.0.0.1:8000/`.

## License

The Agent Network System (ANS) Specification is licensed under the **Apache License 2.0**. See the [LICENSE](LICENSE) file for details.

## About

The Agent Network System (ANS) is an open-source project initiated by **gClouds R&D | gLabs**, under the **Apache License 2.0**. We are committed to developing ANS as an open standard and warmly welcome contributions, feedback, and collaboration from the broader AI and agent technology community. Our goal is to foster a robust and interoperable ecosystem for AI agents.

---

*gClouds R&D | gLabs*