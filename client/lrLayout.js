/**
 * Created by Aaron on 2018/3/2.
 */
import React from 'react'
import { Layout} from 'antd';
const { Sider } = Layout;
const { Content } = Layout;

class LRLayout extends React.Component{
    render() {
        return (
            <Layout>
                <Sider width={200} style={{ background: '#fff' }}>
                    {this.props.left}
                </Sider>
                <Layout style={{ padding: '0 24px' }}>
                    <Content style={{ background: '#fff', padding: 24, margin: 0, minHeight: 280 }}>
                        {this.props.right}
                    </Content>
                </Layout>
            </Layout>
        );
    }
}
export default LRLayout;