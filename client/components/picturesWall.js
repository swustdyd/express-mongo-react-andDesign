/**
 * Created by Aaron on 2018/3/5.
 */
import React from 'react'
import { Upload, Icon, Modal, message } from 'antd';
import PictureCut from './pictureCut'

import './picturesWall.scss'

class PicturesWall extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
            modalTitle: '',
            previewImage: '',
            fileList: this.props.fileList
        };
        /*this.handlePicItemMouseEnter = this.handlePicItemMouseEnter.bind(this);
        this.handlePicItemMouseOut = this.handlePicItemMouseOut.bind(this);*/
    }

    handleCancel(){
        this.setState({ previewVisible: false });
    }

    handlePreview(file) {
        this.setState({
            previewImage: file.url || file.thumbUrl,
            previewVisible: true,
        });
    }

    handleChange(info){
        let {fileList, file} = info;
        if(file.response && file.response.success){
            let newFileList = [];
            for(let i = 0; i < fileList.length; i++){
                let item = fileList[i];
                let obj = {
                    filename: item.filename || file.response.result[0].filename,
                    displayName: item.displayName || file.response.result[0].originalname,
                    src: item.src || file.response.result[0].src
                };
                newFileList.push(obj);
            }
            this.props.onChange(newFileList)
        }else if(file.response && file.response.success === false){
            message.error(file.response.message);
            fileList.forEach((item, index) => {
                if(item.uid === file.uid){
                    fileList.splice(index, 1);
                    return false;
                }
            });
        }
        this.setState({
            fileList: fileList
        });
    }

    handleRemove(file){
        this.state.fileList.forEach((item, index) => {
           if(item.uid === file.uid){
               this.state.fileList.splice(index, 1);
               return false;
           }
        });
        this.props.onChange(this.state.fileList);
        return false;
    }

    handlePicItemMouseEnter(uid){
        this.setState({
            activeItem: uid
        })
    }

    handlePicItemMouseOut(){
        this.setState({
            activeItem: undefined
        })
    }

    getPictureList(fileList){
        let itemList = [];
        let _this = this;
        fileList.forEach((item, index) => {
            itemList.push(
                <div className="picture-item"
                     key={item.uid}
                     onMouseEnter={ () => this.handlePicItemMouseEnter(item.uid)}
                     onMouseOut={() => this.handlePicItemMouseOut(item.uid)}
                >
                    <div className={`picture-item-drop ${_this.state.activeItem === item.uid ? 'active' : ''}`}>
                        <Icon type="delete"/>
                        <Icon type="delete"/>
                        <Icon type="delete"/>
                    </div>
                    <img src={item.url} alt={item.name} title={item.name}/>
                </div>
            )
        });
        return itemList;
    }

    render() {
        let { previewVisible, previewImage, fileList, cutImage } = this.state;
        fileList = fileList || [];
        const maxLength = this.props.maxLength || 3;
        return (
            <div className="pictures-wall">
                { fileList.length >= maxLength ?
                    this.getPictureList(fileList) :
                    <Upload
                        name={this.props.name}
                        action={this.props.action}
                        fileList={fileList}
                        onPreview={this.handlePreview.bind(this)}
                        onChange={this.handleChange.bind(this)}
                        onRemove={this.handleRemove.bind(this)}
                        accept=".jpg,.png"
                    >
                        <div className="btn-upload">
                            <Icon type="inbox" />
                            <div className="btn-upload-text">点击上传</div>
                        </div>
                    </Upload>
                }
                <Modal
                    title={this.state.modalTitle}
                    visible={previewVisible}
                    style={{top: '20px'}}
                    footer={null}
                    onCancel={this.handleCancel.bind(this)}
                >
                    {
                        this.state.type === 'cut' ?
                            <PictureCut action="/movie/cutPoster" fileData={cutImage} onSave={this.handlePictureCutSave}/> :
                            <img alt="预览" style={{ width: '100%' }} src={previewImage} />
                    }
                </Modal>
            </div>
        );
    }
}
export default PicturesWall;