#!/bin/sh

rm -rf /home/webserver/willproject/backend/static/js
rm -rf /home/webserver/willproject/backend/templates
mkdir /home/webserver/willproject/backend/static/js
mkdir /home/webserver/willproject/backend/templates
cp -ri /home/webserver/willproject/frontend/build/static/js/* /home/webserver/willproject/backend/static/js
cp -ri /home/webserver/willproject/frontend/build/templates/* /home/webserver/willproject/backend/templates
