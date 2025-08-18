# Image Build Configuration

This directory contains the Cloud Build configuration for building and pushing Docker images for the ANS project.

## Usage

To build and push a Docker image, use the `gcloud builds submit` command with the `cloudbuild.yaml` file located in this directory.

**Prerequisites:**

*   The `gcloud` CLI must be installed and authenticated to your GCP project.
*   An Artifact Registry repository must be created in your GCP project (this is typically handled by the Terraform configuration).

**Command:**

```bash
gcloud builds submit --config image-build/cloudbuild.yaml . --substitutions=_PROJECT_ID=[YOUR_PROJECT_ID],_LOCATION=[YOUR_ARTIFACT_REGISTRY_REGION],_REPOSITORY=[YOUR_ARTIFACT_REGISTRY_REPO],_IMAGE_NAME=[YOUR_IMAGE_NAME] --gcs-source-staging-dir=gs://[YOUR_SOURCE_BUCKET]/source
```

**Parameters:**

*   `_PROJECT_ID`: Your Google Cloud Project ID.
*   `_LOCATION`: The region where your Artifact Registry repository is located (e.g., `us-central1`).
*   `_REPOSITORY`: The name of your Artifact Registry repository (e.g., `ans-register`).
*   `_IMAGE_NAME`: The desired name for your Docker image (e.g., `backend`).
*   `[YOUR_SOURCE_BUCKET]`: The name of the GCS bucket for Cloud Build to use for staging source code.

This command will build the Docker image from the `backend` directory (relative to the project root) and push it to the specified Artifact Registry repository.

## Automated Image Building (Cloud Build Trigger)

For automated builds, a Cloud Build Trigger has been configured in `terraform/main.tf`.
This trigger automatically builds and pushes a new Docker image whenever changes are pushed to a branch matching the `^image-build*` pattern.

**Connecting Your Repository:**
For the Cloud Build Trigger to work, it needs to be connected to your source code repository (e.g., GitHub). See the [Terraform Setup Guide](./terraform/README.md) for more details on the required permissions and setup.

## Local Setup for Image Building

To build and push Docker images from your local machine, you need to set up your `gcloud` environment to use a service account with the necessary permissions.

1.  **Create and Activate a Service Account:**
    Follow the instructions in the [Terraform Setup Guide](./terraform/README.md) to create and activate a service account with the appropriate IAM roles for interacting with Artifact Registry and Cloud Build.

2.  **Run the Docker Image Build:**
    Once the service account is activated, you can run the `gcloud builds submit` command from your project's root directory, replacing the placeholder values with your project details.