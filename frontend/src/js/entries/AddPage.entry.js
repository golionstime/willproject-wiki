import React from 'react';
import ReactDOM from 'react-dom';

import 'file?name=templates/[name].[ext]!./../../html/addpage.html';

import AddWikiPage from '../pages/AddWikiPage.react';

ReactDOM.render(
  <div>
    <AddWikiPage />
  </div>,
  document.getElementById('content')
);
