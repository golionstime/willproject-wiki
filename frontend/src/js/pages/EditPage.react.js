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
import CardService from '../services/Card';

/**
 * @Author: Golion
 */
class EditPage extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      msg: "Loading...",
      step: 0,
      initialized: false,
      data: {},
      errorMsg: "",
      loading: false
    };
    Data.storage = false;
    Data.prefix = "edit-" + DATA.CARD_ID;
    this._getCardInfo.bind(this, DATA.CARD_ID)();
  }

  _getCardInfo(cardId) {
    let _this = this;
    CardService.getCard(cardId, (status, data) => {
      if (status) {
        Data.setItem("name", data.data.name);
        Data.setItem("introduction", data.data.introduction);
        Data.setItem("gender", data.data.gender);
        Data.setItem("age", data.data.age);
        Data.setItem("height", data.data.height);
        Data.setItem("weight", data.data.weight);
        Data.setItem("skin", data.data.skin);
        Data.setItem("hair", data.data.hair);
        Data.setItem("eye", data.data.eye);
        Data.setItem("hand", data.data.hand);
        Data.setItem("appear", data.data.appear);
        Data.setItem("story", data.data.story);
        Data.setItem("addition", data.data.addition);
        Data.setItem("race-list-select", data.data.race);
        Data.setItem("params-xp", data.data.xp);
        Data.setItem("final-xp-cost", data.data.xpCost);
        Data.setItem("params-radio", data.data.radio);
        Data.setItem("params-int", data.data.pint);
        Data.setItem("params-str", data.data.pstr);
        Data.setItem("params-agi", data.data.pagi);
        Data.setItem("params-vit", data.data.pvit);
        Data.setItem("params-crm", data.data.pcrm);
        Data.setItem("params-cal", data.data.pcal);
        Data.setItem("params-pow", data.data.ppow);
        Data.setItem("params-dex", data.data.pdex);
        Data.setItem("params-for", data.data.pfor);
        Data.setItem("params-con", data.data.pcon);
        Data.setItem("final-professions", data.data.professions);
        Data.setItem("final-abilities", data.data.abilities);
        Data.setItem("final-skills", data.data.skills);
        Data.setItem("final-equips", data.data.equips);
        Data.setItem("final-items", data.data.items);
        Data.setItem("original-objs", data.data.originalObjs);
        Data.setItem("price-sum", data.data.priceSum);
        Data.setItem("weight-sum", data.data.weightSum);
        Data.setItem("profession-target-keys", data.data.edit.professionTargetKeys);
        Data.setItem("custom-professions", data.data.edit.customProfessions);
        Data.setItem("custom-abilities", data.data.edit.customAbilities);
        Data.setItem("extra-abilities", data.data.edit.extraAbilities);
        Data.setItem("style-target-keys", data.data.edit.styleTargetKeys);
        Data.setItem("custom-skills", data.data.edit.customSkills);
        Data.setItem("skill-xp-cost", data.data.edit.skillXPCost);
        Data.setItem("equip-class-target-keys", data.data.edit.equipClassTargetKeys);
        Data.setItem("custom-equips", data.data.edit.customEquips);
        Data.setItem("custom-items", data.data.edit.customItems);
        Data.setItem("extra-equips", data.data.edit.extraEquips);
        Build.init(_this._initialized.bind(_this));
      }
      else {
        this.setState({
          msg: "CHARACTER NOT FOUND"
        });
      }
    });
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

  _edit() {
    this.setState({
      errorMsg: "",
      loading: true
    });
    CardService.update(DATA.CARD_ID, Build.toJsonObj(), (status) => {
      if (status) {
        this.setState({
          errorMsg: "更新成功",
          loading: false
        });
        setTimeout(() => {
          window.location.href = DATA.HOST + '/character/' + DATA.CARD_ID
        }, 1000);
      }
      else {
        this.setState({
          errorMsg: "更新失败",
          loading: false
        });
      }
    });
  }

  render() {
    if (!this.state.initialized) return <p>{ this.state.msg }</p>;
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
          <Button style={{margin:10}} onClick={ this._edit.bind(this) } loading={ this.state.loading }>更新卡片</Button>
        ) : (
          <noscript/>
        )}
      </div>
    );
    let errorMsg = (
      <div>
        { this.state.errorMsg !== "" ? (
          <p style={{color:"red",margin:15}}>{ this.state.errorMsg }</p>
        ) : (
          <noscript/>
        )}
      </div>
    );
    let stepDirection = (wp.base.BROWSER_TYPE || (wp.base.DOC_WIDTH < 700)) ? "vertical" : "horizonal";
    return (
      <div>
        <p>
          <a href={ DATA.HOST + '/character/' + DATA.CARD_ID }>
            <Button>回到人物</Button>
          </a>
        </p>
        <p>建卡器（编辑模式）</p>
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

export default EditPage;
