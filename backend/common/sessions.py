# -*- coding:utf-8 -*-

# Author: Golion
# Date: 2016.2


import web


class Sessions:

    _session = None

    @staticmethod
    def init(webapp):
        if web.config.get('_session') is None:
            web.config.session_parameters['cookie_name']      = 'webpy_session_id'
            web.config.session_parameters['cookie_domain']    = None
            web.config.session_parameters['timeout']          = 86400 * 7,
            web.config.session_parameters['ignore_expiry']    = True
            web.config.session_parameters['ignore_change_ip'] = True
            web.config.session_parameters['secret_key']       = '******'
            web.config.session_parameters['expired_message']  = 'Session Expired'
            from web import utils
            user = utils.Storage({
                'username'   : '',
                'status'     : '',
                'lastlogin'  : ''
            })
            Sessions._session = web.session.Session(
                webapp,
                MemcacheStore(), # web.session.DiskStore('sessions'),
                initializer={
                    'status' : 0,
                    'user'   : user
                }
            )
            web.config._session = Sessions._session
        else:
            Sessions._session = web.config._session

    @staticmethod
    def reset():
        if Sessions._session is None: return
        Sessions._session.kill()

    #######

    @staticmethod
    def setUserName(userName):
        if Sessions._session is None: return
        Sessions._session.user['username'] = userName

    @staticmethod
    def getUserName():
        if Sessions._session is None: return ''
        return Sessions._session.user['username']

    #######

    @staticmethod
    def setUserStatus(userStatus):
        if Sessions._session is None: return
        Sessions._session.user['status'] = userStatus

    @staticmethod
    def getUserStatus():
        if Sessions._session is None: return ''
        return Sessions._session.user['status']

    #######

    @staticmethod
    def setUserLastLogin(userLastLogin):
        if Sessions._session is None: return
        Sessions._session.user['lastlogin'] = userLastLogin

    @staticmethod
    def getUserLastLogin():
        if Sessions._session is None: return ''
        return Sessions._session.user['lastlogin']


# 使用MC来存session
# Author: Golion
# Date: 2016.12


from common.dao import MemcacheConn
from web.session import Store


class MemcacheStore(Store):

    def __init__(self, timeout = 604800):
        self.mc = MemcacheConn().getMcConn('sessions')
        self.timeout = timeout

    def __contains__(self, key):
        return True if self.mc.get(key) else False

    def __getitem__(self, key):
        return self.mc.get(key)

    def __setitem__(self, key, value):
        self.mc.set(key, value, self.timeout)

    def __delitem__(self, key):
        self.mc.delete(key)

    def cleanup(self, timeout):
        '''You need nothing to do. Memcache can handle it.'''
        pass