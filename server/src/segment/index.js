import SegmentPangu from 'segment'

export default class Segment{
    /**
     * 创建分词实例
     * @param {*} stopword 停词的绝对路径
     * @param {*} synonym 同义词的绝对路径
     */
    constructor(stopword: string = '', synonym: string = ''){
        this.stopword = stopword;
        this.synonym = synonym;
        // 创建实例
        this.segment = new SegmentPangu();
        // 使用默认的识别模块及字典，载入字典文件需要1秒，仅初始化时执行一次即可
        this.segment.useDefault();
        // 加载停止符
        if(this.stopword){
            this.segment.loadStopwordDict(this.stopword);
        }
        // 加载同义词
        if(this.synonym){
            this.segment.loadSynonymDict(this.synonym);
        }

        // 设置默认分词选项
        this._defaultOptions = {
            // 默认不返回词性
            simple: true,
            // 默认去除标点符号
            stripPunctuation: true,
            stripStopword: this.stopword ? true : false,
            convertSynonym: this.synonym ? true : false
        }
    }

    /**
     * 进行分词
     * @param {*} text 目标分词的文本
     * @param {*} options 分词选项
     */
    doSegement(text: string, options = {}){
        if(!text){
            throw new Error('text can not be null');
        }
        options = Object.assign({}, this._defaultOptions, options);
        return this.segment.doSegment(text, options);
    }
}
