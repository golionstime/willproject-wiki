import React, { Component } from 'react';
import jQuery from 'jquery';
import { Transfer, Popover, Button } from 'antd';
import Data from '../services/Data';
import Build from '../services/Build';

/**
 * @Author: Golion
 * Build Page 4 魔法、技能与优点
 */
class BuildPage4 extends Component {

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
    const storagedTargetKeys = Data.getItem("style-target-keys").split(",");
    for (let i=0; i<Data.getItem('style-list').length; i++) {
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
        title: Data.getItem('style-list')[i],
        description: Data.getItem('style-list')[i],
        chosen: hasKey
      };
      mockData.push(data);
      if (hasKey) targetKeys.push(data.key);
    }
    this.setState({ mockData, targetKeys });
  }

  _handleChangeStyleTransfer(targetKeys) {
    Data.setItem("custom-skills", "");
    Data.setItem("style-target-keys", targetKeys.join(","));
    this.setState({ targetKeys });
  }

  _changeSkillLevel(skillName, add = true) {
    return () => {
      Build.setSkillLevel(skillName, add);
      this.setState({refresh: true});
    }
  }

  render() {

    let skillList = [];
    let finalSkillList = [];
    let skillPoints = Build.getSkillPoints(); // 总技能点
    let xp = Data.getNumberItem("params-xp"); // 总XP
    let abilityXPCost = Build.getSavedAbilityXPCost();
    let skillCostList = [];
    let skillCost = 0;
    let skillXPCost = 0;

    // 所选流派列表与技能列表
    let skillInfo = Build.getSkillInfo(this.state.targetKeys);
    let selectedStyles = skillInfo.styles;
    let selectedSkills = skillInfo.skills;

    if (selectedStyles.length > 0) {
      let highestMagicLevel = 0;
      let totalSkillNum1 = 0;  // 肮脏战斗
      let totalSkillNum2 = 0;  // 短兵械斗
      let totalSkillNum3 = 0;  // 长兵械斗
      let totalSkillNum4 = 0;  // 大型械斗
      for (let skillName in selectedSkills) {
        let skillLevel = Build.getSkillLevel(skillName);
        if (skillLevel <= 0) continue;
        let skill = selectedSkills[skillName]
        let isCombat = skill.type === "combat";
        let isMagic = skill.type === "magic";
        if (isMagic && 'magic_level' in skill) {
          let magicLevelStr = skill.magic_level;
          highestMagicLevel = Math.max(highestMagicLevel, parseInt(magicLevelStr.charAt(magicLevelStr.length - 1)));
        }
        if (isCombat && 'type_detail' in skill) {
          switch (skill.type_detail) {
            case "肮脏战斗战技": totalSkillNum1 += 1; break;
            case "短兵械斗战技": totalSkillNum2 += 1; break;
            case "长兵械斗战技": totalSkillNum3 += 1; break;
            case "大型械斗战技": totalSkillNum4 += 1; break;
            case "近战通用战技":
              totalSkillNum2 += 1;
              totalSkillNum3 += 1;
              totalSkillNum4 += 1;
              break;
          }
        }
      }
      for (let skillName in selectedSkills) {
        let skillLevel = Build.getSkillLevel(skillName);
        let skill = selectedSkills[skillName];
        let isCombat = skill.type === "combat";
        let isMagic = skill.type === "magic";
        let counter = 0;
        if (isMagic) {
          counter = highestMagicLevel;
        } else if (isCombat && 'type_detail' in skill) {
          switch (skill.type_detail) {
            case "肮脏战斗战技": counter = totalSkillNum1; break;
            case "短兵械斗战技": counter = totalSkillNum2; break;
            case "长兵械斗战技": counter = totalSkillNum3; break;
            case "大型械斗战技": counter = totalSkillNum4; break;
          }
        }
        let requirements = skill.requirement.map(
          (s, i) => Build.getSkillRequirementDescription(s, counter));
        let popoverContent = (
          <div>
            { isCombat ? (
              <div>
                { 'combat_type' in skill ? (
                  <div><p style={{fontWeight:"bold"}}>战技类型</p><p>{ skill.combat_type }</p><br/></div>
                ) : ( <noscript/> ) }
                { 'combat_bonus' in skill ? (
                  <div><p style={{fontWeight:"bold"}}>战技增幅</p><p>{ skill.combat_bonus }</p><br/></div>
                ) : ( <noscript/> ) }
                { 'combat_cost' in skill ? (
                  <div><p style={{fontWeight:"bold"}}>战技消耗</p><p>{ skill.combat_cost }</p><br/></div>
                ) : ( <noscript/> ) }
                { 'combat_range' in skill ? (
                  <div><p style={{fontWeight:"bold"}}>战技射程</p><p>{ skill.combat_range }</p><br/></div>
                ) : ( <noscript/> ) }
              </div>
            ) : ( <noscript/> )}
            { isMagic ? (
              <div>
                { 'magic_level' in skill ? (
                  <div><p style={{fontWeight:"bold"}}>魔法等级</p><p>{ skill.magic_level }</p><br/></div>
                ) : ( <noscript/> ) }
                { 'magic_type' in skill ? (
                  <div><p style={{fontWeight:"bold"}}>魔法类型</p><p>{ skill.magic_type }</p><br/></div>
                ) : ( <noscript/> ) }
                { 'magic_cost' in skill ? (
                  <div><p style={{fontWeight:"bold"}}>魔法消耗</p><p>{ skill.magic_cost }</p><br/></div>
                ) : ( <noscript/> ) }
                { 'magic_range' in skill ? (
                  <div><p style={{fontWeight:"bold"}}>魔法射程</p><p>{ skill.magic_range }</p><br/></div>
                ) : ( <noscript/> ) }
              </div>
            ) : ( <noscript/> )}
            { 'bonus' in skill ? (
              <div><p style={{fontWeight:"bold"}}>增幅</p><p>{ skill.bonus }</p><br/></div>
            ) : ( <noscript/> ) }
            { 'special' in skill ? (
              <div><p style={{fontWeight:"bold"}}>特殊</p><p>{ skill.special }</p><br/></div>
            ) : ( <noscript/> ) }
            <p style={{fontWeight:"bold"}}>效果</p><p>{ skill.description }</p><br/>
            <p style={{fontWeight:"bold"}}>
              <span>学习消耗：</span>
              <span style={{color:"red"}}>{ skill.cost }</span>
              <span>技能点</span>
            </p>
            <br/>
            <p style={{fontWeight:"bold"}}>学习条件（满足以下任意一条即可）</p>
            { requirements.map((s, i) => <p style={s.valid?{color:"red"}:{}}>{ s.description }</p>) }
          </div>
        );
        let isValid = false;
        for (let i=0; i<requirements.length; i++) {
          if (requirements[i].valid) { isValid = true; break; }
        }
        let minusAble = skillLevel > 0;
        let addAble = isValid && ( skillLevel === 0 );
        if (minusAble) {
          skillCostList.push(selectedSkills[skillName].cost);
          finalSkillList.push(skillName);
        }
        skillList.push(
          <div style={{margin:5}}>
            { minusAble ? (
              <Button style={{width:50}} size="small" onClick={ this._changeSkillLevel(skillName, false).bind(this) }>取消</Button>
            ) : (
              <div style={{display:"inline-block",width:50,height:22}}/>
            )}
            <Popover overlayStyle={{width:400}} content={ popoverContent } title={ skillName }>
              <a href="javascript:void(0);">
                <div style={{display:"inline-block",margin:5,width:160,fontSize:"small"}}>
                  <span style={minusAble?{color:"red",fontWeight:"bold"}:{}}>{ skillName }</span>
                </div>
              </a>
            </Popover>
            { addAble ? (
              <Button style={{width:50}} size="small" onClick={ this._changeSkillLevel(skillName, true).bind(this) }>学习</Button>
            ) : (
              <div style={{display:"inline-block",width:50,height:22}}/>
            )}
          </div>
        );
      }
    }

    skillCostList.sort((a, b) => { return b - a;});
    for (let i=0; i<skillCostList.length; i++) {
      let _cost = skillCostList[i];
      if (_cost === 0) continue;
      if (skillCost + _cost <= skillPoints) {
        skillCost += _cost;
      }
      else {
        skillXPCost += _cost * 5;
      }
    }

    Data.setItem("skill-cost", skillCost);
    Data.setItem("skill-xp-cost", skillXPCost);
    Data.setItem("final-skills", finalSkillList.join(","));
    Data.setItem("final-xp-cost", abilityXPCost + skillXPCost);

    return (
      <div style={{margin:"10px 0"}}>
        <p>流派列表</p>
        <Transfer
          listStyle={{
            width: wp.base.BROWSER_TYPE?100:200,
            height: wp.base.BROWSER_TYPE?300:400,
            textAlign: "left"
          }}
          dataSource={ this.state.mockData }
          targetKeys={ this.state.targetKeys }
          onChange={ this._handleChangeStyleTransfer.bind(this) }
          render={item => item.title}
        />
        { selectedStyles.length > 0 ? (
          <div style={{margin:"10px 0"}}>
            <p>
              <span>选中的流派：</span>
              <span style={{color:"red"}}>{ selectedStyles.join(", ") }</span>
            </p>
            <div style={{margin:"10px 0"}}>
              <hr/>
            </div>
            { skillList }
          </div>
        ) : (
          <noscript/>
        )}
        <div style={{margin:"10px 0"}}>
          <hr/>
        </div>
        <p>
          <span>技能点：COST/TOTAL=</span>
          <span style={{color:"red"}}>{ skillCost }</span>
          <span>{ "/" + skillPoints }</span>
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

export default BuildPage4;
