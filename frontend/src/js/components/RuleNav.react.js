import React, { Component } from 'react';
import { Menu } from 'antd';
const SubMenu = Menu.SubMenu;

/**
 * @Author: Golion
 */
class RuleNav extends Component {

  render() {
    return (
      <div>
        <Menu
          className="rule-nav-wrap"
          onClick={ this.props.handleClick }
          selectedKeys={ [this.props.current] }
          mode="inline"
        >
          <Menu.Item key="intro">什么是Will Project</Menu.Item>
          <SubMenu title="玩家角色">
            <Menu.Item key="characterintro">角色人物卡</Menu.Item>
            <Menu.Item key="characterraces">种族</Menu.Item>
          </SubMenu>
        </Menu>
      </div>
    );
  }

}

export default RuleNav;
