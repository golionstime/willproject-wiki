import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory } from 'react-router';

import 'file?name=templates/[name].[ext]!./../../html/rules.html';
import './../../css/rules.less';

import RuleNav from './../components/RuleNav.react';
import RulePage from './../pages/RulePage.react';
import Data from '../services/Data';

class RuleWrap extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      initialized: false,
      data: [],
      current: (typeof(DATA.RULEPAGE) == "undefined") ? "intro" : DATA.RULEPAGE
    };
    let _this = this;
    Data.getRuleConfFromServer(this.state.current, (status, data) => {
      _this.setState({
        initialized: true,
        data: data
      });
    });
  }

  _handleClick(e) {
    this.setState({
      current: e.key
    });
    let _this = this;
    _this.setState({
      initialized: false
    });
    Data.getRuleConfFromServer(e.key, (status, data) => {
      if (status) {
        _this.setState({
          initialized: true,
          data: data
        });
        browserHistory.replace("/rules/" + e.key);
      }
      else {
        _this.setState({
          initialized: true,
          data: ['加载数据失败']
        });
      }
    });
  }

  render() {
    return (
      <div style={{padding:0}}>
        <RuleNav 
          handleClick={ this._handleClick.bind(this) }
          current={ this.state.current }
        />
        <div style={{display:wp.base.BROWSER_TYPE?"block":"none"}}>
          <hr style={{marginTop:0,paddingTop:0}}/>
        </div>
        <RulePage 
          initialized={ this.state.initialized }
          data={ this.state.data }
        />
      </div>
    );
  }

}

ReactDOM.render(
  <Router history={ browserHistory }>
    <Route path="*" component={ RuleWrap }/>
  </Router>,
  document.getElementById('content')
);
