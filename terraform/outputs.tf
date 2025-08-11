output "project_id" {
  description = "The ID of the created GCP project."
  value       = google_project.project.project_id
}

output "firestore_service_account_email" {
  description = "The email of the Firebase Admin SDK service account."
  value       = google_service_account.firebase_admin_sa.email
}

output "cloud_run_service_account_email" {
  description = "The email of the Cloud Run service account."
  value       = google_service_account.cloud_run_service_account.email
}

output "network_name" {
  description = "The name of the VPC network."
  value       = google_compute_network.vpc_network.name
}

output "subnet_name" {
  description = "Name of the subnet."
  value       = google_compute_subnetwork.default.name
}

output "subnet_id" {
  description = "Self-link of the subnet (handy for other modules)."
  value       = google_compute_subnetwork.default.id
}

output "subnet_cidr" {
  description = "CIDR range of the subnet."
  value       = google_compute_subnetwork.default.ip_cidr_range
}

output "firestore_database_id" {
  description = "Firestore database ID (same as var.firestore_database_id)."
  value       = google_firestore_database.database.name
}

output "firestore_database_location" {
  description = "Firestore region where the database lives."
  value       = google_firestore_database.database.location_id
}

output "firestore_database_path" {
  description = "Fully-qualified Firestore database path (useful in gcloud / client libraries)."
  value       = "projects/${google_project.project.project_id}/databases/${google_firestore_database.database.name}"
}