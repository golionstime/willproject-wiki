# -*- coding: utf-8 -*-

ABS_PATH = '******'

LOG_PATH = '%s/logs/' % ABS_PATH

# CRITICAL/ERROR/WARN/WARNING/INFO/DEBUG/NOTSET
LOG_LEVEL = 'INFO'

LOG_PROTECTED_DAYS = 30

WEBAPP_PORT = '6666'

MYSQL_CONF = {
    'wp' : {
        'host' : '127.0.0.1',
        'port' : 3306,
        'user' : '******',
        'passwd' : '******',
        'db' : '******'
    }
}

MEMCACHED_CONF = {
    'sessions' : {
        'host' : '127.0.0.1',
        'port' : 11211
    },
    'wp' : {
        'host' : '127.0.0.1',
        'port' : 11211
    }
}

WEB_CONF = {
    'host' : ''
}
