import React from 'react';
import ReactDOM from 'react-dom';

import 'file?name=templates/[name].[ext]!./../../html/map.html';

ReactDOM.render(
  <div style={{marginTop:20}}>
    <a href="/static/img/wp_map_large.png" target="_blank" title="点击查看大图（5.5M）">
      <img width={ wp.base.DOC_WIDTH - 60 } src="/static/img/wp_map_small.gif"/>
    </a>
  </div>,
  document.getElementById('content')
);
