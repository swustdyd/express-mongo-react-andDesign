/**
 * Created by Aaron on 2018/3/2.
 */
import React from 'react'
import { message } from 'antd'
import ReactHighcharts from 'react-highcharts' // Expects that Highcharts was loaded in the code.
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import MovieAction from '../../actions/movie/movieAction'

class MovieCount extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            moviesOfEachYear: [],
            moviesOfEachLanguage: []
        }
    }

    componentDidMount(){
        this.getMoviesGroupByYear();
        this.getMoviesGroupByLanguage();
    }

    rebuildMoviesDataByYear(data){
        data.sort((a, b) => {
            return a.year - b.year;
        });
        const newData = {
            year: [],
            count: []
        };
        data.forEach((item) => {
            if(item.count >= 10 && item.year){
                newData.year.push(item.year);
                newData.count.push(item.count);
            }            
        });
        return newData;
    }

    rebuildMoviesDataByLanguage(data){
        const newData = [];
        data.forEach((item) => {
            if(item.count >= 10 && item.language){
                newData.push([item.language, item.count]);
            } 
            newData.push([item.language, item.count]);
        });
        return newData;
    }

    getMoviesGroupByYear(){
        this.props.movieAction.getMovieByGroup('year', (err, data) => {
            if(err){
                message.error(err.message);
            }else{
                if(data.success){
                    this.setState({
                        moviesOfEachYear: this.rebuildMoviesDataByYear(data.result)
                    })
                }else{
                    message.error(data.message);
                }
            }
        })
    }

    getMoviesGroupByLanguage(){
        this.props.movieAction.getMovieByGroup('language', (err, data) => {
            if(err){
                message.error(err.message);
            }else{
                if(data.success){                    
                    this.setState({
                        moviesOfEachLanguage: this.rebuildMoviesDataByLanguage(data.result)
                    })
                }else{
                    message.error(data.message);
                }
            }
        })
    }

    render(){
        const { moviesOfEachYear, moviesOfEachLanguage } = this.state;
        const lineConfig = {
            title: {
                text: '每年电影产量'
            },
            xAxis: {
                title: {
                    text: '年份'
                },
                categories: moviesOfEachYear.year
            },
            yAxis: {
                title: {
                    text: '数量',
                    rotation: 0
                }
            },
            tooltip: {
                headerFormat: '<b>{point.key}年</b><br>',
                pointFormat: '产量: {point.y}部'
            },
            series: [{
                type: 'line',
                name: '电影产量',
                data: moviesOfEachYear.count
            }]
        };
        const pieConfig = {
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false
            },
            title: {
                text: '电影各个语种占比'
            },
            tooltip: {
                headerFormat: '<b>{point.key}</b><br>',
                pointFormat: '<b>百分比: <i>{point.percentage:.1f}%</i></b><br><b>数\u3000量：</b>{point.y}部'
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        format: '<b>{point.name}</b>: {point.percentage:.1f} %'
                    },
                    states: {
                        hover: {
                            enabled: false
                        }
                    },
                    // 突出间距
                    slicedOffset: 20,
                    point: {
                        // 每个扇区是数据点对象，所以事件应该写在 point 下面
                        events: {
                            // 鼠标滑过是，突出当前扇区
                            mouseOver: function() {
                                this.slice();
                            },
                            // 鼠标移出时，收回突出显示
                            mouseOut: function() {
                                this.slice();
                            },
                            // 默认是点击突出，这里屏蔽掉
                            click: function() {
                                return false;
                            }
                        }
                    }
                }
            },
            series: [{
                type: 'pie',
                name: '语种',
                data: moviesOfEachLanguage
            }]
        };
        return(
            <div className="user-count-container">
                <ReactHighcharts config={lineConfig}/>
                <ReactHighcharts config={pieConfig}/>
            </div>
        );
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        movieAction: bindActionCreators(MovieAction, dispatch)
    }
};

export default connect(undefined, mapDispatchToProps)(MovieCount);