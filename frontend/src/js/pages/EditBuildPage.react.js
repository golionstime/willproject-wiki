import React, { Component } from 'react';
import { Input, Button } from 'antd';
import Data from '../services/Data';
import './../../css/add-page.less';

/**
 * @Author: Golion
 */
class EditBuildPage extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      initialized: false,
      refresh: false,
      loading: false,
      submitStatus: 0,
      data: '',
    };
    console.log("DATA.CONFNAME=" + DATA.CONFNAME);
    let _this = this;
    Data.getBuildConfFromServer(DATA.CONFNAME, (status, data) => {
      _this.setState({
        initialized: status,
        data: JSON.stringify(data, null, 2)
      });
    });
  }

  _onChange(evt) {
    this.setState({
      refresh: true,
      data: evt.target.value
    });
  }

  _submit() {
    this.setState({
      refresh: true,
      loading: true,
    });
    Data.setBuildConfToServer(DATA.CONFNAME, this.state.data, (status) => {
      this.setState({
        refresh: true,
        loading: false,
        submitStatus: status ? 1 : 2,
      });
    });
  }

  render() {
    if (!this.state.initialized) {
      return ( <div>Loading...</div> );
    }
    const inputStyle = {
      width: wp.base.BROWSER_TYPE ? wp.base.DOC_WIDTH - 60 : wp.base.DOC_WIDTH - 200,
      minWidth: 200,
      height: wp.base.WINDOW_HEIGHT - 120,
      minHeight: 300,
      margin: 10,
      verticalAlign: "top"
    };
    return (
      <div>
        <div>
          <Input
            type="textarea"
            style={ inputStyle }
            value={ this.state.data }
            placeholder=""
            onChange={ this._onChange.bind(this) }
          />
        </div>
        <p>
          <Button type="primary" loading={ this.state.loading } style={{margin:10}} onClick={ this._submit.bind(this) }>提交</Button>
        </p>
        { this.state.submitStatus === 1 ? ( <p>提交成功！</p>) : ( <noscript/> ) }
        { this.state.submitStatus === 2 ? ( <p>提交失败！</p>) : ( <noscript/> ) }
      </div>
    );
  }

}

export default EditBuildPage;
