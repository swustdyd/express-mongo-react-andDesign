import React from 'react'
import { message } from 'antd'

import './canvas3D.scss'

export default class Canvas3D extends React.Component{


    constructor(props){
        super(props);
    }

    init(){
        const {canvas, gl} = this.state;
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        // Clear the color buffer with specified clear color
        gl.clear(gl.COLOR_BUFFER_BIT);
        l.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array([
                0, -100,
                150,  125,
                -175,  100
            ]),
            gl.STATIC_DRAW
        );
        gl.drawArrays(gl.TRIANGLE, 0, 9); 
    }

    componentDidMount(){
        const webglOptions = {
            // alpha: false,
            // stencil: false,
            // antialias: true,
            // depth: false
        };
        const {canvas} = this.refs;
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
        const gl = canvas.getContext('webgl', webglOptions) || canvas.getContext('experimental-webgl', webglOptions);
        if (!gl) {
            message.error('Unable to initialize WebGL. Your browser or machine may not support it.');
            return;
        }else{
            this.setState({
                canvas,
                gl
            });
            setTimeout(() => {
                this.init();
            }, 0);            
        }       
    }
    render(){
        return(
            <div className="canvas3d-page">
                <canvas ref="canvas"></canvas>
            </div>
        )
    }
}