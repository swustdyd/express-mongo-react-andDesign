/**
 * Created by Aaron on 2018/3/5.
 */
import React from 'react'
import { Upload, Icon, Modal, message } from 'antd';

class PicturesWall extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            previewVisible: false,
            previewImage: '',
            fileList: this.props.fileList
        };
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
                console.log(obj);
                newFileList.push(obj);
            }
            this.props.onChangeCallBack(newFileList)
        }else if(file.response && file.response.success === false){
            message.error(file.response.message);fileList.forEach((item, index) => {
                if(item.uid === file.uid){
                    fileList.splice(index, 1);
                    return false;
                }
            });
        }
        this.setState({ fileList });
    }

    handleRemove(file){
        this.state.fileList.forEach((item, index) => {
           if(item.uid === file.uid){
               this.state.fileList.splice(index, 1);
               return false;
           }
        });
        this.props.onChangeCallBack(this.state.fileList);
        return false;
    }

    render() {
        let { previewVisible, previewImage, fileList } = this.state;
        fileList = fileList || [];
        const uploadButton = (
            <div>
                <Icon type="plus" />
                <div className="ant-upload-text">上传</div>
            </div>
        );
        const maxLength = this.props.maxLength || 3;
        return (
            <div className="pictures-wall">
                <Upload
                    name={this.props.name}
                    action={this.props.action}
                    listType={this.props.listType}
                    fileList={fileList}
                    onPreview={this.handlePreview.bind(this)}
                    onChange={this.handleChange.bind(this)}
                    onRemove={this.handleRemove.bind(this)}
                    accept=".jpg,.png"
                >
                    {fileList.length >= maxLength ? null : uploadButton}
                </Upload>
                <Modal
                    title="预览"
                    visible={previewVisible}
                    style={{top: '20px'}}
                    footer={null}
                    onCancel={this.handleCancel.bind(this)}
                >
                    <img alt="预览" style={{ width: '100%' }} src={previewImage} />
                </Modal>
            </div>
        );
    }
}
export default PicturesWall;