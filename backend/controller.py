# -*- coding:utf-8 -*-

# Author: Golion
# Date: 2016.2


import os
import web
import string
import json
from urllib import quote

from common.utils import toUtf8Str
from common.log import LogClient
from common.settings import ABS_PATH
from common.settings import WEB_CONF
from common.filter import Filter
from services.rule import RuleEngine
from services.wiki import WikiEngine
from services.history import HistoryClient
from services.build import BuildClient
from services.img import ImgClient
from services.page import PageClient


class Controller:

    def __init__(self):
        self._render = web.template.render('templates', globals = {})
        self._cmd = {
            'index'      : self.__index,
            '404'        : self.__404,
            'api'        : self.__api,
            'page'       : self.__page,
            'addpage'    : self.__addpage,
            'editpage'   : self.__editpage,
            'editbuild'  : self.__editbuild,
            'rules'      : self.__rules,
            'map'        : self.__map,
            'dice'       : self.__dice,
            'datagram'   : self.__datagram,
            'build'      : self.__build,
            'printer'    : self.__printer,
            'edit'       : self.__edit,
            'setimg'     : self.__setimg,
            'character'  : self.__character,
            'characters' : self.__characters,
            'uploadimg'  : self.__uploadimg,
            'history'    : self.__history
        }

    @staticmethod
    def __getAttrs(uri):
        if not uri:
            uri = ''
        attrs = uri.split('/')
        _attrs = []
        for attr in attrs:
            _attrs.append(Filter.filter(attr))
        return _attrs

    #######

    def GET(self, uri):
        LogClient.info('GET - ' + uri)
        attrs = Controller.__getAttrs(uri)
        if uri == '':
            return self._cmd['index'](attrs)
        if uri == 'favicon.ico':
            web.redirect('/static/img/favicon.ico')
        if (len(attrs) > 0) & (attrs[0] is not ''):
            if attrs[0] in self._cmd.keys():
                key = attrs[0]
                attrs[0] = 'get'
                return self._cmd[key](attrs)
        else:
            return self._cmd['index'](attrs)
        return self._cmd['404'](attrs)

    def POST(self, uri):
        LogClient.info('POST - ' + uri)
        attrs = Controller.__getAttrs(uri)
        if (len(attrs) > 0) & (attrs[0] == 'api'):
            attrs[0] = 'post'
            return self._cmd['api'](attrs)
        return ''

    def PUT(self, uri):
        LogClient.info('PUT - ' + uri)
        attrs = Controller.__getAttrs(uri)
        if (len(attrs) > 0) & (attrs[0] == 'api'):
            attrs[0] = 'put'
            return self._cmd['api'](attrs)
        return ''

    def DELETE(self, uri):
        LogClient.info('DELETE - ' + uri)
        attrs = Controller.__getAttrs(uri)
        if (len(attrs) > 0) & (attrs[0] == 'api'):
            attrs[0] = 'delete'
            return self._cmd['api'](attrs)
        return ''

    #######

    def __index(self, attrs):
        return self._render.index({
            'HOST' : WEB_CONF['host']
        })

    def __404(self, attrs):
        return self._render.page404({
            'HOST' : WEB_CONF['host']
        })

    def __page(self, attrs):
        if (len(attrs) > 1):
            if os.path.exists(r'%s/page/%s.html' % (ABS_PATH, attrs[1])): 
                return web.template.frender('page/%s.html' % attrs[1])({
                    'HOST' : WEB_CONF['host'],
                    'PAGE' : quote(toUtf8Str(attrs[1]))
                })
            else:
                return self._render.addpage({
                    'HOST' : WEB_CONF['host'],
                    'PAGE' : 'NONE',
                    'NAME' : quote(toUtf8Str(attrs[1]))
                })
        return self.__404(attrs)

    def __addpage(self, attrs):
        if (len(attrs) > 1):
            return self._render.addpage({
                'HOST' : WEB_CONF['host'],
                'PAGE' : quote(toUtf8Str(attrs[1])),
                'NAME' : 'NONE'
	        })
        else:
            return self._render.addpage({
                'HOST' : WEB_CONF['host'],
                'PAGE' : 'NEW',
                'NAME' : 'NONE'
            })
    
    def __editpage(self, attrs):
        if (len(attrs) > 1):
            return self._render.editpage({
                'HOST' : WEB_CONF['host'],
                'PAGE' : quote(toUtf8Str(attrs[1]))
            })
        return self.__404(attrs)

    def __editbuild(self, attrs):
        if (len(attrs) > 1):
            return self._render.editbuild({
                'HOST' : WEB_CONF['host'],
                'CONFNAME' : quote(toUtf8Str(attrs[1]))
            })
        return self.__404(attrs)

    def __rules(self, attrs):
        return self._render.rules({
            'HOST' : WEB_CONF['host'],
            'RULEPAGE' : (len(attrs) > 1) and (toUtf8Str(attrs[1])) or 'intro'
        })

    def __map(self, attrs):
        return self._render.map({
            'HOST' : WEB_CONF['host']
        })

    def __dice(self, attrs):
        return self._render.dice({
            'HOST' : WEB_CONF['host']
        })

    def __datagram(self, attrs):
        return self._render.datagram({
            'HOST' : WEB_CONF['host']
        })

    def __build(self, attrs):
        return self._render.build({
            'HOST' : WEB_CONF['host']
        })

    def __printer(self, attrs):
        return self._render.printer({
            'HOST' : WEB_CONF['host']
        })

    def __edit(self, attrs):
        if (len(attrs) > 1):
            return self._render.edit({
                'HOST' : WEB_CONF['host'],
                'CARD_ID' : quote(toUtf8Str(attrs[1]))
            })
        return self.__404(attrs)

    def __setimg(self, attrs):
        if (len(attrs) > 1):
            return self._render.setimg({
                'HOST' : WEB_CONF['host'],
                'CARD_ID' : quote(toUtf8Str(attrs[1]))
            })
        return self.__404(attrs)

    def __character(self, attrs):
        if (len(attrs) > 1):
            return self._render.character({
                'HOST' : WEB_CONF['host'],
                'CARD_ID' : quote(toUtf8Str(attrs[1]))
            })
        return self.__404(attrs)

    def __characters(self, attrs):
        return self._render.characters({
            'HOST' : WEB_CONF['host'],
            'CHARACTERSPAGE' : (len(attrs) > 1) and (toUtf8Str(attrs[1])) or '1'
        })

    def __uploadimg(self, attrs):
        return self._render.uploadimg({
            'HOST' : WEB_CONF['host']
        })

    def __history(self, attrs):
        return self._render.history({
            'HOST' : WEB_CONF['host']
        })

    __RET_API_NOT_FOUND = '{"status":"API NOT FOUND"}'

    __RET_PERMISSION_DENIED = '{"status":"PERMISSION DENIED"}'

    # RESTful API
    def __api(self, attrs):

        # GET
        if (len(attrs) > 1) & (attrs[0] == 'get'):

            if (attrs[1] == 'rolldice') & (len(attrs) > 3):
                n = string.atoi(attrs[2])
                k = string.atoi(attrs[3])
                return json.dumps({
                    "status": "succeed",
                    "dices": RuleEngine.RollDiceNaive(n, k)
                })

            if (attrs[1] == 'nkm') & (len(attrs) > 4):
                n = string.atoi(attrs[2])
                m = string.atoi(attrs[3])
                reverse = attrs[4] == '1' and True or False
                return json.dumps({
                    "status": "succeed",
                    "dices": RuleEngine.RollDice(n, m, reverse)
                })

            if (attrs[1] == 'nkmexp') & (len(attrs) > 3):
                n = string.atoi(attrs[2])
                m = string.atoi(attrs[3])
                reverse = attrs[4] == '1' and True or False
                return json.dumps({
                    "status": "succeed",
                    "exp": RuleEngine.CalcExp(n, m, reverse)
                })

            if (attrs[1] == 'nkmdatagram') & (len(attrs) > 3):
                n = string.atoi(attrs[2])
                m = string.atoi(attrs[3])
                reverse = attrs[4] == '1' and True or False
                return json.dumps({
                    "status": "succeed",
                    "datagram": RuleEngine.CalcDataGram(n, m, reverse)
                })

            if attrs[1] == 'latestdicehistory':
                return json.dumps(HistoryClient.getDiceHistory())

            if attrs[1] == 'latestpagehistory':
                return json.dumps(HistoryClient.getPageHistory())

            if (attrs[1] == 'buildconf') & (len(attrs) > 2):
                return json.dumps({
                    "status": "succeed",
                    "data": BuildClient.readConf(attrs[2])
                })

            if (attrs[1] == 'ruleconf') & (len(attrs) > 2):
                return json.dumps({
                    "status": "succeed",
                    "data": RuleEngine.readConf(attrs[2])
                })

            if (attrs[1] == 'card') & (len(attrs) > 2):
                return json.dumps(BuildClient.getCard(attrs[2]))

            if (attrs[1] == 'cards') & (len(attrs) > 3):
                return json.dumps(BuildClient.getCards(string.atoi(attrs[2]), string.atoi(attrs[3])))

            if (attrs[1] == 'page') & (len(attrs) > 2):
                return json.dumps(PageClient.getPage(attrs[2]))

        # POST
        if (len(attrs) > 1) & (attrs[0] == 'post'):

            if attrs[1] == 'card':
                data = web.input(cardid=None, data=None)
                return json.dumps(BuildClient.updateCard(data.cardid, data.data))

            if attrs[1] == 'makepublic':
                data = web.input(cardid=None)
                return json.dumps(BuildClient.makePublic(data.cardid))

            if attrs[1] == 'cardimg':
                data = web.input(cardid=None, imgpath=None)
                return json.dumps(BuildClient.updateCardImg(data.cardid, data.imgpath))

            if attrs[1] == 'cardimglarge':
                data = web.input(cardid=None, imgpath=None)
                return json.dumps(BuildClient.updateCardImgLarge(data.cardid, data.imgpath))

            if attrs[1] == 'uploadimg':
                data = web.input(filename=None, data=None)
                return json.dumps(ImgClient.upload(data.filename, data.data))

            if attrs[1] == 'convertwiki':
                data = web.input(pagedata=None)
                return WikiEngine.strToHtml(data.pagedata)

            if attrs[1] == 'page':
                data = web.input(pagename=None, creator=None, imgpath=None, pagedata=None)
                return json.dumps(PageClient.updatePage(data.pagename, data.creator, data.imgpath, data.pagedata))

            if (attrs[1] == 'buildconf') & (len(attrs) > 2):
                data = web.input(confjsonstr=None)
                return json.dumps(BuildClient.setConf(attrs[2], data.confjsonstr))

        # PUT
        if (len(attrs) > 1) & (attrs[0] == 'put'):
            
            if attrs[1] == 'dicehistory':
                data = web.input(msg='')
                HistoryClient.addDiceHistory(data.msg)
                return json.dumps({
                    "status": "succeed"
                })

            if attrs[1] == 'card':
                data = web.input(creator=None, imgpath=None, ispublic=None, data=None)
                isPrivate = ( data.ispublic == '0' ) and True or False
                return json.dumps(BuildClient.addCard(data.creator, data.imgpath, data.data, isPrivate))

            if attrs[1] == 'page':
                data = web.input(pagename=None, creator=None, imgpath=None, pagedata=None)
                return json.dumps(PageClient.addPage(data.pagename, data.creator, data.imgpath, data.pagedata))

        # DELETE
        if (len(attrs) > 1) & (attrs[0] == 'delete'):

            if (attrs[1] == 'card') & (len(attrs) > 2):
                return json.dumps(BuildClient.deleteCard(attrs[2]))

        return Controller.__RET_API_NOT_FOUND
