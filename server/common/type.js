export type APIResponseType = {
    success: boolean,
    message: string,
    result: any,
    pageIndex: number,
    pageSzie: number,
    total: number,
    errorCode: number
}

export type PageReturnType = {
    success: boolean,
    message: string,
    result: Array,
    pageIndex: number,
    pageSzie: number,
    total: number
}

export type SingleReturnType = {
    success: boolean, 
    result: object,
    message: string
}

export type MultipleReturnType = {
    success: boolean, 
    message: string,
    result: Array
} 