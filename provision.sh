#For use with DO ubuntu

wget https://dl.bintray.com/mitchellh/vagrant/vagrant_1.7.2_x86_64.deb
curl https://raw.githubusercontent.com/creationix/nvm/v0.23.3/install.sh | bash
bash
nvm install v0.10
dpkg -i vagrant_1.7.2_x86_64.deb
git clone https://github.com/code4hk/budget-explorer.git
cd /root/budget-explorer/docker-host-vm
vagrant up
