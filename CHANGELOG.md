# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Packages

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

---

## Architecture

## [0.1.1] - 2025-07-30

### Added

- Appendix H: Federated Architecture (ANS-FED-v0.1.1) to the specification. This appendix describes a federated architecture for the Agent Network System.

## [0.1.0] - 2025-05-02

### Added

- Initial public release of the Agent Network System specification.
