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
