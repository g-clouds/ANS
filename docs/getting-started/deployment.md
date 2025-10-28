# Full Backend Deployment Guide

This guide provides a comprehensive walkthrough for deploying your own instance of the Agent Network System (ANS) backend on Google Cloud Platform (GCP). This is for developers and infrastructure operators who wish to run a private or custom version of the ANS.

## Overview

The deployment process involves three main stages:
1.  **Infrastructure Provisioning:** Using Terraform to create the necessary GCP resources.
2.  **Docker Image Build:** Building the backend application into a Docker container and pushing it to the Artifact Registry.
3.  **Service Deployment:** Deploying the containerized application as a serverless Cloud Run service.

## Prerequisites

*   A Google Cloud Platform (GCP) account with billing enabled.
*   The `gcloud` CLI installed and authenticated.
*   Terraform installed on your local machine.
*   Git installed on your local machine.

---

## 1. Infrastructure Provisioning with Terraform

The `terraform` directory in the root of this project contains all the necessary code to provision the required infrastructure.

### Step 1.1: Configure Terraform

First, you need to provide your specific GCP project details to Terraform.

1.  **Create a `terraform.tfvars` file:**
    Inside the `terraform` directory, create a file named `terraform.tfvars`.
2.  **Add your project details:**
    Paste the following content into the file, replacing the placeholder values with your own.

    ```hcl
    # terraform/terraform.tfvars

    project_id      = "your-gcp-project-id"  # Choose a unique ID for your new project
    billing_account = "YOUR_BILLING_ACCOUNT_ID" # Find this in your GCP console
    org_id          = "YOUR_ORGANIZATION_ID"    # Find this in your GCP console
    ```

### Step 1.2: Deploy the Infrastructure

The project is configured to use Cloud Build to run Terraform, which is the recommended best practice for CI/CD.

1.  **Commit your changes:**
    Commit the `terraform.tfvars` file to your Git repository.
2.  **Trigger Cloud Build:**
    Pushing the commit to your main branch will trigger the Cloud Build pipeline defined in `terraform/cloudbuild.yaml`.

This pipeline will automatically perform the following actions:
*   Create a new GCP Project with the ID you specified.
*   Enable the necessary APIs (Cloud Run, Firestore, Artifact Registry, etc.).
*   Create a Firestore Database to store agent registrations.
*   Create an Artifact Registry repository to store your Docker images.
*   Set up the necessary IAM service accounts and permissions.

---

## 2. Build and Push the Docker Image

Once the infrastructure is ready, you need to build the backend application into a Docker image.

The `image-build` directory contains the instructions for this process. The key steps are:

1.  **Authenticate Docker:**
    Configure Docker to authenticate with Google Cloud Artifact Registry.
    ```bash
    gcloud auth configure-docker us-central1-docker.pkg.dev
    ```
2.  **Submit the build to Cloud Build:**
    From the root of the repository, run the following command. This command tells Cloud Build to use the `image-build/cloudbuild.yaml` file, which contains the steps to build and push the Docker image.

    ```bash
    gcloud builds submit . --config=image-build/cloudbuild.yaml
    ```

This process will:
*   Use the `Dockerfile` in the `backend` directory to build the Node.js application.
*   Tag the resulting image appropriately.
*   Push the image to the Artifact Registry repository that you created in the previous stage.

---

## 3. Deploy the Cloud Run Service

The final step is to deploy the containerized application as a Cloud Run service. This is also handled by the Terraform configuration.

The resource `google_cloud_run_v2_service` in `terraform/main.tf` defines the Cloud Run service. It is configured to use the image you just built.

1.  **Trigger the deployment:**
    Because the Cloud Run service is defined in Terraform, any new commit to the `terraform` directory will trigger the Cloud Build pipeline again. If you have already pushed your changes from Step 1, you can simply re-trigger the build or make a minor change to one of the Terraform files and push it.
2.  **Verify the deployment:**
    Once the Cloud Build pipeline completes, your ANS backend will be deployed and running as a public-facing Cloud Run service. You can find the URL of your service in the Cloud Run section of the GCP Console.

Your private instance of the Agent Network System is now live and ready to be used. You can update the endpoint in the SDK clients to point to your new service URL.
