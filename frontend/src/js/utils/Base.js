/**
 * 基础
 * @Author: Golion
 */

// 滚动条在Y轴上的滚动距离
export function getScrollTop() {
  var scrollTop = 0, bodyScrollTop = 0, documentScrollTop = 0;
  if (document.body) {
    bodyScrollTop = document.body.scrollTop;
  }
  if (document.documentElement) {
    documentScrollTop = document.documentElement.scrollTop;
  }
  scrollTop = (bodyScrollTop - documentScrollTop > 0) ? bodyScrollTop : documentScrollTop;
  return scrollTop;
}

// 文档的总高度
export function getScrollHeight() {
  var g = document, a = g.body, f = g.documentElement, d = g.compatMode == "BackCompat"
    ? a
    : g.documentElement;
  return Math.max(f.scrollHeight, a.scrollHeight, d.clientHeight);
}

// 浏览器视口的高度
export function getWindowHeight() {
  var d = document, a = d.compatMode == "BackCompat" ?
    d.body: d.documentElement;
  return a.clientHeight;
}

// 浏览器视口的宽度
export function getWindowWidth() {
  var d = document, a = d.compatMode == "BackCompat" ?
    d.body: d.documentElement;
  return a.clientWidth;
}