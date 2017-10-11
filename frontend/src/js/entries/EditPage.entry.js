import React from 'react';
import ReactDOM from 'react-dom';

import 'file?name=templates/[name].[ext]!./../../html/editpage.html';

import EditPagePage from './../pages/EditPagePage.react';

ReactDOM.render(
  <div>
    <EditPagePage />
  </div>,
  document.getElementById('content')
);
