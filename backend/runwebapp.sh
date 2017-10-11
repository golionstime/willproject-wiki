#!/bin/sh

source /home/webserver/local/python-env/bin/activate
cd /home/webserver/willproject.wiki
nohup python main.py runwebapp >/dev/null 2>&1 &
