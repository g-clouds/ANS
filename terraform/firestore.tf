# This file contains the Firestore index configurations for the ANS project.
# These indexes are required for the complex queries used in the lookup functionality.

resource "google_firestore_index" "agents_verification_status_name" {
  project    = var.project_id
  collection = "agents"
  fields {
    field_path = "verification_status"
    order      = "ASCENDING"
  }
  fields {
    field_path = "name"
    order      = "ASCENDING"
  }
  # This index supports queries that filter by verification_status and do a prefix search on name.
  # e.g., WHERE verification_status == 'verified' AND name >= 'some-prefix' AND name <= 'some-prefix\uf8ff'
}

resource "google_firestore_index" "agents_verification_status_capabilities_name" {
  project    = var.project_id
  collection = "agents"
  fields {
    field_path = "verification_status"
    order      = "ASCENDING"
  }
  fields {
    field_path = "capabilities"
    array_config = "CONTAINS"
  }
  fields {
    field_path = "name"
    order      = "ASCENDING"
  }
  # This index supports complex queries that filter by verification_status, check for capabilities, and search by name.
  # e.g., WHERE verification_status == 'verified' AND capabilities CONTAINS 'some-capability' AND name >= 'some-prefix'
}
