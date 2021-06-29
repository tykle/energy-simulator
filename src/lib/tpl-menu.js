import React, { Component } from 'react'
import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'
import '../App.css';
import logo from '../signderiva-logo.png'

import {
  Layout,
  Select,
  Menu
} from 'antd';

const { Header, Footer, Sider, Content } = Layout;

export class template extends Component {
  render() {
    return (
      <Layout>

        <Header style={{ backgroundColor: "#292F33" }}>
          <img src={logo} style={{ float: "left", padding: "10px", maxHeight: "100%" }} />
          <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']} style={{ backgroundColor: "#292F33" }}>
            <Menu.Item key="q1">Computer</Menu.Item>
            <Menu.Item key="q2">Simulation</Menu.Item>
          </Menu>
        </Header>
        <Content style={{ padding: '0 2%' }}>
          {this.props.children}
        </Content>
        <Footer>Footer</Footer>

      </Layout>
    )
  }
}

export default template
