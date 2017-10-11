# -*- coding:utf-8 -*-

# Author: Golion
# Date: 2016.2


import sys
import web

from common.settings import WEBAPP_PORT
from common.log import LogClient
from common.sessions import Sessions


class Main:

    def __init__(self):
        self._CMDLIST = {
            'help'         : [self.__help,         0],
            'runwebapp'    : [self.__runWebApp,    0],
            'autoclear'    : [self.__autoClear,    0],
            'refreshpage'  : [self.__refreshPage,  0],
            'test'         : [self.__test,         0]
        }

    def __help(self):
        print('Options')
        print('  help ..................... Help')
        print('  runwebapp ................ Run Server')
        print('  autoclear ................ Delete Logs')
        print('  refreshpage .............. Refresh All Page Data, Convert Them into Html Files')
        exit(0)

    def run(self, argvList):
        if len(argvList) == 1:
            argvList.append('help')
        cmd = argvList[1]
        if self._CMDLIST.has_key(cmd):
            method = self._CMDLIST[cmd][0]
            avgNum = self._CMDLIST[cmd][1]
            if len(argvList) <= avgNum:
                LogClient.error('Invalid Command. Needs %d Arguments, but only %d provided.' % (avgNum, len(argvList)-2))
                exit(0)
            if avgNum == 0:
                method()
            elif avgNum == 1:
                method(argvList[2])
            elif avgNum == 2:
                method(argvList[2], argvList[3])
            elif avgNum == 3:
                method(argvList[2], argvList[3], argvList[4])
            else:
                LogClient.error('Impossible Error')
                exit(1)
        else:
            LogClient.error("Invalid Command. Run 'python main.py help' for help")
            exit(0)

    def __runWebApp(self):
        web.config.debug = False
        self._urls = (
            '/(.*)', 'controller.Controller'
        )
        sys.argv[1] = WEBAPP_PORT
        self._webapp = web.application(self._urls, globals(), autoreload=False)
        # Sessions.init(self._webapp)
        self._webapp.run()

    def __autoClear(self):
        LogClient.autoClear()

    def __refreshPage(self):
        from services.page import PageClient
        PageClient.refreshAllPages()

    def __test(self):
        from common.dao import MemcacheConn
        mc = MemcacheConn()
        # mc.getMcConn('wp').set('test', 'helloworld!')
        LogClient.info(mc.getMcConn('wp').get('test')) 


if __name__ == '__main__':
    leader = Main()
    leader.run(sys.argv)
