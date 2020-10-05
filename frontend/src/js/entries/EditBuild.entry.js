import React from 'react';
import ReactDOM from 'react-dom';

import 'file?name=templates/[name].[ext]!./../../html/editbuild.html';

import EditBuildPage from './../pages/EditBuildPage.react';

ReactDOM.render(
  <div>
    <EditBuildPage />
  </div>,
  document.getElementById('content')
);
