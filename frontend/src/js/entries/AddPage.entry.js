import React from 'react';
import ReactDOM from 'react-dom';

import 'file?name=templates/[name].[ext]!./../../html/addpage.html';

import AddPagePage from './../pages/AddPagePage.react';

ReactDOM.render(
  <div>
    <AddPagePage />
  </div>,
  document.getElementById('content')
);
