import React, { Component } from 'react';
import { Input } from 'antd';
import Data from '../services/Data';

/**
 * @Author: Golion
 */
class AddPage extends Component {

  render() {
    const inputStyle = {
      width: wp.base.BROWSER_TYPE ? wp.base.DOC_WIDTH - 60 : wp.base.DOC_WIDTH - 200,
      minWidth: 200,
      height: wp.base.WINDOW_HEIGHT - 480,
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
            value={ Data.getItem("page-content") }
            placeholder=""
            onChange={ this.props.setItem("page-content") }
          />
        </div>
      </div>
    );
  }

}

export default AddPage;
