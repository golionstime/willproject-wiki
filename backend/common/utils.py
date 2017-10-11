# -*- coding:utf-8 -*-

# Author: Golion
# Date: 2016.1
# Utils for crawlers


import sys
import random
from random import Random

from log import LogClient

# Python2.7的bug，不加这段会导致decode失败，升级到3可解决问题
reload(sys)
sys.setdefaultencoding('utf-8')


# 将字符串或数字统一转换为utf-8编码的字符串
def toUtf8Str(oriStr):
    try:
        oriStr = '%s' % oriStr
        if isinstance(oriStr, unicode):
            oriStr = oriStr.encode('utf-8', 'ignore')
    except:
        LogClient.error(sys.exc_info())
    return oriStr


def rand10():
    return random.randint(1, 10)


def md5(str):
    import hashlib
    myMd5 = hashlib.md5()
    myMd5.update(str)
    return myMd5.hexdigest()


# 生成指定长度的随机字符串
def randomStr(randomlength=8):
    str = ''
    chars = 'AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz0123456789'
    length = len(chars) - 1
    random = Random()
    for i in range(randomlength):
        str += chars[random.randint(0, length)]
    return str
