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
    /**
     * 返回的结果
     */
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

export type ErrorCodeType = {}

export type UploadFileType = {
    /**
     * Field name specified in the form
     */
    fieldname: string,
    /**
     * Name of the file on the user's computer	
     */
    originalname: string,
    /**
     * Encoding type of the file	
     */
    encoding: string,
    /**
     * Mime type of the file
     */ 
    mimetype: string,	
	/**
     * Size of the file in bytes
     */
    size: number,
    /**
     * The folder to which the file has been saved
     */
    destination: string,
	/**
     * The name of the file within the destination
     */
    filename: string,
    /**
     * The full path to the uploaded file
     */
    path: string,
    /**
     * A Buffer of the entire file
     */
    buffer: Buffer
}

// MongoDB Model Type
export type CommentType = {};
export type UserType = {};
export type MovieType = {};