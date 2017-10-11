import React from 'react';
import ReactDOM from 'react-dom';

import 'file?name=templates/[name].[ext]!./../../html/uploadimg.html';

import UploadImgPage from './../pages/UploadImgPage.react';

ReactDOM.render(
  <div>
    <UploadImgPage />
  </div>,
  document.getElementById('content')
);
