import React, { Component } from 'react';
import { InputNumber, Button } from 'antd';
import jQuery from 'jquery';
const {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend} = Recharts;
import Rule from './../services/Rule';

/**
 * @Author: Golion
 */
class DataGramPage extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      loading: false,
      n: 4,
      m: 3,
      reverse: 1,
      exp: -1,
      data: []
    };
  }

  _changeN(value) {
    this.setState({
      n: value
    });
  }

  _changeM(value) {
    this.setState({
      m: value
    });
  }

  _getDataGram() {
    let _this = this;
    this.setState({
      loading: true
    });
    Rule.getDataGram(this.state.n, this.state.m, this.state.reverse, (status, data) => {
      _this.setState({
        loading: false
      });
      if (status) {
        let _data = [];
        let _sum = 0.0;
        for (let i=0; i<data.list.length; i++) {
          _sum += data.list[i].v;
          _data.push({name: data.list[i].k, hit: data.list[i].v, prob: _sum / 10000});
        }
        _this.setState({
          exp: data.exp,
          data: _data
        });
      }
    });
  }

  render() {
    return (
      <div>
        <p>NKM数据图表（模拟10000次）</p>
        <InputNumber min={ 0 } max={ 10 } style={{width:80,margin:10}} value={ this.state.n } onChange={ this._changeN.bind(this) }/>
        <InputNumber min={ 0 } max={ 10 } style={{width:80,margin:10}} value={ this.state.m } onChange={ this._changeM.bind(this) }/>
        <Button style={{margin:10}} onClick={ this._getDataGram.bind(this) } loading={ this.state.loading }>生成图表</Button>
        { this.state.exp != -1 ? (
          <div>
            <div style={{marginTop: 10}}>
              Expectation: { this.state.exp }
            </div>
            <LineChart width={wp.base.DOC_WIDTH - 60} height={400} data={this.state.data}
                       margin={{top: 5, right: 5, left: 5, bottom: 5}}>
              <XAxis dataKey="name"/>
              <YAxis yAxisId="left" orientation="left" stroke="#8884d8"/>
              <YAxis yAxisId="right" orientation="right" stroke="#82ca9d"/>
              <CartesianGrid strokeDasharray="3 3"/>
              <Tooltip/>
              <Legend />
              <Line type="monotone" yAxisId="left" dataKey="hit" stroke="#8884d8" activeDot={{r: 8}}/>
              <Line type="monotone" yAxisId="right" dataKey="prob" stroke="#82ca9d" />
            </LineChart>
          </div>
        ) : (
          <noscript/>
        )}
      </div>
    );
  }

}

export default DataGramPage;
