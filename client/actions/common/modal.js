/**
 * Created by Aaron on 2018/3/10.
 */
export default {
    showModal: (modalProps) =>({
        type: 'SHOW_MODAL',
        payload: modalProps
    }),
    hideModal: () => ({
        type: 'HIDE_MODAL'
    })
}