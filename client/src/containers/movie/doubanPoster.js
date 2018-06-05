import React from 'react'
import MoviePoster from '../../components/moviePoster'
import './doubanPoster.scss'

export default class DoubanPoster extends React.Component{
    constructor(){
        super();
        this.state = {
            doubanIconShow: false
        }
    }

    render(){
        const {doubanIconShow} = this.state;
        const {item} = this.props;
        return(
            <div 
                className="douban-poster"
                onMouseEnter={() => {
                    this.setState({doubanIconShow: !doubanIconShow})
                }}
                onMouseLeave={() => {
                    this.setState({doubanIconShow: !doubanIconShow})
                }}
            >
                <a className={`douban-icon${doubanIconShow ? ' show' : ''}`} target="_blank" href={`https://movie.douban.com/subject/${item.doubanMovieId}/`}></a>
                <MoviePoster 
                    movieData={{
                        title: item.name,
                        summary: item.summary,
                        poster: {
                            src: item.mainpic.href
                        }
                    }}
                />
            </div>
        )
    }
}