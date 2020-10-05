import React from 'react';
import ReactDOM from 'react-dom';

import 'file?name=templates/[name].[ext]!./../../html/edit.html';

import EditCardPage from '../pages/EditCardPage.react';

ReactDOM.render(
  <div>
    <EditCardPage />
  </div>,
  document.getElementById('content')
);
