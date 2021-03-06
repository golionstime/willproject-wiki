import React, { Component } from 'react';
import { Popover } from "antd";
import Data from '../services/Data';
import Build from "../services/Build";

/**
 * @Author: Golion
 */
class Card extends Component {

  _parseProfessions(professionsStr) {
    let professions = professionsStr.split(",");
    let professionList = [];
    for (let i=0; i<professions.length; i++) {
      if (professions[i] === "") continue;
      professionList.push({
        name: professions[i]
      });
    }
    return professionList;
  }

  _parseAbilities(abilitiesStr) {
    let abilities = abilitiesStr.split(",");
    let abilityList = [];
    for (let i=0; i<abilities.length; i++) {
      if (abilities[i] === "") continue;
      let ability = abilities[i].split("|");
      if (ability[0] === "任意战斗能力" && this.props.arbCbtSkl1 !== "") {
        ability[0] = this.props.arbCbtSkl1;
      }
      if (ability[0] === "任意知识能力" && this.props.arbKlgSkl1 !== "") {
        ability[0] = this.props.arbKlgSkl1;
      }
      abilityList.push({
        name: ability[0],
        level: ability[1]
      });
    }
    return abilityList;
  }

  _parseSkills(skillsStr) {
    let skills = skillsStr.split(",");
    let skillList = [];
    for (let i=0; i<skills.length; i++) {
      if (skills[i] === "") continue;
      skillList.push({
        name: skills[i]
      });
    }
    return skillList;
  }

  _parseEquips(equipsStr) {
    let equips = equipsStr.split(",");
    let equipList = [];
    for (let i=0; i<equips.length; i++) {
      if (equips[i] === "") continue;
      let equip = equips[i].split("|");
      equipList.push({
        name: equip[0],
        amount: equip[1]
      });
    }
    return equipList;
  }

  _parseItems(itemsStr) {
    let items = itemsStr.split(",");
    let itemList = [];
    for (let i=0; i<items.length; i++) {
      if (items[i] === "") continue;
      let item = items[i].split("|");
      itemList.push({
        name: item[0],
        amount: item[1]
      });
    }
    return itemList;
  }

  _parseOriginalObjs(originalObjsStr) {
    let originalObjs = originalObjsStr.split(",");
    let originalObjList = [];
    for (let i=0; i<originalObjs.length; i++) {
      if (originalObjs[i].trim() === "") continue;
      let originalObj = originalObjs[i].trim().split("|");
      originalObjList.push({
        name: originalObj[0],
        weight: parseFloat(originalObj[1]),
        price: parseInt(originalObj[2]),
        displayPrice: originalObj[3]
      });
    }
    return originalObjList;
  }

  // 计算价格
  _getPriceDescription(price) {
    let _price = price;
    let _money7 = Math.floor(_price / 10000);
    _price %= 10000;
    let _money6 = Math.floor(_price / 5000);
    _price %= 5000;
    let _money5 = Math.floor(_price / 1000);
    _price %= 1000;
    let _money4 = Math.floor(_price / 100);
    _price %= 100;
    let _money3 = Math.floor(_price / 50);
    _price %= 50;
    let _money2 = Math.floor(_price / 10);
    _price %= 10;
    let _money1 = _price;
    let _descr = "";
    if (_money7 > 0) _descr += _money7 + "大金币 ";
    if (_money6 > 0) _descr += _money6 + "中金币 ";
    if (_money5 > 0) _descr += _money5 + "小金币 ";
    if (_money4 > 0) _descr += _money4 + "大银币 ";
    if (_money3 > 0) _descr += _money3 + "中银币 ";
    if (_money2 > 0) _descr += _money2 + "小银币 ";
    if (_money1 > 0) _descr += _money1 + "铜币";
    if (_descr === "") _descr = "免费";
    return _descr;
  }

