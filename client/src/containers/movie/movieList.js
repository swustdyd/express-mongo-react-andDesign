/**
 * Created by Aaron on 2018/3/2.
 */

import React from 'react'
import {
    Table, Button, message, Popconfirm, Select,
    Divider, Col, Row, Form, Input, DatePicker
} from 'antd'
import { Link } from 'react-router-dom'
import momont from 'moment'
import { bindActionCreators } from 'redux';
import MovieEdit from './movieEdit'
import { connect } from 'react-redux';
import MovieListAction from '../../actions/movie/movieList'
import ModalAction from '../../actions/common/customModal'
import YearRangePicker from '../../components/yearRangePicker'
import Common from '../../common/common'

const FormItem = Form.Item;

class MovieList extends React.Component{
    constructor(){
        super();
        this.state = {
            yearRange: {}
        };
        this.handleSearchClick = this.handleSearchClick.bind(this);
    }
    getSearchCondition(){
        let condition = {};
        let { searchTitle, searchLanguage, searchYear } = this.props.form.getFieldsValue();
        condition.searchYear = searchYear;
        if(searchTitle){
            condition.title = searchTitle;
        }
        if(searchLanguage){
            condition.language = searchLanguage;
        }
        return condition;
    }
    handleDeleteClick(id){
        this.props.movieListAction.deleteMovie(id, (err, data) => {
            if(err){
                message.error(err.message);
            }else{
                if(data.success){
                    message.success(data.message);
                    this.searchAndLoadMovies(this.props.movieListState.pageIndex);
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
        this.props.movieListAction.searchMovies(condition, 0, (err, data) => {
            if(err){
                message.error(err.message);
            }else{
                if(data.success){
                    this.props.modalAction.showModal({
                        title: `编辑电影：${data.result[0].title}`,
                        maskClosable: false,
                        modalContent: <MovieEdit
                            onSubmitSuccess={() => {
                                this.props.modalAction.hideModal();
                                this.searchAndLoadMovies(this.props.movieListState.pageIndex);
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
        this.searchAndLoadMovies(0, this.getSearchCondition());
    }
    componentDidMount(){
        this.searchAndLoadMovies();
    }
    searchAndLoadMovies(pageIndex, condition){
        this.props.movieListAction.searchMovies(condition, pageIndex, 10, (err, data) => {
            if(err){
                message.error(err.message)
            }else {
                if(data.success){
                    data.result.forEach(function (item) {
                        item.key = item._id;
                    });
                    this.props.movieListAction.loadMovieList(data.result, data.pageIndex, data.pageSize, data.total);
                }else {
                    message.error(data.message)
                }
            }
        });
    }
    handleNewClick(){
        this.props.modalAction.showModal({
            title: '新增电影',
            maskClosable: false,
            modalContent: <MovieEdit
                onSubmitSuccess={() => {
                    this.props.modalAction.hideModal();
                    this.searchAndLoadMovies(this.props.movieListState.pageIndex);
                }}
            />,
            width: 800
        });
    }
    render(){
        let {total, pageIndex, pageSize, movies } = this.props.movieListState;
        const { getFieldDecorator } = this.props.form;
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
                title: '评论',
                dataIndex: '_id',
                key: 'comment',
                render: id => <Link to={`/moviePage/comment/${id}`} >查看评论</Link>
            },
            {
                title: '编辑',
                dataIndex: '_id',
                key: 'edit',
                render: (id) =>
                    <Button type="primary" size="small" onClick={() => this.handleEditClick(id)}>
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
                            onConfirm={() => this.handleDeleteClick(text)}
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
                this.searchAndLoadMovies(pageIndex - 1, this.getSearchCondition())
            }
        };
        const colLayout = {
            xs: 24,
            sm: 24,
            md: 12,
            lg: 8,
            xl: 8
        };
        const formItemLayout = {
            labelCol:{
                span: 4
            },
            wrapperCol: {
                span: 20
            }
        };
        return(
            <Form onSubmit={this.handleSearchClick}>
                <Row gutter={12}>
                    <Col xl={6}>
                        <FormItem {...formItemLayout} label="电影名">
                            {getFieldDecorator('searchTitle')(
                                <Input />
                            )}
                        </FormItem>
                    </Col>
                    <Col xl={8}>
                        <FormItem labelCol={{span: 4}} wrapperCol={{span: 20}} label="年代">
                            {getFieldDecorator('searchYear')(
                                <YearRangePicker />
                            )}
                        </FormItem>
                    </Col>
                    <Col xl={6}>
                        <FormItem {...formItemLayout} label="语言">
                            {getFieldDecorator('searchLanguage')(
                                <Select allowClear>
                                    {Common.createLanguageOptions()}
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Button type="primary" htmlType="submit" icon="search">搜索</Button>
                    &emsp;
                    <Button type="primary" icon="plus-circle-o" onClick={() => this.handleNewClick()}>新增电影</Button>
                </Row>
                <Divider />
                <Table
                    columns={columns}
                    dataSource={movies}
                    pagination={pagination}
                />
            </Form>
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