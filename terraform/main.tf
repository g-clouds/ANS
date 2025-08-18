terraform {
  required_providers {
    google-beta = {
      source  = "hashicorp/google-beta"
      version = "~> 6.0"
    }
  }
  backend "gcs" {
    bucket = "a-unique-name-gcp-terraform" # Replace with your GCS bucket name
    prefix = "terraform/state"
  }
}

provider "google-beta" {
  alias = "no_user_project_override"
  user_project_override = false
}

provider "google-beta" {
  user_project_override = true
}

resource "google_project" "project" {
  provider        = google-beta.no_user_project_override
  name            = var.project_id
  project_id      = var.project_id
  billing_account = var.billing_account
  org_id          = var.org_id
  deletion_policy = "DELETE"
  labels = {
    "firebase" = "enabled"
  }
}

resource "google_project_service" "project_services" {
  provider = google-beta.no_user_project_override
  project  = google_project.project.project_id
  for_each = toset([
    "firebase.googleapis.com",
    "serviceusage.googleapis.com",
    "cloudresourcemanager.googleapis.com",
    "iam.googleapis.com",
    "cloudbuild.googleapis.com",
    "run.googleapis.com",
    "firestore.googleapis.com",
    "compute.googleapis.com",
    "secretmanager.googleapis.com",
    "firebasestorage.googleapis.com",
    "storage.googleapis.com",
  ])
  service            = each.key
  disable_on_destroy = false
}

resource "google_compute_network" "vpc_network" {
  project                 = google_project.project.project_id
  name                    = var.network_name
  auto_create_subnetworks = false
  depends_on = [google_project_service.project_services]
  lifecycle {
    prevent_destroy = false
  }
}

resource "google_compute_subnetwork" "default" {
  project                  = google_project.project.project_id
  name                     = "${var.network_name}-subnet"
  ip_cidr_range            = var.subnet_cidr
  region                   = var.region
  network                  = google_compute_network.vpc_network.id
  depends_on = [google_project_service.project_services]
  lifecycle {
    prevent_destroy = false
  }
}

resource "google_firebase_project" "default" {
  provider = google-beta
  project  = google_project.project.project_id
  depends_on = [google_project_service.project_services]
  lifecycle {
    prevent_destroy = false
  }
}

resource "google_firestore_database" "database" {
  # https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/firestore_database

  provider    = google-beta
  project     = google_project.project.project_id
  name        = var.firestore_database_id
  location_id = var.firestore_region
  type        = "FIRESTORE_NATIVE"
  concurrency_mode                  = "OPTIMISTIC"
  app_engine_integration_mode       = "DISABLED"
  point_in_time_recovery_enablement = "POINT_IN_TIME_RECOVERY_ENABLED"
  delete_protection_state           = "DELETE_PROTECTION_DISABLED"
  deletion_policy                   = "DELETE"
  depends_on = [google_firebase_project.default]
}

resource "google_compute_firewall" "allow_ssh" {
  project = google_project.project.project_id
  name    = "${var.network_name}-allow-ssh"
  network = google_compute_network.vpc_network.name
  allow {
    protocol = "tcp"
    ports    = ["22"]
  }
  source_ranges = ["0.0.0.0/0"]
  depends_on = [google_project_service.project_services]
  lifecycle {
    prevent_destroy = false
  }
}

resource "google_service_account" "firebase_admin_sa" {
  project      = google_project.project.project_id
  account_id   = "firebase-admin-sa"
  display_name = "Firebase Admin SDK Service Account"
  lifecycle {
    prevent_destroy = false
  }
}

locals {
  firebase_admin_roles = [
    "roles/datastore.user",
    "roles/cloudfunctions.invoker",
    "roles/cloudfunctions.serviceAgent",
    "roles/discoveryengine.admin",
    "roles/firebase.sdkAdminServiceAgent",
    "roles/firebaseauth.admin",
    "roles/secretmanager.secretAccessor",
    "roles/iam.serviceAccountTokenCreator",
    "roles/serviceusage.serviceUsageAdmin",
    "roles/storage.admin",
    "roles/aiplatform.user",
  ]
}

resource "google_project_iam_member" "firebase_admin_sa_roles" {
  for_each = toset(local.firebase_admin_roles)
  project  = google_project.project.project_id
  role     = each.key
  member   = "serviceAccount:${google_service_account.firebase_admin_sa.email}"
}

resource "google_service_account" "cloud_run_service_account" {
  project      = google_project.project.project_id
  account_id   = "cloud-run-service-account"
  display_name = "Cloud Run Service Account"
  lifecycle {
    prevent_destroy = false
  }
}

resource "google_project_iam_member" "cloud_run_service_account_iam" {
  project = google_project.project.project_id
  role    = "roles/run.invoker"
  member  = "serviceAccount:${google_service_account.cloud_run_service_account.email}"
}

resource "google_project_iam_member" "cloud_run_sa_datastore_user" {
  project = google_project.project.project_id
  role    = "roles/datastore.user"
  member  = "serviceAccount:${google_service_account.cloud_run_service_account.email}"
}

