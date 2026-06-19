#!/bin/bash

REPO_URL="https://github.com/jayeshpatel882006/Portfolio-2026.git"
APP_DIR="Portfolio-2026"

install_nginx(){
echo "Installing Nginx.."
apt install -y nginx git || return 1
}

clone_code(){
echo "Cloning Code From Github.."
if [ -d "$APP_DIR" ]
then
        echo "Already Exist"
else
        git clone "$REPO_URL" || return 1
fi
}

deploy_site(){
echo "Deeplying Site.."
rm -rf /var/www/html/*
cp -r "$APP_DIR"/* /var/www/html/ || return 1
}

start_server(){
nginx -t || return 1
service nginx restart || return 1
}

verify_site(){
  curl localhost | grep "<!DOCTYPE html>" || return 1
}

echo "=======DEPLOYMENT STARTED========="
install_nginx || exit 1
clone_code || exit 1
deploy_site || exit 1
start_server || exit 1
verify_site || exit 1
echo "========DEPLOYMENT COMPLETED========"
