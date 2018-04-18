/**
 * Created by Aaron on 2018/3/14.
 */

import React from 'react'
import { Select, message} from 'antd';

const Option = Select.Option;

class YearRangePicker extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            startOfFirst: this.props.start || 2000,
            endOfFirst: this.props.end || 2050,
            startOfSecond: this.props.start || 2000,
            endOfSecond: this.props.end || 2050,
            valueOfFirst: undefined,
            valueOfSecond: undefined
        }
    }

    handleFirstChange(value){
        let nextState = Object.assign({}, this.state);
        if(!value){
            nextState.startOfSecond = this.state.startOfFirst;
        }
        if(value >= this.state.valueOfSecond){
            nextState.valueOfSecond = undefined;
            nextState.startOfSecond = value + 1;
        }
        nextState.valueOfFirst = value;
        nextState.startOfSecond = value ?  value + 1 : this.state.startOfFirst;
        //this.props.onChange({start: nextState.valueOfFirst, end: nextState.valueOfSecond});
        this.onChange({start: nextState.valueOfFirst, end: nextState.valueOfSecond});
        this.setState(nextState);
    }

    handleSecondChange(value){
        //this.props.onChange({start: this.state.valueOfFirst, end: value});
        this.onChange({start: this.state.valueOfFirst, end: value});
        this.setState({
            valueOfSecond: value
        });
    }

    onChange(value){
        const onChange = this.props.onChange;
        if (onChange) {
            onChange(value);
        }
    }

    getOptions(start, end){
        let options = [];
        for(let i = start; i <= end; i++){
            options.push(<Option key={i} value={i}>{i}</Option>)
        }
        return options;
    }

    handleFilterOption(input, option){
        return new String(option.props.children).toLowerCase().indexOf(input.toLowerCase()) >= 0;
    }

    render() {
        const {startOfFirst, endOfFirst, startOfSecond, endOfSecond, valueOfFirst, valueOfSecond} = this.state;
        return (
            <div>
                <Select
                    value={valueOfFirst}
                    allowClear
                    showSearch
                    style={{ width: 120 }}
                    placeholder="开始时间"
                    onChange={this.handleFirstChange.bind(this)}
                    filterOption={this.handleFilterOption.bind(this)}
                >
                    {this.getOptions(startOfFirst, endOfFirst)}
                </Select>
                &nbsp;-&nbsp;
                <Select
                    value={valueOfSecond}
                    allowClear
                    showSearch
                    style={{ width: 120 }}
                    placeholder="结束时间"
                    onChange={this.handleSecondChange.bind(this)}
                    filterOption={this.handleFilterOption.bind(this)}
                >
                    {this.getOptions(startOfSecond, endOfSecond)}
                </Select>
            </div>
        );
    }
}

export default YearRangePicker;