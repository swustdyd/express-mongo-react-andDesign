export const settingActionType = {
    CHANGE_HEADER_HEIGHT: Symbol('CHANGE_HEADER_HEIGHT'),
    CHANGE_FOOTER_HEIGHT: Symbol('CHANGE_FOOTER_HEIGHT')
}

export default {
    changeHeaderHeight: (headerHeight) => {
        return {
            type: settingActionType.CHANGE_HEADER_HEIGHT,
            payload: {headerHeight}
        }
    },
    changeFooterHeight: (footerHeight) => {
        return {
            type: settingActionType.CHANGE_FOOTER_HEIGHT,
            payload: {footerHeight}
        }
    }
}