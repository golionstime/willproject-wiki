import React, { Component } from 'react';
import { Input, Button, Switch } from 'antd';
import Data from '../services/Data';
import Card from '../components/Card.react';
import Build from '../services/Build';
import CardService from '../services/Card';
import Wiki from "../services/Wiki";

/**
 * @Author: Golion
 */
class PrinterPage extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      initialized: false,
      html: {
        appear: "",
        story: "",
        addition: ""
      },
      loading: false,
      creator: Data.getItem("creator"),
      imgPath: "http://www.willproject.cn/static/img/default-character-cover.png",
      isPublic: true,
      msg: ""
    };
    Wiki.convertPageDataToHtml(Data.getItem("appear"), (appearHtmlData) => {
      Wiki.convertPageDataToHtml(Data.getItem("story"), (storyHtmlData) => {
        Wiki.convertPageDataToHtml(Data.getItem("addition"), (additionHtmlData) => {
          this.setState({
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
  }

  _setCreator(evt) {
    Data.setItem("creator", evt.target.value);
    this.setState({
      msg: "",
      creator: evt.target.value
    });
  }

  _setImgPath(evt) {
    this.setState({
      msg: "",
      imgPath: evt.target.value
    });
  }

  _onChangePublicSwitch(checked) {
    this.setState({
      isPublic: checked
    });
  }

  _upload() {
    if (this.state.creator === "") {
      this.setState({
        msg: "请输入创作者的名字"
      });
    }
    else {
      this.setState({
        msg: "",
        loading: true
      });
      CardService.add(this.state.creator, this.state.imgPath, this.state.isPublic, Build.toJsonObj(), (status, cardId) => {
        if (status) {
          this.setState({
            msg: "上传成功",
            loading: false
          });
          setTimeout(() => {
            window.location.href = DATA.HOST + '/character/' + cardId
          }, 1000);
        }
        else {
          this.setState({
            msg: "上传失败",
            loading: false
          });
        }
      });
    }
  }

  render() {
    return (
      <div style={{margin:10}}>
        <Card
          creator      = { "" }
          name         = { Data.getItem("name") }
          introduction = { Data.getItem("introduction") }
          gender       = { Data.getItem("gender") }
          age          = { Data.getItem("age") }
          height       = { Data.getItem("height") }
          weight       = { Data.getItem("weight") }
          skin         = { Data.getItem("skin") }
          hair         = { Data.getItem("hair") }
          eye          = { Data.getItem("eye") }
          hand         = { Data.getItem("hand") }
          appear       = { this.state.html.appear }
          story        = { this.state.html.story }
          addition     = { this.state.html.addition }
          race         = { Data.getItem("race-list-select") }
          xp           = { Data.getItem("params-xp") }
          xpCost       = { Data.getItem("final-xp-cost") }
          radio        = { Data.getItem("params-radio") }
          pint         = { Data.getItem("params-int") }
          pstr         = { Data.getItem("params-str") }
          pagi         = { Data.getItem("params-agi") }
          pvit         = { Data.getItem("params-vit") }
          pcrm         = { Data.getItem("params-crm") }
          pcal         = { Data.getItem("params-cal") }
          ppow         = { Data.getItem("params-pow") }
          pdex         = { Data.getItem("params-dex") }
          pfor         = { Data.getItem("params-for") }
          pcon         = { Data.getItem("params-con") }
          professions  = { Data.getItem("final-professions") }
          abilities    = { Data.getItem("final-abilities") }
          skills       = { Data.getItem("final-skills") }
          equips       = { Data.getItem("final-equips") }
          items        = { Data.getItem("final-items") }
          originalObjs = { Data.getItem("original-objs") }
          priceSum     = { Data.getItem("price-sum") }
          weightSum    = { Data.getItem("weight-sum") }
        />
        <div style={{margin:"10px 0"}}>
          <hr/>
        </div>
        <div style={{margin:"10px 0"}}>
          <span>图片：</span>
          <Input style={{width:400,marginRight:20}} value={ this.state.imgPath } placeholder="图片地址，推荐大小80x80" onChange={ this._setImgPath.bind(this) }/>
          <img style={{verticalAlign:"bottom"}} width="30px" height="30px" src={ this.state.imgPath }/>
        </div>
        <div style={{margin:"10px 0"}}>
          <span>创作者：</span>
          <Input style={{width:120,marginRight:20}} value={ this.state.creator } placeholder="姓名" onChange={ this._setCreator.bind(this) }/>
          <Button type="primary" onClick={ this._upload.bind(this) } loading={ this.state.loading }>上传卡片至服务器</Button>
        </div>
        <div style={{margin:"10px 0"}}>
          <Switch size="small" checked={ this.state.isPublic } onChange={ this._onChangePublicSwitch.bind(this) }/>
          { this.state.isPublic ? (
            <span style={{marginLeft:5,fontSize:"small"}}>公开</span>
          ): (
            <span style={{marginLeft:5,fontSize:"small"}}>私有</span>
          )}
        </div>
        { this.state.msg !== "" ? (
          <p style={{color:"red"}}>{ this.state.msg }</p>
        ) : (
          <noscript/>
        )}
        { this.state.isPublic ? (
          <p style={{fontSize:"small"}}>上传后，这张卡将会出现在Wiki的<a target="_blank" href="/characters">人物</a>页面</p>
        ): (
          <p style={{fontSize:"small",color:"red"}}>这张卡片不会公开，请务必记下这张卡片的URL</p>
        )}
      </div>
    );
  }

}

export default PrinterPage;
