# -*- coding:utf-8 -*-
# Will Project 建卡
# @Author: Golion
# @Date: 2016.7


import sys
import json
import time

from common.settings import ABS_PATH
from common.log import LogClient
from common.dao import MysqlConn
from common.utils import randomStr


class BuildClient:

    ERROR = {
        "status": "failed",
        "msg": "error"
    }

    EMPTY_INPUT = {
        "status": "failed",
        "msg": "empty input"
    }

    NOT_JSON_FORMAT = {
        "status": "failed",
        "msg": "not json format"
    }

    @staticmethod
    def readConf(confName):
        try:
             file = open(ABS_PATH + '/wpbuild/' + confName + '.conf')
        except:
             return []
        try:
             data = file.read()
        finally:
             file.close()
        try:
             jsonData = json.loads(data)
        except:
             jsonData = []
        return jsonData

    @staticmethod
    def addCard(creator, imgPath, cardJsonStr, isPrivate = False):
        if (creator is None) | (imgPath is None) | (cardJsonStr is None):
            return BuildClient.EMPTY_INPUT
        try:
            cardJsonObj = json.loads(cardJsonStr)
        except:
            return BuildClient.NOT_JSON_FORMAT
        LogClient.info('INSERT CARD')
        LogClient.info(creator)
        LogClient.info(cardJsonObj)
        db = MysqlConn().getMysqlConn('wp')
        cur = db.cursor()
        description = '%s - %s' % (cardJsonObj['introduction'], cardJsonObj['name'])
        private = isPrivate and 1 or 0
        privateToken = isPrivate and randomStr(10) or ''
        lastId = 0
        now = time.time()
        try:
            sql = "INSERT INTO `wp_card` (`creator`, `data`, `description`, `img_path`, `is_private`, `private_token`, `ctime`, `last_update`) VALUES ('%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s')" % (creator, cardJsonStr, description, imgPath, private, privateToken, now, now)
            LogClient.info(sql)
            cur.execute(sql)
            db.commit()
            lastId = cur.lastrowid
        except:
            LogClient.error(sys.exc_info())
        finally:
            cur.close()
        BuildClient.addCardHistory(lastId, cardJsonStr)
        LogClient.info('INSERT CARD SUCCEED')
        return {
            "status": "succeed",
            "id": isPrivate and ('p-%s-%s' % (lastId, privateToken)) or lastId
        }

    @staticmethod
    def updateCard(cardId, cardJsonStr):
        if (cardId is None) | (cardJsonStr is None):
            return BuildClient.EMPTY_INPUT
        try:
            cardJsonObj = json.loads(cardJsonStr)
        except:
            return BuildClient.NOT_JSON_FORMAT
        LogClient.info('UPDATE CARD')
        LogClient.info(cardJsonObj)
        db = MysqlConn().getMysqlConn('wp')
        cur = db.cursor()
        description = '%s - %s' % (cardJsonObj['introduction'], cardJsonObj['name'])
        now = time.time()
        try:
            if cardId[0] == 'p':
                ids = cardId.split('-')
                cardId = ids[1]
                privateToken = ids[2]
                sql = "UPDATE `wp_card` SET `data` = '%s', `description` = '%s', `last_update` = '%s' WHERE `id` = '%s' AND `private_token` = '%s'" % (cardJsonStr, description, now, cardId, privateToken)
            else:
                sql = "UPDATE `wp_card` SET `data` = '%s', `description` = '%s', `last_update` = '%s' WHERE `id` = '%s' AND `is_private` = '0'" % (cardJsonStr, description, now, cardId)
            LogClient.info(sql)
            cur.execute(sql)
            db.commit()
        except:
            LogClient.error(sys.exc_info())
        finally:
            cur.close()
        BuildClient.addCardHistory(cardId, cardJsonStr)
        LogClient.info('UPDATE CARD SUCCEED')
        return {
            "status": "succeed"
        }

    @staticmethod
    def updateCardImg(cardId, imgPath):
        if (cardId is None) | (imgPath is None):
            return BuildClient.EMPTY_INPUT
        LogClient.info('UPDATE CARD IMG')
        db = MysqlConn().getMysqlConn('wp')
        cur = db.cursor()
        now = time.time()
        try:
            if cardId[0] == 'p':
                ids = cardId.split('-')
                cardId = ids[1]
                privateToken = ids[2]
                sql = "UPDATE `wp_card` SET `img_path` = '%s', `last_update` = '%s' WHERE `id` = '%s' AND `private_token` = '%s'" % (imgPath, now, cardId, privateToken)
            else:
                sql = "UPDATE `wp_card` SET `img_path` = '%s', `last_update` = '%s' WHERE `id` = '%s' AND `is_private` = '0'" % (imgPath, now, cardId)
            LogClient.info(sql)
            cur.execute(sql)
            db.commit()
        except:
            LogClient.error(sys.exc_info())
        finally:
            cur.close()
        LogClient.info('UPDATE CARD IMG SUCCEED')
        return {
            "status": "succeed"
        }

    @staticmethod
    def updateCardImgLarge(cardId, imgPath):
        if (cardId is None) | (imgPath is None):
            return BuildClient.EMPTY_INPUT
        LogClient.info('UPDATE CARD IMG LARGE')
        db = MysqlConn().getMysqlConn('wp')
        cur = db.cursor()
        now = time.time()
        try:
            if cardId[0] == 'p':
                ids = cardId.split('-')
                cardId = ids[1]
                privateToken = ids[2]
                sql = "UPDATE `wp_card` SET `img_path_large` = '%s', `last_update` = '%s' WHERE `id` = '%s' AND `private_token` = '%s'" % (imgPath, now, cardId, privateToken)
            else:
                sql = "UPDATE `wp_card` SET `img_path_large` = '%s', `last_update` = '%s' WHERE `id` = '%s' AND `is_private` = '0'" % (imgPath, now, cardId)
            LogClient.info(sql)
            cur.execute(sql)
            db.commit()
        except:
            LogClient.error(sys.exc_info())
        finally:
            cur.close()
        LogClient.info('UPDATE CARD IMG LARGE SUCCEED')
        return {
            "status": "succeed"
        }

    @staticmethod
    def deleteCard(cardId):
        if cardId is None:
            return BuildClient.EMPTY_INPUT
        LogClient.info('DELETE CARD')
        db = MysqlConn().getMysqlConn('wp')
        cur = db.cursor()
        try:
            if cardId[0] == 'p':
                ids = cardId.split('-')
                cardId = ids[1]
                privateToken = ids[2]
                sql = "UPDATE `wp_card` SET `is_delete` = '1' WHERE `id` = '%s' AND `private_token` = '%s'" % (cardId, privateToken)
            else:
                sql = "UPDATE `wp_card` SET `is_delete` = '1' WHERE `id` = '%s' AND `is_private` = '0'" % cardId
            LogClient.info(sql)
            cur.execute(sql)
            db.commit()
        except:
            LogClient.error(sys.exc_info())
        finally:
            cur.close()
        LogClient.info('DELETE CARD SUCCEED')
        return {
            "status": "succeed"
        }

    @staticmethod
    def makePublic(cardId):
        if cardId is None:
            return BuildClient.EMPTY_INPUT
        LogClient.info('MAKE PUBLIC CARD')
        db = MysqlConn().getMysqlConn('wp')
        cur = db.cursor()
        try:
            ids = cardId.split('-')
            cardId = ids[1]
            privateToken = ids[2]
            sql = "UPDATE `wp_card` SET `is_private` = '0', `private_token` = '' WHERE `id` = '%s' AND `private_token` = '%s'" % (cardId, privateToken)
            LogClient.info(sql)
            cur.execute(sql)
            db.commit()
        except:
            LogClient.error(sys.exc_info())
        finally:
            cur.close()
        LogClient.info('MAKE PUBLIC CARD SUCCEED')
        return {
            "status": "succeed"
        }

    @staticmethod
    def addCardHistory(cardId, cardJsonStr):
        db = MysqlConn().getMysqlConn('wp')
        cur = db.cursor()
        now = time.time()
        try:
            sql = "INSERT INTO `wp_card_history` (`card_id`, `data`, `ctime`) VALUES ('%s', '%s', '%s')" % (cardId, cardJsonStr, now)
            LogClient.info(sql)
            cur.execute(sql)
            db.commit()
        except:
            LogClient.error(sys.exc_info())
        finally:
            cur.close()
        LogClient.info('INSERT CARD HISTORY SUCCEED')

    @staticmethod
    def getCard(cardId):
        db = MysqlConn().getMysqlConn('wp')
        cur = db.cursor()
        item = None
        try:
            if cardId[0] == 'p':
                ids = cardId.split('-')
                cardId = ids[1]
                privateToken = ids[2]
                sql = "SELECT * FROM `wp_card` WHERE `id` = '%s' AND `is_delete` = '0' AND `private_token` = '%s' LIMIT 1" % (cardId, privateToken)
            else:
                sql = "SELECT * FROM `wp_card` WHERE `id` = '%s' AND `is_delete` = '0' AND `is_private` = '0' LIMIT 1" % cardId
            cur.execute(sql)
            item = cur.fetchone()
        except:
            LogClient.error(sys.exc_info())
        finally:
            cur.close()
        if item is not None:
            return {
                "status": "succeed",
                "data": {
                    "creator"       : item['creator'],
                    "imgpath"       : item['img_path'],
                    "imgpath_large" : item['img_path_large'],
                    "ctime"         : item['ctime'],
                    "last_update"   : item['last_update'],
                    "data"          : json.loads(item['data'])
                }
            }
        else:
            return BuildClient.ERROR

    @staticmethod
    def getCards(page, pageSize):
        total = BuildClient.countCards()
        start = pageSize * (page - 1)
        db = MysqlConn().getMysqlConn('wp')
        cur = db.cursor()
        items = None
        try:
            sql = "SELECT `id`, `description`, `img_path` FROM `wp_card` WHERE `is_delete` = '0' AND `is_private` = '0' ORDER BY `id` DESC LIMIT %s, %s" % (start, pageSize)
            cur.execute(sql)
            items = cur.fetchall()
        except:
            LogClient.error(sys.exc_info())
        finally:
            cur.close()
        if items is not None:
            return {
                'status': 'succeed',
                'total': total,
                'data': items
            }
        else:
            return BuildClient.ERROR

    @staticmethod
    def countCards():
        item = None
        db = MysqlConn().getMysqlConn('wp')
        cur = db.cursor()
        try:
            sql = "SELECT COUNT(1) AS num FROM `wp_card` WHERE `is_delete` = '0' AND `is_private` = '0'"
            cur.execute(sql)
            item = cur.fetchone()
        except:
            LogClient.error(sys.exc_info())
        finally:
            cur.close()
        if item is not None:
            return item['num']
        else:
            return 0
