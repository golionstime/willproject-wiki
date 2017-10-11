import jQuery from 'jquery';
import { API_SERVER } from './../Settings';

/**
 * @author: Golion
 */
var History = {

  addDiceHistory(msg, callback) {
    jQuery.ajax({
      type     : 'put',
      timeout  : 10000,
      url      : API_SERVER + '/dicehistory',
      dataType : 'json',
      data     : '&msg=' + msg,
      success  : function(data) {
        if (data.status == 'succeed') {
          callback(true);
        }
        else {
          callback(false);
        }
      },
      error    : function() {
        callback(false);
      }
    });
  },

  getLatestDiceHistory(callback) {
    jQuery.ajax({
      type     : 'get',
      timeout  : 10000,
      url      : API_SERVER + '/latestdicehistory/' + Math.random().toString(),
      dataType : 'json',
      success  : function(data) {
        if (data.status == 'succeed') {
          callback(true, data.data);
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

  getLatestPageHistory(callback) {
    jQuery.ajax({
      type: 'get',
      timeout: 10000,
      url: API_SERVER + '/latestpagehistory/' + Math.random().toString(),
      dataType : 'json',
      success: function (data) {
        if (data.status == "succeed") {
          callback(true, data.data);
        }
        else {
          callback(false, []);
        }
      },
      error: function () {
        callback(false, []);
      }
    });
  }

};

export default History;
