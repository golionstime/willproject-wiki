import React from 'react';
import ReactDOM from 'react-dom';

import 'file?name=templates/[name].[ext]!./../../html/history.html';

import HistoryPage from './../pages/HistoryPage.react';

ReactDOM.render(
  <div>
    <HistoryPage />
  </div>,
  document.getElementById('content')
);
