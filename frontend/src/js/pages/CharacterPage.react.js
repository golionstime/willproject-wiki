import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import { Modal, Button } from 'antd';
import Card from '../components/Card.react';
import CardService from '../services/Card';
import { getTimeString } from '../utils/Time';
import './../../css/add-page.less';
import Wiki from "../services/Wiki";
import Data from "../services/Data";

/**
 * @Author: Golion
 */
class CharacterPage extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      msg: "Loading...",
      initialized: false,
      data: {},
      combatSkills: {},
      magicSkills: {},
      allSKills: {},
      allEquips: {},
      html: {
        appear: "",
        story: "",
        addition: ""
      },
      modalVisible: false,
      confirmLoading: false,
      modalMsg: ""
    };
    this._init();
  }

  _init() {
    let _this = this;
    // 流派
    Data.loadBuildDataFromServer("style", () => {
      if ((typeof (Data.data["style"].length) !== "undefined") && (Data.data["style"].length > 0)) {
        Data.data["style-list"] = [];
        let combatSkills = {}
        let magicSkills = {}
        let allSKills = {}
        for (let i = 0; i < Data.data["style"].length; i++) {
          for (let j = 0; j < Data.data["style"][i].list.length; j++) {
            let skill = Data.data["style"][i].list[j];
            if (skill.type === "combat") {
              combatSkills[skill.name] = true;
            } else if (skill.type === "magic") {
              magicSkills[skill.name] = true;
            }
            allSKills[skill.name] = skill;
          }
        }
        // 装备
        Data.loadBuildDataFromServer("equip", () => {
          if ((typeof (Data.data["equip"].length) !== "undefined") && (Data.data["equip"].length > 0)) {
            Data.data["equip-class-list"] = [];
            let allEquips = {}
            for (let i = 0; i < Data.data["equip"].length; i++) {
              for (let j = 0; j < Data.data["equip"][i].list.length; j++) {
                let equip = Data.data["equip"][i].list[j];
                allEquips[equip.name] = equip;
              }
            }
            // 人物
            CardService.getCard(DATA.CARD_ID, (status, data) => {
              if (status) {
                Wiki.convertPageDataToHtml(data.data.appear, (appearHtmlData) => {
                  Wiki.convertPageDataToHtml(data.data.story, (storyHtmlData) => {
                    Wiki.convertPageDataToHtml(data.data.addition, (additionHtmlData) => {
                      _this.setState({
                        msg: "",
                        data: data,
                        combatSkills: combatSkills,
                        magicSkills: magicSkills,
                        allSKills: allSKills,
                        allEquips: allEquips,
                        html: {
                          appear: appearHtmlData,
                          story: storyHtmlData,
                          addition: additionHtmlData
                        },
                        initialized: true
                      });
                    });
                  });
                });
                browserHistory.replace("/character/" + DATA.CARD_ID + "/" + data.data.name);
              } else {
                _this.setState({
                  msg: "CHARACTER NOT FOUND"
                });
              }
            });
          } else {
            _this.setState({
              msg: "LOAD CONF[EQUIP] FAILED"
            });
          }
        });
      } else {
        _this.setState({
          msg: "LOAD CONF[STYLE] FAILED"
        });
      }
    });
  }

  _setModalVisible(visible) {
    return () => {
      this.setState({
        modalVisible: visible
      });
    }
  }

  _mustInt(data) {
    if (typeof(data) === "undefined") {
      return 0
    } else {
      return parseInt(data)
    }
  }

  _mustStr(data) {
    if (typeof(data) === "undefined") {
      return ""
    } else {
      return data
    }
  }

  _makePublic() {
    let _this = this;
    CardService.makePublic(DATA.CARD_ID, (status) => {
      if (status) {
        _this.setState({
          modalMsg: "成功！",
          confirmLoading: false
        });
        setTimeout(() => {
          let newCardId = DATA.CARD_ID.split('-')[1];
          window.location.href = DATA.HOST + '/character/' + newCardId
        }, 1000);
      }
      else {
        _this.setState({
          modalMsg: "失败，请重试！",
          confirmLoading: false
        });
      }
    });
  }

  render() {
    if (!this.state.initialized) return <p>{ this.state.msg }</p>;
    let modal = <noscript/>;
    if (this.state.modalVisible) {
      modal = (
        <Modal
          title="是否确认要公开这张卡片"
          width={ Math.min(400, wp.base.DOC_WIDTH - 40) }
          wrapClassName="vertical-center-modal"
          visible={ true }
          onOk={ this._makePublic.bind(this) }
          onCancel={ this._setModalVisible(false).bind(this) }
          okText="确定"
          cancelText="取消"
          confirmLoading={ this.state.confirmLoading }
        >
          <p>公开后，这张卡将会出现在Wiki的<a target="_blank" href="/characters">人物</a>页面</p>
          { this.state.modalMsg !== "" ? ( <p style={{color:"red"}}>{ this.state.modalMsg }</p> ) : ( <noscript/> ) }
        </Modal>
      );
    }
    return (
      <div style={{margin:10}}>
        { DATA.CARD_ID[0] === 'p' ? (
          <Button style={{float:wp.base.BROWSER_TYPE?"none":"right",margin:10}} onClick={ this._setModalVisible(true).bind(this) }>公开人物</Button>
        ) : ( <noscript/> ) }
        <a href={ DATA.HOST + '/edit/' + DATA.CARD_ID }>
          <Button style={{float:wp.base.BROWSER_TYPE?"none":"right",margin:10}}>编辑人物</Button>
        </a>
        <a href={ DATA.HOST + '/setimg/' + DATA.CARD_ID }>
          <Button style={{float:wp.base.BROWSER_TYPE?"none":"right",margin:10}}>设置图片</Button>
        </a>
        <div style={{float:wp.base.BROWSER_TYPE?"none":"right",width:"100%",height:1}}/>
        { ((this.state.data.imgpath !== "") && (this.state.data.imgpath !== "http://www.willproject.cn/static/img/default-character-cover.png")) ? (
          <img style={{float:wp.base.BROWSER_TYPE?"none":"right",margin:10}} width="80px" height="80px" src={ this.state.data.imgpath }/>
        ) : ( <noscript/> )}
        <div style={{float:wp.base.BROWSER_TYPE?"none":"right",width:"100%",height:1}}/>
        { this.state.data.imgpath_large !== "" ? (
          <div style={{float:wp.base.BROWSER_TYPE?"none":"right"}}>
            <img style={{margin:10}} width={ Math.min(wp.base.DOC_WIDTH - 80, 320) } src={ this.state.data.imgpath_large }/>
          </div>
        ) : ( <noscript/> )}
        <Card
          style={{float:"left"}}
          creator      = { this.state.data.creator }
          name         = { this.state.data.data.name }
          introduction = { this.state.data.data.introduction }
          gender       = { this.state.data.data.gender }
          age          = { this.state.data.data.age }
          height       = { this.state.data.data.height }
          weight       = { this.state.data.data.weight }
          skin         = { this.state.data.data.skin }
          hair         = { this.state.data.data.hair }
          eye          = { this.state.data.data.eye }
          hand         = { this.state.data.data.hand }
          appear       = { this.state.html.appear }
          story        = { this.state.html.story }
          addition     = { this.state.html.addition }
          race         = { this.state.data.data.race }
          xp           = { this.state.data.data.xp }
          xpCost       = { this.state.data.data.xpCost }
          radio        = { this.state.data.data.radio }
          pint         = { this._mustInt(this.state.data.data.pint) }
          pstr         = { this._mustInt(this.state.data.data.pstr) }
          pagi         = { this._mustInt(this.state.data.data.pagi) }
          pvit         = { this._mustInt(this.state.data.data.pvit) }
          pcrm         = { this._mustInt(this.state.data.data.pcrm) }
          pcal         = { this._mustInt(this.state.data.data.pcal) }
          ppow         = { this._mustInt(this.state.data.data.ppow) }
          pdex         = { this._mustInt(this.state.data.data.pdex) }
          pfor         = { this._mustInt(this.state.data.data.pfor) }
          pcon         = { this._mustInt(this.state.data.data.pcon) }
          professions  = { this._mustStr(this.state.data.data.professions) }
          abilities    = { this._mustStr(this.state.data.data.abilities) }
          skills       = { this._mustStr(this.state.data.data.skills) }
          equips       = { this._mustStr(this.state.data.data.equips) }
          items        = { this._mustStr(this.state.data.data.items) }
          originalObjs = { this._mustStr(this.state.data.data.originalObjs) }
          priceSum     = { this.state.data.data.priceSum }
          weightSum    = { this.state.data.data.weightSum }
          arbCbtSkl1   = { this._mustStr(this.state.data.data.arbCbtSkl1) }
          arbKlgSkl1   = { this._mustStr(this.state.data.data.arbKlgSkl1) }
          combatSkills = { this.state.combatSkills }
          magicSkills  = { this.state.magicSkills }
          allSKills    = { this.state.allSKills }
          allEquips    = { this.state.allEquips }
        />
        <div style={{fontSize:"small",margin:"10px 0"}}>
          <hr/>
          <p>{ "创建时间：" + getTimeString(this.state.data.ctime * 1000) }</p>
          <p>{ "最后更新时间：" + getTimeString(this.state.data.last_update * 1000) }</p>
        </div>
        { modal }
      </div>
    );
  }

}

export default CharacterPage;
