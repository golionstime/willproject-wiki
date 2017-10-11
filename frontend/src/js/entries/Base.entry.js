/**
 * 基础库
 * 里面的所有变量/方法，均可以在全局以wp.base的方式调用
 * @Author: Golion
 */

import jQuery from 'jquery';
import { getWindowHeight, getWindowWidth } from './../utils/Base';
import { getBrowserType } from './../utils/BrowserType';
import './../../css/base.less';

(function() {

  var base = wp.base || (wp.base = {});

  // 设置额外的Resize回调
  base.resizeCallback = false;
  base.setResizeCallback = (callback) => {
    base.resizeCallback = callback;
  };

  // 计算基础参数
  base.calcBaseParams = () => {
    const _date = new Date();
    base.DATE_TODAY = _date.getUTCFullYear() + '_' + _date.getUTCMonth() + '_' + _date.getUTCDate();
    base.BROWSER_TYPE = getBrowserType();
    base.WINDOW_WIDTH = getWindowWidth();
    base.WINDOW_HEIGHT = getWindowHeight();
    base.MAX_WIDTH = 1200;
    base.BASE_SIZE = base.BROWSER_TYPE ? 50 : 100;
    base.HALF_BASE_SIZE = base.BASE_SIZE / 2;
    base.QUARTER_BASE_SIZE = base.BASE_SIZE / 4;
    base.DOC_WIDTH = base.WINDOW_WIDTH > base.MAX_WIDTH ? base.MAX_WIDTH : base.WINDOW_WIDTH;
    base.DOC_PADDING = base.WINDOW_WIDTH > base.MAX_WIDTH ? ( base.WINDOW_WIDTH - base.MAX_WIDTH ) / 2 : 0;
    base.NAV_CLICK_TIME = 0;
  };
  base.calcBaseParams();

  // 将body的高度设为WindowHeight，便于设置background-color
  base.calcWindowHeight = () => {
    jQuery("body").css("minHeight", base.WINDOW_HEIGHT);
    jQuery("#main").css("minHeight", base.WINDOW_HEIGHT);
  };

  // Resize处理
  base.resize = () => {
    base.calcBaseParams();
    base.calcWindowHeight();
    if (base.resizeCallback !== false) base.resizeCallback();
  }

})(window, window['wp'] || (window['wp'] = {}));

window.onresize = () => {
  wp.base.resize();
};

// 百度统计
var _hmt = _hmt || [];
(function() {
  var hm = document.createElement("script");
  hm.src = "//hm.baidu.com/hm.js?06aedd79a5bd6324b544cc97f75edeec";
  var s = document.getElementsByTagName("script")[0]; 
  s.parentNode.insertBefore(hm, s);
})();
