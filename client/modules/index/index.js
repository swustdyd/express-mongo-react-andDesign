/**
 * Created by Aaron on 2018/1/4.
 */
import '../../common/common.scss'
import './index.scss'
import React from 'react'
import MoviePoster from '../../components/moviePoster'

class IndexPage extends React.Component{
    constructor(){
        super();
        this.state = {
            movies: []
        }
    }

    componentDidMount(){
        let _this = this;
        setTimeout(function () {
            fetch('/movie/getMovies')
                .then(res => res.json())
                .then(data => {
                    //console.log(data);
                    _this.setState({movies: data.result})
                });
        }, 0);
    }

    getMoviePosters(movies){
        let moviePosters = [];
        if(movies && movies.length > 0){
            movies.forEach(function (item, index) {
                moviePosters.push(<MoviePoster
                    key={index}
                    href={`/movie/detail.html/${item._id}`}
                    poster={item.poster}
                    name={item.title}
                />)
            })
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
export default IndexPage;




