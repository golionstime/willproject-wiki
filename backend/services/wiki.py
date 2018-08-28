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
        currentTableParams = None
        for data in dataList:
            # 处理换行
            if data == '':
                ret += '<br/>'
                continue
            # 处理表格
            if data.startswith('|-'):
                ret += '<table>'
                currentTableParams = WikiEngine.parseTableParams(data)
                continue
            if data.endswith('-|'):
                ret += '</table>'
                currentTableParams = WikiEngine.parseTableParams('')
                continue
            if data[0] == '|':
                currentTableParams['lineCnt'] += 1
                ret += WikiEngine.parseTable(data, currentTableParams)
                continue
            # HTML直出
            if len(data) > 4:
                if (data[0] == '{') & (data[1] == '{') & (data[-1] == '}') & (data[-2] == '}'):
                    ret += data[2:-2]
                    continue
            # 处理<nowiki/>
            data = WikiEngine.parseNoWiki(data)
            # 处理链接
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
    def parseTableParams(line):
        line = line.strip()
        params = {
            'lineCnt': 0,
            'cols': 2
        }
        if len(line) > 2:
            line = line[2:]
            if (line[0] == '[') and (line[-1] == ']'):
                for _str in line[1:-1].split(','):
                    _kv = _str.split('=')
                    if len(_kv) == 2:
                        key = _kv[0]
                        val = _kv[1]
                        if key == 'cols':
                            params['cols'] = int(val)
        return params

    @staticmethod
    # 匹配表格
    def parseTable(line, params):
        if params is None:
            return line
        strArr = line[1:].split('=')
        tableCell = 'td'
        classDescr = ''
        if params['lineCnt'] == 1:
            tableCell = 'th'
            classDescr = ' class="title"'
        if params['cols'] == 2:
            if len(strArr) == 1:
                return '<tr%s><%s colspan="2" class="fullwidth">%s</%s></tr>' % (
                    classDescr,
                    tableCell, WikiEngine.parseLink(strArr[0].strip()), tableCell)
            elif len(strArr) == 2:
                return '<tr%s><%s class="catalog">%s</%s><%s class="detail">%s</%s></tr>' % (
                    classDescr,
                    tableCell, WikiEngine.parseLink(strArr[0].strip()), tableCell,
                    tableCell, WikiEngine.parseLink(strArr[1].strip()), tableCell)
            else:
                mergeStr = ''
                for i, slice in enumerate(strArr):
                    if i == 0:
                        continue
                    mergeStr += slice
                return '<tr%s><%s class="catalog">%s</%s><%s class="detail">%s</%s></tr>' % (
                    classDescr,
                    tableCell, WikiEngine.parseLink(strArr[0].strip()), tableCell,
                    tableCell, WikiEngine.parseLink(mergeStr.strip()), tableCell)
        else:
            if len(strArr) == 1:
                return '<tr%s><%s colspan="%d" class="fullwidth">%s</%s></tr>' % (
                    classDescr,
                    tableCell, params['cols'], WikiEngine.parseLink(strArr[0].strip()), tableCell)
            else:
                cols = []
                for slice in strArr:
                    cols.append('<%s style="width:auto">%s</%s>' % (tableCell, slice.strip(), tableCell))
                return '<tr%s>%s</tr>' % (classDescr, ''.join(cols))