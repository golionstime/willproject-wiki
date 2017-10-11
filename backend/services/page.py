# -*- coding:utf-8 -*-


import os
import sys
import time

from common.settings import ABS_PATH
from common.log import LogClient
from common.dao import MysqlConn
from services.wiki import WikiEngine


class PageClient:

    PAGE_NAME_MAX_LENGTH = 100

    ERROR = {
        "status": "failed",
        "msg": "error"
    }

    EMPTY_INPUT = {
        "status": "failed",
        "msg": "empty input"
    }

    REDUNDANT = {
        "status": "failed",
        "msg": "redundant"
    }

    NOT_EXIST = {
        "status": "failed",
        "msg": "page not exist"
    }

    NAME_TOO_LONG = {
        "status": "failed",
        "msg": "name too long"
    }

    @staticmethod
    def getPage(pageName):
        db = MysqlConn().getMysqlConn('wp')
        cur = db.cursor()
        item = None
        try:
            sql = "SELECT `data`, `creator`, `img_path`, `is_lock` FROM `wp_page` WHERE `name` = '%s' AND `is_delete` = '0' LIMIT 1" % pageName
            cur.execute(sql)
            item = cur.fetchone()
        except:
            LogClient.error(sys.exc_info())
        finally:
            cur.close()
        if item is not None:
            return {
                "status": "succeed",
                "pagedata": item['data'],
                "creator": item['creator'],
                "imgpath": item['img_path'],
                "is_lock": item['is_lock']
            }
        else:
            return PageClient.NOT_EXIST

    @staticmethod
    def addPage(pageName, creator, imgPath, pageData):
        if (pageName is None) | (creator is None) | (imgPath is None) | (pageData is None):
            return PageClient.EMPTY_INPUT
        if len(pageName) > PageClient.PAGE_NAME_MAX_LENGTH:
            return PageClient.NAME_TOO_LONG
        if (PageClient.checkPageByName(pageName)):
            return PageClient.REDUNDANT
        LogClient.info('INSERT PAGE')
        db = MysqlConn().getMysqlConn('wp')
        cur = db.cursor()
        now = time.time()
        try:
            sql = "INSERT INTO `wp_page` (`name`, `creator`, `img_path`, `data`, `ctime`, `last_update`) VALUES ('%s', '%s', '%s', '%s', '%s', '%s')" % (pageName, creator, imgPath, pageData, now, now)
            LogClient.info(sql)
            cur.execute(sql)
            db.commit()
        except:
            LogClient.error(sys.exc_info())
        finally:
            cur.close()
        PageClient.addPageHistory(pageName, creator, pageData)
        PageClient.convertPage(pageName, creator, imgPath, pageData)
        LogClient.info('INSERT PAGE SUCCEED')
        return {
            "status": "succeed"
        }

    @staticmethod
    def updatePage(pageName, creator, imgPath, pageData):
        if (pageName is None) | (creator is None) | (imgPath is None) | (pageData is None):
            return PageClient.EMPTY_INPUT
        if len(pageName) > PageClient.PAGE_NAME_MAX_LENGTH:
            return PageClient.NAME_TOO_LONG
        pageItem = PageClient.getPage(pageName)
        if pageItem['status'] != 'succeed':
            return PageClient.NOT_EXIST
        if pageItem['is_lock'] != 0:
            return {
                "status": "locked"
            }
        LogClient.info('UPDATE PAGE')
        db = MysqlConn().getMysqlConn('wp')
        cur = db.cursor()
        now = time.time()
        try:
            sql = "UPDATE `wp_page` SET `creator` = '%s', `img_path` = '%s', `data` = '%s', `last_update` = '%s' WHERE `name` = '%s'" % (creator, imgPath, pageData, now, pageName)
            LogClient.info(sql)
            cur.execute(sql)
            db.commit()
        except:
            LogClient.error(sys.exc_info())
        finally:
            cur.close()
        PageClient.addPageHistory(pageName, creator, pageData)
        PageClient.convertPage(pageName, creator, imgPath, pageData)
        LogClient.info('UPDATE PAGE SUCCEED')
        return {
            "status": "succeed"
        }

    @staticmethod
    def addPageHistory(pageName, creator, pageData):
        LogClient.info('INSERT PAGE HISTORY')
        db = MysqlConn().getMysqlConn('wp')
        cur = db.cursor()
        now = time.time()
        try:
            sql = "INSERT INTO `wp_page_history` (`name`, `creator`, `data`, `ctime`) VALUES ('%s', '%s', '%s', '%s')" % (pageName, creator, pageData, now)
            LogClient.info(sql)
            cur.execute(sql)
            db.commit()
        except:
            LogClient.error(sys.exc_info())
        finally:
            cur.close()
        LogClient.info('INSERT PAGE HISTORY SUCCEED')

    @staticmethod
    def checkPageByName(name):
        db = MysqlConn().getMysqlConn('wp')
        cur = db.cursor()
        item = None
        try:
            sql = "SELECT * FROM `wp_page` WHERE `name` = '%s' LIMIT 1" % name
            cur.execute(sql)
            item = cur.fetchone()
        except:
            LogClient.error(sys.exc_info())
        finally:
            cur.close()
        if item is not None:
            return True
        else:
            return False

    @staticmethod
    def refreshAllPages():
        db = MysqlConn().getMysqlConn('wp')
        cur = db.cursor()
        items = None
        try:
            sql = "SELECT `name`, `creator`, `img_path`, `data` FROM `wp_page` WHERE 1=1"
            cur.execute(sql)
            items = cur.fetchall()
        except:
            LogClient.error(sys.exc_info())
        finally:
            cur.close()
        if items is not None:
            for item in items:
                PageClient.convertPage(item['name'], item['creator'], item['img_path'], item['data'])

    @staticmethod
    def convertPage(pageName, creator, imgPath, pageData):
        LogClient.info("Convert Page Start: %s" % pageName)
        filePath = r'%s/page/%s.html' % (ABS_PATH, pageName)
        if os.path.isfile(filePath):
            os.remove(filePath)
        htmlData = WikiEngine.strToHtml(pageData)
        file = open(filePath,'wa')
        file.write('$def with (DATA)\n')
        file.write('<!DOCTYPE html>\n')
        file.write('<html>\n')
        file.write('<head>\n')
        file.write('    <meta http-equiv="content-type" content="text/html; charset=UTF-8">\n')
        file.write('    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">\n')
        file.write('    <title>%s - Will Project Wiki</title>\n' % pageName)
        file.write('    <link rel="icon" type="image/png" href="$DATA[\'HOST\']/favicon.ico"/>\n')
        file.write('    <script type="text/javascript">const DATA = $:DATA; </script>\n')
        file.write('    <script type="text/javascript" src="http://cdn.bootcss.com/jquery/2.2.0/jquery.min.js"></script>\n')
        file.write('    <script type="text/javascript" src="http://cdn.bootcss.com/react/15.2.0/react-with-addons.min.js"></script>\n')
        file.write('    <script type="text/javascript" src="http://cdn.bootcss.com/react/15.2.0/react-dom.min.js"></script>\n')
        file.write('    <script type="text/javascript" src="http://cdn.bootcss.com/antd/1.6.4/antd.min.js"></script>\n')
        file.write('    <link type="text/css" rel="stylesheet" href="http://cdn.bootcss.com/antd/1.6.4/antd.min.css"/>\n')
        file.write('    <script type="text/javascript" src="$DATA[\'HOST\']/static/js/base.bundle.js"></script>\n')
        file.write('</head>\n')
        file.write('<body>\n')
        file.write('<div class="stage">\n')
        file.write('    <script>\n')
        file.write('        if (wp.base.BROWSER_TYPE) { $$(".stage").addClass("mobile"); }\n')
        file.write('        else { $$(".stage").addClass("pc"); }\n')
        file.write('    </script>\n')
        file.write('    <div class="main wrap" id="main">\n')
        file.write('        <div class="nav" id="nav" style="min-height:139px;"></div>\n')
        file.write('        <div class="content" id="content">\n')
        file.write('            <div style="margin:10px 0;float:right;font-size:small;"><a href="/editpage/%s">编辑本页</a></div>\n' % pageName)
        file.write('            <p style="text-align:left;font-weight:bold;">%s</p>\n' % pageName)
        file.write('            <div style="margin:10px;"><hr/></div>\n')
        file.write('            <div class="page-content" style="text-align:left;">\n')
        file.write('                <script> $$(".page-content").css("minHeight", wp.base.WINDOW_HEIGHT-300); </script>\n')
        if imgPath != "":
            file.write('                <div style="margin:10px;text-align:center;"><img style="max-width:100%;" src="' + imgPath + '"/></div>\n')
        file.write(htmlData)
        file.write('\n            </div>\n')
        file.write('            <div style="margin:10px;"><hr/></div>\n')
        file.write('            <p style="font-size:small;">最后编辑：%s</p>\n' % creator)
        file.write('            <p style="font-size:small;">最后更新时间：%s</p>\n' % (time.strftime('%Y-%m-%d %H:%M', time.gmtime(time.time() + 3600 * 8))))
        file.write('        </div>\n')
        file.write('    </div>\n')
        file.write('</div>\n')
        file.write('<script>wp.base.calcWindowHeight();</script>\n')
        file.write('</body>\n')
        file.write('<script type="text/javascript" src="$DATA[\'HOST\']/static/js/nav.bundle.js"></script>\n')
        file.write('</html>\n')
        LogClient.info("Convert Page Finished: %s" % pageName)
