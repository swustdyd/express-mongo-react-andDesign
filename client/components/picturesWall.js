/**
 * Created by Aaron on 2018/3/5.
 */
import React from 'react'
import { Upload, Icon, Modal } from 'antd';

class PicturesWall extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            previewVisible: false,
            previewImage: '',
            fileList: this.props.fileList || []
        };
        this.handleChange = this.handleChange.bind(this);
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
        let fileList = info.fileList;
        this.setState({ fileList });
    }

    render() {
        const { previewVisible, previewImage, fileList } = this.state;
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
                    fileList={this.state.fileList}
                    onPreview={this.handlePreview}
                    onChange={this.handleChange}
                >
                    {fileList.length >= maxLength ? null : uploadButton}
                </Upload>
                <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal>
            </div>
        );
    }
}
export default PicturesWall;