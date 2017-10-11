import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import { Modal, Button } from 'antd';
import Card from '../components/Card.react';
import CardService from '../services/Card';
import { getTimeString } from '../utils/Time';
import './../../css/add-page.less';

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
      modalVisible: false,
      confirmLoading: false,
      modalMsg: ""
    };
    this._init();
  }

  _init() {
    CardService.getCard(DATA.CARD_ID, (status, data) => {
      if (status) {
        this.setState({
          msg: "",
          data: data,
          initialized: true
        });
        browserHistory.replace("/character/" + DATA.CARD_ID + "/" + this.state.data.data.name);
      }
      else {
        this.setState({
          msg: "CHARACTER NOT FOUND"
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
          { this.state.modalMsg != "" ? ( <p style={{color:"red"}}>{ this.state.modalMsg }</p> ) : ( <noscript/> ) }
        </Modal>
      );
    }
    return (
      <div style={{margin:10}}>
        { DATA.CARD_ID[0] == 'p' ? (
          <Button style={{float:wp.base.BROWSER_TYPE?"none":"right",margin:10}} onClick={ this._setModalVisible(true).bind(this) }>公开人物</Button>
        ) : ( <noscript/> ) }
        <a href={ DATA.HOST + '/edit/' + DATA.CARD_ID }>
          <Button style={{float:wp.base.BROWSER_TYPE?"none":"right",margin:10}}>编辑人物</Button>
        </a>
        <a href={ DATA.HOST + '/setimg/' + DATA.CARD_ID }>
          <Button style={{float:wp.base.BROWSER_TYPE?"none":"right",margin:10}}>设置图片</Button>
        </a>
        <div style={{float:wp.base.BROWSER_TYPE?"none":"right",width:"100%",height:1}}></div>
        { ((this.state.data.imgpath != "") && (this.state.data.imgpath != "http://www.willproject.cn/static/img/default-character-cover.png")) ? (
          <img style={{float:wp.base.BROWSER_TYPE?"none":"right",margin:10}} width="80px" height="80px" src={ this.state.data.imgpath }/>
        ) : ( <noscript/> )}
        <div style={{float:wp.base.BROWSER_TYPE?"none":"right",width:"100%",height:1}}></div>
        { this.state.data.imgpath_large != "" ? (
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
          appear       = { this.state.data.data.appear }
          story        = { this.state.data.data.story }
          addition     = { this.state.data.data.addition }
          race         = { this.state.data.data.race }
          xp           = { this.state.data.data.xp }
          xpCost       = { this.state.data.data.xpCost }
          radio        = { this.state.data.data.radio }
          pint         = { this.state.data.data.pint }
          pstr         = { this.state.data.data.pstr }
          pagi         = { this.state.data.data.pagi }
          pvit         = { this.state.data.data.pvit }
          pcrm         = { this.state.data.data.pcrm }
          pcal         = { this.state.data.data.pcal }
          ppow         = { this.state.data.data.ppow }
          pdex         = { this.state.data.data.pdex }
          pfor         = { this.state.data.data.pfor }
          pcon         = { this.state.data.data.pcon }
          professions  = { this.state.data.data.professions }
          abilities    = { this.state.data.data.abilities }
          skills       = { this.state.data.data.skills }
          equips       = { this.state.data.data.equips }
          items        = { this.state.data.data.items }
          priceSum     = { this.state.data.data.priceSum }
          weightSum    = { this.state.data.data.weightSum }
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
