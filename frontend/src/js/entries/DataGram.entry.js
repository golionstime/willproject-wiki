import React from 'react';
import ReactDOM from 'react-dom';

import 'file?name=templates/[name].[ext]!./../../html/datagram.html';

import DataGramPage from './../pages/DataGramPage.react';

ReactDOM.render(
  <div>
    <DataGramPage />
  </div>,
  document.getElementById('content')
);
