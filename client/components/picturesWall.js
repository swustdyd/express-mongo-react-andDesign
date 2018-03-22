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
            modalWidth: 600,
            previewImage: '',
            fileList: this.props.defaultFileList || []
        };
        this.handleBeforeUpload = this.handleBeforeUpload.bind(this);
        this.handlePictureCutSave = this.handlePictureCutSave.bind(this);
    }

    handleCancel(){
        this.setState({
            modalTitle: '',
            modalVisible: false,
            modalWidth: 600
        });
    }

    handleEdit(uid){
        let { fileList } = this.state;
        fileList.forEach((item, index) => {
            if(item.uid === uid){
                this.setState({
                    previewImage: item,
                    modalVisible: true,
                    modalTitle: `编辑：${item.name}`,
                    operation: 'edit',
                    modalWidth: 800
                });
            }
        });
    }

    handlePreview(uid) {
        let { fileList } = this.state;
        fileList.forEach((item, index) => {
            if(item.uid === uid){
                console.log(uid, this);
                this.setState({
                    previewImage: item,
                    modalVisible: true,
                    modalTitle: `预览：${item.name}`,
                    operation: 'preview'
                });
            }
        });
    }

    handleBeforeUpload(file){
        let _this = this;
        let { fileList } = _this.state;
        let formData = new FormData();
        formData.append(_this.props.name, file);
        fetch(_this.props.action, {
            method: 'post',
            //同域名下，会带上cookie，否则后端根据sessionid获取不到对应的session
            credentials: 'include',
            body: formData
        }).then(res => res.json())
            .then(data => {
                if(data.success){
                    message.success(data.message);
                    fileList.push(Object.assign(file, {filename: data.result[0].filename, url: data.result[0].url}));
                    _this.setState({
                        fileList: fileList
                    });
                    this.handleChange(fileList);
                }else{
                    message.error(data.message);
                }
            }).catch(err => {
                message.error(err.message);
        });
        return false;
    }

    handleChange(fileList){
        console.log(fileList)
        let newFileList = [];
        fileList.forEach(item => {
            console.log(item.name);
            newFileList.push(Object.assign({},{name: item.name}, item));
        });
        console.log(newFileList)
        if(this.props.onChange){
            this.props.onChange(newFileList);
        }
    }

    handleRemove(uid){
        let {fileList} = this.state;
        fileList.forEach((item, index) => {
           if(item.uid === uid){
               fileList.splice(index, 1);
               return false;
           }
        });
        this.setState({
            fileList: fileList
        });
        this.handleChange(fileList);
    }

    handlePicItemMouseEnter(uid){
        this.setState({
            activeItem: uid
        })
    }

    handlePicItemMouseMove(uid){
        this.setState({
            activeItem: uid
        })
    }

    handlePicItemMouseLeave(){
        this.setState({
            activeItem: undefined
        })
    }

    handlePictureCutSave(file){
        let {fileList} = this.state;
        fileList.forEach(item => {
            if(item.uid === file.uid){
                item.url = file.url;
                return false;
            }
        });
        this.setState({
            fileList: fileList,
            modalVisible: false
        });
        this.handleChange(fileList);
    }

    getPictureList(fileList){
        let itemList = [];
        let _this = this;
        fileList.forEach((item, index) => {
            itemList.push(
                <div className="picture-item"
                     key={item.uid}
                     onMouseEnter={ () => this.handlePicItemMouseEnter(item.uid)}
                     onMouseLeave={() => this.handlePicItemMouseLeave(item.uid)}
                     onMouseMove={() => this.handlePicItemMouseMove(item.uid)}
                >
                    <div className={`picture-item-drop ${_this.state.activeItem === item.uid ? 'active' : ''}`}>
                        <Icon type="edit" onClick={() => this.handleEdit(item.uid)}/>
                        <Icon type="eye-o" onClick={() => this.handlePreview(item.uid)}/>
                        <Icon type="delete" onClick={() => this.handleRemove(item.uid)}/>
                    </div>
                    <img src={item.url} alt={item.name} title={item.name}/>
                </div>
            )
        });
        return itemList;
    }

    render() {
        let { modalVisible, previewImage, fileList, operation, modalWidth } = this.state;
        const maxLength = this.props.maxLength || 3;
        return (
            <div className="pictures-wall">
                {this.getPictureList(fileList)}
                { fileList.length >= maxLength ? '' :
                    <div className="picture-upload">
                        <Upload
                            action={this.props.action}
                            fileList={fileList}
                            beforeUpload={this.handleBeforeUpload}
                            accept=".jpg,.png"
                        >
                            <div className="btn-upload">
                                <Icon type="inbox" />
                                <div className="btn-upload-text">点击上传</div>
                            </div>
                        </Upload>
                    </div>
                }
                <Modal
                    title={this.state.modalTitle}
                    visible={modalVisible}
                    style={{top: '20px'}}
                    footer={null}
                    width={modalWidth}
                    onCancel={this.handleCancel.bind(this)}
                >
                    {
                        operation === 'edit' ?
                            <PictureCut
                                action={this.props.cutAction}
                                fileData={previewImage}
                                onSave={this.handlePictureCutSave}
                            /> :
                            <img
                                alt="预览"
                                style={{ width: '100%' }}
                                src={previewImage.url || previewImage.thumbUrl}
                            />
                    }
                </Modal>
            </div>
        );
    }
}
export default PicturesWall;