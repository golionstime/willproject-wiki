import React, { Component } from 'react';
import { Input, Button } from 'antd';
import CardService from '../services/Card';

/**
 * @Author: Golion
 */
class SetImgPage extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      msg: "",
      errorMsg: "",
      loading: false,
      imgPath: "",
      imgPathLarge: ""
    };
  }

  _changeImg(evt) {
    this.setState({
      imgPath: evt.target.value
    });
  }

  _changeImgLarge(evt) {
    this.setState({
      imgPathLarge: evt.target.value
    });
  }

  _updateImg() {
    let _this = this;
    this.setState({
      loading: true
    });
    if (this.state.imgPath == "") {
      this.setState({
        msg: "",
        errorMsg: "请填写小图的图片地址！"
      });
      return;
    }
    CardService.updateImg(DATA.CARD_ID, this.state.imgPath, (status) => {
      _this.setState({
        loading: false
      });
      if (status) {
        _this.setState({
          msg: "设置小图成功！",
          errorMsg: ""
        });
      }
      else {
        _this.setState({
          msg: "",
          errorMsg: "设置小图失败！"
        });
      }
    });
  }

  _updateImgLarge() {
    let _this = this;
    this.setState({
      loading: true
    });
    if (this.state.imgPathLarge == "") {
      this.setState({
        msg: "",
        errorMsg: "请填写大图的图片地址！"
      });
      return;
    }
    CardService.updateImgLarge(DATA.CARD_ID, this.state.imgPathLarge, (status) => {
      _this.setState({
        loading: false
      });
      if (status) {
        _this.setState({
          msg: "设置大图成功！",
          errorMsg: ""
        });
      }
      else {
        _this.setState({
          msg: "",
          errorMsg: "设置大图失败！"
        });
      }
    });
  }

  render() {
    let inputWidth = Math.min(400, wp.base.DOC_WIDTH - 60);
    let buttonWidth = wp.base.BROWSER_TYPE ? inputWidth : "auto";
    return (
      <div>
        <p>设置人物图片，你需要先<a href="/uploadimg" target="_blank">上传图片</a></p>
        <div style={{margin:"20px 0"}}>
          <span>小图：</span>
          <Input style={{width:inputWidth,margin:5}} value={ this.state.imgPath } placeholder="图片地址，推荐大小80x80" onChange={ this._changeImg.bind(this) }/>
          <div className="mobile-clear-both"></div>
          { this.state.imgPath != "" ? (
            <img style={{verticalAlign:"bottom",margin:5}} width="30px" height="30px" src={ this.state.imgPath }/>
          ) : ( <noscript/> ) }
          <div className="mobile-clear-both"></div>
          <Button style={{width:buttonWidth,margin:5}} type="primary" onClick={ this._updateImg.bind(this) }>设置小图</Button>
          <div className="mobile-clear-both"></div>
        </div>
        <div style={{margin:"20px 0"}}>
          <span>大图：</span>
          <Input style={{width:inputWidth,margin:5}} value={ this.state.imgPathLarge } placeholder="图片地址，推荐大小320x480" onChange={ this._changeImgLarge.bind(this) }/>
          <div className="mobile-clear-both"></div>
          { this.state.imgPathLarge != "" ? (
            <img style={{verticalAlign:"bottom",margin:5}} width="30px" height="30px" src={ this.state.imgPathLarge }/>
          ) : ( <noscript/> ) }
          <div className="mobile-clear-both"></div>
          <Button style={{width:buttonWidth,margin:5}} type="primary" onClick={ this._updateImgLarge.bind(this) }>设置大图</Button>
          <div className="mobile-clear-both"></div>
        </div>
        <div style={{margin:"10px 0"}}>
          <hr/>
        </div>
        { this.state.msg != "" ? (
          <p>{ this.state.msg }</p>
        ) : (
          <noscript/>
        )}
        { this.state.errorMsg != "" ? (
          <p style={{color:"red"}}>{ this.state.errorMsg }</p>
        ) : (
          <noscript/>
        )}
        <p>
          <a href={ DATA.HOST + '/character/' + DATA.CARD_ID }>
            <Button>回到人物</Button>
          </a>
        </p>
      </div>
    );
  }

}

export default SetImgPage;
