import React from 'react';
import ReactDOM from 'react-dom';

import 'file?name=templates/[name].[ext]!./../../html/dice.html';

import DicePage from './../pages/DicePage.react';

ReactDOM.render(
  <div>
    <DicePage />
  </div>,
  document.getElementById('content')
);
