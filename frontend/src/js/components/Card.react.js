import React, { Component } from 'react';

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
    const { combatSkills, magicSkills } = this.props;
    let HP = 0;
    let MP = 0;
    HP = 30 + parseInt(pvit) * 3;
    MP = 15 + parseInt(pint) * 2 + parseInt(pcon) * 2;
    this._parseAbilities(abilities).map((s, i) => {
      if (s.name === "魔法知识能力") MP += 2;
    });
    this._parseSkills(skills).map((s, i) => {
      if (combatSkills.hasOwnProperty(s.name)) HP += 1;
      if (magicSkills.hasOwnProperty(s.name)) MP += 1;
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
        <p>{ "智力：" + pint + " 力量：" + pstr + " 灵巧：" + pagi + " 体魄：" + pvit + " 仪态" + pcrm }</p>
        <p>{ "沉着：" + pcal + " 气势：" + ppow + " 敏锐：" + pdex + " 坚毅：" + pfor + " 操控" + pcon }</p>
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
            <p>{ this._parseSkills(skills).map((s, i) => <span style={{marginRight:15}}>{ s.name + " " }</span>) }</p>
            <br/>
          </div>
        ) : ( <noscript/> )}
        { equips !== "" ? (
          <div>
            <p style={{fontWeight:"bold"}}>装备：</p>
            <p>{ this._parseEquips(equips).map((s, i) => <span><span>{ s.name + " 数量：" }</span><span style={{color:"red",marginRight:15}}>{ s.amount + " " }</span></span>) }</p>
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
          <span>HP=</span><span style={{color:"red"}}>{ HP }</span>
          <span> </span>
          <span>MP=</span><span style={{color:"red"}}>{ MP }</span>
        </p>
        <p>
          <span>总金额：</span>
          <span style={{color:"red"}}>{ this._getPriceDescription(priceSum) }</span>
          <span> </span>
          <span style={{marginLeft:20}}>总负重：</span>
          <span style={{color:"red"}}>{ weightSum }</span>
          <span>KG</span>
        </p>
        <br/>
      </div>
    );
  }
}

export default Card;