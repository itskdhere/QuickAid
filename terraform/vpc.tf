# VPC Firewall Rules
resource "google_compute_firewall" "allow-http" {
  name    = "allow-http"
  network = "default"

  allow {
    protocol = "tcp"
    ports    = ["80"]
  }

  source_ranges = ["0.0.0.0/0"]
  target_tags   = ["http-server"]
}

resource "google_compute_firewall" "allow-https" {
  name    = "allow-https"
  network = "default"

  allow {
    protocol = "tcp"
    ports    = ["443"]
  }

  source_ranges = ["0.0.0.0/0"]
  target_tags   = ["https-server"]
}

resource "google_compute_firewall" "allow-beszel" {
  name    = "allow-beszel"
  network = "default"

  allow {
    protocol = "tcp"
    ports    = ["45876"]
  }

  source_ranges = ["0.0.0.0/0"]
  target_tags   = ["beszel"]
}
