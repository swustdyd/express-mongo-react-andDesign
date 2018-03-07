/**
 * Created by Aaron on 2018/3/2.
 */

import React from 'react'
import { Form, Input, Tooltip, Icon, Select,Button, AutoComplete, message, Spin} from 'antd'
import PicturesWall from '../../components/picturesWall'
const {TextArea} = Input;
const FormItem = Form.Item;
const Option = Select.Option;
const AutoCompleteOption = AutoComplete.Option;

class MovieEdit extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            submiting: false,
            initData: this.props.initData || {}
        };
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleSubmit(e) {
        e.preventDefault();
        let _this = this;
        this.props.form.validateFieldsAndScroll((err, value) => {
            if(!err && !this.state.submiting){
                let movie = this.props.form.getFieldsValue();
                _this.setState({submiting: true});
                movie._id = this.state.initData._id;
                fetch('/movie/newOrUpdate', {
                    method: 'post',
                    headers: {
                        'Content-type': 'application/json'
                    },
                    //同域名下，会带上cookie，否则后端根据sessionid获取不到对应的session
                    credentials: 'include',
                    body: JSON.stringify({movie: movie})
                })
                .then(res => res.json())
                .then(data => {
                    setTimeout(function () {
                        if(data.success){
                            message.success(data.message)
                            _this.setState({initData: {}});
                        }else{
                            message.error(data.message);

                        }
                        _this.setState({submiting: false});
                    }, 3000);
                }).catch(err => {
                    message.error(err.message);
                     _this.setState({submiting: false});
                });
            }
        });
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 4 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 20 },
            },
        };
        const tailFormItemLayout = {
            wrapperCol: {
                xs: {
                    span: 24,
                    offset: 16,
                },
                sm: {
                    span: 24,
                    offset: 22,
                },
            },
        };
        const {initData} = this.state;
        //console.log('start render');
        //console.log(initData);
        return (
            <Spin tip="提交中..." spinning={this.state.submiting}>
                <Form onSubmit={this.handleSubmit}>
                    <FormItem
                        {...formItemLayout}
                        label="电影名称"
                    >
                        {getFieldDecorator('title',{
                            rules: [{
                                required: true,
                                message: '请输入电影名称'
                            }],
                            initialValue: initData.title
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="国家"
                    >
                        {getFieldDecorator('country', {
                            rules: [{
                                required: true,
                                message: '请输入国家'
                            }],
                            initialValue: initData.country
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="年代"
                    >
                        {getFieldDecorator('year', {
                            rules: [{
                                required: true,
                                message: '请输入年代'
                            }, {
                                pattern: /^[0-9]{4}$/,
                                message: '年代必须为0-4位的数字'
                            }],
                            initialValue: initData.year
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label={(
                            <span>
                                封面&nbsp;
                                <Tooltip title="文件格式：JPG、PNG">
                                    <Icon type="question-circle-o" />
                                </Tooltip>
                            </span>
                        )}
                    >
                        {getFieldDecorator('posterFile')(
                            <PicturesWall
                                name="poster"
                                action="/movie/uploadPoster"
                                listType="picture-card"
                            />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="简介"
                    >
                        {getFieldDecorator('summary', {
                            rules: [{
                                required: true,
                                message: '请输入电影简介'
                            }],
                            initialValue: initData.summary
                        })(
                            <TextArea placeholder="请输入电影简介" autosize={{minRows: 3}}/>
                        )}
                    </FormItem>
                    <FormItem {...tailFormItemLayout}>
                        <Button type="primary" htmlType="submit" >提交</Button>
                    </FormItem>
                </Form>
            </Spin>
        );
    }
}
export default Form.create()(MovieEdit);