resource "google_project_iam_member" "cloud_run_sa_pubsub_publisher" {
  project = google_project.project.project_id
  role    = "roles/pubsub.publisher"
  member  = "serviceAccount:${google_service_account.cloud_run_service_account.email}"
}

resource "google_project_service" "artifact_registry" {
  provider = google-beta.no_user_project_override
  project  = google_project.project.project_id
  service  = "artifactregistry.googleapis.com"
  disable_on_destroy = false
}

resource "google_project_service" "pubsub_api" {
  provider = google-beta.no_user_project_override
  project  = google_project.project.project_id
  service  = "pubsub.googleapis.com"
  disable_on_destroy = false
}

resource "google_service_account" "cloud_build_sa" {
  project      = google_project.project.project_id
  account_id   = "cloud-build-sa"
  display_name = "Cloud Build Service Account"
  lifecycle {
    prevent_destroy = false
  }
}

resource "google_project_iam_member" "cloud_build_sa_roles" {
  for_each = toset([
    "roles/artifactregistry.writer",
    "roles/cloudbuild.builds.builder",
  ])
  project  = google_project.project.project_id
  role     = each.key
  member   = "serviceAccount:${google_service_account.cloud_build_sa.email}"
}

resource "google_project_iam_member" "default_cloud_build_sa_artifact_writer" {
  project = google_project.project.project_id
  role    = "roles/artifactregistry.writer"
  member  = "serviceAccount:${google_project.project.number}@cloudbuild.gserviceaccount.com"
}

resource "google_project_iam_member" "cloud_build_sa_storage_admin" {
  project = google_project.project.project_id
  role    = "roles/storage.objectAdmin"
  member  = "serviceAccount:${google_service_account.cloud_build_sa.email}"
}

resource "google_artifact_registry_repository" "backend_repo" {
  provider      = google-beta
  project       = google_project.project.project_id
  location      = var.region
  repository_id = var.cloud_run_service_name
  description   = "Repository for the backend service"
  format        = "DOCKER"
  depends_on = [google_project_service.artifact_registry]
}

resource "google_storage_bucket" "cloudbuild_source_bucket" {
  project       = google_project.project.project_id
  name          = "ans-${var.project_id}-cloudbuild"
  location      = "US" # Multi-region for Cloud Build source
  storage_class = "STANDARD"
  uniform_bucket_level_access = true
  force_destroy = true # For easier cleanup during development

  depends_on = [google_project_service.project_services]
}

resource "google_pubsub_topic" "ans_sync_topic" {
  project = google_project.project.project_id
  name    = "ans-sync"
  depends_on = [google_project_service.pubsub_api]
}

resource "google_cloud_run_v2_service" "backend_service" {
  provider    = google-beta
  project     = google_project.project.project_id
  name        = var.cloud_run_service_name
  location    = var.region
  description = "Backend service for the ANS project"

  template {
    service_account = google_service_account.cloud_run_service_account.email
    containers {
      image = "${var.region}-docker.pkg.dev/${var.project_id}/${google_artifact_registry_repository.backend_repo.repository_id}/ans-register:latest"
      ports {
        container_port = 8080
      }
    }
  }

  ingress = "INGRESS_TRAFFIC_ALL"

  traffic {
    type = "TRAFFIC_TARGET_ALLOCATION_TYPE_LATEST"
    percent         = 100
  }

  depends_on = [
    google_project_service.project_services,
    google_artifact_registry_repository.backend_repo,
  ]
}

resource "google_cloud_run_service_iam_member" "backend_service_invoker" {
  provider = google-beta
  project  = google_project.project.project_id
  location = google_cloud_run_v2_service.backend_service.location
  service  = google_cloud_run_v2_service.backend_service.name
  role     = "roles/run.invoker"
  member   = "allUsers"
}

resource "google_cloudbuild_trigger" "backend_image_trigger" {
  project     = google_project.project.project_id
  name        = "backend-image-build-trigger"
  description = "Triggers a Cloud Build to build and push the backend Docker image."
  location    = "global" # Cloud Build Triggers are global

  trigger_template {
    branch_name = "^image-build*" # Trigger on push to ^image-build* branch
    repo_name   = "ans"  # Assuming your GitHub repo is named 'ans'
    dir         = "."    # Root of the repository
  }

  filename = "image-build/cloudbuild.yaml" # Path to your Cloud Build config file

  substitutions = {
    _PROJECT_ID = google_project.project.project_id
    _LOCATION   = var.region
    _REPOSITORY = google_artifact_registry_repository.backend_repo.repository_id
    _IMAGE_NAME = "ans-register" # The name of your Docker image
  }

  service_account = google_service_account.cloud_build_sa.id # Use the custom Cloud Build SA

  depends_on = [
    google_project_service.artifact_registry,
    google_service_account.cloud_build_sa,
    google_project_iam_member.cloud_build_sa_roles,
    google_project_iam_member.cloud_build_sa_storage_admin,
  ]
}


