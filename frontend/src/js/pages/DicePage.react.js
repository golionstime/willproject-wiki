import React, { Component } from 'react';
import { Input, InputNumber, Button, Switch } from 'antd';
import jQuery from 'jquery';
import Data from './../services/Data';
import Rule from './../services/Rule';
import History from './../services/History';
import { getTimeString } from './../utils/Time';

/**
 * @Author: Golion
 */
class DicePage extends Component {

  constructor(props, context) {
    super(props, context);
    if (Data.getItem("dice-n") == "") Data.setItem("dice-n", 4);
    if (Data.getItem("dice-m") == "") Data.setItem("dice-m", 3);
    if (Data.getItem("dice-d") == "") Data.setItem("dice-d", 1);
    if (Data.getItem("dice-k") == "") Data.setItem("dice-k", 100);
    this.state = {
      loading: false,
      n: Data.getItem("dice-n"),
      m: Data.getItem("dice-m"),
      d: Data.getItem("dice-d"),
      k: Data.getItem("dice-k"),
      name: Data.getItem("dice-player-name"),
      check: true,
      autorefresh: true,
      dices: [],
      dicesNaive: [],
      history: []
    };
    this._getHistoryFirst.bind(this)();
  }

  _getHistoryFirst() {
    History.getLatestDiceHistory((status, data) => {
      if (status) {
        data.sort((a, b) => {
          return (b.ctime - a.ctime);
        });
        this.setState({
          history: data
        });
      }
      setTimeout(this._getHistory.bind(this), 5000);
    });
  }

  _getHistory() {
    if (this.state.autorefresh) {
      History.getLatestDiceHistory((status, data) => {
        if (status) {
          data.sort((a, b) => {
            return (b.ctime - a.ctime);
          });
          this.setState({
            history: data
          });
        }
        setTimeout(this._getHistory.bind(this), 5000);
      });
    }
    else {
      setTimeout(this._getHistory.bind(this), 1000);
    }
  }

  _changeName(evt) {
    Data.setItem("dice-player-name", evt.target.value);
    this.setState({
      name: evt.target.value
    });
  }

  _changeN(value) {
    Data.setItem("dice-n", value);
    this.setState({
      n: value
    });
  }

  _changeM(value) {
    Data.setItem("dice-m", value);
    this.setState({
      m: value
    });
  }

  _changeD(value) {
    Data.setItem("dice-d", value);
    this.setState({
      d: value
    });
  }

  _changeK(value) {
    Data.setItem("dice-k", value);
    this.setState({
      k: value
    });
  }

  _changeCheck(value) {
    this.setState({
      check: value
    });
  }

  _changeAutoRefresh(value) {
    this.setState({
      autorefresh: value
    });
  }

  _rollDiceNKM() {
    let _this = this;
    let _n = this.state.n;
    let _m = this.state.m;
    while (_m > _n) {
      _m--;
      _n++;
    }
    this.setState({
      n: _n,
      m: _m,
      loading: true,
      dices: [],
      dicesNaive: []
    });
    Rule.rollDice(_n, 10, (status, data) => {
      _this.setState({
        loading: false
      });
      if (status) {
        _this.setState({
          dices: data
        });
        _this._addMsg.bind(_this, _n + "K" + _m + " - " + data.join(", "))();
      }
    });
  }

  _rollDiceNaive() {
    let _this = this;
    let _d = this.state.d;
    let _k = this.state.k;
    this.setState({
      loading: true,
      dices: [],
      dicesNaive: []
    });
    Rule.rollDice(_d, _k, (status, data) => {
      _this.setState({
        loading: false
      });
      if (status) {
        _this.setState({
          dicesNaive: data
        });
        _this._addMsg.bind(_this, _d + "D" + _k + " - " + data.join(", "))();
      }
    });
  }

  _addMsg(msg) {
    let _this = this;
    if (this.state.name != '') {
      History.addDiceHistory(this.state.name + " - " + msg, (status) => {
        if (status) {
          History.getLatestDiceHistory((status, data) => {
            if (status) {
              data.sort((a, b) => {
                return (b.ctime - a.ctime);
              });
              this.setState({
                history: data
              });
            }
          });
        }
      });
    }
  }

