import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory } from 'react-router';

import 'file?name=templates/[name].[ext]!./../../html/character.html';

import CharacterPage from './../pages/CharacterPage.react';

ReactDOM.render(
  <Router history={ browserHistory }>
    <Route path="*" component={ CharacterPage }/>
  </Router>,
  document.getElementById('content')
);
