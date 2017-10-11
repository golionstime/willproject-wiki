import jQuery from 'jquery';
import { API_SERVER } from './../Settings';

/**
 * @author: Golion
 */
var Upload = {

  uploadImg(fileName, data, callback) {
    var formData = new FormData();
    formData.append('filename', fileName);
    formData.append('data', data);
    jQuery.ajax({
      type: 'post',
      timeout: 60000,
      url: API_SERVER + '/uploadimg',
      data: formData,
      processData : false,
      contentType : false,
      dataType : 'json',
      success: function (data) {
        if (data.status == "succeed") {
          callback(true, data.filepath);
        }
        else {
          callback(false, "");
        }
      },
      error: function () {
        callback(false, "");
      }
    });
  }

};

export default Upload;
