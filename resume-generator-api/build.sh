#!/usr/bin/env bash
# exit on error
set -o errexit

tar -xvf wkhtmltox.tar.xz
export PATH=$PATH:~/wkhtmltox/bin

pip install --upgrade pip
pip install -r requirements.txt

# python manage.py createsuperuser --noinput
python manage.py collectstatic --no-input
python manage.py migrate
