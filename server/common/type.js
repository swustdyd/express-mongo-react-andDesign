export type APIResponseType = {
    success: Boolean,
    message: String,
    result: any,
    pageIndex: Number,
    pageSzie: Number,
    total: Number,
    errorCode: Number
}

export type ServiceResponseType = {
    result: any,
    pageIndex: Number,
    pageSzie: Number,
    total: Number
}