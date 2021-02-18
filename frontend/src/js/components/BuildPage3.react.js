import React, { Component } from 'react';
import jQuery from 'jquery';
import {Transfer, Button, Checkbox, Input} from 'antd';
const CheckboxGroup = Checkbox.Group;
import Data from '../services/Data';
import Build from '../services/Build';

/**
 * @Author: Golion
 * Build Page 3 职业与能力
 */
class BuildPage3 extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      mockData: [],
      targetKeys: [],
      refresh: false // 用于页面刷新
    };
  }

  componentDidMount() {
    this.getMock.bind(this)();
    if (wp.base.BROWSER_TYPE) { jQuery(".ant-transfer-list-header-title").css("display", "none"); }
  }

  componentDidUpdate() {
    if (wp.base.BROWSER_TYPE) { jQuery(".ant-transfer-list-header-title").css("display", "none"); }
  }

  getMock() {
    const targetKeys = [];
    const mockData = [];
    const storagedTargetKeys = Data.getItem("profession-target-keys").split(",");
    for (let i=0; i<Data.getItem('profession-list').length; i++) {
      let hasKey = false;
      for (let j=0; j<storagedTargetKeys.length; j++) {
        if (storagedTargetKeys[j] === "") continue;
        if (parseInt(storagedTargetKeys[j]) === i) {
          hasKey = true;
          break;
        }
      }
      const data = {
        key: i,
        title: Data.getItem('profession-list')[i],
        description: Data.getItem('profession-list')[i],
        chosen: hasKey
      };
      mockData.push(data);
      if (hasKey) targetKeys.push(data.key);
    }
    this.setState({ mockData, targetKeys });
  }

  _handleChangeProfessionTransfer(targetKeys) {
    let abilityInfo = Build.getAbilityInfo(this.state.targetKeys);
    let selectedAbilities = abilityInfo.abilities;
    let customAbilities = Data.getItem("custom-abilities").split(",");
    let customAbilitiesNew = [];
    for (let j=0; j<customAbilities.length; j++) {
      if (customAbilities[j] === "") continue;
      let _abilityInfo = customAbilities[j].split("|");
      if (_abilityInfo[0] in selectedAbilities) {
        customAbilitiesNew.push(customAbilities[j]);
      }
    }
    Data.setItem("custom-professions", "");
    Data.setItem("custom-abilities", customAbilitiesNew.join(","));
    Data.setItem("extra-abilities", "");
    Data.setItem("custom-skills", "");
    Data.setItem("profession-target-keys", targetKeys.join(","));
    Build.clearAbilityLevel();
    this.setState({ targetKeys });
  }

  _changeCustomAbility(abilityName, add = true) {
    return () => {
      Build.setCustomAbility(abilityName, add);
      this.setState({refresh: true});
    }
  }

  _changeExtraAbilities(checkedValues) {
    Data.setItem("extra-abilities", checkedValues.join(","));
    this.setState({refresh: true});
  }

  _setItem(itemName) {
    return (evt) => {
      Data.setItem(itemName, evt.target.value);
      this.setState({refresh: true});
    }
  }

  render() {

    let inputWidthNormal = wp.base.BROWSER_TYPE ? ( wp.base.DOC_WIDTH - 60 ) : Math.min(300, wp.base.DOC_WIDTH - 60);
    let abilityList = []; // 能力列表
    let finalAbilityList = [];
    let abilityPoints = Build.getAbilityPoints(); // 总能力点
    let xp = Data.getNumberItem("params-xp"); // 总XP
    let abilityCost = 0; // 消耗的能力点
    let abilityXPCost = 0; // 消耗的XP
    let allAbilities = Data.getItem("ability-list");
    for (let abilityName in allAbilities) {
      allAbilities[abilityName] = 0; // 并非DeepCopy，所以要重新初始化
    }
    let abilityCostList = []; // 消耗的能力点

    // 所选职业列表与能力列表
    let abilityInfo = Build.getAbilityInfo(this.state.targetKeys);
    let selectedProfessions = abilityInfo.professions;
    let selectedAbilities = abilityInfo.abilities;

    // 计算职业带来的能力点消耗
    if (selectedProfessions.length > 0) {
      for (let i=0; i<selectedProfessions.length; i++) {
        abilityCost += i + 1;
      }
    }

    // 能力等级
    if (selectedProfessions.length > 0) {
      for (let abilityName in selectedAbilities) {
        allAbilities[abilityName] = 1;
        let abilityLevel = selectedAbilities[abilityName];
        let customAbilityLevel = Build.getCustomAbilityLevel(abilityName);
        Build.setAbilityLevel(abilityName, abilityLevel + customAbilityLevel);
        let _costList = Build.getAbilityPointCostList(abilityLevel, customAbilityLevel);
        for (let i=0; i<_costList.length; i++) {
          abilityCostList.push(_costList[i]);
        }
        abilityXPCost += Build.getAbilityXPCost(abilityLevel, customAbilityLevel);
        let minusAble = customAbilityLevel > 0;
        let addAble = abilityLevel + customAbilityLevel < 6;
        abilityList.push(
          <div style={{margin:5}}>
            { minusAble ? (
              <Button style={{width:30}} size="small" onClick={ this._changeCustomAbility(abilityName, false).bind(this) }>-</Button>
            ) : (
              <div style={{display:"inline-block",width:30,height:22}}/>
            )}
            <div style={{display:"inline-block",margin:5,width:200,fontSize:"small"}}>
              <span>{ abilityName + " - Lv" }</span>
              <span style={{color:"red"}}>{ abilityLevel + customAbilityLevel }</span>
            </div>
            { addAble ? (
              <Button style={{width:30}} size="small" onClick={ this._changeCustomAbility(abilityName, true).bind(this) }>+</Button>
            ) : (
              <div style={{display:"inline-block",width:30,height:22}}/>
            )}
          </div>
        );
        finalAbilityList.push(abilityName + "|" + (abilityLevel + customAbilityLevel))
      }
    }

    // 其他能力
    let extraAbilityList = [];
    for (let abilityName in allAbilities) {
      if (allAbilities.hasOwnProperty(abilityName) && allAbilities[abilityName] === 0) {
        extraAbilityList.push(abilityName);
      }
    }
    let selectedExtraAbilities = Data.getItem("extra-abilities").split(",");
    for (let i=0; i<selectedExtraAbilities.length; i++) {
      let abilityName = selectedExtraAbilities[i];
      if (abilityName === "") continue;
      let abilityLevel = 1;
      abilityCostList.push(2);
      let customAbilityLevel = Build.getCustomAbilityLevel(abilityName);
      Build.setAbilityLevel(abilityName, abilityLevel + customAbilityLevel);
      let _costList = Build.getAbilityPointCostList(abilityLevel, customAbilityLevel, true);
      for (let i=0; i<_costList.length; i++) {
        abilityCostList.push(_costList[i]);
      }
      abilityXPCost += Build.getAbilityXPCost(abilityLevel, customAbilityLevel) * 2;
      let minusAble = customAbilityLevel > 0;
      let addAble = abilityLevel + customAbilityLevel < 6;
      abilityList.push(
        <div style={{margin:5}}>
          { minusAble ? (
            <Button style={{width:30}} size="small" onClick={ this._changeCustomAbility(abilityName, false).bind(this) }>-</Button>
          ) : (
            <div style={{display:"inline-block",width:30,height:22}}/>
          )}
          <div style={{display:"inline-block",margin:5,width:200,fontSize:"small"}}>
            <span>额外能力：</span>
            <span style={{color:"red"}}>{ abilityName }</span>
            <span> - Lv</span>
            <span style={{color:"red"}}>{ abilityLevel + customAbilityLevel }</span>
          </div>
          { addAble ? (
            <Button style={{width:30}} size="small" onClick={ this._changeCustomAbility(abilityName, true).bind(this) }>+</Button>
          ) : (
            <div style={{display:"inline-block",width:30,height:22}}/>
          )}
        </div>
      );
      finalAbilityList.push(abilityName + "|" + (abilityLevel + customAbilityLevel))
    }

    abilityCostList.sort((a, b) => { return a - b;});
    for (let i=0; i<abilityCostList.length; i++) {
      let _cost = abilityCostList[i];
      if (_cost === 0) continue;
      if (abilityCost + _cost <= abilityPoints) {
        abilityCost += _cost;
      }
      else {
        abilityXPCost += _cost * 5;
      }
    }

    Data.setItem("final-professions", selectedProfessions.join(","));
    Data.setItem("final-abilities", finalAbilityList.join(","));
    Data.setItem("ability-cost", abilityCost);
    Data.setItem("ability-xp-cost", abilityXPCost);
    let skillXPCost = Data.getItem("skill-xp-cost") === "" ? 0 : parseInt(Data.getItem("skill-xp-cost"));

    return (
      <div style={{margin:"10px 0"}}>
        <p>职业列表</p>
        <Transfer
          listStyle={{
            width: wp.base.BROWSER_TYPE?100:200,
            height: wp.base.BROWSER_TYPE?300:400,
            textAlign: "left"
          }}
          dataSource={ this.state.mockData }
          targetKeys={ this.state.targetKeys }
          onChange={ this._handleChangeProfessionTransfer.bind(this) }
          render={item => item.title}
        />
        { selectedProfessions.length > 0 ? (
          <div style={{margin:"10px 0"}}>
            <p>
              <span>选中的职业：</span>
              <span style={{color:"red"}}>{ selectedProfessions.join(", ") }</span>
            </p>
            <div style={{margin:"10px 0"}}>
              <hr/>
            </div>
            <p>可选的额外能力（能力点消耗翻倍）</p>
            <CheckboxGroup style={{margin:10}} options={ extraAbilityList } value={ Data.getItem("extra-abilities").split(",") } onChange={ this._changeExtraAbilities.bind(this) } />
            <div style={{margin:"10px 0"}}>
              <hr/>
            </div>
            { abilityList }
          </div>
        ) : (
          <noscript/>
        )}
        <hr/>
        <p>
          <span>任意战斗能力=</span>
          <Input style={{width:inputWidthNormal,margin:10}} value={ Data.getItem("arbitrary-combat-skill-1") } placeholder="任意战斗能力" onChange={ this._setItem("arbitrary-combat-skill-1").bind(this) }/>
        </p>
        <p>
          <span>任意知识能力=</span>
          <Input style={{width:inputWidthNormal,margin:10}} value={ Data.getItem("arbitrary-knowledge-skill-1") } placeholder="任意战斗能力" onChange={ this._setItem("arbitrary-knowledge-skill-1").bind(this) }/>
        </p>
        <div style={{margin:"10px 0"}}>
          <hr/>
        </div>
        <p>
          <span>能力点：COST/TOTAL=</span>
          <span style={{color:"red"}}>{ abilityCost }</span>
          <span>{ "/" + abilityPoints }</span>
        </p>
        <p>
          <span>XP：COST/TOTAL=</span>
          <span style={{color:"red"}}>{ abilityXPCost + skillXPCost }</span>
          <span>{ "/" + xp }</span>
        </p>
      </div>
    );
  }

}

export default BuildPage3;
