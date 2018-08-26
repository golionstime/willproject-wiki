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
        tableLineCnt = 0
        for data in dataList:
            if data == '':
                ret += '<br/>'
                continue
            if data == '|-':
                ret += '<table>'
                continue
            if data == '-|':
                ret += '</table>'
                tableLineCnt = 0
                continue
            if data[0] == '|':
                tableLineCnt += 1
                ret += WikiEngine.parseTable(data, tableLineCnt)
                continue
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
    # [PageName]
    # [DisplayName|PageName]
    # [DiaplayName URL]
    def parseLink(str):
        ret = ''
        reResult = re.split('(\[[^\[\]\s\|]+[^\[\]\s\|]+\])|(\[[^\[\]\|]+\|[^\[\]\|]+\])|(\[[^\[\]\s\|]+\s[^\[\]\s\|]+\])', str)
        for result in reResult:
            if (result is None) | (result == ''):
                continue
            if len(result) > 4:
                if (result[0] == '[') & (result[-1] == ']'):
                    _result = toUtf8Str(result)[1:-1].split('|')
                    if len(_result) == 2:
                        ret += '<a href="/page/%s">%s</a>' % (_result[1], _result[0]) 
                        continue
            if len(result) > 2:
                if (result[0] == '[') & (result[-1] == ']'):
                    _result = toUtf8Str(result)[1:-1].split(' ')
                    if len(_result) == 1:
                        ret += '<a href="/page/%s">%s</a>' % (_result[0], _result[0])
                        continue
                    elif len(_result) == 2:
                        ret += '<a href="%s">%s</a>' % (_result[1], _result[0])
                        continue
            ret += result
        return ret

    @staticmethod
    # 匹配表格
    def parseTable(str, tableLineCnt):
        strArr = str[1:].split('=')
        tableCell = 'td'
        classDescr = ''
        extraStyle = ''
        if tableLineCnt == 1:
            tableCell = 'th'
            classDescr = ' class="title"'
            extraStyle = ' style="font-weight:bold"'
        if len(strArr) == 1:
            return '<tr%s><%s colspan="2" class="fullwidth"%s>%s</%s></tr>' % (
                classDescr,
                tableCell, extraStyle, WikiEngine.parseLink(strArr[0].strip()), tableCell)
        elif len(strArr) == 2:
            return '<tr%s><%s class="catalog"%s>%s</%s><%s class="detail"%s>%s</%s></tr>' % (
                classDescr,
                tableCell, extraStyle, WikiEngine.parseLink(strArr[0].strip()), tableCell,
                tableCell, extraStyle, WikiEngine.parseLink(strArr[1].strip()), tableCell)
        else:
            mergeStr = ''
            for i, slice in enumerate(strArr):
                if i == 0:
                    continue
                mergeStr += slice
            return '<tr%s><%s class="catalog"%s>%s</%s><%s class="detail"%s>%s</%s></tr>' % (
                classDescr,
                tableCell, extraStyle, WikiEngine.parseLink(strArr[0].strip()), tableCell,
                tableCell, extraStyle, WikiEngine.parseLink(mergeStr.strip()), tableCell)