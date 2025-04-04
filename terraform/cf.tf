# Cloudflare DNS Record
resource "cloudflare_record" "quickaid-vm-dns" {
  depends_on = [google_compute_instance.quickaid-vm]
  zone_id    = var.cloudflare_zone_id
  name       = var.dns_name
  content    = google_compute_instance.quickaid-vm.network_interface.0.access_config.0.nat_ip
  type       = "A"
  proxied    = false
  # priority   = 420
  # ttl        = 3600
  comment = "DNS Record of quickaid VM (via Terraform)"
}
