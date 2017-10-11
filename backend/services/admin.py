# -*- coding:utf-8 -*-

# Author: Golion
# Date: 2016.2


from math import ceil

from common.sessions import Sessions
from common.dao import execute
from common.dao import queryAndFetchOne
from common.dao import queryAndFetchAll


class Admin:

    CONN_NAME = 'wp'

    TABLE_NAME = 'cms_auth'

    TABLE_NAME_HISTORY = 'cms_history'

    # 注册成功
    CONSTANT_ADMIN_ADDUSER_SUCCEED = 'ADMIN_ADDUSER_SUCCEED'

    # 注册失败，用户名已存在
    CONSTANT_ADMIN_ADDUSER_FAILED_REDUNDANT = 'ADMIN_ADDUSER_FAILED_REDUNDANT'

    # 修改密码成功
    CONSTANT_ADMIN_CHANGEPWD_SUCCEED = 'ADMIN_CHANGEPWD_SUCCEED'

    # 修改密码失败
    CONSTANT_ADMIN_CHANGEPWD_FAILED = 'ADMIN_CHANGEPWD_FAILED'

    @staticmethod
    def getOne(username):
        return queryAndFetchOne(Admin.CONN_NAME, "SELECT * FROM %s WHERE `username` = '%s'" % (Admin.TABLE_NAME, username))

    @staticmethod
    def changePwd(newpwd):
        if newpwd is None:
            return {
                'status' : Admin.CONSTANT_ADMIN_CHANGEPWD_FAILED
            }
        username = Sessions.getUserName()
        from common.aes import AESCipher
        cipher = AESCipher()
        newpwd = cipher.encrypt(newpwd)
        execute(Admin.CONN_NAME, "UPDATE %s SET `password` = '%s' WHERE username = '%s'" % (Admin.TABLE_NAME, newpwd, username))
        return {
            'status' : Admin.CONSTANT_ADMIN_CHANGEPWD_SUCCEED
        }

    @staticmethod
    def addUser(username, password):
        oneitem = Admin.getOne(username)
        from common.aes import AESCipher
        cipher = AESCipher()
        password = cipher.encrypt(password)
        if oneitem is not None:
            return {
                'status' : Admin.CONSTANT_ADMIN_ADDUSER_FAILED_REDUNDANT
            }
        execute(Admin.CONN_NAME, "INSERT INTO %s (`username`, `password`) VALUES ('%s', '%s')" % (Admin.TABLE_NAME, username, password))
        return {
            'status' : Admin.CONSTANT_ADMIN_ADDUSER_SUCCEED
        }

    @staticmethod
    def getHistoryList(page, pageSize, startTime, endTime, username):
        total = Admin.countHistory(startTime, endTime, username)
        page = long(max(min(long(page), long(ceil(float(total) / long(pageSize)))), 1))
        start = long(pageSize) * (page - 1)
        addition = (username == 'sunnyleone') and (' ') or (" AND (`username`='%s') " % username)
        items = queryAndFetchAll(Admin.CONN_NAME, "SELECT * FROM %s WHERE (`ctime` > '%s') AND (`ctime` < '%s') %s ORDER BY `id` DESC LIMIT %s, %s" % (Admin.TABLE_NAME_HISTORY, startTime, endTime, addition, start, pageSize))
        if items is not None:
            return {
                'status' : 'SUCCEED',
                'total' : total,
                'data' : items
            }
        else:
            return {
                'status' : 'FAILED'
            }

    @staticmethod
    def countHistory(startTime, endTime, username):
        addition = (username == 'sunnyleone') and (' ') or (" AND (`username`='%s') " % username)
        item = queryAndFetchOne(Admin.CONN_NAME, "SELECT COUNT(1) AS num FROM %s WHERE (`ctime` > '%s') AND (`ctime` < '%s') %s" % (Admin.TABLE_NAME_HISTORY, startTime, endTime, addition))
        if item is not None:
            return item['num']
        else:
            return 0
