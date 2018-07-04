import React from 'react'

import './index.scss'

export default class CanvasPage extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            play: false
        }
    }
    /** 
     * 绘制一条曲线路径
     * @param {Object} ctx canvas渲染上下文 
     * @param {Array<number>} start 起点 
     * @param {Array<number>} end 终点 
     * @param {number} curveness 曲度(0-1) 
     * @param {number} percent 绘制百分比(0-100) 
     */
    drawCurvePath(ctx, start, end, curveness, percent) { 
        const cp = [ 
            ( start[0] + end[0] ) / 2 - (start[1] - end[1] ) * curveness, 
            ( start[1] + end[1] ) / 2 - (end[0] - start[0] ) * curveness 
        ]; 
        ctx.moveTo( start[0], start[1] ); 
        for ( let t = 0; t <= percent / 100; t += 0.01 ) { 
            const x = this.quadraticBezier( start[0], cp[0], end[0], t ); 
            const y = this.quadraticBezier( start[1], cp[1], end[1], t ); 
            ctx.lineTo( x, y ); 
        }
    }

    quadraticBezier(p0, p1, p2, t) {
        const k = 1 - t; 
        return k * k * p0 + 2 * ( 1 - t ) * t * p1 + t * t * p2;  
    }
    
    componentDidMount(){
        const {canvas} = this.refs;
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
        const context = canvas.getContext('2d');
        context.lineWidth = 6;
        context.strokeStyle = '#333';
        let percent = 0;
        function animation(){
            context.clearRect( 0, 0,  canvas.width, canvas.height );
            context.beginPath();
            this.drawCurvePath(context, [100, 100], [600, 500], 0.2, percent);
            context.stroke();
            percent = (percent + 1) % 100;
            requestAnimationFrame(animation)
        }
        setTimeout(() => {          
            animation.call(this);
        }, 2000);
    }
    render(){
        return(
            <div className="canvas-page">
                <h2>Canvas Page</h2>
                <canvas ref="canvas"></canvas>
            </div>
        )
    }
}