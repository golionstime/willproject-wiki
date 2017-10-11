# -*- coding:utf-8 -*-

# Author: Golion
# Date: 2016.1
# 防止SQL注入攻击的Filter


class Filter:

    # 直接过滤的字符
    MAGICCHARS = [
        "'",
        '"',
        '`'
    ]

    @staticmethod
    def filter(str):
        if (str.__class__ == float)|(str.__class__ == long)|(str.__class__ == int):
            return str
        return Filter.__magicCharsFilter(str)

    @staticmethod
    def __magicCharsFilter(str):
        filteredStr = ''
        for char in str:
            magic = False
            for magicChar in Filter.MAGICCHARS:
                if char == magicChar:
                    magic = True
                    break
            if not magic:
                filteredStr = filteredStr + char
        return filteredStr