import React from 'react';
import ReactDOM from 'react-dom';

import 'file?name=templates/[name].[ext]!./../../html/editpage.html';

import EditWikiPage from '../pages/EditWikiPage.react';

ReactDOM.render(
  <div>
    <EditWikiPage />
  </div>,
  document.getElementById('content')
);
