/**
 * Created by Aaron on 2018/1/4.
 */
import React from 'react'
import MoviePoster from '../../components/moviePoster'
import { message, Spin } from 'antd'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import MovieAction from '../../actions/movie/movieAction'
import BaseConfig from '../../../../baseConfig'
import './index.scss'

class IndexPage extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            windowInnerHeight: window.innerHeight,
            windowInnerWidth: window.innerWidth,
            currentPoster: 0,
            controllerHeight: 50,
            minHeight: 600,
            paddingX: 50,
            centerStyle: {
                width: 350,
                height: 350
            },
            pageIndex: 0,
            pageSize: 20,
            total: 0,
            movies:[],
            loading: false,
            animation: false
        }
    }

    getAndLoadMovies(pageIndex = 0){
        const {pageSize} = this.state;
        this.setState({
            loading: true,
            animation: false
        })
        this.props.movieAction.searchMovies({}, pageIndex, pageSize, (err, data) => {
            if(err){
                message.error(err.message);
            }else{
                if(data.success){
                    this.setState({
                        pageIndex,
                        total: data.total,
                        movies: data.result,
                        currentPoster: data.result.length ? data.result[0]._id : 0
                    });
                    setTimeout(() => {
                        this.setState({
                            animation: true
                        })
                    }, 100);
                }else{
                    message.error(data.message);
                }
            }
            this.setState({
                loading: false
            })
        });
    }

    getStyleMap(){
        const styleMap = {};
        const {commonSetting} = this.props;
        const { movies, currentPoster: currentId, centerStyle, animation,
            controllerHeight, windowInnerWidth, windowInnerHeight, minHeight, paddingX} = this.state;
        const height = Math.max(windowInnerHeight, minHeight) - commonSetting.headerHeight - commonSetting.footerHeight - controllerHeight;
        const width = Math.max(windowInnerWidth, 500) - paddingX;
        if(movies && movies.length > 0){
            movies.forEach((item) => {
                const randomDeg = Math.ceil(Math.random() * 30);
                const randomSymbol = Math.random() > 0.5 ? '' : '-';
                const style = {
                    transform: `rotate(${randomSymbol}${randomDeg}deg)`
                };
                if(!animation || item._id === currentId){
                    style.top = (height - centerStyle.height) / 2;
                    style.left = (width - centerStyle.width) / 2;
                    style.transform = undefined;
                }else{
                    style.top = Math.ceil(Math.random() * (height - 100));
                    style.left = Math.ceil(Math.random() * (width - 100));
                }
                styleMap[item._id] = style;
            });
            return styleMap;
        }
    }

    getWindowInnerArea(){
        return {
            windowInnerHeight: window.innerHeight,
            windowInnerWidth: window.innerWidth
        }
    }

    componentDidMount(){
        this.getAndLoadMovies();
        window.addEventListener('resize', () => {
            this.setState(this.getWindowInnerArea());
        });
    }

    componentWillUnmount(){
        window.removeEventListener('resize', () => {
            this.setState(this.getWindowInnerArea());
        });
    }

    handlePosterClick(id){
        if(id === this.state.currentPoster){
            return true;
        }else{
            this.setState({
                currentPoster: id
            });
            return false;
        }
    }

    createMoviePosters(movies){
        const moviePosters = [];
        const styleMap = this.getStyleMap();
        if(movies && movies.length > 0){
            movies.forEach((item, index) => {
                item.poster = {
                    src: item.picture
                }
                let className = '';
                if(item._id === this.state.currentPoster){
                    className = 'center'
                }
                moviePosters.push(<MoviePoster
                    style={styleMap[item._id]}
                    className={className}
                    handlePosterClick={() => { return this.handlePosterClick(item._id)}}
                    movieData={item}
                    key={index}
                    href={`/movie/detail.html/${item._id}`}
                />)
            })
        }
        return moviePosters;
    }

    createControlPosters(movies){
        const controllers = [];
        if(movies && movies.length > 0){
            movies.forEach((item, index) => {
                let className = '';
                if(this.state.currentPoster === item._id){
                    className = 'poster-controller active';
                }else {
                    className = 'poster-controller';
                }
                controllers.push(
                    <span
                        title={item.title}
                        key={index}
                        className={className}
                        onClick={() => {this.handlePosterClick(item._id)}}
                    />)
            })

        }
        return controllers;
    }

    render(){
        const {commonSetting} = this.props;
        const { movies, pageIndex, total, pageSize, loading,
            windowInnerHeight, minHeight: settingMinHeight, controllerHeight} = this.state;
        const minHeight = Math.max(windowInnerHeight, settingMinHeight) - commonSetting.headerHeight - commonSetting.footerHeight - controllerHeight;
        const lastPageProps = {};
        if(pageIndex <= 0){
            lastPageProps.disabled = true;
        }
        const nextPageProps = {};
        if(pageIndex === Math.floor( total / pageSize)){
            nextPageProps.disabled = true;
        }
        return (
            <Spin tip="loading..." spinning={loading}>
                <div>
                    <div style={{minHeight: minHeight, position: 'relative', overflow: 'hidden'}}>
                        {this.createMoviePosters(movies)}
                    </div>
                    <div
                        style={{
                            height: controllerHeight,
                            lineHeight: `${controllerHeight}px`
                        }}
                        className="controller"
                    >
                        <a
                            className="page-icon"
                            onClick={() => {this.getAndLoadMovies(pageIndex - 1)}}
                            {...lastPageProps}
                        >
                            last page
                        </a>
                        {this.createControlPosters(movies)}
                        <a
                            className="page-icon"
                            onClick={() => {this.getAndLoadMovies(pageIndex + 1)}}
                            {...nextPageProps}
                        >
                            next page
                        </a>
                    </div>
                </div>
            </Spin>            
        );
    }
}

const mapStateToPros = (state) => {
    return {
        commonSetting: state.common.setting
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        movieAction: bindActionCreators(MovieAction, dispatch)
    }
}

export default connect(mapStateToPros, mapDispatchToProps)(IndexPage);
//export default IndexPage;




