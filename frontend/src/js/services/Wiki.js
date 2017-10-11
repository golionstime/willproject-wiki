import jQuery from 'jquery';
import { API_SERVER } from './../Settings';

/**
 * @author: Golion
 */
var Wiki = {

  convertPageDataToHtml(pageData, callback) {
    jQuery.ajax({
      type: 'post',
      timeout: 10000,
      url: API_SERVER + '/convertwiki',
      data: "&pagedata=" + encodeURIComponent(pageData),
      success: function (data) {
        callback(data)
      },
      error: function () {
        callback(false);
      }
    });
  },

  getPage(pageName, callback) {
    jQuery.ajax({
      type: 'get',
      timeout: 10000,
      url: API_SERVER + '/page/' + pageName + '/' + Math.random().toString(),
      dataType : 'json',
      success: function (data) {
        if (data.status == 'succeed') {
          callback(true, {
            pageData: data.pagedata,
            imgPath: data.imgpath,
            creator: data.creator
          });
        }
        else {
          callback(false, {});
        }
      },
      error: function () {
        callback(false, {});
      }
    });
  },

  addPage(pageName, creator, imgPath, pageData, callback) {
    jQuery.ajax({
      type: 'put',
      timeout: 10000,
      url: API_SERVER + '/page',
      dataType : 'json',
      data: "&pagename=" + pageName + "&creator=" + creator + "&imgpath=" + imgPath + "&pagedata=" + encodeURIComponent(pageData),
      success: function (data) {
        if (data.status == 'succeed') {
          callback(true);
        }
        else if ((data.status == 'failed') && (data.msg == 'redundant')) {
          callback("redundant");
        }
        else {
          callback(false);
        }
      },
      error: function () {
        callback(false);
      }
    });
  },

  updatePage(pageName, creator, imgPath, pageData, callback) {
    jQuery.ajax({
      type: 'post',
      timeout: 10000,
      url: API_SERVER + '/page',
      dataType : 'json',
      data: "&pagename=" + pageName + "&creator=" + creator + "&imgpath=" + imgPath + "&pagedata=" + encodeURIComponent(pageData),
      success: function (data) {
        if (data.status == 'succeed') {
          callback(true);
        }
        else if (data.status == 'locked') {
          callback("locked");
        }
        else {
          callback(false);
        }
      },
      error: function () {
        callback(false);
      }
    });
  }

};

export default Wiki;
