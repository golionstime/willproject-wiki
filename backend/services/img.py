# -*- coding:utf-8 -*-


import sys
import time

from common.settings import WEB_CONF
from common.settings import ABS_PATH
from common.log import LogClient
from common.dao import MysqlConn
from common.utils import randomStr


class ImgClient:

    IMG_STORAGE_PATH = ABS_PATH + '/static/img/custom/'

    ERROR = {
        "status": "failed",
        "msg": "error"
    }

    EMPTY_INPUT = {
        "status": "failed",
        "msg": "empty input"
    }

    NOT_SUPPORTED_FORMAT = {
        "status": "failed",
        "msg": "not supported format"
    }

    @staticmethod
    def upload(fileName, data):
        if (fileName is None) | (data is None):
            return ImgClient.EMPTY_INPUT
        LogClient.info(fileName)
        ext = fileName.replace('\\', '/').split('/')[-1].split('.', 1)[1]
        if (not ((ext == 'jpeg') | (ext == 'gif') | (ext == 'png') | (ext == 'bmp') | (ext == 'jpg') | (ext == 'webp'))):
            return ImgClient.NOT_SUPPORTED_FORMAT
        randFileName = randomStr(10)
        fout = open(ImgClient.IMG_STORAGE_PATH + randFileName + '.' + ext, 'wb')
        fout.write(data)
        fout.close()
        db = MysqlConn().getMysqlConn('wp')
        cur = db.cursor()
        now = time.time()
        try:
            sql = "INSERT INTO `wp_img` (`filename`, `ctime`) VALUES ('%s', '%s')" % (randFileName + '.' + ext, now)
            LogClient.info(sql)
            cur.execute(sql)
            db.commit()
        except:
            LogClient.error(sys.exc_info())
        finally:
            cur.close()
        return {
            "status": "succeed",
            "filepath": WEB_CONF['host'] + '/static/img/custom/' + randFileName + '.' + ext
        }
