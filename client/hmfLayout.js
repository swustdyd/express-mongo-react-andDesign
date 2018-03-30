/**
 * Created by Aaron on 2018/3/1.
 */
import React from 'react'
import {Layout} from 'antd'

const { Header, Content, Footer } = Layout;

class CustomLayout extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        console.log(typeof this.props.header, typeof this.props.content);
        return(
            <Layout className="layout">
                <Header>
                    {(typeof this.props.header) === 'function' ?  <this.props.header /> : this.props.header }
                </Header>
                <Content style={{ padding: '0 50px'}}>
                    {(typeof this.props.content) === 'function' ?  <this.props.content /> : this.props.content }
                    {this.props.children}
                </Content>
                <Footer style={{ textAlign: 'center'}}>
                    {(typeof this.props.footer) === 'function' ?  <this.props.footer /> : this.props.footer }
                </Footer>
            </Layout>
        );
    }
}
export default CustomLayout;
