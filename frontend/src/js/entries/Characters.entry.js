import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory } from 'react-router';

import 'file?name=templates/[name].[ext]!./../../html/characters.html';

import CharactersPage from './../pages/CharactersPage.react';

ReactDOM.render(
  <Router history={ browserHistory }>
    <Route path="*" component={ CharactersPage }/>
  </Router>,
  document.getElementById('content')
);
