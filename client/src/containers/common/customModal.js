/**
 * Created by Aaron on 2018/3/10.
 */
import React from 'react'
import { Modal } from 'antd'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import ModalAction from '../../actions/common/customModal'

import './customModal.scss'

class CustomModal extends React.Component{
    render(){
        let { modalState } = this.props;
        /*console.log(modalState);
        console.log('modal render');*/
        return(
            <Modal
                title={modalState.title}
                visible={modalState.visible}
                maskClosable={modalState.maskClosable}
                destroyOnClose={modalState.destroyOnClose}
                onCancel={this.props.modalAction.hideModal}
                footer={modalState.footer}
                width={modalState.width}
                style={modalState.style}
            >
                {modalState.modalContent}
            </Modal>
        );
    }
}
const mapStateToPros = state => ({
    modalState: state.common.modal
});
const mapDispatchToProps = dispatch => ({
    modalAction: bindActionCreators(ModalAction, dispatch)
});

export default connect(mapStateToPros, mapDispatchToProps)(CustomModal);
