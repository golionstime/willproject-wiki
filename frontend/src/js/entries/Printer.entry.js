import React from 'react';
import ReactDOM from 'react-dom';

import 'file?name=templates/[name].[ext]!./../../html/printer.html';

import PrinterPage from './../pages/PrinterPage.react';

ReactDOM.render(
  <div>
    <PrinterPage />
  </div>,
  document.getElementById('content')
);
