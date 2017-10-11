import React, { Component } from 'react';

/**
 * @Author: Golion
 */
class RulePage extends Component {

  render() {
    const { initialized, data } = this.props;
    let pageContent = ( <p>Loading...</p> );
    if (initialized) {
      pageContent = [];
      for (let i=0; i<data.length; i++) {
        pageContent.push(
          <p>{ data[i] }</p>
        );
      }
    }
    return (
      <div className="rule-content-wrap" style={{width:wp.base.BROWSER_TYPE?"100%":wp.base.DOC_WIDTH-300}}>
        { pageContent }
      </div>
    );
  }

}

export default RulePage;
