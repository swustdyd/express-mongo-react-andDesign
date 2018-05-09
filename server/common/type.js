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
    result: [],
    pageIndex: number,
    pageSzie: number,
    total: number
}

export type SingleReturnType = {
    success: boolean, 
    result: {},
    message: string
}

export type MultipleReturnType = {
    success: boolean, 
    message: string,
    result: []
} 

export type ObjectId = {};

export type QueryOptionsType = {
    condition: {},
    sort: {},
    pageSize: number,
    pageIndex: number
};

// MongoDB Model Type
export type CommentType = {};
export type UserType = {};
export type MovieType = {};