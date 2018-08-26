import React, { Component } from 'react';
import { Menu, Icon, Button } from 'antd';
const SubMenu = Menu.SubMenu;

/**
 * @Author: Golion
 */
class Nav extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      current: ""
    };
  }

  _handleClick(e) {
    this.setState({
      current: e.key
    });
  }

  render() {
    return (
      <div className="nav-wrap" style={{zIndex:99}}>
        <img className="nav-img" src={ DATA.HOST + '/static/img/wp-banner.png' } />
        <div style={{clear:"both"}}/>
        <a href="/addpage" title="创建Wiki页面">
          <Button style={{margin:"5px 20px",float:wp.base.BROWSER_TYPE?"none":"right"}}>新建Wiki</Button>
        </a>
        <div className="mobile-clear-both"/>
        <Menu 
          onClick={ this._handleClick.bind(this) }
          selectedKeys={ [this.state.current] }
          mode="horizontal"
        >
          <Menu.Item key="index">
            <a href={ "/index" } title="首页">首页</a>
          </Menu.Item>
          <SubMenu title="世界观">
            <Menu.Item key="map">
              <a href={ "/page/地图" } title="地图">地图</a>
            </Menu.Item>
            <Menu.Item key="races">
              <a href={ "/page/种族" } title="种族">种族</a>
            </Menu.Item>
            <Menu.Item key="countries">
              <a href={ "/page/国家" } title="国家">国家</a>
            </Menu.Item>
            <Menu.Item key="organizations">
              <a href={ "/page/组织" } title="组织">组织</a>
            </Menu.Item>
            <Menu.Item key="history">
              <a href={ "/page/历史" } title="历史">历史</a>
            </Menu.Item>
            <Menu.Item key="others">
              <a href={ "/page/其他" } title="其他">其他</a>
            </Menu.Item>
          </SubMenu>
          <Menu.Item key="characters">
            <a href={ "/characters" } title="人物">人物</a>
          </Menu.Item>
          <Menu.Item key="rules">
            <a href={ "/page/规则书" } title="规则书">规则书</a>
          </Menu.Item>
          <SubMenu title="工具箱">
            <Menu.Item key="dice">
              <a href={ "/dice" } target="_blank" title="骰子"><Icon type="smile"/>骰子</a>
            </Menu.Item>
            <Menu.Item key="build">
              <a href={ "/build" } target="_blank" title="建卡"><Icon type="book"/>建卡</a>
            </Menu.Item>
            <Menu.Item key="datagram">
              <a href={ "/datagram" } target="_blank" title="图表"><Icon type="line-chart"/>图表</a>
            </Menu.Item>
            <Menu.Item key="uploadimg">
              <a href={ "/uploadimg" } target="_blank" title="传图"><Icon type="picture"/>传图</a>
            </Menu.Item>
          </SubMenu>
        </Menu>
      </div>
    );
  }

}

export default Nav;
