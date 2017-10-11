import React, { Component } from 'react';
import { Button } from 'antd';
import Upload from '../services/Upload';
import './../../css/upload-img.less';

/**
 * @Author: Golion
 */
class UploadImgPage extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      msg: "",
      errorMsg: "",
      loading: false,
      fileUrl: "",
      fileData: ""
    };
  }
  
  _changeImg(evt) {
    let file = evt.target.files||evt.dataTransfer.files;
    let _this = this;
    if (file[0]) {
      const type = file[0].type;
      if ((type == 'image/jpeg')||(type == 'image/gif')||(type == 'image/png')) {
        var reader = new FileReader();
        reader.onload = function() {
          _this.setState({
            fileUrl: this.result,
            fileData: file[0]
          });
        };
        reader.readAsDataURL(file[0]);
      }
      else {
        _this.setState({
          msg: "",
          errorMsg: "INVALID FORMAT"
        });
      }
    }
  }

  _upload() {
    let _this = this;
    this.setState({
      loading: true
    });
    Upload.uploadImg(this.state.fileData.name, this.state.fileData, (status, filePath) => {
      _this.setState({
        loading: false
      });
      if (status) {
        _this.setState({
          msg: "图片地址：" + filePath,
          errorMsg: "上传成功！"
        });
      }
    });
  }

  render() {
    return (
      <div>
        <p style={{fontSize:"small"}}>严禁非原创或未授权图片</p>
        <div className="upload-img-wrap" style={{width:wp.base.DOC_WIDTH/2,height:wp.base.DOC_WIDTH/3,marginTop:30}}>
          <div style={{position:"relative"}}>
            <a href="javascript:void(0)">
              <input
                className="upload-img-input"
                style={{width:wp.base.DOC_WIDTH/2,height:wp.base.DOC_WIDTH/3}}
                type="file" accept="image/jpeg,image/png,image/gif"
                onChange={ this._changeImg.bind(this) }
              />
            </a>
            <div style={{display:"table",position:"absolute",width:wp.base.DOC_WIDTH/2,height:wp.base.DOC_WIDTH/3}}>
              <span style={{verticalAlign:"middle",display:"table-cell"}}>
                { this.state.fileUrl != "" ? (
                  <img style={{margin:0,maxWidth:wp.base.DOC_WIDTH/2,maxHeight:wp.base.DOC_WIDTH/3}} src={ this.state.fileUrl }/>
                ) : (
                  <p style={{margin:0,padding:0}}>上传图片</p>
                )}
              </span>
            </div>
          </div>
        </div>
        { this.state.fileUrl != "" ? (
          <Button style={{margin:20}} type="primary" onClick={ this._upload.bind(this) } loading={ this.state.loading }>上传</Button>
        ) : ( <noscript/> )}
        { this.state.errorMsg != "" ? ( <p style={{color:"red"}}>{ this.state.errorMsg }</p> ):( <noscript/> )}
        { this.state.msg != "" ? ( <p>{ this.state.msg }</p> ):( <noscript/> )}
      </div>
    );
  }

}

export default UploadImgPage;
