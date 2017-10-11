# -*- coding:utf-8 -*-


import time
import json

from common.dao import MysqlConn
from common.dao import MemcacheConn


class HistoryClient:

    MAX_LIST_SIZE = 10

    @staticmethod
    def addDiceHistory(msg):
        try:
            mc = MemcacheConn().getMcConn('wp')
            mcRet = mc.get('wp-dice-history') 
            if mcRet is None:
                diceHistory = []
            else:
                diceHistory = json.loads(mcRet)
            diceHistory.append({
                'ctime': time.time(),
                'msg': msg
            })
            if len(diceHistory) > HistoryClient.MAX_LIST_SIZE:
                del diceHistory[0]
            mc.set('wp-dice-history', json.dumps(diceHistory))
            return {
                'status': 'succeed',
                'data': diceHistory
            }
        except:
            LogClient.error(sys.exc_info())
            return {
                'status': 'succeed',
                'data': []
            }

    @staticmethod
    def getDiceHistory():
        mc = MemcacheConn().getMcConn('wp')
        mcRet = mc.get('wp-dice-history')  
        if mcRet is None:
            diceHistory = []
        else:
            diceHistory = json.loads(mcRet)
        return {
            'status': 'succeed',
            'data': diceHistory
        }

    @staticmethod
    def getPageHistory():
        db = MysqlConn().getMysqlConn('wp')
        cur = db.cursor()
        items = None
        try:
            sql = "SELECT `id`, `name`, `creator`, `ctime` FROM `wp_page_history` WHERE 1=1 ORDER BY `id` DESC LIMIT 0, 20"
            cur.execute(sql)
            items = cur.fetchall()
        except:
            LogClient.error(sys.exc_info())
        finally:
            cur.close()
        if items is not None:
            return {
                'status': 'succeed',
                'data': items
            }
        else:
            return {
                'status': 'succeed',
                'data': []
            }
