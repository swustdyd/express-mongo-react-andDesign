/**
 * Created by Aaron on 2018/3/2.
 */
import React from 'react'
import { message } from 'antd'
import ReactHighcharts from 'react-highcharts' // Expects that Highcharts was loaded in the code.

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
        let newData = {
            year: [],
            count: []
        };
        data.forEach( item => {
            newData.year.push(item._id.year);
            newData.count.push(item.count);
        });
        return newData;
    }

    rebuildMoviesDataByLanguage(data){
        let newData = [];
        data.forEach((item) => {
            if(item._id.language === '日语'){
                newData.push({
                    name: item._id.language,
                    y: item.count,
                    sliced: true
                });
            }else{
                newData.push([item._id.language, item.count]);
            }
        });
        return newData;
    }

    getMoviesGroupByYear(){
        let _this = this;
        let groupArray = ['year'];
        fetch(`/movie/getMoviesByGroup?groupArray=${JSON.stringify(groupArray)}`)
            .then(res => res.json())
            .then(data => {
                if(data.success){
                    data = _this.rebuildMoviesDataByYear(data.result);
                    _this.setState({
                        moviesOfEachYear: data
                    });
                }else{
                    message.error(data.message);
                }
            });
    }

    getMoviesGroupByLanguage(){
        let _this = this;
        let groupArray = ['language'];
        fetch(`/movie/getMoviesByGroup?groupArray=${JSON.stringify(groupArray)}`)
            .then(res => res.json())
            .then(data => {
                if(data.success){
                    data = _this.rebuildMoviesDataByLanguage(data.result);
                    _this.setState({
                        moviesOfEachLanguage: data
                    });
                }else{
                    message.error(data.message);
                }
            });
    }

    render(){
        let { moviesOfEachYear, moviesOfEachLanguage } = this.state;
        let lineConfig = {
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
            series: [{
                type: 'line',
                name: '电影产量',
                tooltip: {
                    headerFormat: '<span style="font-size: 12px">{point.key}年</span><br/>',
                    valueSuffix: '部'
                },
                data: moviesOfEachYear.count
            }]
        };
        let pieConfig = {
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false
            },
            title: {
                text: '电影各个语种占比'
            },
            tooltip: {
                headerFormat: '{series.name}<br>',
                pointFormat: '{point.name}: <b>{point.percentage:.1f}%</b>'
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
            <div>
                <ReactHighcharts config={lineConfig}/>
                <ReactHighcharts config={pieConfig}/>
            </div>
        );
    }
}
export default MovieCount;