  render() {
    let diceList = [];
    let diceSum = 0;
    if (this.state.dices.length > 0) {
      let _dices = [];
      for (let i=0; i<this.state.dices.length; i++) {
        _dices.push({
          k: i,
          v: this.state.dices[i],
          picked: false
        });
      }
      if (!this.state.check) {
        _dices.sort((a, b) => {            
          return (a.v - b.v);
        });
      }
      else {
        _dices.sort((a, b) => {           
          return (b.v - a.v);
        });
      }
      for (let i=0; (i<_dices.length) && (i<this.state.m); i++) {
        _dices[i].picked = true;
        diceSum += _dices[i].v;
      }
      _dices.sort((a, b) => {
        return (a.k - b.k);
      });
      for (let i=0; i<_dices.length; i++) {
        diceList.push(
          <span style={_dices[i].picked ? {color:"red"} : {}}>{ _dices[i].v }</span>
        );
        if (i+1<_dices.length) {
          diceList.push(<span>, </span>);
        }
      }
    }
    let historyList = [];
    if (this.state.history.length>0) {
      for (let i=0; i<this.state.history.length; i++) {
        historyList.push(<p>{ getTimeString(this.state.history[i].ctime * 1000) + " - " + this.state.history[i].msg }</p>);
      }
    }
    let inputWidth = Math.min(300, wp.base.DOC_WIDTH - 60);
    let buttonWidth = wp.base.BROWSER_TYPE ? inputWidth : "auto";
    return (
      <div>
        <p>投个骰子</p>
        <p>
          <Input style={{width:inputWidth,margin:10}} value={ this.state.name } placeholder="输入用户名，大家可看到你的骰子历史" onChange={ this._changeName.bind(this) }/>
        </p>
        <div>
          <InputNumber min={ 0 } max={ 10 } style={{width:60,margin:10}} value={ this.state.n } onChange={ this._changeN.bind(this) }/>
          <span>K</span>
          <InputNumber min={ 0 } max={ 10 } style={{width:60,margin:10}} value={ this.state.m } onChange={ this._changeM.bind(this) }/>
          <Switch checked={ this.state.check } onChange={ this._changeCheck.bind(this) }/>
          <span style={{marginLeft:5}}>{ this.state.check ? "取高" : "取低" }</span>
          <div className="mobile-clear-both"></div>
          <Button type="primary" style={{width:buttonWidth,margin:10}} onClick={ this._rollDiceNKM.bind(this) } loading={ this.state.loading }>投！</Button>
        </div>
        <div>
          <InputNumber min={ 0 } max={ 20 } style={{width:60,margin:10}} value={ this.state.d } onChange={ this._changeD.bind(this) }/>
          <span>D</span>
          <InputNumber min={ 0 } max={ 100 } style={{width:60,margin:10}} value={ this.state.k } onChange={ this._changeK.bind(this) }/>
          <span style={wp.base.BROWSER_TYPE?{}:{margin:"0 40px"}}></span>
          <div className="mobile-clear-both"></div>
          <Button type="primary" style={{width:buttonWidth,margin:10}} onClick={ this._rollDiceNaive.bind(this) } loading={ this.state.loading }>投！</Button>
        </div>
        { (diceList.length > 0) || (this.state.dicesNaive.length > 0) ? (
          <div>
            <div style={{margin:10}}><hr/></div>
            <p>结果</p>
          </div>
        ) : (
          <noscript/>
        )} 
        { diceList.length > 0 ? (
          <div>
            <p>{ diceList }</p>
            <p>{ "总和：" + diceSum }</p>
          </div>
        ) : (
          <noscript/>
        )}
        { this.state.dicesNaive.length > 0 ? (
          <p>{ this.state.dicesNaive.join(", ") }</p>
        ) : (
          <noscript/>
        )}
        <div>
          {/*
          <p>
            <Switch checked={ this.state.autorefresh } onChange={ this._changeAutoRefresh.bind(this) }/>
            <span style={{marginLeft:5}}>{ this.state.autorefresh ? "自动刷新历史" : "不自动刷新历史" }</span>
          </p>
          */}
          <div style={{margin:10}}><hr/></div>
          { historyList }
        </div>
      </div>
    );
  }

}

export default DicePage;
