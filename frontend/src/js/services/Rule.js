import jQuery from 'jquery';
import { API_SERVER } from './../Settings';

/**
 * @author: Golion
 */
var Rule = {

  // “骰神啊，听从我的召唤吧！”
  rollDice(n, k = 10, callback) {
    jQuery.ajax({
      type     : 'get',
      timeout  : 10000,
      url      : API_SERVER + '/rolldice/' + n + '/' + k + '/' + Math.random().toString(),
      dataType : 'json',
      success  : function(data) {
        if (data.status == 'succeed') {
          callback(true, data.dices);
        }
        else {
          callback(false, []);
        }
      },
      error    : function() {
        callback(false, []);
      }
    });
  },

  // “骰神啊，听从我的召唤吧！”
  rollDiceNKM(n, m, reverse = 1, callback) {
    jQuery.ajax({
      type     : 'get',
      timeout  : 10000,
      url      : API_SERVER + '/nkm/' + n + '/' + m + '/' + reverse + '/' + Math.random().toString(),
      dataType : 'json',
      success  : function(data) {
        if (data.status == 'succeed') {
          callback(true, data.dices);
        }
        else {
          callback(false, []);
        }
      },
      error    : function() {
        callback(false, []);
      }
    });
  },

  // 获取期望
  calcExp(n, m, reverse = 1, callback) {
    jQuery.ajax({
      type     : 'get',
      timeout  : 10000,
      url      : API_SERVER + '/nkmexp/' + n + '/' + m + '/' + reverse + '/' + Math.random().toString(),
      dataType : 'json',
      success  : function(data) {
        if (data.status == 'succeed') {
          callback(true, data.exp);
        }
        else {
          callback(false, 0.0);
        }
      },
      error    : function() {
        callback(false, 0.0);
      }
    });
  },

  // 获取分布图
  getDataGram(n, m, reverse = 1, callback) {
    jQuery.ajax({
      type     : 'get',
      timeout  : 10000,
      url      : API_SERVER + '/nkmdatagram/' + n + '/' + m + '/' + reverse + '/' + Math.random().toString(),
      dataType : 'json',
      success  : function(data) {
        if (data.status == 'succeed') {
          callback(true, data.datagram);
        }
        else {
          callback(false, {});
        }
      },
      error    : function() {
        callback(false, {});
      }
    });
  }

};

export default Rule;
