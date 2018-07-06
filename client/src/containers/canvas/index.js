import React from 'react'
import {Button, Slider} from 'antd'

import './index.scss'

export default class CanvasPage extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            play: false, 
            yOffset: 300,
            xOffset: 0, 
            r: 10, 
            padding: 1,
            xSpeed: 3, 
            ySpeed: 0.01, 
            maxWaveHeight: 100,
            waveHeight: 100,
            waveWidth: 0.01,
            direction: 'up'
        }
    }
    
    /**
     * 获取杨辉三角
     * @param {*} col 行数 >= 3 
     */
    getMi(col: number){
        col = Math.max(col, 3);
        //计算杨辉三角
        const mi = [];
        mi[0] = mi[1] = 1;
        for (let i = 3; i <= col; i++) {

            const t = [];
            for (let j = 0; j < i - 1; j++) {
                t[j] = mi[j];
            }

            mi[0] = mi[i - 1] = 1;
            for (let j = 0; j < i - 2; j++) {
                mi[j + 1] = t[j] + t[j + 1];
            }
        }
        return mi;
    }

    getCalculateArray(poss: [][], mi, precision: number) {
        const result = [];
        //计算坐标点
        for (let i = 0; i < precision; i++) {
            const percent = i / precision * 100;
            const oneResult = this.calculate(poss, mi, percent)
            if(oneResult){
                result.push(oneResult);
            }else{
                break;
            }
        }
        return result;
    }

    /**
     * 返回曲线上的某一点坐标
     * @param {*} poss 控制点，控制点数不小于 2 ，至少为二维坐标系
     * @param {*} mi 杨辉三角，与控制点的数目一致
     * @param {*} percent 百分比，0-100
     */
    calculate(poss: [][], mi, percent: number){
        //维度，坐标轴数（二维坐标，三维坐标...）
        const dimersion = poss[0].length;

        //贝塞尔曲线控制点数（阶数）
        const number = poss.length;

        //控制点数不小于 2 ，至少为二维坐标系
        if (number < 2 || dimersion < 2)
            return null;        

        //计算坐标点
        const t = percent / 100;

        const result = [];
        for (let j = 0; j < dimersion; j++) {
            let temp = 0;
            for (let k = 0; k < number; k++) {
                temp += Math.pow(1 - t, number - k - 1) * poss[k][j] * Math.pow(t, k) * mi[k];
            }
            result.push(temp);
        }
        return result;
    }

    lineAndArc(){
        console.log('do animation');
        const {play} = this.state;
        if(play){
            const {arcContext, arcCanvas, canvas, context} = this.state;
            const controlPoint = [
                [100, 300], 
                [300, -300],
                [300, 900],
                [500, 300]
            ];            
            const mi = this.getMi(controlPoint.length);
            const beginPoint = [controlPoint[0][0], controlPoint[0][1]];

            context.clearRect( 0, 0,  canvas.width, canvas.height );
            context.beginPath();
            context.moveTo(beginPoint[0], beginPoint[1]);
            //let i = 0; 
            let x = beginPoint[0];
            const length = 1000;
            const animation = () => {
                if(x < length){
                    //const position = this.calculate(controlPoint, mi, i);
                    const position = [
                        x,
                        -100 * Math.sin((x - beginPoint[0]) * 0.02) + 300
                    ]
                    arcContext.clearRect(0, 0, arcCanvas.width, arcCanvas.height);
                    arcContext.beginPath();
                    arcContext.arc(position[0], position[1], 10, 0, 2 * Math.PI);
                    arcContext.stroke();

                    context.lineTo(position[0], position[1]);
                    context.stroke();  
                    //i = i + 0.1;
                    x += 1;
                    requestAnimationFrame(animation);
                }else{
                    cancelAnimationFrame(animation);
                }
            }       
            animation();
        }        
    }

    waveLine(){
        let xOffset = 0;
        const animation = () => {
            this.drawSin(xOffset);
            xOffset+= 5;
            requestAnimationFrame(animation)
        }
        animation();
    }

    drawBallWaveLine(){            
        const {context, canvas, startX, endX, yOffset, r, padding} = this.state;
        let {xOffset} = this.state;
        const  number = Math.floor((endX - startX) / 2 / (r + padding));

        const animation = () => {
            const {xSpeed, ySpeed, waveWidth, waveHeight} = this.state;
            context.save();
            context.clearRect(0, 0,  canvas.width, canvas.height );

            //设置背景颜色
            const lgd = context.createLinearGradient(0, 0, canvas.width, canvas.height);
            lgd.addColorStop(0, '#3a6186');
            lgd.addColorStop(1, '#89253a');
            context.fillStyle = lgd;
            context.fillRect(0, 0, canvas.width, canvas.height);

            for(let i = 0; i < number; i++){                
                const x = i * 2 * (r + padding) + startX;
                const y = waveHeight * Math.sin((x + xOffset) * waveWidth) + yOffset;
                const point = {x, y};

                context.save();
                const grd = context.createRadialGradient(point.x, point.y, 0, point.x, point.y, r);        
                grd.addColorStop(0, '#90f7ec');//90f7ec,a0fe65,5efce8
                grd.addColorStop(1, '#32ccbc');//32ccbc,fa016d,736efe

                context.shadowColor = '#90f7ec';
                context.shadowBlur = 10;
                context.shadowOffsetX = 0;
                context.shadowOffsetY = 0;

                context.fillStyle = grd;
                context.beginPath();
                context.arc(point.x, point.y, r, 0, 2 * Math.PI);
                context.fill();
                context.restore();
            }
            context.restore();
            xOffset += xSpeed;
            const {play} = this.state;
            if(play){
                requestAnimationFrame(animation)
            }else{
                this.setState({
                    xOffset,
                    waveHeight
                })
                cancelAnimationFrame(animation);
            }
        }
        animation();
    }
    
    componentDidMount(){
        const {canvas, arcCanvas} = this.refs;
        arcCanvas.width = canvas.width = canvas.clientWidth;
        arcCanvas.height = canvas.height = canvas.clientHeight;
        const context = canvas.getContext('2d');        
        const arcContext = arcCanvas.getContext('2d');
        const startX = 500;
        this.setState({
            canvas,
            context,
            arcCanvas,
            arcContext,
            play: true,
            startX, 
            endX: canvas.width - startX
        })
        setTimeout(() => {
            this.drawBallWaveLine();
        }, 0);
    }

    onPlayButtonClick(){
        const {play} = this.state;
        setTimeout(() => {       
            this.drawBallWaveLine();
        }, 0);
        this.setState({
            play: !play
        })
    }

    onSpeedChange(value){
        this.setState({
            xSpeed: value
        })
    }

    onWaveWidthChange(value){
        // waveWidth在0.01~0.03之间可以友好显示，值越小，波宽越宽
        // value的的值在0-10之间，计算方式如下
        this.setState({
            waveWidth: (30 - value * 2) / 1000
        })
    }

    onMaxWaveHeightChange(value){
        this.setState({
            waveHeight: value * 10
        })
    }

    render(){
        const {play, xSpeed, waveHeight, waveWidth} = this.state;
        return(
            <div className="canvas-page">
                <div className="canvas-control">
                    <Button className="play" type="primary" onClick={() => {this.onPlayButtonClick()}}>{play ? 'stop' : 'play'}</Button>                    
                    <span>振幅：</span>
                    <Slider onChange={(value) => {this.onMaxWaveHeightChange(value)}} defaultValue={waveHeight} max={10}/>
                    <span>波宽：</span>
                    <Slider onChange={(value) => {this.onWaveWidthChange(value)}} defaultValue={15 - 500 * waveWidth} max={10} min={1}/>
                    <span>speed：</span>
                    <Slider onChange={(value) => {this.onSpeedChange(value)}} defaultValue={xSpeed} max={10}/>
                </div>
                <canvas ref="canvas"></canvas>
                <canvas ref="arcCanvas"></canvas>
            </div>
        )
    }
}