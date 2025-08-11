# Terraform Setup for ANS Project

This Terraform setup will create a new GCP project and arrange the necessary API services. It creates a Virtual Private Cloud (VPC), a default Firestore database, configures firewall rules, and creates required service accounts, such as the Firebase Admin SDK, and sets up the service account's IAM permissions.

We are looking for the community to verify this configuration (even though we have already tested it) and create configurations for other terraform providers (e.g., AWS, Azure, Kubernetes, Oracle Cloud, Alibaba Cloud ) to build a similar setup, enabling cloud-agnostic capabilities.

## Prerequisites

- [Terraform](https://learn.hashicorp.com/tutorials/terraform/install-cli)
- [Google Cloud SDK](https://cloud.google.com/sdk/docs/install)

## Enabled GCP Services

This Terraform configuration will enable the following GCP services:

- `Compute Engine API`
- `Cloud Key Management Service (KMS) API`
- `Compute Engine`
- `Secret Manager`
- `Service Accounts`
- `Cloud Storage`
- `Cloud Build`
- `Cloud Resource Manager API`
- `Service Usage API`
- `IAM API`
- `Firestore API`

## GCS Backend

This configuration uses a GCS backend to store the Terraform state. Before you can use this configuration, you need to create a GCS bucket.

1. **Create the GCS bucket:**

   ```bash
   gsutil mb gs://a-unique-name-gcp-terraform
   ```
2. **Enable versioning for the bucket:**

   ```bash
   gsutil versioning set on gs://a-unique-name-gcp-terraform
   ```

## Usage

### Manual Deployment

1. **Authenticate with Google Cloud:**

   ```bash
   gcloud auth application-default login
   ```
2. **Initialize Terraform:**

   ```bash
   terraform init
   ```
3. **Create a `terraform.tfvars` file with the following content:**

   ```
   project_id      = "your-gcp-project-id"
   billing_account = "your-billing-account-id"
   org_id          = "your-organization-id-numbers"
   ```

   Replace the values with your GCP project ID, billing account ID, and organization ID. You can also customize the `network_name` and `subnet_cidr` variables in this file.
4. **Apply the Terraform configuration:**

   ```bash
   terraform apply
   ```

   Terraform will show you a plan of the resources to be created. Type `yes` to approve the plan.

### Prerequisites for Cloud Build

Before you can use Cloud Build to deploy the Terraform configuration, you need to create a secret in Google Secret Manager to hold your GitHub Personal Access Token (PAT). This allows Cloud Build to access your repository.

1. **Create a GitHub Personal Access Token (PAT):**

   - Go to [https://github.com/settings/tokens](https://github.com/settings/tokens) and generate a new token.
   - The token must have the `repo` scope to allow Cloud Build to access your repository.
2. **Create the secret in Google Secret Manager:**

   ```bash
   export GITHUB_TOKEN="your-github-pat"
   gcloud secrets create github-token-secret-name --data-file=- <<< "$GITHUB_TOKEN"
   ```
3. **Ensure the Cloud Build service account has the necessary permissions:**
   The service account that runs your Cloud Build trigger will need the `Secret Manager Secret Accessor` role to access the `github-token` secret. It will also need the roles listed in the "Cloud Build Deployment" section below.

### Cloud Build Deployment

1. **Enable the Cloud Build API for your project.**
2. **Create a secret in Secret Manager with your GitHub SSH key.**
3. **Create a service account for Cloud Build with the following roles:**

   - `Cloud Build Service Account`
   - `Cloud Build WorkerPool owner`
   - `Cloud Build WorkerPool user`
   - `Cloud Deployment Manager Service Agent`
   - `Cloud KMS CryptoKey Decrypter`
   - `Compute Admin`
   - `Compute Engine Service Agent`
   - `Compute Instance Admin (v1)`
   - `Compute Network Admin`
   - `IAP-secured Tunnel User`
   - `Secret Manager Secret Accessor`
   - `Service Account Token Creator`
   - `Service Account User`
   - `Service Usage Admin`
   - `Storage Admin`
   - `Storage Bucket Viewer`
   - `Viewer`
   - `Resourcemanager.projectCreator`

   The service account email should be `svc-terraform-your-gcp-project-id@your-gcp-project-id.iam.gserviceaccount.com`.
4. **Grant the Cloud Build service account the `Secret Manager Secret Accessor` role for the secret.**
5. **Update the `cloudbuild.yaml` file with your project ID in the `availableSecrets` section.**
6. **Create a Cloud Build trigger:**

   - In the Google Cloud Console, go to **Cloud Build > Triggers**.
   - Click **Create trigger**.
   - **Name**: `ans-terraform-pr`
   - **Event**: `Pull request`
   - **Source**: Select your repository and the base branch (e.g., `main`).
   - **Configuration**: `Cloud Build configuration file (yaml or json)`
   - **Location**: `/terraform/cloudbuild.yaml`
   - Click **Create**.
7. **Trigger the build:**

   - Create a pull request to the base branch.

## Outputs

After the apply is complete, Terraform will output the following:

- `project_id`: The ID of the created GCP project.
- `cloud_run_service_account_email`: The email of the Cloud Run service account.
- `network_name`: The name of the VPC network.

## Cleanup

To destroy the resources created by this Terraform configuration, you can either push to the `destroy` branch or run the following command:

```bash
terraform destroy
```

## Known Issues

### googleapi: Error 403: Cloud Billing API has not been used in project ... before or it is disabled.

Enable it by visiting https://console.developers.google.com/apis/api/cloudbilling.googleapis.com/overview?project=... then retry. If you enabled this API recently, wait a few minutes for the action to propagate to our systems and retry.

### missing billing account persmission

```log
Error: failed pre-requisites: missing permission on "billingAccounts/01466A-729CFD-658D6D": billing.resourceAssociations.create
│ 
│   with google_project.project,
│   on main.tf line 23, in resource "google_project" "project":
│   23: resource "google_project" "project" {
```

```bash
BILLING_ACCOUNT_ID="1111-1111-1111"
```

service account is from the cloud build deployment configuration. [Step 3](#cloud-build-deployment)

```bash
gcloud billing accounts add-iam-policy-binding "${BILLING_ACCOUNT_ID}" \
  --member="serviceAccount:<service_account_name>@<gcp_project>.iam.gserviceaccount.com" \
  --role="roles/billing.user"
```

### Error 403: Cloud Resource Manager API has not been used in project

Grant the Organization-level IAM role roles/resourcemanager.projectCreator to your service account so it can create new GCP projects.
Run once (replace ORG_ID and the service-account e-mail):

```bash
gcloud organizations add-iam-policy-binding ORG_ID \
  --member="serviceAccount:<service_account_name>@<gcp_project>.iam.gserviceaccount.com" \
  --role="roles/resourcemanager.projectCreator"
```

Find your ORG_ID quickly:

```bash
gcloud organizations list
```

### Error 403: Cloud Resource Manager API has not been used in project

│ Error: error creating project your-gcp-project-id: googleapi: Error 403: Cloud Resource Manager API has not been used in project before or it is disabled. Enable it by visiting https://console.developers.google.com/apis/api/cloudresourcemanager.googleapis.com/overview?project=<project_id> then retry. If you enabled this API recently, wait a few minutes for the action to propagate to our systems and retry.

### │ Error: error creating project googleapi: Error 400: field [parent] has issue [Parent id must be numeric.]

│ Details:

```log
│ [
│   {
│     "@type": "type.googleapis.com/google.rpc.BadRequest",
│     "fieldViolations": [
│       {
│         "description": "Parent id must be numeric.",
│         "field": "parent"
│       }
│     ]
│   },
│   {
│     "@type": "type.googleapis.com/google.rpc.Help",
│     "links": [
│       {
│         "url": "https://cloud.google.com/resource-manager/reference/rest/v1/projects"
│       }
│     ]
│   }
```

Find your numeric org ID

```bash
gcloud organizations list
```

Output

```bash
DISPLAY_NAME       ID
example.com        123456789
```

Use the numeric ID in your variables or .tfvars:

```hcl
org_id = "123456789"
```

### googleapi: Error 409: Requested entity already exists, alreadyExists.

```log
google_project.project: Creating...
╷
│ Error: error creating project your-gcp-project-id: googleapi: Error 409: Requested entity already exists, alreadyExists.
```

If you ever created your GCP project manually then you will receive this error.
Change the project id in yout .tfvars

```hcl
project_id      = "a-unique-project-id-random-number"
```

### Error 403: Compute Engine API has not been used in new project

```log
Error: Error creating Network: googleapi: Error 403: Compute Engine API has not been used in newly created project before or it is disabled. Enable it by visiting https://console.developers.google.com/apis/api/compute.googleapis.com/overview?project=<project_id> then retry. If you enabled this API recently, wait a few minutes for the action to propagate to our systems and retry.
│ Details:
│ [
│   {
│     "@type": "type.googleapis.com/google.rpc.ErrorInfo",
│     "domain": "googleapis.com",
│     "metadata": {
│       "activationUrl": "https://console.developers.google.com/apis/api/compute.googleapis.com/overview?project=<project_id>",
│   ...
│       "service": "compute.googleapis.com",
│       "serviceTitle": "Compute Engine API"
│     },
│     "reason": "SERVICE_DISABLED"
│   },
│   {
│     "@type": "type.googleapis.com/google.rpc.LocalizedMessage",
│     "locale": "en-US",
│     "message": "Compute Engine API has not been used in project <peoject_id> before or it is disabled. Enable it by visiting https://console.developers.google.com/apis/api/compute.googleapis.com/overview?project=<peoject_id> then retry. If you enabled this API recently, wait a few minutes for the action to propagate to our systems and retry."
│   },
│   {
│     "@type": "type.googleapis.com/google.rpc.Help",
│     "links": [
│       {
│         "description": "Google developers console API activation",
│         "url": "https://console.developers.google.com/apis/api/compute.googleapis.com/overview?project=<project_id>"
│       }
│     ]
│   }
│ ]
```

add a dependency to the resource in your main.tf

```hcl
depends_on = [google_project_service.project_services]
```

# Destroy

> Create a branch called "destroy" and raise a PR.

Minimal checklist:
*google_project.project*

```hcl
deletion_policy = "DELETE"
```

*Firestore database*

```hcl
deletion_policy = "DELETE"
delete_protection_state = "DELETE_PROTECTION_DISABLED"
```

*Any Cloud Storage buckets*

```hcl
force_destroy = true
```

so objects are wiped on destroy.

*Any other resources* that have prevent_destroy or deletion_protection
Remove or disable those flags.

*Service-account keys* (if you generated any)
Terraform will delete the keys automatically when the SA is destroyed.

*IAM / billing permissions*
Ensure the Terraform service account still has
`roles/resourcemanager.projectCreator`
`roles/billing.user` (or `billing.admin`)
`roles/compute.admin` (or the specific roles)
so it can both create and destroy.
