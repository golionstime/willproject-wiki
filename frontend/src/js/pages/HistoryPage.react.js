import React, { Component } from 'react';
import History from '../services/History';
import { getTimeString } from '../utils/Time';

/**
 * @Author: Golion
 */
class HistoryPage extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      initialized: false,
      errorMsg: "",
      loading: false,
      historyData: []
    };
    this._init.bind(this)();
  }

  _init() {
    History.getLatestPageHistory((status, data) => {
      if (status) {
        this.setState({
          initialized: true,
          historyData: data
        });
      }
      else {
        this.setState({
          initialized: true,
          errorMsg: "获取数据失败，请刷新页面"
        });
      }
    });
  }
  
  render() {
    if (!this.state.initialized) return <p>Loading...</p>;
    if (this.state.errorMsg != "") return <p style={{color:"red"}}>{ this.state.errorMsg }</p>;
    let historyList = [];
    historyList.push(
      <tr>
        <th>更新时间</th>
        <th>作者</th>
        <th>页面</th>
      </tr>
    )
    for (let i=0; i<this.state.historyData.length; i++) {
      let history = this.state.historyData[i];
      historyList.push(
        <tr>
          <td>{ getTimeString(history.ctime * 1000) }</td>
          <td>{ history.creator }</td>
          <td><a href={ "/page/" + history.name } target="_blank">{ history.name }</a></td>
        </tr>
      );
    }
    return (
      <div>
        <p style={{fontWeight:"bold",textAlign:"left"}}>更新历史（最近20条）</p>
        <hr/>
        <div style={{margin:10}}>
          <table style={{margin:"0 auto"}}>
          { historyList }
          </table>
        </div>
      </div>
    );
  }

}

export default HistoryPage;
