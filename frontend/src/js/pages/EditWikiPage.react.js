import React, { Component } from 'react';
import { Input, Button, Icon, Modal } from 'antd';
import Data from '../services/Data';
import Wiki from '../services/Wiki';
import AddPage from '../components/AddPage.react';
import './../../css/add-page.less';

/**
 * @Author: Golion
 */
class EditWikiPage extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      msg: "",
      errorMsg: "",
      modalMsg: "预览",
      loading: false,
      confirmLoading: false,
      refresh: false,
      modalVisible: false,
      modalInnerHtmlData: "",
      initialized: false
    };
    if (typeof(DATA.PAGE) == "undefined") {
      window.location.href = "/404";
    }
    Data.storage = false;
    Data.prefix = "editpage-" + DATA.PAGE;
    Data.setItem("page-name", decodeURIComponent(DATA.PAGE));
    this._init.bind(this)();
  }

  _init() {
    let _this = this;
    Wiki.getPage(Data.getItem("page-name"), (status, data) => {
      Data.setItem("page-creator", data.creator);
      Data.setItem("page-img-path", data.imgPath);
      Data.setItem("page-content", data.pageData);
      _this.setState({
        initialized: true
      });
    });
  }

  _clearData() {
    Data.removeItem("page-name");
    Data.removeItem("page-creator");
    Data.removeItem("page-img-path");
    Data.removeItem("page-content");
  }

  _setItem(itemName) {
    return (evt) => {
      Data.setItem(itemName, evt.target.value);
      this.setState({
        refresh: true,
        msg: "",
        errorMsg: ""
      });
    }
  }

  _previewPage() {
    if ((Data.prefix = "addbrandnewpage") && (Data.getItem("page-name") == "")) {
      this.setState({
        errorMsg: "请输入页面名称",
        msg: ""
      });
      return;
    }
    if (Data.getItem("page-content") == "") {
      this.setState({
        errorMsg: "请填写页面内容",
        msg: ""
      });
      return;
    }
    if (Data.getItem("page-creator") == "") {
      this.setState({
        errorMsg: "请填写作者",
        msg: ""
      });
      return;
    }
    let _this = this;
    _this.setState({
      loading: true,
      msg: "",
      errorMsg: ""
    });
    Wiki.convertPageDataToHtml(Data.getItem("page-content"), (htmlData) => {
      _this.setState({
        loading: false
      });
      if (htmlData === false) {
        _this.setState({
          errorMsg: "ERROR!",
          msg: ""
        });
      }
      else {
        _this.setState({
          modalVisible: true,
          modalInnerHtmlData: htmlData,
          msg: "",
          errorMsg: ""
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

  _release() {
    this.setState({
      confirmLoading: true,
      msg: "",
      errorMsg: "",
      modalMsg: "预览"
    });
    let _this = this;
    Wiki.updatePage(Data.getItem("page-name"), Data.getItem("page-creator"), Data.getItem("page-img-path"), Data.getItem("page-content"), (status) => {
      if (status == "locked") {
        _this.setState({
          confirmLoading: false,
          msg: "",
          errorMsg: "本页面已锁定，不允许编辑，请联系管理员",
          modalMsg: "",
          modalVisible: false
        });
      }
      else if (status) {
        _this.setState({
          confirmLoading: false,
          msg: "",
          errorMsg: "",
          modalMsg: "创建Wiki页面成功！"
        });
        this._clearData();
        setTimeout(() => {
          window.location.href = DATA.HOST + "/page/" + Data.getItem("page-name");
        }, 1000);
      }
      else {
        _this.setState({
          confirmLoading: false,
          msg: "",
          errorMsg: "",
          modalMsg: "创建Wiki页面失败！"
        });
      }
    });
  }

  render() {

    if (!this.state.initialized) return <p>Loading...</p>;

    let inputWidth = wp.base.BROWSER_TYPE ? wp.base.DOC_WIDTH - 60 : 300;

    let modal = <noscript/>;
    if (this.state.modalVisible) {
      modal = (
        <Modal
          title={ this.state.modalMsg }
          width={ wp.base.DOC_WIDTH - 40 }
          wrapClassName="vertical-center-modal"
          visible={ true }
          onOk={ this._release.bind(this) }
          onCancel={ this._setModalVisible(false).bind(this) }
          okText="确定发布"
          cancelText="继续编辑"
          confirmLoading={ this.state.confirmLoading }
        >
          <div
            style={{width:"100%",maxHeight:wp.base.WINDOW_HEIGHT-200,overflowY:"auto"}}
            dangerouslySetInnerHTML={{__html: this.state.modalInnerHtmlData }}>
          </div>
        </Modal>
      );
    }

    return (
      <div>
        <div>
          <a href={ "/page/" + Data.getItem("page-name") } title="回到页面"><Icon type="left" style={{float:wp.base.BROWSER_TYPE?"none":"left",margin:10}}/></a>
          <a href="/page/编辑指南" target="_blank" title="编辑指南"><Icon type="question-circle-o" style={{float:wp.base.BROWSER_TYPE?"none":"right",margin:10}}/></a>
          <a href="/uploadimg" target="_blank" title="上传图片"><Icon type="upload" style={{float:wp.base.BROWSER_TYPE?"none":"right",margin:10}}/></a>
          <div style={{clear:"both"}}></div>
        </div>
        <p>
            <span>
              编辑页面：
            </span>
            <span style={{color:"red"}}>
              { Data.getItem("page-name") }
            </span>
        </p>
        <div>
          <AddPage setItem={ this._setItem.bind(this) }/>
          <p>
            <span>页面配图地址：</span>
            <Input style={{width:inputWidth,margin:10}} value={ Data.getItem("page-img-path") } placeholder="页面配图地址" onChange={ this._setItem("page-img-path") }/>
          </p>
          <p>
            <span>作者（必填）：</span>
            <Input style={{width:inputWidth,margin:10}} value={ Data.getItem("page-creator") } placeholder="作者（必填）" onChange={ this._setItem("page-creator") }/>
          </p>
          { this.state.errorMsg !== "" ? ( <p style={{color:"red"}}>{ this.state.errorMsg }</p> ):( <noscript/> )}
          { this.state.msg !== "" ? ( <p>{ this.state.msg }</p> ):( <noscript/> )}
          <Button type="primary" loading={ this.state.loading } style={{margin:10}} onClick={ this._previewPage.bind(this) }>预览页面</Button>
          { modal }
        </div>
      </div>
    );
  }

}

export default EditWikiPage;
