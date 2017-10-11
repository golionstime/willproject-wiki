import React from 'react';
import ReactDOM from 'react-dom';

import 'file?name=static/img/[name].[ext]!./../../../static/img/favicon.ico';
import 'file?name=static/img/[name].[ext]!./../../../static/img/wp-banner.png';
import 'file?name=static/img/[name].[ext]!./../../../static/img/default-character-cover.png';
import './../../css/nav.less';

import 'file?name=templates/[name].[ext]!./../../html/index.html';
import 'file?name=templates/[name].[ext]!./../../html/page404.html';

import Nav from './../components/Nav.react';

ReactDOM.render(
  <Nav />,
  document.getElementById('nav')
);