  render() {
    const { creator, name, introduction, gender, age, height, weight, skin, hair, eye, hand, appear, story, addition } = this.props;
    const { xp, xpCost, radio, pint, pstr, pagi, pvit, pcrm, pcal, ppow, pdex, pfor, pcon } = this.props;
    const { professions, abilities, skills, equips, items, originalObjs, priceSum, weightSum } = this.props;
    const { combatSkills, magicSkills, allSKills, allEquips } = this.props;
    // pow:元素里 flo:元素流出
    // A:Aqua F:Fire W:Wind E:Earth L:Light D:Dark
    let powA = Math.abs(parseInt(pint) + parseInt(pcal));
    let floA = Math.abs(parseInt(pint) - parseInt(pcal));
    let powF = Math.abs(parseInt(pstr) + parseInt(ppow));
    let floF = Math.abs(parseInt(pstr) - parseInt(ppow));
    let powW = Math.abs(parseInt(pagi) + parseInt(pdex));
    let floW = Math.abs(parseInt(pagi) - parseInt(pdex));
    let powE = Math.abs(parseInt(pvit) + parseInt(pfor));
    let floE = Math.abs(parseInt(pvit) - parseInt(pfor));
    let powL = parseInt(pcal);
    let floL = 0;
    let powD = parseInt(pcon);
    let floD = 0;
    let HP = 0;
    let MP = 0;
    let WILL = Math.floor((parseInt(ppow) + parseInt(pfor)) / 2.0);
    let LUCK = Math.min(parseInt(pint), parseInt(pstr), parseInt(pagi), parseInt(pvit), parseInt(pcrm),
                        parseInt(pcal), parseInt(ppow), parseInt(pdex), parseInt(pfor), parseInt(pcon));
    let AD = Math.floor((parseFloat(pcal) + parseFloat(pdex)) / 2.0);
    let AP = 2;
    let COV = 2 + parseInt(pvit);
    let SPEED = 2 + Math.floor((parseFloat(pstr) + parseFloat(pagi)) / 2.0);
    let LOAD = 0;
    switch (parseInt(pstr)) {
      case 1: LOAD = 15; break;
      case 2: LOAD = 30; break;
      case 3: LOAD = 50; break;
      case 4: LOAD = 80; break;
      case 5: LOAD = 120; break;
      case 6: LOAD = 170; break;
      case 7: LOAD = 230; break;
      case 8: LOAD = 300; break;
    }
    HP = 30 + parseInt(pvit) * 3;
    MP = 15 + parseInt(pint) * 2 + parseInt(pcon) * 2;
    this._parseAbilities(abilities).map((s, i) => {
      if (s.name === "元素魔法知识") MP += 2 * parseInt(s.level);
    });
    this._parseSkills(skills).map((s, i) => {
      if (combatSkills.hasOwnProperty(s.name)) HP += 1;
      if (magicSkills.hasOwnProperty(s.name)) MP += 1;
      if (s.name.startsWith("迅捷行动")) AP += 1;
      if (s.name.startsWith("高速移动")) SPEED += 1;
      if (s.name.startsWith("强运")) LUCK += 1;
      if (s.name === "光之力") powL += 2;
      if (s.name === "暗之力") powD += 2;
      if (s.name.startsWith("自然元素")) {
        if (s.name.indexOf("（水）") !== -1) powA += 1;
        if (s.name.indexOf("（火）") !== -1) powF += 1;
        if (s.name.indexOf("（气）") !== -1) powW += 1;
        if (s.name.indexOf("（地）") !== -1) powE += 1;
      }
      if (s.name.startsWith("混沌元素")) {
        if (s.name.indexOf("（光）") !== -1) powL += 1;
        if (s.name.indexOf("（暗）") !== -1) powD += 1;
      }
      if (s.name.startsWith("元素流出")) {
        if (s.name.indexOf("（水）") !== -1) floA += 1;
        if (s.name.indexOf("（火）") !== -1) floF += 1;
        if (s.name.indexOf("（气）") !== -1) floW += 1;
        if (s.name.indexOf("（地）") !== -1) floE += 1;
        if (s.name.indexOf("（光）") !== -1) floL += 1;
        if (s.name.indexOf("（暗）") !== -1) floD += 1;
      }
    });
    return (
      <div style={{margin:"20px 0",textAlign:"left"}}>
        <p>{ introduction + " - " + name }</p>
        { creator !== "" ? ( <p><span style={{fontWeight:"bold"}}>创作者：</span><span>{ creator }</span></p> ) : ( <noscript/> )}
        { gender !== "" || age !== "" ? (
          <p>
            { gender !== "" ? ( <span><span style={{fontWeight:"bold"}}>性别：</span><span>{ gender }</span></span> ) : ( <noscript/> )}
            { gender !== "" && age !== "" ? (<span style={{margin:"0 10px"}}> </span>) : ( <noscript/> )}
            { age !== "" ? ( <span><span style={{fontWeight:"bold"}}>年龄：</span><span>{ age }</span></span> ) : ( <noscript/> )}
          </p>
        ) : ( <noscript/> )}
        { height !== "" || weight !== "" ? (
          <p>
            { height !== "" ? ( <span><span style={{fontWeight:"bold"}}>身高：</span><span>{ height }</span></span> ) : ( <noscript/> )}
            { height !== "" && weight !== "" ? (<span style={{margin:"0 10px"}}> </span>) : ( <noscript/> )}
            { weight !== "" ? ( <span><span style={{fontWeight:"bold"}}>体重：</span><span>{ weight }</span></span> ) : ( <noscript/> )}
          </p>
        ) : ( <noscript/> )}
        { skin !== "" || hair !== "" ? (
          <p>
            { skin !== "" ? ( <span><span style={{fontWeight:"bold"}}>肤色：</span><span>{ skin }</span></span> ) : ( <noscript/> )}
            { skin !== "" && hair !== "" ? (<span style={{margin:"0 10px"}}> </span>) : ( <noscript/> )}
            { hair !== "" ? ( <span><span style={{fontWeight:"bold"}}>发色：</span><span>{ hair }</span></span> ) : ( <noscript/> )}
          </p>
        ) : ( <noscript/> )}
        { eye !== "" || hand !== "" ? (
          <p>
            { eye !== "" ? ( <span><span style={{fontWeight:"bold"}}>瞳色：</span><span>{ eye }</span></span> ) : ( <noscript/> )}
            { eye !== "" && hand !== "" ? (<span style={{margin:"0 10px"}}> </span>) : ( <noscript/> )}
            { hand !== "" ? ( <span><span style={{fontWeight:"bold"}}>惯用手：</span><span>{ hand }</span></span> ) : ( <noscript/> )}
          </p>
        ) : ( <noscript/> )}
        { appear !== "" ? ( <div><p style={{fontWeight:"bold"}}>外观：</p>
          <div dangerouslySetInnerHTML={{ __html: appear }}/>
        </div> ) : ( <noscript/> )}
        { story !== "" ? ( <div><p style={{fontWeight:"bold"}}>故事背景：</p>
          <div dangerouslySetInnerHTML={{ __html: story }}/>
        </div> ) : ( <noscript/> )}
        { addition !== "" ? ( <div><p style={{fontWeight:"bold"}}>补充设定：</p>
          <div dangerouslySetInnerHTML={{ __html: addition }}/>
        </div> ) : ( <noscript/> )}
        <div style={{margin:"20px 0"}}>
          <hr/>
        </div>
        <p><span style={{fontWeight:"bold"}}>XP：COST/TOTAL=</span><span>{ xpCost + " / " + xp }</span></p>
        { radio === "a" ? ( <p style={{fontWeight:"bold"}}>魔法相性：表</p> ) : ( <noscript/> ) }
        { radio === "b" ? ( <p style={{fontWeight:"bold"}}>魔法相性：里</p> ) : ( <noscript/> ) }
        <p>{ "智力:" + pint + "  力量:" + pstr + "  灵巧:" + pagi + "  体魄:" + pvit + "  仪态:" + pcrm }</p>
        <p>{ "沉着:" + pcal + "  气势:" + ppow + "  敏锐:" + pdex + "  坚毅:" + pfor + "  操控:" + pcon }</p>
        <p>{ "水元素:" + powA + "  火元素:" + powF + "  地元素:" + powE + "  气元素:" + powW + "  光元素:" + powL + "  暗元素:" + powD }</p>
        <p>{ "水流出:" + floA + "  火流出:" + floF + "  地流出:" + floE + "  气流出:" + floW + "  光流出:" + floL + "  暗流出:" + floD }</p>
        <div style={{margin:"20px 0"}}>
          <hr/>
        </div>
        { professions !== "" ? (
          <div>
            <p style={{fontWeight:"bold"}}>职业：</p>
            <p>{ this._parseProfessions(professions).map((s, i) => <span style={{marginRight:15}}>{ s.name + " " }</span>) }</p>
            <br/>
          </div>
        ) : ( <noscript/> )}
        { abilities !== "" ? (
          <div>
            <p style={{fontWeight:"bold"}}>能力：</p>
            <p>{ this._parseAbilities(abilities).map((s, i) => <span><span>{ s.name + " Lv" }</span><span style={{color:"red",marginRight:15}}>{ s.level + " " }</span></span>) }</p>
            <br/>
          </div>
        ) : ( <noscript/> )}
        { skills !== "" ? (
          <div>
            <p style={{fontWeight:"bold"}}>魔法、技能与优点：</p>
            <p>{ this._parseSkills(skills).map((s, i) =>
              <Popover overlayStyle={{width:400}} content={
                <div>
                  { allSKills.hasOwnProperty(s.name) ? (
                    <div>
                      { 'combat_type' in allSKills[s.name] ? (
                        <div><p>战技类型：{ allSKills[s.name]['combat_type'] }</p><br/></div>
                      ) : ( <noscript/> ) }
                      { 'combat_bonus' in allSKills[s.name] ? (
                        <div><p>战技增幅：{ allSKills[s.name]['combat_bonus'] }</p><br/></div>
                      ) : ( <noscript/> ) }
                      { 'combat_cost' in allSKills[s.name] ? (
                        <div><p>战技消耗：{ allSKills[s.name]['combat_cost'] }</p><br/></div>
                      ) : ( <noscript/> ) }
                      { 'combat_range' in allSKills[s.name] ? (
                        <div><p>战技射程：{ allSKills[s.name]['combat_range'] }</p><br/></div>
                      ) : ( <noscript/> ) }
                      { 'magic_level' in allSKills[s.name] ? (
                        <div><p>魔法等级：{ allSKills[s.name]['magic_level'] }</p><br/></div>
                      ) : ( <noscript/> ) }
                      { 'magic_type' in allSKills[s.name] ? (
                        <div><p>魔法类型：{ allSKills[s.name]['magic_type'] }</p><br/></div>
                      ) : ( <noscript/> ) }
                      { 'magic_cost' in allSKills[s.name] ? (
                        <div><p>魔法消耗：{ allSKills[s.name]['magic_cost'] }</p><br/></div>
                      ) : ( <noscript/> ) }
                      { 'magic_range' in allSKills[s.name] ? (
                        <div><p>魔法射程：{ allSKills[s.name]['magic_range'] }</p><br/></div>
                      ) : ( <noscript/> ) }
                      { 'bonus' in allSKills[s.name] ? (
                        <div><p>增幅：{ allSKills[s.name]['bonus'] }</p><br/></div>
                      ) : ( <noscript/> ) }
                      { 'special' in allSKills[s.name] ? (
                        <div><p>特殊：{ allSKills[s.name]['special'] }</p><br/></div>
                      ) : ( <noscript/> ) }
                      { 'limit' in allSKills[s.name] ? (
                        <div><p>限制：{ allSKills[s.name]['limit'] }</p><br/></div>
                      ) : ( <noscript/> ) }
                      { 'description' in allSKills[s.name] ? (
                        <div><p>效果：{ allSKills[s.name]['description'] }</p><br/></div>
                      ) : ( <noscript/> ) }
                    </div>
                  ) : ( <div>NOT FOUND</div> )}
                </div>
              } title={ s.name }>
                <a href="javascript:void(0);">
                  <div style={{display:"inline-block",margin:5,width:160,fontSize:"small"}}>
                    <span style={{marginRight:15}}>{ s.name + " " }</span>
                  </div>
                </a>
              </Popover>
            )}</p>
            <br/>
          </div>
        ) : ( <noscript/> )}
        { equips !== "" ? (
          <div>
            <p style={{fontWeight:"bold"}}>装备：</p>
            <p>{ this._parseEquips(equips).map((s, i) =>
              <Popover overlayStyle={{width:400}} content={
                <div>
                  { allEquips.hasOwnProperty(s.name) ? (
                    <div>
                      { 'description' in allEquips[s.name] && allEquips[s.name]['description'] !== "" ? (
                        <div><p>描述：{ allEquips[s.name]['description'] }</p><br/></div>
                      ) : ( <noscript/> ) }
                      { 'weapon_type' in allEquips[s.name] && allEquips[s.name]['weapon_type'] !== "" ? (
                        <div><p>武器类型：{ allEquips[s.name]['weapon_type'] }</p><br/></div>
                      ) : ( <noscript/> ) }
                      { 'weapon_damage' in allEquips[s.name] && allEquips[s.name]['weapon_damage'] !== "" ? (
                        <div><p>武器伤害：{ allEquips[s.name]['weapon_damage'] }</p><br/></div>
                      ) : ( <noscript/> ) }
                      { 'weapon_range' in allEquips[s.name] && allEquips[s.name]['weapon_range'] !== "" ? (
                        <div><p>武器射程：{ allEquips[s.name]['weapon_range'] }</p><br/></div>
                      ) : ( <noscript/> ) }
                      { 'weapon_block' in allEquips[s.name] && allEquips[s.name]['weapon_block'] !== "" ? (
                        <div><p>武器格挡：{ allEquips[s.name]['weapon_block'] }</p><br/></div>
                      ) : ( <noscript/> ) }
                      { 'weapon_critical' in allEquips[s.name] && allEquips[s.name]['weapon_critical'] !== "" ? (
                        <div><p>武器暴击：{ allEquips[s.name]['weapon_critical'] }</p><br/></div>
                      ) : ( <noscript/> ) }
                      { 'weapon_requirement' in allEquips[s.name] && allEquips[s.name]['weapon_requirement'] !== "" ? (
                        <div><p>武器需求：{ allEquips[s.name]['weapon_requirement'] }</p><br/></div>
                      ) : ( <noscript/> ) }
                      { 'weapon_special' in allEquips[s.name] && allEquips[s.name]['weapon_special'] !== "" ? (
                        <div><p>武器特殊：{ allEquips[s.name]['weapon_special'] }</p><br/></div>
                      ) : ( <noscript/> ) }
                      { 'armor_effect' in allEquips[s.name] && allEquips[s.name]['armor_effect'] !== "" ? (
                        <div><p>防具效果：{ allEquips[s.name]['armor_effect'] }</p><br/></div>
                      ) : ( <noscript/> ) }
                      { 'armor_effect_sting' in allEquips[s.name] && allEquips[s.name]['armor_effect_sting'] !== "" ? (
                        <div><p>穿刺防御：{ allEquips[s.name]['armor_effect_sting'] }</p><br/></div>
                      ) : ( <noscript/> ) }
                      { 'armor_effect_slash' in allEquips[s.name] && allEquips[s.name]['armor_effect_slash'] !== "" ? (
                        <div><p>挥砍防御：{ allEquips[s.name]['armor_effect_slash'] }</p><br/></div>
                      ) : ( <noscript/> ) }
                      { 'armor_effect_blunt' in allEquips[s.name] && allEquips[s.name]['armor_effect_blunt'] !== "" ? (
                        <div><p>钝击防御：{ allEquips[s.name]['armor_effect_blunt'] }</p><br/></div>
                      ) : ( <noscript/> ) }
                      { 'armor_block_active' in allEquips[s.name] && allEquips[s.name]['armor_block_active'] !== "" ? (
                        <div><p>主动格挡：{ allEquips[s.name]['armor_block_active'] }</p><br/></div>
                      ) : ( <noscript/> ) }
                      { 'armor_block_passive' in allEquips[s.name] && allEquips[s.name]['armor_block_passive'] !== "" ? (
                        <div><p>被动格挡：{ allEquips[s.name]['armor_block_passive'] }</p><br/></div>
                      ) : ( <noscript/> ) }
                      { 'armor_dexterity' in allEquips[s.name] && allEquips[s.name]['armor_dexterity'] !== "" ? (
                        <div><p>防具灵活：{ allEquips[s.name]['armor_dexterity'] }</p><br/></div>
                      ) : ( <noscript/> ) }
                      { 'armor_requirement' in allEquips[s.name] && allEquips[s.name]['armor_requirement'] !== "" ? (
                        <div><p>防具需求：{ allEquips[s.name]['armor_requirement'] }</p><br/></div>
                      ) : ( <noscript/> ) }
                      { 'armor_special' in allEquips[s.name] && allEquips[s.name]['armor_special'] !== "" ? (
                        <div><p>防具特殊：{ allEquips[s.name]['armor_special'] }</p><br/></div>
                      ) : ( <noscript/> ) }
                      { 'strength' in allEquips[s.name] && allEquips[s.name]['strength'] !== "" ? (
                        <div><p>强度：{ allEquips[s.name]['strength'] }</p><br/></div>
                      ) : ( <noscript/> ) }
                    </div>
                  ) : ( <div>NOT FOUND</div> )}
                </div>
              } title={ s.name }>
                <a href="javascript:void(0);">
                  <div style={{display:"inline-block",margin:5,width:160,fontSize:"small"}}>
                    <span><span>{ s.name }</span><span style={{color:"#696969",marginRight:15}}>{ " 数量:" + s.amount + " " }</span></span>
                  </div>
                </a>
              </Popover>
            ) }</p>
            <br/>
          </div>
        ) : ( <noscript/> )}
        { items !== "" ? (
          <div>
            <p style={{fontWeight:"bold"}}>道具：</p>
            <p>{ this._parseItems(items).map((s, i) => <span><span>{ s.name + " 数量：" }</span><span style={{color:"red",marginRight:15}}>{ s.amount + " " }</span></span>) }</p>
            <br/>
          </div>
        ) : ( <noscript/> )}
        { originalObjs !== "" ? (
          <div>
            <p style={{fontWeight:"bold"}}>原创物品：</p>
            { this._parseOriginalObjs(originalObjs).map((s, i) =>
            <p>
              <span>{ s.name + " 重量：" }</span>
              <span style={{color:"red"}}>{ s.weight }</span>
              <span> 价格：</span>
              <span style={{color:"red",marginRight:15}}>{ s.displayPrice }</span>
            </p>) }
            <br/>
          </div>
        ) : ( <noscript/> )}
        <p>
          <span>HP（生命值）=</span><span style={{color:"red"}}>{ HP }</span>
          <span> </span>
          <span style={{marginLeft:20}}>MP（魔法值）=</span><span style={{color:"red"}}>{ MP }</span>
          <span> </span>
          <span style={{marginLeft:20}}>COV（恢复力）=</span><span style={{color:"red"}}>{ COV }</span>
        </p>
        <p>
          <span><a href="http://willproject.cn/page/TRPG-AP">AP（行动数）</a>=</span><span style={{color:"red"}}>{ AP }</span>
          <span> </span>
          <span style={{marginLeft:20}}><a href="http://willproject.cn/page/TRPG-AD">AD（行动骰）</a>=</span><span style={{color:"red"}}>{ AD }</span>
        </p>
        <p>
          <span><a href="http://willproject.cn/page/TRPG-幸运点">LUCK（幸运点）</a>=</span><span style={{color:"red"}}>{ LUCK }</span>
          <span> </span>
          <span style={{marginLeft:20}}><a href="http://willproject.cn/page/TRPG-意志点">WILL（意志点）</a>=</span><span style={{color:"red"}}>{ WILL }</span>
        </p>
        <p>
          <span>SPEED（速度）=</span><span style={{color:"red"}}>{ SPEED }</span>
          <span> </span>
          <span style={{marginLeft:20}}>LOAD（负重）=</span><span style={{color:"red"}}>{ LOAD }</span>
        </p>
        <p>
          <span>总金额：</span>
          <span style={{color:"red"}}>{ this._getPriceDescription(priceSum) }</span>
          <span> </span>
          <span style={{marginLeft:20}}>总负重：</span>
          <span style={{color:"red"}}>{ Data.mustFloat(weightSum, 0.0, 2) }</span>
          <span>KG</span>
        </p>
        <br/>
      </div>
    );
  }
}

export default Card;