/**
 * Created by Aaron on 2018/3/20.
 */
import React from 'react'
import { Button, Slider, message} from 'antd'

import './pictureCut.scss'

class PictureCut extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            width: 500,
            height: 500,
            cutWidth: Math.min(this.props.cutWidth || 250, 500),
            cutHeight: Math.min(this.props.cutHeight || 250, 500),
            cutArea: undefined,
            clearArea: undefined,
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
    }

    createCanvas(){
        let { fileData } = this.props;
        let { cutWidth, cutHeight } = this.state;
        let pictureCutCanvas = this.refs.pictureCutCanvas;
        let context = pictureCutCanvas.getContext('2d');
        let magnifierCanvas = this.refs.magnifierCanvas;
        let magnifierCanvasContext = magnifierCanvas.getContext('2d');
        let img = new Image();
        let _this = this;
        img.onload = function () {
            let clearArea = {
                x: (pictureCutCanvas.width - cutWidth)/2,
                y: (pictureCutCanvas.height - cutHeight)/2,
                width: cutWidth,
                height: cutHeight
            };
            _this.setState({
                context: context,
                canvas: pictureCutCanvas,
                magnifierCanvas: magnifierCanvas,
                magnifierCanvasContext: magnifierCanvasContext,
                image: img,
                clearArea: clearArea,
                cutArea: clearArea,
                originPosition: {
                    x: clearArea.x,
                    y: clearArea.y
                }
            });
            _this.draw();
        };
        img.src = fileData.url;
    }

    draw() {
        let {
            canvas, context, image, magnifierCanvas, magnifierCanvasContext,
            scale, originPosition, clearArea
        } = this.state;
        let drawWidth = image.width * scale;
        let drawHeight = image.height * scale;
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
        let {
            isMouseDown, originPosition, lastMosePosition,
            clearArea, cutWidth, cutHeight, scale, image
        } = this.state;
        if(isMouseDown){
            let currentMousePosition = this.getCanvasMousePosition(e.clientX, e.clientY);
            let newOriginPosition = {
                x: originPosition.x + currentMousePosition.x - lastMosePosition.x,
                y: originPosition.y + currentMousePosition.y - lastMosePosition.y
            };

            //边界判断
            if(newOriginPosition.x > clearArea.x){
                newOriginPosition.x = clearArea.x;
            }
            if(newOriginPosition.y > clearArea.y){
                newOriginPosition.y = clearArea.y;
            }
            if(newOriginPosition.x + image.width * scale < clearArea.x + cutWidth ){
                newOriginPosition.x = clearArea.x + cutWidth - image.width * scale;
            }

            if(newOriginPosition.y + image.height * scale < clearArea.y + cutHeight ){
                newOriginPosition.y = clearArea.y + cutHeight - image.height * scale;
            }

            let cutAreaX = (clearArea.x - newOriginPosition.x) / scale,
                cutAreaY = (clearArea.y - newOriginPosition.y) / scale,
                cutAreaWidth = Math.min(image.width  - cutAreaX, cutWidth / scale),
                cutAreaHeight = Math.min(image.height - cutAreaY, cutHeight / scale);

            let newCutArea = {
                x: parseInt(cutAreaX),
                y: parseInt(cutAreaY),
                width: parseInt(cutAreaWidth),
                height: parseInt(cutAreaHeight)
            };
            this.setState({
                originPosition: newOriginPosition,
                lastMosePosition: currentMousePosition,
                cutArea: newCutArea
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
        let {
            scale, originPosition, image,
            clearArea, cutWidth, cutHeight
        } = this.state;
        let newScale = value / 100.0;
        originPosition.x = originPosition.x * (1 + (newScale - scale));
        originPosition.y = originPosition.y * (1 + (newScale - scale));

        //边界判断
        if(originPosition.x > clearArea.x){
            originPosition.x = clearArea.x;
            newScale = scale;
        }

        if(originPosition.y > clearArea.y){
            originPosition.y = clearArea.y;
            newScale = scale;
        }

        if(originPosition.x + image.width * scale < clearArea.x + cutWidth ){
            originPosition.x = clearArea.x + cutWidth - image.width * scale;
            newScale = scale;
        }

        if(originPosition.y + image.height * scale < clearArea.y + cutHeight ){
            originPosition.y = clearArea.y + cutHeight - image.height * scale;
            newScale = scale;
        }
        let cutArea = {
            x: (clearArea.x - originPosition.x) / scale,
            y: (clearArea.y - originPosition.y) / scale,
            width: cutWidth / scale,
            height: cutHeight / scale
        };

        this.setState({
            cutArea: cutArea,
            scale: newScale,
            originPosition: originPosition
        });

        this.draw();
    }

    handleSaveClick(){
        let _this = this;
        let { cutArea, cutWidth, cutHeight} = this.state;
        let path = this.props.action;
        let { fileData } = this.props;
        fetch(path, {
            method: 'post',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({file: fileData, cutArea: cutArea, resizeWidth: cutWidth, resizeHeight: cutHeight})
        }).then(res => res.json())
            .then(data => {
                if(data.success){
                    _this.props.onSave(data.result);
                }else {
                    message.error(data.message);
                }
            })
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
                            value={this.state.scale * 100}
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
                    <Button type="primary" onClick={this.handleSaveClick}>保存</Button>
                </div>
            </div>
        );
    }
}

export default PictureCut;