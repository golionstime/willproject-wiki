# -*- coding:utf-8 -*-

# Author: Golion
# Date: 2016.2


import time
import bcrypt
import json
from math import ceil

from common.sessions import Sessions
from common.utils import toUtf8Str
from common.dao import execute
from common.dao import queryAndFetchOne


class Login:

    CONN_NAME = 'wp'

    TABLE_NAME = 'cms_auth'

    # 未登录
    CONSTANT_LOGIN_NONE = 'LOGIN_NONE'

    # 用户名或密码错误
    CONSTANT_LOGIN_WRONG = 'LOGIN_WRONG'

    # 登陆成功
    CONSTANT_LOGIN_AUTHENTICATED = 'LOGIN_AUTHENTICATED'

    # 登出成功
    CONSTANT_LOGOUT_SUCCEED = 'LOGOUT_SUCCEED'

    @staticmethod
    def isLogin():
        status = Sessions.getUserStatus()
        if status == Login.CONSTANT_LOGIN_AUTHENTICATED:
            return True
        return False

    @staticmethod
    def checkAuth(menu, subMenu):
        username = Sessions.getUserName()
        oneitem = Login.getOne(username)
        if oneitem is None:
            return False
        permissionStr = oneitem['permission']
        if (permissionStr is None) | (permissionStr == ''):
            permission = {}
        else:
            try:
                permission = json.loads(permissionStr)
            except:
                permission = {}
        if permission.has_key(menu):
            if subMenu in permission[menu]:
                return True
        return False

    @staticmethod
    def getUserInfo():
        status = Sessions.getUserStatus()
        if status == Login.CONSTANT_LOGIN_AUTHENTICATED:
            username = Sessions.getUserName()
            oneitem = Login.getOne(username)
            if oneitem is None:
                return {
                    'status'    : Login.CONSTANT_LOGIN_NONE
                }
            permissionStr = oneitem['permission']
            if (permissionStr is None) | (permissionStr == ''):
                permission = {}
            else:
                try:
                    permission = json.loads(permissionStr)
                    # permission = permission.has_key(entry) and permission[entry] or []
                except:
                    permission = {}
            now = ceil(time.time())
            Sessions.setUserLastLogin(now)
            Login.updateLastLogin(username, Sessions.getUserLastLogin())
            return {
                'username'   : username,
                'status'     : Login.CONSTANT_LOGIN_AUTHENTICATED,
                'lastlogin'  : Sessions.getUserLastLogin(),
                'permission' : permission
            }
        else:
            return {
                'status'    : Login.CONSTANT_LOGIN_NONE
            }

    @staticmethod
    def updateLastLogin(username, lastlogin):
        execute(Login.CONN_NAME, "UPDATE %s SET `lastlogin`='%s' WHERE `username`='%s'" % (Login.TABLE_NAME, lastlogin, username))

    @staticmethod
    def login(username, pwdhash, keeplogin = 1):
        item = queryAndFetchOne(Login.CONN_NAME, "SELECT * FROM %s WHERE `username` = '%s'" % (Login.TABLE_NAME, username))
        if item is None:
            return {
                'status' : Login.CONSTANT_LOGIN_WRONG
            }
        from common.aes import AESCipher
        cipher = AESCipher()
        password = toUtf8Str(cipher.decrypt(item['password']))
        pwdhash = toUtf8Str(pwdhash)
        hash = bcrypt.hashpw(password, pwdhash)
        if hash == pwdhash:
            now = ceil(time.time())
            Sessions.setUserName(username)
            Sessions.setUserStatus(Login.CONSTANT_LOGIN_AUTHENTICATED)
            Sessions.setUserLastLogin(now)
            Login.updateLastLogin(username, Sessions.getUserLastLogin())
            return {
                'status'     : Login.CONSTANT_LOGIN_AUTHENTICATED,
                'username'   : username,
                'lastlogin'  : now
            }
        else:
            return {
                'status'    : Login.CONSTANT_LOGIN_WRONG
            }

    @staticmethod
    def logout():
        Sessions.reset()
        return {
            'status' : Login.CONSTANT_LOGOUT_SUCCEED
        }

    @staticmethod
    def getOne(username):
        return queryAndFetchOne(Login.CONN_NAME, "SELECT * FROM %s WHERE `username` = '%s'" % (Login.TABLE_NAME, username))
