# -*- coding: utf-8 -*-


import sys
import memcache
import MySQLdb
import MySQLdb.cursors

from settings import MYSQL_CONF
from settings import MEMCACHED_CONF
from log import LogClient


class MysqlConn():

    db = None

    def __init__(self):
        if MysqlConn.db is None:
            MysqlConn.db = {}

    def getMysqlConn(self, CONF):
        config = MYSQL_CONF[CONF]
        dao = MySQLdb.connect(
            host = config['host'],
            port = config['port'],
            user = config['user'],
            passwd = config['passwd'],
            db = config['db'],
            use_unicode = True,
            charset = 'UTF8',
            cursorclass = MySQLdb.cursors.DictCursor
        )
        # autocommit=True，避免事务造成的数据库性能波动
        dao.autocommit(True)
        return dao

    def getMysqlLongConn(self, CONF):
        if (MysqlConn.db.has_key(CONF) == False):
            config = MYSQL_CONF[CONF]
            MysqlConn.db[CONF] = MySQLdb.connect(
                host = config['host'],
                port = config['port'],
                user = config['user'],
                passwd = config['passwd'],
                db = config['db'],
                use_unicode = True,
                charset = 'UTF8',
                cursorclass = MySQLdb.cursors.DictCursor
            )
            # autocommit=True，避免事务造成的数据库性能波动
            MysqlConn.db[CONF].autocommit(True)
        return MysqlConn.db[CONF]

    def closeMysqlLongConn(self, CONF):
        if (MysqlConn.db.has_key(CONF) == False):
            return
        else:
            MysqlConn.db.pop(CONF)


class MemcacheConn():

    mc = None

    def __init__(self):
        if MemcacheConn.mc is None:
            MemcacheConn.mc = {}

    def getMcConn(self, CONF):
        if (MemcacheConn.mc.has_key(CONF) == False):
            config = MEMCACHED_CONF[CONF]
            MemcacheConn.mc[CONF] = memcache.Client(['%s:%s' % (config['host'], config['port'])], debug=0)
        return MemcacheConn.mc[CONF]


def getOne(connName, tableName, startId, addition = ''):
    try:
        db = MysqlConn().getMysqlConn(connName)
        cur = db.cursor()
    except:
        LogClient.error(sys.exc_info())
        return None
    oneitem = None
    try:
        sql = "SELECT * FROM %s WHERE (`id` >= '%s') %s LIMIT 1" % (tableName, startId, addition)
        LogClient.info(sql)
        cur.execute(sql)
        oneitem = cur.fetchone()
    except:
        LogClient.error(sys.exc_info())
    finally:
        cur.close()
    return oneitem


def execute(connName, sql):
    try:
        db = MysqlConn().getMysqlConn(connName)
        cur = db.cursor()
    except:
        LogClient.error(sys.exc_info())
        return False
    try:
        LogClient.info(sql)
        cur.execute(sql)
    except:
        LogClient.error(sys.exc_info())
        return False
    finally:
        cur.close()
    return True


def queryAndFetchOne(connName, sql):
    try:
        db = MysqlConn().getMysqlConn(connName)
        cur = db.cursor()
    except:
        LogClient.error(sys.exc_info())
        return None
    item = None
    try:
        LogClient.info(sql)
        cur.execute(sql)
        item = cur.fetchone()
    except:
        LogClient.error(sys.exc_info())
    finally:
        cur.close()
    return item


def queryAndFetchAll(connName, sql):
    try:
        db = MysqlConn().getMysqlConn(connName)
        cur = db.cursor()
    except:
        LogClient.error(sys.exc_info())
        return None
    items = None
    try:
        LogClient.info(sql)
        cur.execute(sql)
        items = cur.fetchall()
    except:
        LogClient.error(sys.exc_info())
    finally:
        cur.close()
    return items