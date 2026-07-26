#!/bin/bash
# Railway/Render build script
pip install -r requirements.txt
pip install whitenoise==6.7.0 gunicorn==22.0.0
python manage.py collectstatic --noinput
python manage.py migrate --noinput
