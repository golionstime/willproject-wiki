# -*- coding:utf-8 -*-

# Author: Golion
# Date: 2016.2


import sys
import web


web.config.debug = False
urls = (
    '/(.*)', 'controller.Controller'
)
app = web.application(urls, globals(), autoreload=False)
application = app.wsgifunc()
