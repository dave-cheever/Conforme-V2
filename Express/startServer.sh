#!/bin/bash
apt update
dpkg -i wkhtmltox_0.12.6-0.20180618.3.dev.e6d6f54.stretch_amd64.deb || apt install -f -y
node index.js