import React from 'react';
import ReactDOM from 'react-dom';

import 'file?name=templates/[name].[ext]!./../../html/build.html';

import BuildPage from './../pages/BuildPage.react';

ReactDOM.render(
  <div>
    <BuildPage />
  </div>,
  document.getElementById('content')
);
