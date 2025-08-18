# Image Build Configuration

This directory contains the Cloud Build configuration for building and pushing Docker images for the ANS project.

## Usage

To build and push a Docker image, use the `gcloud builds submit` command with the `cloudbuild.yaml` file located in this directory.

**Prerequisites:**

* The `gcloud` CLI must be installed and authenticated to your GCP project.
* An Artifact Registry repository must be created in your GCP project (this is typically handled by the Terraform configuration).

**Command:**

```bash
```bash
gcloud builds submit --config image-build/cloudbuild.yaml . --substitutions=_PROJECT_ID=your-project-id,_LOCATION=your-location,_REPOSITORY=your-repo,_IMAGE_NAME=your-image-name --gcs-source-staging-dir=gs://ans-${var.project_id}-cloudbuild/source
```
```

**Parameters:**

* `_PROJECT_ID`: Your Google Cloud Project ID. # from terreaform/terraform.tfvars `project_id`
* `_LOCATION`: The region where your Artifact Registry repository is located (e.g., `us-central1`).
* `_REPOSITORY`: The name of your Artifact Registry repository (e.g., `ans-register`).
* `_IMAGE_NAME`: The desired name for your Docker image (e.g., `backend`).

**Example:**

```bash
gcloud builds submit --config image-build/cloudbuild.yaml . --substitutions=_PROJECT_ID=my-gcp-project,_LOCATION=us-central1,_REPOSITORY=ans-register,_IMAGE_NAME=backend --gcs-source-staging-dir=gs://ans-<my-gcp-project>-cloudbuild/source
```

This command will build the Docker image from the `backend` directory (relative to the project root) and push it to the specified Artifact Registry repository.

## Automated Image Building (Cloud Build Trigger)

For automated builds, a Cloud Build Trigger has been configured in `terraform/main.tf`.
This trigger automatically builds and pushes a new Docker image whenever changes are pushed to the `main` branch of the repository.

**Connecting Your Repository:**
For the Cloud Build Trigger to work, it needs to be connected to your source code repository (e.g., GitHub).
1.  Go to the Google Cloud Console: `Cloud Build` -> `Triggers`.
2.  Click `CONNECT REPOSITORY` or `MANAGE REPOSITORIES`.
3.  Follow the prompts to connect to your source host (e.g., GitHub) and select your repository (`ans`).

**Important Note for Developers:**
If your repository is not named `ans`, you must update the `repo_name` field in the `google_cloudbuild_trigger` resource within `terraform/main.tf` to match your repository's name.

## Local Setup for Image Building

To build and push Docker images from your local machine, you need to set up your `gcloud` environment to use a service account with the necessary permissions.

**1. Create a Service Account Key for the Default Compute Service Account:**

It is recommended to create a dedicated service account key for local development.

*   Go to the Google Cloud Console: `IAM & Admin` -> `Service Accounts`.
*   Find the **Default Compute Service Account** (it typically looks like `your-project-number-compute@developer.gserviceaccount.com`).
*   Click on the service account, then navigate to the `Keys` tab.
*   Click `ADD KEY` -> `Create new key` -> `JSON` -> `CREATE`.
*   Save the downloaded JSON key file to a secure location on your local machine (e.g., `~/gcp-keys/my-project-compute-sa.json`). **Keep this file secure and do not commit it to version control.**

**2. Activate the Service Account:**

Use the `gcloud auth activate-service-account` command to activate the service account using the downloaded key file.

```bash
gcloud auth activate-service-account --key-file="PATH_TO_YOUR_KEY_FILE.json"
```

Replace `PATH_TO_YOUR_KEY_FILE.json` with the actual path to your downloaded JSON key file. For example:

```bash
gcloud auth activate-service-account --key-file="~/gcp-keys/my-project-compute-sa.json"
```

You should see a confirmation message like: `Activated service account credentials for: [your-project-number-compute@developer.gserviceaccount.com]`

**3. Run the Docker Image Build:**

Once the service account is activated, you can run the `gcloud builds submit` command from your project's root directory.

```bash
gcloud builds submit --config image-build/cloudbuild.yaml . --substitutions=_PROJECT_ID=your-project-id,_LOCATION=your-location,_REPOSITORY=your-repo,_IMAGE_NAME=ans-register --gcs-source-staging-dir=gs://ans-${var.project_id}-cloudbuild/source
```

Remember to replace the placeholders (`your-project-id`, `your-location`, `your-repo`) with your actual project details.
