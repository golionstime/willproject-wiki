import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import { Button } from 'antd';
import CardService from '../services/Card';
import CardSmall from '../components/CardSmall.react';
import { initDotdotdot } from '../utils/jQuery.dotdotdot';

/**
 * @Author: Golion
 */
class CharactersPage extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      msg: "",
      errorMsg: "",
      initialized: false,
      total: 0,
      data: [],
      page: (typeof(DATA.CHARACTERSPAGE) == "undefined") ? 1 : parseInt(DATA.CHARACTERSPAGE),
      pageSize: 18
    };
    this._init();
  }

  componentDidMount() {
    initDotdotdot();
  }

  componentDidUpdate() {
    initDotdotdot();
  }

  _init() {
    let _this = this;
    CardService.getCards(this.state.page, this.state.pageSize, (status, total, data) => {
      if (status) {
        _this.setState({
          msg: "",
          errorMsg: "",
          total: total,
          data: data,
          initialized: true
        });
      }
      else {
        _this.setState({
          msg: "",
          errorMsg: "无法加载人物列表，请刷新页面"
        });
      }
    });
  }

  _goPage(isNext = true) {
    return () => {
      let currentPage = this.state.page;
      let nextPage = isNext ? ( currentPage + 1 ) : ( currentPage - 1 );
      this.setState({
        msg: "Loading...",
        errorMsg: "",
        page: nextPage
      });
      let _this = this;
      browserHistory.replace("/characters/" + nextPage);
      CardService.getCards(nextPage, this.state.pageSize, (status, total, data) => {
        if (status) {
          this.setState({
            msg: "",
            errorMsg: "",
            total: total,
            data: data
          });
        }
        else {
          this.setState({
            msg: "",
            errorMsg: "无法加载人物列表，请刷新页面"
          });
        }
      });
    }
  }

  render() {
    if (!this.state.initialized) return <p>Loading...</p>;
    if (this.state.msg != "") return <p>{ this.state.msg }</p>;
    if (this.state.errorMsg != "") return <p style={{color:"red"}}>{ this.state.errorMsg }</p>;
    let docWidth = wp.base.DOC_WIDTH - 80;
    let cellWidth = ((docWidth < 800) ? (docWidth / 3) : (docWidth / 6));
    let cardList = [];
    for (let i=0; i<this.state.data.length; i++) {
      let _card = this.state.data[i];
      cardList.push(
        <CardSmall
          width = { cellWidth }
          title = { _card.description }
          img   = { _card.img_path }
          link  = { DATA.HOST + '/character/' + _card.id }
        />
      );
    }
    let hasPrevious = this.state.page > 1;
    let hasNext = this.state.page * this.state.pageSize < this.state.total;
    let pagination = (
      <div>
        { hasPrevious || hasNext ? (
          <div style={{margin:20}}>
            { hasPrevious ? (
              <Button onClick={ this._goPage(false).bind(this) }>上一页</Button>
            ) : ( <noscript/> ) }
            { hasPrevious && hasNext ? ( <span style={{margin:"0 10px"}}></span> ) : ( <noscript/> ) }
            { hasNext ? (
              <Button onClick={ this._goPage(true).bind(this) }>下一页</Button>
            ) : ( <noscript/> ) }
          </div>
        ) : ( <noscript/> ) }
      </div>
    );
    return (
      <div style={{width:docWidth,margin:"0 auto"}}>
        { pagination }
        { cardList }
        <div style={{clear:"both"}}></div>
        { pagination }
      </div>
    );
  }
}

export default CharactersPage;
