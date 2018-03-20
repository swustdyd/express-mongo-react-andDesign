/**
 * Created by Aaron on 2018/3/20.
 */
import React from 'react'
import { Button, Slider} from 'antd'

import './pictureCut.scss'

class PictureCut extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            width: 500,
            height: 500,
            cutWidth: 250,
            cutHeight: 250,
            cutArea: undefined,
            isMouseDown: false,
            scale: 1,
            originPosition: {x: 0, y: 0},
            lastMosePosition: undefined,
            canvas: undefined,
            context: undefined,
            image: undefined
        };

        this.handleSliderChange = this.handleSliderChange.bind(this);
        this.handleCanvasMouseDown = this.handleCanvasMouseDown.bind(this);
        this.handleCanvasMouseUp = this.handleCanvasMouseUp.bind(this);
        this.handleCanvasMouseMove = this.handleCanvasMouseMove.bind(this);
        this.handleCanvasMouseOut = this.handleCanvasMouseOut.bind(this);
        this.handleSaveClick = this.handleSaveClick.bind(this);
        this.handleRestClick = this.handleRestClick.bind(this);
    }

    createCanvas(){
        let { fileData } = this.props;
        let pictureCutCanvas = this.refs.pictureCutCanvas;
        let context = pictureCutCanvas.getContext('2d');
        let magnifierCanvas = this.refs.magnifierCanvas;
        let magnifierCanvasContext = magnifierCanvas.getContext('2d');
        let img = new Image();
        let _this = this;
        img.onload = function () {
            _this.setState({
                context: context,
                canvas: pictureCutCanvas,
                magnifierCanvas: magnifierCanvas,
                magnifierCanvasContext: magnifierCanvasContext,
                image: img
            });
            _this.draw();
        };
        img.src = fileData.src;
    }

    draw() {
        let {
            canvas, context, image, magnifierCanvas, magnifierCanvasContext,
            cutHeight, cutWidth, scale, originPosition
        } = this.state;
        let drawWidth = image.width * scale;
        let drawHeight = image.height * scale;
        let clearArea = {
            x: (canvas.width - cutWidth)/2,
            y: (canvas.height - cutHeight)/2,
            width: cutWidth,
            height: cutHeight
        };
        let cutArea = {
            x: (clearArea.x - originPosition.x) / scale,
            y: (clearArea.y - originPosition.y) / scale,
            width: cutWidth / scale,
            height: cutHeight / scale
        };
        console.log(cutArea);
        context.clearRect(0, 0, canvas.width, canvas.height);
        magnifierCanvasContext.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(image, originPosition.x, originPosition.y, drawWidth, drawHeight);
        magnifierCanvasContext.fillStyle = 'rgba(0,0,0,0.5)';
        magnifierCanvasContext.rect(0, 0, canvas.width, canvas.height);
        magnifierCanvasContext.fill();
        magnifierCanvasContext.clearRect(clearArea.x, clearArea.y, clearArea.width, clearArea.height);
        context.drawImage(magnifierCanvas, 0, 0, canvas.width, canvas.height);
    }

    getCanvasMousePosition(x, y) {
        let { canvas} = this.state;
        let position = {};
        position.x = Math.round(x - canvas.getBoundingClientRect().left);//缩放页面仍可正确的计算出相对位置
        position.y = Math.round(y - canvas.getBoundingClientRect().top);
        return position;
    }

    handleCanvasMouseDown(e) {
        this.setState({
            isMouseDown: true,
            lastMosePosition: this.getCanvasMousePosition(e.clientX, e.clientY)
        });
    }

    handleCanvasMouseMove(e) {
        let { isMouseDown, originPosition, lastMosePosition} = this.state;
        if(isMouseDown){
            let currentMousePosition = this.getCanvasMousePosition(e.clientX, e.clientY);
            originPosition.x += currentMousePosition.x - lastMosePosition.x;
            originPosition.y += currentMousePosition.y - lastMosePosition.y;
            this.setState({
                originPosition: originPosition,
                lastMosePosition: currentMousePosition
            });
            this.draw();
        }
    }

    handleCanvasMouseUp() {
        this.setState({
            isMouseDown: false,
            lastMosePosition: undefined
        });
    }

    handleCanvasMouseOut() {
        this.setState({
            isMouseDown: false,
            lastMosePosition: undefined
        });
    }

    handleSliderChange(value){
        let { scale, originPosition} = this.state;
        let newScale = value / 100.0;
        originPosition.x = originPosition.x * (1 + (newScale - scale));
        originPosition.y = originPosition.y * (1 + (newScale - scale));
        this.setState({
            scale: newScale,
            originPosition: originPosition
        });
        this.draw();
    }

    handleSaveClick(){
        let {cutArea} = this.state;

    }

    handleRestClick(){
        this.setState({
            cutArea: undefined,
            isMouseDown: false,
            scale: 1,
            originPosition: {x: 0, y: 0}
        });
        this.draw();
    }

    componentDidMount(){
        this.createCanvas();
    }

    render(){
        return(
            <div>
                <div style={{textAlign: 'center'}}>
                    <div style={{height: 300, float: 'right', marginRight: 20}}>
                        <Slider
                            vertical
                            onChange={this.handleSliderChange}
                            defaultValue={this.state.scale * 100}
                            max={200}
                            min={30}
                            tipFormatter={value=> value / 100.0 }
                        />
                    </div>
                    <canvas
                        ref="pictureCutCanvas"
                        width={this.state.width}
                        height={this.state.height}
                        onMouseDown={this.handleCanvasMouseDown}
                        onMouseUp={this.handleCanvasMouseUp}
                        onMouseMove={this.handleCanvasMouseMove}
                        onMouseOut={this.handleCanvasMouseOut}
                    />
                    <canvas
                        ref="magnifierCanvas"
                        style={{display: 'none'}}
                        width={this.state.width}
                        height={this.state.height}
                    />
                </div>
                <div style={{textAlign: 'right'}}>
                    <Button type="danger" onClick={this.handleRestClick}>重置</Button>
                    <Button type="primary" onClick={this.handleSaveClick}>保存</Button>
                </div>
            </div>
        );
    }
}

export default PictureCut;