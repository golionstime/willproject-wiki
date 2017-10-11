import React from 'react';
import ReactDOM from 'react-dom';

import 'file?name=templates/[name].[ext]!./../../html/setimg.html';

import SetImgPage from './../pages/SetImgPage.react';

ReactDOM.render(
  <div>
    <SetImgPage />
  </div>,
  document.getElementById('content')
);
