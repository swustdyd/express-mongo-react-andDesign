/**
 * Created by Aaron on 2018/1/4.
 */
import React from 'react'
import MoviePoster from '../../components/moviePoster'
import { message } from 'antd'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import MovieListAction from '../../actions/movie/movieList'
import './index.scss'

class IndexPage extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            currentPoster: 0,
            controllerHeight: 50,
            minHeight: 600,
            padding: {
                x: 100,
                y: 113
            },
            centerStyle: {
                width: 350,
                height: 350
            },
            resData: {},
            styleObj: [],
        }
    }

    getAndLoadMovies(pageIndex){
        let _this = this;
        _this.props.movieListAction.searchMovies({}, pageIndex, 5, (err, data) => {
            if(err){
                message.error(err.message);
            }else{
                if(data.success){
                    _this.setState({
                        resData: data,
                        currentPoster: data.result.length ? data.result[0]._id : 0
                    });
                    setTimeout(()=>{
                        this.rePosition(data.result.length ? data.result[0]._id : 0)
                    }, 100)
                }else{
                    message.error(data.message);
                }
            }
        });
    }

    rePosition(id){
        let styleObj = {};
        let {resData} = this.state;
        let movies = resData.result;
        let height = Math.max(window.innerHeight, this.state.minHeight) - this.state.padding.y - this.state.controllerHeight;
        let width = Math.max(window.innerWidth, 500) - this.state.padding.x;
        if(movies && movies.length > 0){
            movies.forEach((item) =>{
                let randomDeg = Math.ceil(Math.random() * 30);
                let randomSymbol = Math.random() > 0.5 ? '' : '-';
                let style = {
                    transform: `rotate(${randomSymbol}${randomDeg}deg)`,
                    position: 'absolute',
                };
                if(item._id === id){
                    style.top = (height - this.state.centerStyle.height) / 2;
                    style.left = (width - this.state.centerStyle.width) / 2;
                    style.transform = undefined;
                }else{
                    style.top = Math.ceil(Math.random() * (height - 100));
                    style.left = Math.ceil(Math.random() * (width - 100));
                }
                styleObj[item._id] = style;
            });
            this.setState({
                styleObj: styleObj
            })
        }
    }

    componentDidMount(){
        this.getAndLoadMovies();
    }

    handlePosterClick(id){
        if(id === this.state.currentPoster){
            return true;
        }else{
            this.setState({
                currentPoster: id
            });
            this.rePosition(id)
            return false;
        }
    }

    createMoviePosters(movies){
        let moviePosters = [];
        let height = Math.max(window.innerHeight, this.state.minHeight) - this.state.padding.y - this.state.controllerHeight;
        let width = Math.max(window.innerWidth, 500) - this.state.padding.x;
        if(movies && movies.length > 0){
            movies.forEach((item, index) => {
                let className = '';
                let style = {};
                if(item._id === this.state.currentPoster){
                    style.top = (height - this.state.centerStyle.height) / 2;
                    style.left = (width - this.state.centerStyle.width) / 2;
                    style.transform = undefined;
                    className = 'center'
                }
                moviePosters.push(<MoviePoster
                    style={this.state.styleObj[item._id] || style}
                    className={className}
                    handlePosterClick={this.handlePosterClick.bind(this)}
                    movieData={item}
                    key={index}
                    href={`/movie/detail.html/${item._id}`}
                />)
            })
        }else {
            moviePosters.push(<h1 key={-1} style={{textAlign: 'center'}}>暂无数据</h1>);
        }
        return moviePosters;
    }

    createControlPosters(movies){
        let controllers = [];
        if(movies && movies.length > 0){
            movies.forEach((item, index) => {
                let className;
                if(this.state.currentPoster == item._id){
                    className = 'poster-controller active';
                }else {
                    className = 'poster-controller';
                }
                controllers.push(
                    <span
                        title={item.title}
                        key={index}
                        className={className}
                        onClick={this.handlePosterClick.bind(this, item._id)}
                    />)
            })

        }
        return controllers;
    }

    render(){
        let minHeight = Math.max(window.innerHeight, this.state.minHeight) - this.state.padding.y - this.state.controllerHeight;
        let { result } = this.state.resData;
        let lastPageProps = {};
        if(this.state.resData.pageIndex <= 0){
            lastPageProps.disabled = true;
        }
        let nextPageProps = {};
        //console.log(this.state.resData.pageIndex, Math.floor( this.state.resData.total / this.state.resData.pageSize));
        if(this.state.resData.pageIndex === Math.floor( this.state.resData.total / this.state.resData.pageSize)){
            nextPageProps.disabled = true;
        }
        return (
            <div>
                <div style={{minHeight: minHeight, position: 'relative', overflow: 'hidden'}}>
                    {this.createMoviePosters(result)}
                </div>
                <div style={{
                    height: this.state.controllerHeight,
                    lineHeight: `${this.state.controllerHeight}px`}}
                     className="controller"
                >
                    <a className="page-icon"
                       onClick={this.getAndLoadMovies.bind(this, this.state.resData.pageIndex - 1)}
                       {...lastPageProps}
                    >
                        last page
                    </a>
                        {this.createControlPosters(result)}
                    <a className="page-icon"
                       onClick={this.getAndLoadMovies.bind(this, this.state.resData.pageIndex + 1)}
                       {...nextPageProps}
                    >
                        next page
                    </a>
                </div>
            </div>
        );
    }
}

const mapStateToPros = state => ({
});

const mapDispatchToProps = dispatch => ({
    movieListAction: bindActionCreators(MovieListAction, dispatch)
});

export default connect(mapStateToPros, mapDispatchToProps)(IndexPage);
//export default IndexPage;




