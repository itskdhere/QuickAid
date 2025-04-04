# VM Setup with NVM, Node.js, Docker
resource "null_resource" "quickaid-vm-setup" {
  depends_on = [google_compute_instance.quickaid-vm]

  triggers = {
    instance_id = google_compute_instance.quickaid-vm.id
  }

  connection {
    type        = "ssh"
    user        = var.ssh_username
    private_key = file(var.ssh_private_key_path)
    host        = google_compute_instance.quickaid-vm.network_interface.0.access_config.0.nat_ip
  }

  provisioner "file" {
    when        = create
    on_failure  = continue
    source      = "scripts/setup.sh"
    destination = "/tmp/setup.sh"
  }

  provisioner "remote-exec" {
    when       = create
    on_failure = continue
    inline = [
      "chmod +x /tmp/setup.sh",
      "/tmp/setup.sh"
    ]
  }
}
