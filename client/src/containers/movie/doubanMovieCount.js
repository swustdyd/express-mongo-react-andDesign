/**
 * Created by Aaron on 2018/3/2.
 */
import React from 'react'
import { message } from 'antd'
import ReactHighcharts from 'react-highcharts' // Expects that Highcharts was loaded in the code.
import API from '../../common/api'

class DoubanMovieCount extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            groupData: {
                year: {
                    name: [],
                    value: []
                },
                types: [],
                languages: [],
                countries: []
            }
        }
    }

    componentDidMount(){
        this.getMoviesGroup();
    }

    rebuildMoviesData(data){        
        const newData = {
            year: {
                name: [],
                value: []
            },
            types: [],
            languages: [],
            countries: []
        };
        data.year.sort((a, b) => {
            return a._id - b._id;
        });

        data.year.forEach((item) => {
            newData.year.name.push(item._id);
            newData.year.value.push(item.count);
        });

        data.types.forEach((item) => {
            newData.types.push([item._id, item.count]);
        });

        data.languages.forEach((item) => {
            newData.languages.push([item._id, item.count]);
        });

        data.countries.forEach((item) => {
            newData.countries.push([item._id, item.count]);
        });

        return newData;
    }

    getMoviesGroup(){
        fetch(API.getGroupInfoOfDouban)
            .then((res) => {
                return res.json()
            }).then((data) => {
                if(data.success){
                    const groupData = this.rebuildMoviesData(data.result);
                    this.setState({groupData});
                }else{
                    message.error(data.message);
                }
            });
    }

    render(){
        const { groupData } = this.state;
        const yearConfig = {
            title: {
                text: '每年电影产量'
            },
            xAxis: {
                title: {
                    text: '年份'
                },
                categories: groupData.year.name
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
                data: groupData.year.value
            }]
        };

        const typesConfig = {
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false
            },
            title: {
                text: '电影各个分类占比'
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
                        format: '<b>{point.name}</b>: {point.percentage:.3f} %'
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
                name: '分类',
                data: groupData.types
            }]
        };

        const languagesConfig = {
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false
            },
            title: {
                text: '电影语种占比'
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
                        format: '<b>{point.name}</b>: {point.percentage:.3f} %'
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
                data: groupData.languages
            }]
        };

        const countriesConfig = {
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false
            },
            title: {
                text: '电影产地占比'
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
                        format: '<b>{point.name}</b>: {point.percentage:.3f} %'
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
                name: '产地',
                data: groupData.countries
            }]
        };

        return(
            <div className="user-count-container">
                <ReactHighcharts config={yearConfig}/>
                <ReactHighcharts config={typesConfig}/>
                <ReactHighcharts config={languagesConfig}/>
                <ReactHighcharts config={countriesConfig}/>
            </div>
        );
    }
}
export default DoubanMovieCount;