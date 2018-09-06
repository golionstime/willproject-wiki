import jQuery from 'jquery';
import { API_SERVER } from './../Settings';

/**
 * @author: Golion
 */
var Card = {

  add(creator, imgPath, isPublic, dataJsonOby, callback) {
    let isPublicStr = isPublic ? '1' : '0';
    dataJsonOby.appear = btoa(encodeURIComponent(dataJsonOby.appear));
    dataJsonOby.story = btoa(encodeURIComponent(dataJsonOby.story));
    dataJsonOby.addition = btoa(encodeURIComponent(dataJsonOby.addition));
    jQuery.ajax({
      type     : 'put',
      timeout  : 10000,
      url      : API_SERVER + '/card',
      dataType : 'json',
      data     : '&creator=' + encodeURIComponent(creator) + '&imgpath=' + encodeURIComponent(imgPath) + '&ispublic=' + isPublicStr + '&data=' + JSON.stringify(dataJsonOby) ,
      success  : function(data) {
        if (data.status === 'succeed') {
          callback(true, data.id);
        }
        else {
          callback(false, -1);
        }
      },
      error    : function() {
        callback(false, -1);
      }
    });
  },

  update(cardId, dataJsonOby, callback) {
    dataJsonOby.appear = btoa(encodeURIComponent(dataJsonOby.appear));
    dataJsonOby.story = btoa(encodeURIComponent(dataJsonOby.story));
    dataJsonOby.addition = btoa(encodeURIComponent(dataJsonOby.addition));
    jQuery.ajax({
      type     : 'post',
      timeout  : 10000,
      url      : API_SERVER + '/card',
      dataType : 'json',
      data     : '&cardid=' + cardId + '&data=' + JSON.stringify(dataJsonOby) ,
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

  updateImg(cardId, imgPath, callback) {
    jQuery.ajax({
      type     : 'post',
      timeout  : 10000,
      url      : API_SERVER + '/cardimg',
      dataType : 'json',
      data     : '&cardid=' + cardId + '&imgpath=' + encodeURIComponent(imgPath),
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

  updateImgLarge(cardId, imgPath, callback) {
    jQuery.ajax({
      type     : 'post',
      timeout  : 10000,
      url      : API_SERVER + '/cardimglarge',
      dataType : 'json',
      data     : '&cardid=' + cardId + '&imgpath=' + encodeURIComponent(imgPath),
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
  
  getCard(id, callback) {
    jQuery.ajax({
      type     : 'get',
      timeout  : 10000,
      url      : API_SERVER + '/card/' + id + '/' + Math.random().toString(),
      dataType : 'json',
      success  : function(data) {
        if (data.status === 'succeed') {
          data.data.data.appear = decodeURIComponent(atob(data.data.data.appear));
          data.data.data.story = decodeURIComponent(atob(data.data.data.story));
          data.data.data.addition = decodeURIComponent(atob(data.data.data.addition));
          callback(true, data.data);
        }
        else {
          callback(false, {});
        }
      },
      error    : function() {
        callback(false, {});
      }
    });
  },

  getCards(page, pageSize, callback) {
    jQuery.ajax({
      type     : 'get',
      timeout  : 10000,
      url      : API_SERVER + '/cards/' + page + '/' + pageSize + '/' + Math.random().toString(),
      dataType : 'json',
      success  : function(data) {
        if (data.status === 'succeed') {
          callback(true, data.total, data.data);
        }
        else {
          callback(false, 0, []);
        }
      },
      error    : function() {
        callback(false, 0, []);
      }
    });
  },

  makePublic(cardId, callback) {
    jQuery.ajax({
      type     : 'post',
      timeout  : 10000,
      url      : API_SERVER + '/makepublic',
      dataType : 'json',
      data     : '&cardid=' + cardId,
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
  }

};

export default Card;
