/**
 * Created by Aaron on 2018/3/10.
 */
export const modalActionType = {
    SHOW_MODAL: Symbol('SHOW_MODAL'),
    HIDE_MODAL: Symbol('HIDE_MODAL')
}

export default {
    showModal: (modalProps) => {
        return {
            type: modalActionType.SHOW_MODAL,
            payload: modalProps
        }
    },
    hideModal: () => {
        return {
            type: modalActionType.HIDE_MODAL
        }
    }
}