import React, { Component } from 'react';
import { Steps, Button } from 'antd';
const Step = Steps.Step;
import Data from '../services/Data';
import Build from '../services/Build';
import BuildPage1 from '../components/BuildPage1.react';
import BuildPage2 from '../components/BuildPage2.react';
import BuildPage3 from '../components/BuildPage3.react';
import BuildPage4 from '../components/BuildPage4.react';
import BuildPage5 from '../components/BuildPage5.react';

/**
 * @Author: Golion
 */
class BuildPage extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      step: 0,
      initialized: false,
      data: {},
      errorMsg: ""
    };
    Build.init(this._initialized.bind(this));
  }

  _initialized(data) {
    if (data === false) {
      this.setState({
        errorMsg: "读取数据失败，请刷新页面",
        initialized: true
      });
    }
    else {
      this.setState({
        data: data,
        initialized: true
      });
    }
  }

  _setItemDirect(itemName) {
    return (value) => {
      Data.setItem(itemName, value);
      let _data = this.state.data;
      _data[itemName] = value;
      this.setState({
        data: _data
      });
    }
  }

  _setItem(itemName) {
    return (evt) => {
      Data.setItem(itemName, evt.target.value);
      let _data = this.state.data;
      _data[itemName] = evt.target.value;
      this.setState({
        data: _data
      });
    }
  }

  _changeRace(raceName) {
    Build.changeRace(raceName);
    this._setItemDirect.bind(this)("race-list-select")(raceName);
  }

  _previousStep() {
    this.setState({
      errorMsg: "",
      step: this.state.step - 1
    });
  }

  _nextStep() {
    let ret = Build.checkStep(this.state.step);
    if (ret.status) {
      this.setState({
        errorMsg: "",
        step: this.state.step + 1
      });
    }
    else {
      this.setState({
        errorMsg: ret.msg
      });
    }
  }

  _build() {
    window.open("/printer");
  }

  render() {
    if (!this.state.initialized) return <p>Loading...</p>;
    const steps = [{
      title: '人物背景'
    }, {
      title: '基础数值'
    }, {
      title: '职业与能力'
    }, {
      title: '魔法、技能与优点'
    }, {
      title: '装备与道具'
    }].map((s, i) => <Step key={i} title={s.title} />);
    let pageContent = <noscript/>;
    switch(this.state.step) {
      case 0:
        pageContent =
          <BuildPage1 setItem={ this._setItem.bind(this) }/>;
        break;
      case 1:
        pageContent =
          <BuildPage2 setItem={ this._setItem.bind(this) } setItemDirect={ this._setItemDirect.bind(this) } changeRace={ this._changeRace.bind(this) }/>;
        break;
      case 2:
        pageContent =
          <BuildPage3 />;
        break;
      case 3:
        pageContent =
          <BuildPage4 />;
        break;
      case 4:
        pageContent =
          <BuildPage5 />;
        break;
      default:
        pageContent =
          <p>ERROR</p>;
    }
    let stepPagination = (
      <div style={{margin:10}}>
        { this.state.step > 0 ? (
          <Button type="primary" style={{margin:10}} onClick={ this._previousStep.bind(this) }>上一步</Button>
        ) : (
          <noscript/>
        )}
        { this.state.step < 4 ? (
          <Button type="primary" style={{margin:10}} onClick={ this._nextStep.bind(this) }>下一步</Button>
        ) : (
          <noscript/>
        )}
        { this.state.step === 4 ? (
          <Button style={{margin:10}} onClick={ this._build.bind(this) }>OK，建卡！</Button>
        ) : (
          <noscript/>
        )}
      </div>
    );
    let errorMsg = (
      <div>
        { this.state.errorMsg != "" ? (
          <p style={{color:"red",margin:15}}>{ this.state.errorMsg }</p>
        ) : (
          <noscript/>
        )}
      </div>
    );
    let stepDirection = (wp.base.BROWSER_TYPE || (wp.base.DOC_WIDTH < 700)) ? "vertical" : "horizonal";
    return (
      <div>
        <p>建卡器</p>
        <div style={{textAlign:"left"}}>
          <Steps direction={ stepDirection } size="small" current={ this.state.step }>
            { steps }
          </Steps>
        </div>
        { stepPagination }
        { errorMsg }
        { pageContent }
        { errorMsg }
        { stepPagination }
      </div>
    );
  }

}

export default BuildPage;
