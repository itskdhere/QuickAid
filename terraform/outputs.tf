# Outputs
output "quickaid-vm-public-ip" {
  description = "Public IP of the quickaid VM"
  value       = google_compute_instance.quickaid-vm.network_interface.0.access_config.0.nat_ip
}

output "quickaid-vm-dns-name" {
  description = "DNS name of the quickaid VM"
  value       = cloudflare_record.quickaid-vm-dns.hostname
}
