# -*- coding:utf-8 -*-

# Author: Golion
# Date: 2016.1


import os
import logging
import logging.handlers
import time
import os.path

from settings import LOG_PATH
from settings import LOG_LEVEL
from settings import LOG_PROTECTED_DAYS


class LogClient:

    currentDateStr = ''

    logger = None

    logLevel = {
        'CRITICAL' : logging.CRITICAL,
        'ERROR' : logging.ERROR,
        'WARN' : logging.WARN,
        'WARNING' : logging.WARNING,
        'INFO' : logging.INFO,
        'DEBUG' : logging.DEBUG,
        'NOTSET' : logging.NOTSET
    }

    @staticmethod
    def __checkInit():
        dateStr = time.strftime('%Y%m%d', time.gmtime())
        if (LogClient.logger is None) | (dateStr != LogClient.currentDateStr):
            if not os.path.exists(LOG_PATH):
                os.makedirs(LOG_PATH)
            logFilePath = '%s%s.log' % (LOG_PATH, dateStr)
            handler = logging.handlers.RotatingFileHandler(logFilePath, maxBytes = 100*1024*1024, backupCount = 0) # 100MB
            fmt = '%(asctime)s - %(levelname)s - %(message)s'
            formatter = logging.Formatter(fmt)
            handler.setFormatter(formatter)
            LogClient.logger = logging.getLogger('default')
            LogClient.logger.addHandler(handler)
            LogClient.logger.setLevel(LogClient.logLevel[LOG_LEVEL])
            LogClient.currentDateStr = dateStr

    @staticmethod
    def critical(criticalMsg):
        LogClient.__checkInit()
        LogClient.logger.critical(criticalMsg)
        print(criticalMsg)

    @staticmethod
    def error(errorMsg):
        LogClient.__checkInit()
        LogClient.logger.error(errorMsg)
        print(errorMsg)

    @staticmethod
    def warning(warningMsg):
        LogClient.__checkInit()
        LogClient.logger.warning(warningMsg)
        print(warningMsg)

    @staticmethod
    def info(infoMsg):
        LogClient.__checkInit()
        LogClient.logger.info(infoMsg)
        print(infoMsg)

    @staticmethod
    def debug(debugMsg):
        LogClient.__checkInit()
        LogClient.logger.debug(debugMsg)
        print(debugMsg)

    @staticmethod
    def autoClear():
        days = LOG_PROTECTED_DAYS + 5
        while days > LOG_PROTECTED_DAYS: # 指定时间内的日志不删
            logFile = '%s%s.log' % (LOG_PATH, time.strftime('%Y%m%d', time.localtime(time.time() - days * 86400)))
            days -= 1
            if os.path.isfile(logFile):
                os.remove(logFile)
                LogClient.info('Deleted %s' % logFile)
