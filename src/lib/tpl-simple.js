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
      <Layout className="sd-tpl-simple-layout">

        <Content className="sd-tpl-simple-content">
          {this.props.children}
        </Content>
        <Footer className="sd-tpl-simple-footer"></Footer>

      </Layout>
    )
  }
}

export default template
