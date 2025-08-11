variable "project_id" {
  description = "The ID of the GCP project to create."
  type        = string
}

variable "region" {
  description = "The region to deploy the resources in."
  type        = string
  default     = "us-central1"
}

# https://firebase.google.com/docs/firestore/locations
variable "firestore_region" {
  description = "The firestore region to deploy the resources in."
  type        = string
  default     = "nam5" # United States (Central)
}

variable "firestore_database_id" {
  description = "The firestore database name"
  type        = string
  default     = "(default)"
}

variable "billing_account" {
  description = "The billing account to use for the project."
  type        = string
}

variable "org_id" {
  description = "The organization ID to create the project in."
  type        = string
}

variable "network_name" {
  description = "The name of the VPC network to create."
  type        = string
  default     = "ans-vpc"
}

variable "subnet_cidr" {
  description = "The CIDR block for the subnet."
  type        = string
  default     = "10.0.0.0/24"
}
