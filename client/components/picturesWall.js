/**
 * Created by Aaron on 2018/3/5.
 */
import React from 'react'
import { Upload, Icon, Modal, message, Popconfirm} from 'antd';
import PictureCut from './pictureCut'

import './picturesWall.scss'

const Operation = {
    Delete: 'delete',
    Edit: 'edit',
    Preview: 'eye-o'
};

/**
 * <PicturesWall
     name="poster"
     action="/movie/uploadPoster"
     cutAction="/movie/cutPoster"
     cutWidth={350}
     cutHeight={350}
     maxLength={1}
     defaultFileList={fileList}
     onChange={this.handleFileUploadChange}
     />
 */
class PicturesWall extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
            modalTitle: '',
            modalWidth: 600,
            cutWidth: this.props.cutWidth || 250,
            cutHeight: this.props.cutHeight || 250,
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

    handleEdit(item){
        let { cutWidth, cutHeight } = this.state;
        let currentImage = this.refs[`img${item.uid}`];
        if(currentImage.naturalWidth < cutWidth || currentImage.naturalHeight < cutHeight){
            message.error(
                `当前图片大小为${currentImage.naturalWidth}*${currentImage.naturalHeight}，不能剪切为${cutWidth}*${cutHeight}`
            )
        }else{
            this.setState({
                previewImage: item,
                modalVisible: true,
                modalTitle: `编辑：${item.name}`,
                operation: 'edit',
                modalWidth: 800
            });
        }
    }

    handlePreview(item) {
        this.setState({
            previewImage: item,
            modalVisible: true,
            modalTitle: `预览：${item.name}`,
            operation: 'preview'
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
        let newFileList = [];
        fileList.forEach(item => {
            newFileList.push(Object.assign({}, {name: item.name}, item));
        });
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
                        <Icon type={Operation.Edit} onClick={() => this.handleEdit(item)}/>
                        <Icon type={Operation.Preview} onClick={() => this.handlePreview(item)}/>
                        <Popconfirm
                            title="确认删除？"
                            cancelText="取消"
                            okText="确认"
                            onConfirm={() => this.handleRemove(item.uid)}
                        >
                            <Icon type={Operation.Delete}/>
                        </Popconfirm>
                    </div>
                    <img ref={`img${item.uid}`} src={item.url} alt={item.name} title={item.name}/>
                </div>
            )
        });
        return itemList;
    }

    render() {
        let { modalVisible, previewImage, fileList, operation, modalWidth, cutWidth, cutHeight, modalTitle } = this.state;
        const maxLength = this.props.maxLength || 3;
        const maskClosable = operation !== Operation.Edit;
        const extraClassName = operation !== Operation.Edit ? 'picture-preview' : '';
        const closable = operation === Operation.Edit;
        modalTitle = operation === Operation.Edit ? modalTitle : '';
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
                    className={extraClassName}
                    title={modalTitle}
                    visible={modalVisible}
                    style={{top: '20px'}}
                    footer={null}
                    width={modalWidth}
                    destroyOnClose={true}
                    maskClosable={maskClosable}
                    closable={closable}
                    onCancel={this.handleCancel.bind(this)}
                >
                    {
                        operation === 'edit' ?
                            <PictureCut
                                action={this.props.cutAction}
                                fileData={previewImage}
                                cutWidth={cutWidth}
                                cutHeight={cutHeight}
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