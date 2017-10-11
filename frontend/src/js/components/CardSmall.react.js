import React, { Component } from 'react';
import './../../css/card-small.less';

/**
 * @Author: Golion
 */
class CardSmall extends Component {

  render() {
    const { width, title, img, link } = this.props;
    let imgSize = (width - 20 > 80) ? 80 : width - 20;
    return (
      <a href={ link } target="_blank" title={ title }>
        <div className="card-small-wrap" style={{width:width}}>
          <div>
            <img width={ imgSize } height={ imgSize } src={ img }/>
          </div>
          <div className="dot-ellipsis dot-height-40" style={{height:40, margin:"10px 0"}}>
            <p style={{fontSize:"small"}}>{ title }</p>
          </div>
        </div>
      </a>
    );
  }
}

export default CardSmall;
