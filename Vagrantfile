Vagrant.configure("2") do |config|
  config.vm.provider "docker" do |d|
    d.build_dir = "."
    d.vagrant_vagrantfile = "./docker-host-vm/Vagrantfile"
    #d.has_ssh = true
    d.ports = ["9200:9200"]
    
  end
end
