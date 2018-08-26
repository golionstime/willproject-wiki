import React, { Component } from 'react';
import { Input } from 'antd';
import Data from '../services/Data';

/**
 * @Author: Golion
 * Build Page 1 人物背景
 */
class BuildPage1 extends Component {

  render() {
    let inputWidthSmall = wp.base.BROWSER_TYPE ? ( wp.base.DOC_WIDTH - 60 ) : Math.min(100, wp.base.DOC_WIDTH - 60);
    let inputWidthNormal = wp.base.BROWSER_TYPE ? ( wp.base.DOC_WIDTH - 60 ) : Math.min(300, wp.base.DOC_WIDTH - 60);
    let inputWidthLarge = wp.base.BROWSER_TYPE ? ( wp.base.DOC_WIDTH - 60 ) : Math.max(300, wp.base.DOC_WIDTH - 300);
    return (
      <div>
        <p>
          <span>姓名：</span>
          <Input style={{width:inputWidthNormal,margin:10}} value={ Data.getItem("name") } placeholder="姓名" onChange={ this.props.setItem("name") }/>
        </p>
        <p>
          <span>简介：</span>
          <Input style={{width:inputWidthNormal,margin:10}} value={ Data.getItem("introduction") } placeholder="简介" onChange={ this.props.setItem("introduction") }/>
        </p>
        <p>
          <span>性别：</span>
          <Input style={{width:inputWidthSmall,margin:10}} value={ Data.getItem("gender") } placeholder="性别" onChange={ this.props.setItem("gender") }/>
          <div className="mobile-clear-both"/>
          <span style={wp.base.BROWSER_TYPE?{}:{marginLeft:25}}>年龄：</span>
          <Input style={{width:inputWidthSmall,margin:10}} value={ Data.getItem("age") } placeholder="年龄" onChange={ this.props.setItem("age") }/>
        </p>
        <p>
          <span>身高：</span>
          <Input style={{width:inputWidthSmall,margin:10}} value={ Data.getItem("height") } placeholder="身高" onChange={ this.props.setItem("height") }/>
          <div className="mobile-clear-both"/>
          <span style={wp.base.BROWSER_TYPE?{}:{marginLeft:25}}>体重：</span>
          <Input style={{width:inputWidthSmall,margin:10}} value={ Data.getItem("weight") } placeholder="体重" onChange={ this.props.setItem("weight") }/>
        </p>
        <p>
          <span>肤色：</span>
          <Input style={{width:inputWidthSmall,margin:10}} value={ Data.getItem("skin") } placeholder="肤色" onChange={ this.props.setItem("skin") }/>
          <div className="mobile-clear-both"/>
          <span style={wp.base.BROWSER_TYPE?{}:{marginLeft:25}}>发色：</span>
          <Input style={{width:inputWidthSmall,margin:10}} value={ Data.getItem("hair") } placeholder="发色" onChange={ this.props.setItem("hair") }/>
        </p>
        <p>
          <span>瞳色：</span>
          <Input style={{width:inputWidthSmall,margin:10}} value={ Data.getItem("eye") } placeholder="瞳色" onChange={ this.props.setItem("eye") }/>
          <div className="mobile-clear-both"/>
          <span style={wp.base.BROWSER_TYPE?{}:{marginLeft:10}}>惯用手：</span>
          <Input style={{width:inputWidthSmall,margin:10}} value={ Data.getItem("hand") } placeholder="惯用手" onChange={ this.props.setItem("hand") }/>
        </p>
        <p>
          <span>外观：</span>
          <Input type="textarea" style={{width:inputWidthLarge,height:120,margin:10,verticalAlign:"top"}} value={ Data.getItem("appear") } placeholder="人物的外观介绍" onChange={ this.props.setItem("appear") }/>
        </p>
        <p>
          <span>故事：</span>
          <Input type="textarea" style={{width:inputWidthLarge,height:300,margin:10,verticalAlign:"top"}} value={ Data.getItem("story") } placeholder="人物的故事背景" onChange={ this.props.setItem("story") }/>
        </p>
        <p>
          <span>补充：</span>
          <Input type="textarea" style={{width:inputWidthLarge,height:80,margin:10,verticalAlign:"top"}} value={ Data.getItem("addition") } placeholder="补充设定" onChange={ this.props.setItem("addition") }/>
        </p>
      </div>
    );
  }

}

export default BuildPage1;
