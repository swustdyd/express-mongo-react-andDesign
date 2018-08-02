/**
 * Created by Aaron on 2018/3/2.
 */
import React from 'react'
import { message, Spin } from 'antd'
import ReactHighcharts from 'react-highcharts' // Expects that Highcharts was loaded in the code.
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import MovieAction from '../../actions/movie/movieAction'

import './movieCount.scss'

class MovieCount extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            moviesOfEachYear: [],
            moviesOfEachLanguage: [],
            moviesOfEachContry: [],
            moviesOfEachType: [],
            yearLoading: false,
            languageLoading: false,
            countryLoading: false,
            typeLoading: false
        }
    }

    componentDidMount(){
        this.setState({
            yearLoading: true,
            languageLoading: true,
            countryLoading: true,
            typeLoading: true
        })
        const delay = 800;
        
        this.getMoviesGroup('year', (data) => {            
            setTimeout(() => {                                       
                this.setState({
                    moviesOfEachYear: this.rebuildMoviesDataByYear(data.result),
                    yearLoading: false
                })
            }, delay);
        });

        this.getMoviesGroup('language', (data) => {
            setTimeout(() => {                                                
                this.setState({
                    moviesOfEachLanguage: this.rebuildMoviesData(data.result, 'language'),
                    languageLoading: false
                })
            }, delay);
        });

        this.getMoviesGroup('country', (data) => {            
            setTimeout(() => {                                       
                this.setState({
                    moviesOfEachContry: this.rebuildMoviesData(data.result, 'country'),
                    countryLoading: false
                })
            }, delay);
        });

        this.getMoviesGroup('type', (data) => {            
            setTimeout(() => {                                       
                this.setState({
                    moviesOfEachType: this.rebuildMoviesData(data.result, 'type'),
                    typeLoading: false
                })
            }, delay);
        });
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

    rebuildMoviesData(data, key){
        const newData = [];
        data.forEach((item) => {
            if(item.count >= 10 && item[key]){
                newData.push([item[key], item.count]);
            } 
        });
        return newData;
    }

    getMoviesGroup(grounpKey, whereArray, callback){
        if(typeof whereArray === 'function'){
            callback = whereArray;
            whereArray = [];
        }
        this.props.movieAction.getMovieByGroup(grounpKey, whereArray, (err, data) => {
            if(err){
                message.error(err.message);
            }else{
                if(data.success){
                    if(callback){
                        callback(data);
                    }
                }else{
                    message.error(data.message);
                }
            }
        })
    }

    getYearConfig(){
        const { moviesOfEachYear } = this.state;
        const yearConfig = {
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
        return yearConfig;
    }

    getLanguageConfig(){
        const { moviesOfEachLanguage } = this.state;
        const languageConfig = {
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
        return languageConfig;
    }

    getCountryConfig(){
        const {moviesOfEachContry} = this.state;
        const countryConfig = {
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false
            },
            title: {
                text: '地区产量对比'
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
                size: '80%',
                innerSize: '60%',
                type: 'pie',
                name: '产地',
                data: moviesOfEachContry
            }]
        };
        return countryConfig;
    }

    getTypeConfig(){
        const {moviesOfEachType} = this.state;
        const typeConfig = {
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false
            },
            title: {
                text: '电影类型百分比'
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
                size: '80%',
                innerSize: '60%',
                type: 'pie',
                name: '类型',
                data: moviesOfEachType
            }]
        };
        return typeConfig;
    }

    render(){
        const { yearLoading, languageLoading, countryLoading, typeLoading } = this.state;
        
        return(
            <div className="user-count-container">
                <div className="count-item">
                    <Spin tip="loading..." spinning={yearLoading}>
                        <ReactHighcharts config={this.getYearConfig()}/>
                    </Spin>
                </div>
                <div className="count-item">
                    <Spin tip="loading..." spinning={languageLoading}>
                        <ReactHighcharts config={this.getLanguageConfig()}/>
                    </Spin>
                </div>
                <div className="count-item">
                    <Spin tip="loading..." spinning={countryLoading}>
                        <ReactHighcharts config={this.getCountryConfig()}/>
                    </Spin>
                </div>
                <div className="count-item">
                    <Spin tip="loading..." spinning={typeLoading}>
                        <ReactHighcharts config={this.getTypeConfig()}/>
                    </Spin>
                </div>
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