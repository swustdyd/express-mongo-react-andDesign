/**
 * Created by Aaron on 2018/3/14.
 */

import React from 'react'
import { DatePicker, message} from 'antd';

class YearRangePicker extends React.Component {
    constructor(){
        super();
        this.state = {
            startValue: null,
            endValue: null
        };

    }

    disabledStartDate(startValue){
        const endValue = this.state.endValue;
        if (!startValue || !endValue) {
            return false;
        }
        return startValue.valueOf() > endValue.valueOf();
    }

    disabledEndDate(endValue){
        const startValue = this.state.startValue;
        if (!endValue || !startValue) {
            return false;
        }
        return endValue.valueOf() <= startValue.valueOf();
    }

    handleStartPanelChange(value){
        this.setState({ startValue: value });
    }

    handleEndPanelChange(value){
        this.setState({ endValue: value });
    }

    render() {
        const { startValue, endValue} = this.state;
        return (
            <div>
                <DatePicker
                    disabledDate={this.disabledStartDate.bind(this)}
                    showTime
                    format="YYYY"
                    value={startValue}
                    placeholder="Start"
                    onPanelChange={this.handleStartPanelChange.bind(this)}
                    mode="year"
                />
                &nbsp;-&nbsp;
                <DatePicker
                    disabledDate={this.disabledEndDate.bind(this)}
                    showTime
                    format="YYYY"
                    value={endValue}
                    placeholder="End"
                    onPanelChange={this.handleEndPanelChange.bind(this)}
                    mode="year"
                />
            </div>
        );
    }
}

export default YearRangePicker;