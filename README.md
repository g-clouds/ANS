# Agent Network System (ANS) Specification

[![Documentation Status](https://img.shields.io/website?url=https%3A%2F%2Fg-clouds.github.io%2FANS%2F&label=docs&style=flat-square)](https://g-clouds.github.io/ANS/)
[![GitHub release (latest by date)](https://img.shields.io/github/v/release/g-clouds/ans?style=flat-square)](https://github.com/g-clouds/ans/releases/latest)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg?style=flat-square)](https://opensource.org/licenses/Apache-2.0)

An open specification for a foundational hybrid architecture enabling secure discovery, multi-level trust, and confidential verification for AI agent ecosystems. ANS provides the critical infrastructure for agents to find and establish trust with each other, complementing a wide range of agent communication protocols like Google's A2A, IBM's ACP, the Model Context Protocol (MCP), and future interoperability standards.

The Agent Network System (ANS) addresses a fundamental need as AI agents proliferate: a reliable and secure way for agents to discover, verify, and connect. While various protocols define *how* agents communicate, ANS defines the underlying network services that make such communication scalable and trustworthy across diverse organizational and technical boundaries.

---

## Demonstrations and Use Cases

Explore our YouTube playlist to see the Agent Network System in action, including tutorials, demonstrations of core features, and recordings of our community tests.

*   **[ANS Features & Testing Playlist](https://www.youtube.com/playlist?list=PLkSabrhCEOUc4RJyT5mGxEQpwhMlkOoQR)**

---

**ANS enables agents to:**

* **Discover** other agents by human-readable identifiers or capabilities, regardless of the underlying communication protocol they use.
* **Verify** the identity, authenticity, and attested capabilities of other agents through multiple trust levels.
* **Connect** with confidence, leveraging cryptographic proofs and (optionally) blockchain-based verification, before engaging in protocol-specific interactions.
* **Maintain** data sovereignty and control over agent interactions.
* **Operate** within a zero-trust security model.

## Registering New Agents

For Agent developers to register their AI agents while they are building their AI agents. The following SDK packages are publicly available.

### JavaScript/TypeScript SDK (sdk-js)

[![npm version](https://badge.fury.io/js/%40ans-project%2Fsdk-js.svg)](https://www.npmjs.com/package/@ans-project/sdk-js)

Install the package from the npm public repo:

```bash
npm install -g @ans-project/sdk-js
```

The JavaScript/TypeScript SDK provides a client library to interact with the ANS backend for agent registration.

### Java SDK (sdk-java)

[![Maven Package](https://img.shields.io/badge/Maven-sdk--java-blue)](https://github.com/g-clouds/ANS/packages/2623395)

Include the Maven package in your project's `pom.xml`.

Install 1/2: Add this to pom.xml:

```java
<dependency>
  <groupId>io.github.ans-project</groupId>
  <artifactId>sdk-java</artifactId>
  <version>0.0.3</version>
</dependency>
```

Install 2/2: Run via command line

```bash
    mvn install
```

## `anslookup` CLI: The `nslookup` for AI Agents

The `anslookup` CLI is a powerful command-line tool for interacting with the Agent Network System. Just as `nslookup` is used to query the Domain Name System (DNS) for information about servers, `anslookup` allows you to query the ANS for information about registered AI agents. This tool is essential for increasing the accessibility and discoverability of AI agents, whether they are on a global, public network (like a centralized global registry for AI agents) or a private, internal ANS.


**Installation:**

```bash
npm install -g @ans-project/sdk-js
```

**Usage:**

```bash
# Lookup an agent by its ID
anslookup <agent_Id>
anslookup translator.ans

# Query for agents with specific attributes
anslookup --query "sales-assistant" --capability "customer_support" --trust-level "verified"
```

**Options:**

* `--query`: The name or keyword to search for.
* `--capability`: A required capability of the agent.
* `--trust-level`: The minimum trust level required (e.g., `verified`, `blockchain`).
* `--limit`: The maximum number of results to return.
* `--policy-requirements`: A JSON string with policy requirements.
* `--endpoint`: The ANS network endpoint to use.


## Why ANS?

As the vision of interconnected AI agents becomes a reality, the limitations of ad-hoc discovery and manual trust establishment become apparent. ANS aims to:

* **Bridge the Discovery Gap:** Provide a global, standardized discovery mechanism, analogous to DNS for the internet, but for AI agents using any communication standard.
* **Establish Verifiable Trust:** Introduce robust, multi-level verification processes, from basic signatures to blockchain consensus, ensuring trustworthy interactions for any agent-to-agent engagement.
* **Enable a True Agent Ecosystem:** Foster interoperability and collaboration by allowing agents built on different platforms, by different entities, and using various communication protocols (e.g., A2A, ACP, MCP) to securely find and interact with each other.
* **Complement All Agent Communication Protocols:** Provide the "who is this agent?" and "are they trustworthy?" layers that any agent communication protocol can build upon for its specific interaction patterns.

## Key Features of ANS

* **Hybrid Architecture:** Combines high-performance centralized services for discovery with a decentralized trust layer (e.g., blockchain) for verification.
* **Progressive Trust:** Multi-level verification (Basic, Standard, Blockchain) to balance performance and security needs.
* **Global Discovery & High Performance:** Milliseconds-level lookups at global scale.
* **Zero-Trust Security:** Continuous verification at all levels, with no implicit trust.
* **Sovereignty Enablement:** Mechanisms for data residency and organizational control.
* **Standards Alignment:** Designed for integration with DIDs, DNS-SD, gRPC, OpenAPI, and to support emerging agent protocols.
* **AI Supply Chain Verification:** Support for AIBOMs and verification of agent components.
* **Protocol Agnostic:** Designed to support discovery and verification for agents regardless of the specific communication protocol they implement.

## Getting Started

📚 **Explore the Full Specification:** Visit the **[Agent Network System (ANS) Documentation Site](https://g-clouds.github.io/ANS/)** for the complete specification, architectural details, core operations, algorithms, and API examples.

## Relationship to Agent Communication Protocols

ANS is designed as a foundational layer that enhances and supports a diverse range of agent communication and interaction protocols by providing essential discovery and verification services:

* **Google's Agent2Agent (A2A):** While A2A defines how agents communicate *after* discovery, ANS provides the mechanisms for agents to *find and verify* each other before initiating A2A sessions. (See Section 7.1 in the specification).
* **IBM's Agent Communication Protocol (ACP):** ANS can serve as the discovery and trust establishment layer for agents intending to use ACP for broader communication, delegation, and orchestration.
* **Model Context Protocol (MCP):** ANS can help agents discover and verify MCP servers and the tools they offer, ensuring trusted access to external capabilities for AI models. (See Section 7.2 in the specification).
* **Future Protocols:** ANS's extensible design aims to support discovery and verification for new and emerging agent interoperability standards.

ANS provides the trust and discovery infrastructure, while specific protocols like A2A, ACP, and MCP handle the direct communication formats and interaction patterns.

## Contributing

This ANS specification is currently a **Version [![GitHub release (latest by date)](https://img.shields.io/github/v/release/g-clouds/ans?style=flat-square)](https://github.com/g-clouds/ans/releases/latest) – Request for Comment**. We actively welcome community contributions, feedback, and collaboration from developers, researchers, and organizations working across the AI agent landscape to refine and evolve this foundational standard.

A summary of changes can be found in the [CHANGELOG.md](CHANGELOG.md) file.

* **Questions & Discussions:** Join our [GitHub Discussions](https://github.com/g-clouds/ans/discussions)
* **Issues & Feedback:** Report errors, suggest improvements, or propose changes via [GitHub Issues](https://github.com/g-clouds/ans/issues).
* **Contribution Guide:** (Consider creating a `CONTRIBUTING.md` file detailing how to contribute).

## What's Next (Roadmap Highlights)

The ANS specification is an evolving standard. Key areas for future work include:

* Formalization through a recognized standards body.
* Development of open-source reference implementations.
* Establishment of a cross-industry governance model.
* Creation of conformance test suites and certification processes.
* Further development of the Validator Reputation System and Zero-Knowledge Proof System.
* Refinement of the policy language and AIBOM format.

(Refer to Section 11: Milestone-Driven Roadmap in the full specification for more details.)

## Infrastructure Deployment

The infrastructure for the Agent Network System can be deployed using the provided Terraform configuration. This setup will create a new GCP project and configure all the necessary services.

For detailed instructions on how to deploy the infrastructure, please refer to the [Terraform Setup Guide](terraform/README.md).

## Installation Guide

This guide provides step-by-step instructions to deploy and run the Agent Network System (ANS) application on Google Cloud Platform.

### Prerequisites

* Google Cloud Platform (GCP) Account
* `gcloud` CLI installed and configured
* Terraform installed
* Git installed

### 1. GCP Project Setup (Terraform)

This project uses Terraform to provision the necessary GCP infrastructure.

* **Configure Terraform Variables:**
  * Update `terraform/terraform.tfvars` with your GCP project details (`project_id`, `billing_account`, `org_id`).
* **Deploy Infrastructure:**
  * Commit your changes to trigger the Cloud Build pipeline defined in `terraform/cloudbuild.yaml`. This pipeline will automatically initialize Terraform and apply the configuration, creating:
    * A new GCP Project
    * Firestore Database
    * Artifact Registry Repository
    * Cloud Build Source Bucket
    * Required Service Accounts and IAM Permissions

### 2. Build and Push Docker Image

Once the Terraform infrastructure is deployed, build and push the backend Docker image to Artifact Registry.

* **Local Setup:**
  * Follow the instructions in `image-build/README.md` to set up your local environment for building Docker images, including activating the appropriate service account.
* **Build and Push:**
  * Run the `gcloud builds submit` command as detailed in `image-build/README.md`. This will build the Docker image from the `backend` directory and push it to your Artifact Registry.

### 3. Deploy Cloud Run Service

After the Docker image is pushed, deploy the backend as a Cloud Run service.

* **Update Terraform:**
  * The Cloud Run service definition has been added to `terraform/main.tf`.
* **Deploy Service:**
  * Commit the changes to `terraform/main.tf` (if not already committed). This will trigger the Cloud Build pipeline again, which will deploy the Cloud Run service.

## Document update

The documentation site is built using [MkDocs](https://www.mkdocs.org/) with the [Material for MkDocs](https://squidfunk.github.io/mkdocs-material/) theme.

1. **Clone the repository:**

   ```bash
   git clone https://github.com/g-clouds/ANS.git
   cd ans
   ```
2. **Install dependencies:**
   (Ensure you have Python and pip installed)

   ```bash
   pip install mkdocs mkdocs-material pymdown-extensions
   ```
3. **Serve the site:**

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
