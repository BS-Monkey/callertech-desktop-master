#!/bin/sh
set -e

echo "Deploying application ..."

# Update codebase
git pull origin master --no-edit
yarn --non-interactive
yarn webapp
chown -R www-data:ubuntu . 
chmod -R ug+rw .
echo "Application deployed!"