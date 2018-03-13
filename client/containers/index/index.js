/**
 * Created by Aaron on 2018/1/4.
 */
import React from 'react'
import MoviePoster from '../../components/moviePoster'
import { message } from 'antd'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import MovieListAction from '../../actions/movie/movieList'

class IndexPage extends React.Component{
    constructor(){
        super();
        this.state = {
            movies: []
        }
    }
    componentDidMount(){
        let _this = this;
        _this.props.movieListAction.searchMovies({}, 0, 10, (err, data) => {
            if(err){
                message.error(err.message);
            }else{
                if(data.success){
                    _this.setState({ movies: data.result});
                }else{
                    message.error(data.message);
                }
            }
        });
    }

    getMoviePosters(movies){
        let moviePosters = [];
        if(movies && movies.length > 0){
            movies.forEach(function (item, index) {
                moviePosters.push(<MoviePoster
                    key={index}
                    href={`/movie/detail.html/${item._id}`}
                    poster={item.poster.src}
                    name={item.title}
                />)
            })
        }else {
            moviePosters.push(<h1 key={-1} style={{textAlign: 'center'}}>暂无数据</h1>);
        }
        return moviePosters;
    }

    render(){
        return (
            <div>
                {this.getMoviePosters(this.state.movies)}
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




