/**
 * Created by Aaron on 2018/3/2.
 */

import React from 'react'
import { Form, Input, Tooltip, Icon, Button, message, Spin} from 'antd'
import PicturesWall from '../../components/picturesWall'
const {TextArea} = Input;
const FormItem = Form.Item;

class MovieEdit extends React.Component{
    constructor(props){
        super(props);
        let { initData } = this.props;
        let fileList = initData && initData.poster ? [initData.poster] : [];
        this.state = {
            submiting: false,
            initData: initData || {},
            fileList: fileList
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
                let fileList = this.state.fileList;
                if(fileList &&  fileList.length > 0){
                    movie.poster = fileList[0];
                }else {
                    movie.poster = '';
                }
                fetch('/movie/newOrUpdate', {
                    method: 'post',
                    headers: {
                        'Content-type': 'application/json'
                    },
                    //同域名下，会带上cookie，否则后端根据sessionid获取不到对应的session
                    credentials: 'include',
                    body: JSON.stringify({
                        movie: movie,
                        fileList: fileList
                    })
                })
                .then(res => res.json())
                .then(data => {
                    if(data.success){
                        message.success(data.message);
                        //window.location.href = '/#/moviePage/movieList';
                        if( _this.props.onSubmitSuccess){
                            _this.props.onSubmitSuccess();
                        }
                    }else{
                        message.error(data.message);
                        if( _this.props.onSubmitFail){
                            _this.props.onSubmitFail();
                        }
                    }
                    _this.setState({submiting: false});
                }).catch(err => {
                    message.error(err.message);
                     _this.setState({submiting: false});
                });
            }
        });
    }
    handleFileUploadChange(fileList){
        this.setState({
            fileList: fileList
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
        let { initData, fileList } = this.state;
        let fileListTemps = [];
        fileList.forEach((item, index) => {
            fileListTemps.push({
                uid: index,
                name: item.displayName,
                status: 'done',
                url: item.src,
                test: 'test'
            })
        });
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
                        label="导演"
                    >
                        {getFieldDecorator('doctor', {
                            rules: [{
                                required: true,
                                message: '请输入导演'
                            }],
                            initialValue: initData.doctor
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
                        label="语种"
                    >
                        {getFieldDecorator('language', {
                            rules: [{
                                required: true,
                                message: '请输入语种'
                            }],
                            initialValue: initData.language
                        })(
                            <Input />
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
                                maxLength={1}
                                fileList={fileListTemps}
                                onChangeCallBack={this.handleFileUploadChange.bind(this)}
                            />
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