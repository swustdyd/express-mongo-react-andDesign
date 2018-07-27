import { QueryDefaultOptions } from '../common/commonSetting'

export type SolrOptions = {
    q: string, 
    fl: string,
    start: number, 
    rows: number, 
    wt: string,
    indent: string
}

const defaultOptions : SolrOptions = {
    q: '*:*', 
    fl: '',
    start: 0, 
    rows: QueryDefaultOptions.pageSize, 
    wt: 'json',
    indent: 'on'
}

export default class SolrSearch{
    constructor(options: SolrOptions){
        options.q = options.q || defaultOptions.q;
        this.options = Object.assign({}, defaultOptions, options);
    }

    toQueryString(){
        const querys = [];
        for (const key in this.options) {
            const values = this.options[key];
            querys.push(`${key}=${values}`)
        }
        return querys.join('&');
    }
}