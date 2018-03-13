/**
 * Created by Aaron on 2018/3/2.
 */

import React from 'react'
import {
    Table, Button, message, Popconfirm,
    Divider, Col, Row, Form, Input, Modal
} from 'antd'
import MovieEdit from './movieEdit'
import momont from 'moment'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import MovieListAction from '../../actions/movie/movieList'
import ModalAction from '../../actions/common/customModal'

const FormItem = Form.Item;
class MovieList extends React.Component{
    constructor(){
        super();
    }
    handleDeleteClick(id){
        let _this = this;
        _this.props.movieListAction.deleteMovie(id, (err, data) => {
            if(err){
                message.error(err.message);
            }else{
                if(data.success){
                    message.success(data.message);
                    _this.searchAndLoadMovies(_this.props.movieListState.pageIndex);
                }else{
                    message.error(data.message);
                }
            }
        });
    }
    handleEditClick(id){
        let condition = {
            _id: id
        };
        let _this = this;
        _this.props.movieListAction.searchMovies(condition, 0, (err, data) => {
            if(err){
                message.error(err.message);
            }else{
                if(data.success){
                    _this.props.modalAction.showModal({
                        title: `编辑电影：${data.result[0].title}`,
                        maskClosable: true,
                        modalContent: <MovieEdit
                            onSubmitSuccess={() => {
                                _this.props.modalAction.hideModal();
                                _this.searchAndLoadMovies(_this.props.movieListState.pageIndex);
                            }}
                            initData={data.result[0]}
                        />,
                        width: 800
                    });
                }else {
                    message.error(data.message);
                }
            }
        });
    }
    handleSearchClick(e){
        e.preventDefault();
        let { searchTitle, searchYear, searchLanguage } = this.props.form.getFieldsValue();
        let condition = {};
        if(searchTitle){
            condition.title = searchTitle;
        }
        if(searchYear){
            condition.year = searchYear;
        }
        if(searchLanguage){
            condition.language = searchLanguage;
        }
        this.searchAndLoadMovies(0, condition);
    }
    componentDidMount(){
        this.searchAndLoadMovies();
    }
    searchAndLoadMovies(pageIndex, condition){
        let _this = this;
        _this.props.movieListAction.searchMovies(condition, pageIndex, 10, (err, data) => {
            if(err){
                message.error(err.message)
            }else {
                if(data.success){
                    data.result.forEach(function (item) {
                        item.key = item._id;
                    });
                    _this.props.movieListAction.loadMovieList(data.result, data.pageIndex, data.pageSize, data.total);
                }else {
                    message.error(data.message)
                }
            }
        });
    }
    handleNewClick(){
        let _this = this;
        _this.props.modalAction.showModal({
            title: '新增电影',
            maskClosable: false,
            modalContent: <MovieEdit
                onSubmitSuccess={() => {
                    _this.props.modalAction.hideModal();
                    _this.searchAndLoadMovies(_this.props.movieListState.pageIndex);
                }}
            />,
            width: 800
        });
    }
    render(){
        let _this = this;
        let {total, pageIndex, pageSize, movies } = _this.props.movieListState;
        let columns = [
            {
                title: '序号',
                key: 'index',
                render: (text, record, index) => pageIndex * pageSize + index + 1
            },
            {
                title: '电影名',
                dataIndex: 'title',
                key: 'title'
            },
            {
                title: '国家',
                dataIndex: 'country',
                key: 'country'
            },
            {
                title: '语种',
                dataIndex: 'language',
                key: 'language'
            },
            {
                title: '年代',
                dataIndex: 'year',
                key: 'year'
            },
            {
                title: '最后更新时间',
                dataIndex: 'meta',
                key: 'update',
                render: (text) => momont(text.updateAt).format('YYYY-MM-DD HH:mm:ss')
            },
            {
                title: '编辑',
                dataIndex: '_id',
                key: 'edit',
                render: (id) =>
                    <Button type="primary" size="small" onClick={this.handleEditClick.bind(this, id)}>
                        编辑
                    </Button>
            },
            {
                title: '删除',
                dataIndex: '_id',
                key: 'delete',
                render: (text, record) => {
                    return (
                        <Popconfirm
                            title={`确认删除“${record.title}”？`}
                            cancelText="取消"
                            okText="确认"
                            onConfirm={this.handleDeleteClick.bind(this, text)}
                        >
                            <Button type="danger" size="small">删除</Button>
                        </Popconfirm>
                    );
                }
            }
        ];
        let pagination = {
            total: total,
            pageSize: pageSize,
            current: pageIndex + 1,
            onChange: (pageIndex) => {
                let { searchTitle, searchYear, searchLanguage } = _this.props.form.getFieldsValue();
                let condition = {};
                if(searchTitle){
                    condition.title = searchTitle;
                }
                if(searchYear){
                    condition.year = searchYear;
                }
                if(searchLanguage){
                    condition.language = searchLanguage;
                }
                _this.searchAndLoadMovies(pageIndex - 1, condition)
            }
        };
        const { getFieldDecorator } = _this.props.form;
        return(
            <div>
                <Form onSubmit={this.handleSearchClick.bind(this)}>
                    <Row gutter={24}>
                        <Col span={8}>
                            <FormItem label="电影名">
                                {getFieldDecorator(`searchTitle`)(
                                    <Input placeholder="电影名称" />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem label="年代">
                                {getFieldDecorator(`searchYear`,{
                                    rules: [{
                                        message: "年代必须为0-4位的数字",
                                        pattern: /^[0-9]{4}$/
                                    }]
                                })(
                                    <Input span={6}/>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem label="语言">
                                {getFieldDecorator(`searchLanguage`)(
                                    <Input span={6}/>
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row span={24}>
                        <Col span={24}>
                            <Button type="primary" htmlType="submit" icon="search">搜索</Button>
                            &emsp;
                            <Button type="primary" icon="plus-circle-o" onClick={this.handleNewClick.bind(this)}>新增电影</Button>
                        </Col>
                    </Row>
                    <Divider />
                    <Row span={24}>
                        <Table
                            columns={columns}
                            dataSource={movies}
                            pagination={pagination}
                        />
                    </Row>
                </Form>
            </div>
        );
    }
}
const mapStateToPros = state => ({
    movieListState: state.movie.movieList
});

const mapDispatchToProps = dispatch => ({
    movieListAction: bindActionCreators(MovieListAction, dispatch),
    modalAction: bindActionCreators(ModalAction, dispatch)
});

export default connect(mapStateToPros, mapDispatchToProps)(Form.create()(MovieList));
//export default Form.create()(MovieList);