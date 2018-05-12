/**
 * Created by Aaron on 2018/3/2.
 */
import React from 'react'
import { message } from 'antd'
import ReactHighcharts from 'react-highcharts' // Expects that Highcharts was loaded in the code.
import API from '../../common/api'

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
            return a._id.year - b._id.year;
        });
        const newData = {
            year: [],
            count: []
        };
        data.forEach( (item) => {
            newData.year.push(item._id.year);
            newData.count.push(item.count);
        });
        return newData;
    }

    rebuildMoviesDataByLanguage(data){
        const newData = [];
        data.forEach((item) => {
            /*if(item._id.language === '英语'){
                newData.push({
                    name: item._id.language,
                    y: item.count,
                    sliced: true
                });
            }else{
                newData.push([item._id.language, item.count]);
            }*/
            newData.push([item._id.language, item.count]);
        });
        return newData;
    }

    getMoviesGroupByYear(){
        const _this = this;
        const groupArray = ['year'];
        fetch(`${API.getMoviesByGroup}?groupArray=${JSON.stringify(groupArray)}`)
            .then((res) => {
                return res.json()
            }).then((data) => {
                if(data.success){
                    data = _this.rebuildMoviesDataByYear(data.result);
                    this.setState({
                        moviesOfEachYear: data
                    });
                }else{
                    message.error(data.message);
                }
            });
    }

    getMoviesGroupByLanguage(){
        const _this = this;
        const groupArray = ['language'];
        fetch(`${API.getMoviesByGroup}?groupArray=${JSON.stringify(groupArray)}`)
            .then((res) => {
                return res.json()
            }).then((data) => {
                if(data.success){
                    data = _this.rebuildMoviesDataByLanguage(data.result);
                    this.setState({
                        moviesOfEachLanguage: data
                    });
                }else{
                    message.error(data.message);
                }
            });
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
export default MovieCount;