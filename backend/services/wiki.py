# -*- coding:utf-8 -*-
# Wiki Engine
# @Author: Golion
# @Date: 2016.7


import re
from urllib import quote
from urllib import unquote

from common.utils import toUtf8Str
from common.log import LogClient


class WikiEngine:

    @staticmethod
    def strToHtml(dataStr):
        if (dataStr is None) | (dataStr == ''):
            return '<div></div>'
        dataList = dataStr.split('\n')
        ret = ''
        for data in dataList:
            if data == '':
                ret += '<br/>'
            if len(data) > 4:
                if (data[0] == '{') & (data[1] == '{') & (data[-1] == '}') & (data[-2] == '}'):
                    ret += data[2:-2]
                    continue
            data = WikiEngine.parseNoWiki(data)
            data = WikiEngine.parseLink(data)
            data = unquote(data)
            ret += '<p>%s</p>' % data
        return ret

    @staticmethod
    # 匹配<nowiki></nowiki>
    def parseNoWiki(str):
        ret = ''
        reResult = re.split('(<nowiki>[\s\S]+</nowiki>)', str)
        for result in reResult:
            if (result is None) | (result == ''):
                continue
            if len(result) > 17:
                if (result.find('<nowiki>') != -1) & (result.find('</nowiki>') != -1):
                    ret += quote(toUtf8Str(result)[8:-9])
                    continue
            ret += result
        return ret

    @staticmethod
    # 匹配链接
    # [DisplayName|PageName]
    # [DiaplayName URL]
    def parseLink(str):
        ret = ''
        reResult = re.split('(\[[^\[\]\s\|]+\s[^\[\]\s\|]+\])|(\[[^\[\]\|]+\|[^\[\]\|]+\])', str)
        for result in reResult:
            if (result is None) | (result == ''):
                continue
            if len(result) > 4:
                if (result[0] == '[') & (result[-1] == ']'):
                    _result = toUtf8Str(result)[1:-1].split('|')
                    if len(_result) > 1:
                        ret += '<a href="/page/%s">%s</a>' % (_result[1], _result[0]) 
                        continue
            if len(result) > 4:
                if (result[0] == '[') & (result[-1] == ']'):
                    _result = toUtf8Str(result)[1:-1].split(' ')
                    if len(_result) > 1:
                        ret += '<a href="%s">%s</a>' % (_result[1], _result[0])
                        continue
            ret += result
        return ret 
