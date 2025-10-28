# Publishing the `@ans-project/sdk-js` Package

This guide outlines the steps for developers to update and publish new versions of the `@ans-project/sdk-js` package to the npm public registry.

## Prerequisites

*   **Node.js and npm:** Installed on your development machine.
*   **npmjs.com Account:** You must have an account on npmjs.com.
*   **Publishing Rights:** Your npmjs.com account must be an owner or a member with publishing rights for the `@ans-project` scope.
*   **Logged in to npm:** Ensure you are logged in to npm from your terminal:
    ```bash
    npm login
    ```

## Publishing a New Version

Follow these steps to publish an updated version of the SDK:

1.  **Make Your Code Changes:**
    Implement any new features, bug fixes, or improvements in the SDK's source code (`src/index.ts`).

2.  **Update the Package Version:**
    Before publishing, you **must** increment the `version` number in `package.json`. Use npm's `version` command for semantic versioning:
    ```bash
    # Navigate to the sdk/sdk-js directory first
    cd sdk/sdk-js

    # For bug fixes (e.g., 1.0.0 -> 1.0.1)
    npm version patch

    # For new features (e.g., 1.0.0 -> 1.1.0)
    npm version minor

    # For breaking changes (e.g., 1.0.0 -> 2.0.0)
    npm version major
    ```
    This command will update the `version` in `package.json` and create a git tag.

3.  **Build the SDK:**
    Ensure your TypeScript code is compiled to JavaScript. This step is also automatically run by the `prepublishOnly` hook during `npm publish`.
    ```bash
    npm run build
    ```

4.  **Publish to npm:**
    Publish the package to the public npm registry. Since it's a scoped package, you need to specify `--access public`.
    ```bash
    npm publish --access public
    ```
    *   If successful, your new version will be available on `https://www.npmjs.com/package/@ans-project/sdk-js`.
    *   If you encounter an `E404` error, ensure you own the `@ans-project` scope on npmjs.com.

## Semantic Versioning (SemVer)

Always follow [Semantic Versioning](https://semver.org/) principles when updating the package version:

*   **MAJOR version (e.g., `2.0.0`)** when you make incompatible API changes.
*   **MINOR version (e.g., `1.1.0`)** when you add functionality in a backward-compatible manner.
*   **PATCH version (e.g., `1.0.1`)** when you make backward-compatible bug fixes.
