import jQuery from 'jquery';
import { API_SERVER } from './../Settings';

/**
 * @author: Golion
 */
var Data = {

  storage: true,
  
  prefix: "wp-",
  
  data: {},

  getItem(itemName) {
    if (typeof(this.data[itemName]) == "undefined") {
      this.data[itemName] = this.getLocalStorage(this.prefix + itemName);
    }
    return this.data[itemName];
  },
  
  getNumberItem(itemName, defaultValue = 0) {
    if (typeof(this.data[itemName]) == "undefined") {
      this.data[itemName] = this.getLocalStorage(this.prefix + itemName);
    }
    if (this.data[itemName] == "") return defaultValue;
    return (typeof(this.data[itemName]) == "string" ? parseInt(this.data[itemName]) : this.data[itemName]);
  },

  setItem(itemName, value) {
    this.data[itemName] = value;
    if (this.storage) {
      this.setLocalStorage(this.prefix + itemName, value);
    }
  },

  removeItem(itemName) {
    window.localStorage.removeItem(this.prefix + itemName);
  },

  getLocalStorage(key) {
    let value = window.localStorage.getItem(key);
    if (value == null) value = "";
    return value;
  },

  setLocalStorage(key, value) {
    window.localStorage.setItem(key, value);
  },

  loadBuildDataFromServer(confName, callback) {
    let _this = this;
    this.getBuildConfFromServer(confName, (status, data) => {
      if (status) {
        _this.data[confName] = data;
        callback();
      }
      else {
        _this.data[confName] = [];
        callback();
      }
    });
  },

  getBuildConfFromServer(confName, callback) {
    jQuery.ajax({
      type     : 'get',
      timeout  : 10000,
      url      : API_SERVER + '/buildconf/' + confName + '/' + Math.random().toString(),
      dataType : 'json',
      success  : function(data) {
        if (data.status === 'succeed') {
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

  setBuildConfToServer(confName, confJsonStr, callback) {
    jQuery.ajax({
      type     : 'post',
      timeout  : 10000,
      url      : API_SERVER + '/buildconf/' + confName + '/' + Math.random().toString(),
      dataType : 'json',
      data     : '&confjsonstr=' + confJsonStr,
      success  : function(data) {
        if (data.status === 'succeed') {
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

  getRuleConfFromServer(confName, callback) {
    jQuery.ajax({
      type     : 'get',
      timeout  : 10000,
      url      : API_SERVER + '/ruleconf/' + confName + '/' + Math.random().toString(),
      dataType : 'json',
      success  : function(data) {
        if (data.status === 'succeed') {
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
  }

};

export default Data;
