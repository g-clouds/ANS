# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## Architecture

## [0.1.3] - 2025-12-29

### Added
- **Quantum-Proof Architecture:** Introduced a comprehensive roadmap and technical specification for transitioning ANS to a Post-Quantum Cryptography (PQC) hybrid identity model.
- **PQC Proof of Concept:** Added a functional PoC (`tests/pqc-poc`) demonstrating NIST ML-DSA-87 (Dilithium5) signature generation and verification.
- **Documentation:**
    - `docs/engineering-notes/pqc-migration-roadmap.md`: Strategic roadmap for 2026 PQC rollout.
    - `docs/developer-guides/pqc-implementation-guide.md`: Developer guide for implementing hybrid keys.
    - `docs/developer-guides/pqc-poc-validation.md`: Validation report for the PQC PoC.
- **Specification Update:** Updated `docs/index.md` to include the Quantum-Proof Architecture section.

## [0.1.2] - 2025-10-28

### Added

- **Agent Payments Protocol (AP2) Integration**: Added Section 7.4 describing the integration with AP2 for secure agent payments.
- **Section Renumbering**: Renumbered "Cross-Protocol Workflow Examples" to Section 7.5.
- **Community & Governance**: Added `CONTRIBUTING.md` and updated README to foster community contribution.

## [0.1.1] - 2025-07-30

### Added

- Appendix H: Federated Architecture (ANS-FED-v0.1.1) to the specification. This appendix describes a federated architecture for the Agent Network System.

## [0.1.0] - 2025-05-02

### Added

- Initial public release of the Agent Network System specification.

---

## Packages (SDKs & Backend)

## [0.0.5] - 2025-10-28

### Added

- **Backend Service**:
  - The `/lookup` endpoint now returns the `public_key` for agents to enable cryptographic verification.
  - Implemented the `/verify` endpoint to allow for programmatic verification of agent claims.
- **JavaScript/TypeScript SDK (`@ans-project/sdk-js`)**:
  - Released version `0.0.5` to npm.
  - Added `--policy-requirements` flag to the `anslookup` CLI for advanced filtering.
  - The `lookup` method now includes the agent's `public_key` in the response.
- **Tests & Demonstrations**:
  - Added Test `00008` for programmatic verification using the `/verify` endpoint.
  - Added Test `00009` for a visual demonstration of the end-to-end verification workflow.
- **Documentation**:
  - Added `agent-verification-workflow.md` explaining the cryptographic principles and workflow.
  - Added `backend-api-testing-strategy.md` detailing the backend testing strategy.

### Fixed

- **Backend Service**: The `/lookup` endpoint now correctly parses `policy_requirements` when sent as a stringified JSON.
- **JavaScript/TypeScript SDK (`@ans-project/sdk-js`)**:
  - Fixed a bug in the `anslookup` CLI argument parser to correctly handle values.
  - Corrected the conversion of kebab-case arguments to snake_case for the backend API.

## [0.0.3] - 2025-08-25

### Added

- **Backend Service**: Implementation of the `/lookup` endpoint.
- **JavaScript/TypeScript SDK (`@ans-project/sdk-js`)**: Released version `0.0.3` to npm. Includes `lookup` function and `anslookup` CLI.
- **Java SDK (`com.ans.sdk:ans-java-sdk`)**: Released version `0.0.3`. Includes `lookup` method.

## [0.0.2] - 2025-08-18

### Added

- **Backend Service**: Initial implementation of the ANS backend service with a tested `/register` endpoint.
- **JavaScript/TypeScript SDK (`@ans-project/sdk-js`)**: Released version `0.0.2` to npm. Includes `register` and `generateKeyPair` functions.
- **Java SDK (`com.ans.sdk:ans-java-sdk`)**: Released version `0.0.2`. Includes `AgentRegistrationClient` for agent registration.
- **Infrastructure & Tooling**: Added Terraform configurations for GCP, a Docker setup for local development, and a Jest testing framework.

## [0.0.1] - 2025-08-13

### Added

- Initial public release of the Java SDK.
- `AgentRegistrationClient`: Class for registering a new agent with the ANS network, including key generation and payload signing.