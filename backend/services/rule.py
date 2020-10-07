# -*- coding:utf-8 -*-


import sys
sys.path.append('../')

import json

from common.settings import ABS_PATH
from common.utils import rand10
from common.dao import MemcacheConn


class RuleEngine:

    TRY_TIMES = 10000

    @staticmethod
    def readConf(confName):
        try:
             file = open(ABS_PATH + '/wprule/' + confName + '.json')
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
    # “骰神啊，听从我的召唤吧！”
    def RollDiceNaive(n, k = 10):

        import random

        if (n <= 0) | (k <= 0):
            return []

        if n > 20:
            return []

        diceList = []

        # Roll Dices
        i = n
        while i > 0:
            i -= 1
            diceList.append(random.randint(1,k))

        return diceList

    @staticmethod
    # “骰神啊，听从我的召唤吧！”
    def RollDice(n, m, reverse = True):

        if (n < 0) | (m < 0):
            return []

        if (n > 20) | (m > 20):
            return []

        # 0K0=1
        if (n == 0) & (m == 0):
            return [1]

        # 如果出现了1K0或0K1的情况，会被配平为2K1取低
        if n + m <= 1:
            n = 2
            m = 1
            reverse = False

        # 当n<m时，进行配平
        while n < m:
            n += 1
            m -= 1

        diceList = []
        finalDiceList = []

        # Roll Dices
        i = n
        while i > 0:
            i -= 1
            diceList.append(rand10())

        diceList.sort(reverse=reverse)

        # Pick Dices
        i = 0
        while i < m:
            finalDiceList.append(diceList[i])
            i += 1

        return finalDiceList

    @staticmethod
    # 计算期望
    def CalcExp(n, m, reverse=True):
        n = min(n, 10)
        m = min(m, 10)
        mc = MemcacheConn().getMcConn('wp')
        mcKey = 'wp-exp-%s-%s-%s' % (n, m, reverse)
        mcRet = mc.get(mcKey)
        if mcRet is not None:
            return mcRet
        totalSum = 0
        i = RuleEngine.TRY_TIMES
        while i > 0:
            i -= 1
            diceList = RuleEngine.RollDice(n, m, reverse)
            sum = 0
            for dice in diceList:
                sum += dice
            totalSum += sum
        ret = float('%0.3f' % (float(totalSum) / float(RuleEngine.TRY_TIMES)))
        mc.set(mcKey, ret, 3600)
        return ret

    @staticmethod
    # 计算分布
    def CalcDataGram(n, m, reverse=True):
        n = min(n, 10)
        m = min(m, 10)
        mc = MemcacheConn().getMcConn('wp')
        mcKey = 'wp-datagram-%s-%s-%s' % (n, m, reverse)
        mcRet = mc.get(mcKey)
        if mcRet is not None:
            return json.loads(mcRet)
        ret = {}
        i = RuleEngine.TRY_TIMES
        totalSum = 0
        while i > 0:
            i -= 1
            diceList = RuleEngine.RollDice(n, m, reverse)
            sum = 0
            for dice in diceList:
                sum += dice
            totalSum += sum
            if ret.has_key('%s' % sum):
                ret['%s' % sum] += 1
            else:
                ret['%s' % sum] = 1
        _ret = {}
        for k in ret.keys():
            _ret[int(k)] = ret[k]
        _sortedRet = []
        for k in sorted(_ret.keys()):
            _sortedRet.append({
                "k": k,
                "v": _ret[k]
            })
        ret = {
            'exp' : float('%0.3f' % (float(totalSum) / float(RuleEngine.TRY_TIMES))),
            'list' : _sortedRet
        }
        mc.set(mcKey, json.dumps(ret), 3600)
        return ret

    @staticmethod
    # 输出分布
    def CalcCSV():
        import csv
        with open('nkmdata.csv', 'wb') as csvfile:
            writer = csv.writer(csvfile, dialect='excel')
            n = 1
            while n <= 7:
                m = 1
                while m <= n:
                    dataGram = RuleEngine.CalcDataGram(n, m)
                    sum = 0
                    total = RuleEngine.TRY_TIMES
                    for count in dataGram['list']:
                        sum += count['v']
                        writer.writerow(['%sK%s' % (n, m), count['k'], float('%0.3f' % (float(sum) / float(total)))])
                    writer.writerow([])
                    m += 1
                n += 1

if __name__ == '__main__':
    RuleEngine.CalcCSV()
