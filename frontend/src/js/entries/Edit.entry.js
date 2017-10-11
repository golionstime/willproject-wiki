import React from 'react';
import ReactDOM from 'react-dom';

import 'file?name=templates/[name].[ext]!./../../html/edit.html';

import EditPage from './../pages/EditPage.react';

ReactDOM.render(
  <div>
    <EditPage />
  </div>,
  document.getElementById('content')
);
