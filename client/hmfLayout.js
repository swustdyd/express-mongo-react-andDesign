/**
 * Created by Aaron on 2018/3/1.
 */
import React from 'react'
import {Layout} from 'antd'
import { connect } from 'react-redux';

const { Header, Content, Footer } = Layout;

class HMFLayout extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            windowInnerHeight: window.innerHeight,
            windowInnerWidth: window.innerWidth,
            headerHeight: this.props.pageStyle.headerHeight,
            footerHeight: this.props.pageStyle.footerHeight
        }
    }

    getWindowInnerArea(){
        return {
            windowInnerHeight: window.innerHeight,
            windowInnerWidth: window.innerWidth
        }
    }

    componentDidMount(){
        let _this = this;
        window.addEventListener('resize', () => {
            _this.setState(_this.getWindowInnerArea());
        });
    }

    componentWillUnmount(){
        window.removeEventListener('resize', () => {
            _this.setState(_this.getWindowInnerArea());
        });
    }

    render(){
        let {headerHeight, footerHeight, windowInnerHeight} = this.state;
        let headerStyle = {
            height: headerHeight,
            lineHeight: `${headerHeight}px`,
        };
        let contentStyle = {
            minHeight: windowInnerHeight - headerHeight - footerHeight,
            padding: '0 50px'
        };
        let footerStyle = {
            height: footerHeight,
            lineHeight: `${footerHeight}px`,
            textAlign: 'center',
            backgroundColor: '#001529',
            padding: 0,
            color: '#ddd'
        };
        return(
            <Layout className="layout">
                <Header style={headerStyle}>
                    {(typeof this.props.header) === 'function' ?  <this.props.header /> : this.props.header }
                </Header>
                <Content style={contentStyle}>
                    {(typeof this.props.content) === 'function' ?  <this.props.content /> : this.props.content }
                    {this.props.children}
                </Content>
                <Footer style={footerStyle}>
                    {(typeof this.props.footer) === 'function' ?  <this.props.footer /> : this.props.footer }
                </Footer>
            </Layout>
        );
    }
}
const mapStateToPros = state => ({
    pageStyle: state.style
});

/*const mapDispatchToProps = dispatch => ({
    modalAction: bindActionCreators(modalAction, dispatch)
});*/

export default connect(mapStateToPros, undefined, undefined, { pure: false })(HMFLayout);
/*
但是当搭配react-router的时候，在进行路由跳转的时候，组件不会重新render。这个时候看react-redux的connect方法的说明：

connect([mapStateToProps], [mapDispatchToProps], [mergeProps],[options])

mapStateToProps(state, [ownProps])：如果定义该参数，组件将会监听 Redux store 的变化。

mapDispatchToProps(dispatch, [ownProps])：如果传递的是一个对象，那么每个定义在该对象的函数都将被当作 Redux action creator，而且这个对象会与 Redux store 绑定在一起，其中所定义的方法名将作为属性名，合并到组件的 props 中。如果传递的是一个函数，该函数将接收一个 dispatch 函数，然后由你来决定如何返回一个对象，这个对象通过 dispatch 函数与 action creator 以某种方式绑定在一起（提示：你也许会用到 Redux 的辅助函数 bindActionCreators()）

mergeProps(stateProps, dispatchProps, ownProps)：如果指定了这个参数，mapStateToProps() 与 mapDispatchToProps() 的执行结果和组件自身的 props 将传入到这个回调函数中。该回调函数返回的对象将作为 props 传递到被包装的组件中。

options：

如果指定这个参数，可以定制 connector 的行为。

[pure = true] (Boolean): 如果为 true，connector 将执行 shouldComponentUpdate 并且浅对比 mergeProps 的结果，避免不必要的更新，前提是当前组件是一个“纯”组件，它不依赖于任何的输入或 state 而只依赖于 props 和 Redux store 的 state。默认值为 true。
[withRef = false] (Boolean): 如果为 true，connector 会保存一个对被包装组件实例的引用，该引用通过 getWrappedInstance() 方法获得。默认值为 false
options中pure属性默认为true,估计是因为浅对比的原因，没有获取到路由的变化，因此可以将pure设置为false*/
