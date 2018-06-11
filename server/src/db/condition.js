import moment from 'moment'
import {QueryDefaultOptions} from '../common/commonSetting'
import {dateFormatString} from '../../../baseConfig'

export const OpType = {
    EQ: '=',
    GT: '>',
    LT: '<',
    GTE: '>=',
    LTE: '<=',
    LIKE: 'like'
}

export const LogicOpType = {
    AND: 'and',
    OR: 'or'
}

type WhereItem = {
    name: string,
    alias: string,
    value: any,
    opType: OpType,
    logicOpType: LogicOpType
}

type FiledItem = {
    name: string,
    alias: string,
    as: string
}

export const JoinType = {
    LEFT: 'left join',
    RIGHT: 'right join',
    INNER: 'inner join'
}

type Joins = {
    name: string,
    alias: string,
    on: {
        sourceKey: string,
        targetKey: {
            alias: string,
            key: string
        }
    },
    type: JoinType
}

export default class Condition{
    constructor(tableName: string, fileds: Array<string|FiledItem> = [], where: WhereItem[] = [], joins: Joins[] = []){        
        if(!tableName){
            throw new Error('tablename can\'t be null')
        }
        this.tableName = tableName;
        this.fileds = fileds;
        this.where = where;
        this.joins = joins;
        this.offset = 0,
        this.limit = QueryDefaultOptions.pageSize
    }

    setOffset(offset: number){
        this.offset = offset;
    }

    setLimit(limit: number){
        if(limit <= QueryDefaultOptions.pageSize){
            this.limit = limit;
        }
    }

    addFiled(item: string|FiledItem){
        this.fileds.push(item);
    }

    addWhere(item: WhereItem){
        this.where.push(item);
    }

    addJoin(item: Joins){
        this.joins.push(item);
    }

    _parseFileds(){
        let filedsString = '';
        if(this.fileds.length > 0) {
            filedsString = this.fileds.map((item) => {
                if(typeof item !== 'string'){
                    item = `${item.alias ? `${item.alias}.${item.name}` : item.name}${item.as ? ` as ${item.as}`: ''}`;
                }
                return item;
            }).join(', ')
        }else{
            filedsString = '*' 
        }
        return filedsString;
    }

    _parseWhere(){
        let whereString = '';
        if(this.where.length > 0){
            whereString = this.where.map((item, index) => {
                let itemString = '';
                if(index === 0){
                    itemString = 'where ';
                }else{
                    itemString = `${item.logicOpType || LogicOpType.AND} `;
                }
                itemString += `${item.alias ? `${item.alias}.${item.name}` : item.name} ${item.opType || OpType.EQ} ${this._parseValue(item.value)}`;
                return itemString;
            }).join(' ');
        }
        return whereString;
    }

    _parseValue(value){
        let result = '';
        if(value instanceof Date){
            result = `'${moment(value).format(dateFormatString)}'`;
        }else if(typeof value === 'string'){
            result = `'${value.replace(/\'/g, '\\\'')}'`;
        }else{
            result = new String(value).toString();
        }
        return result;
    }

    _parseJoins(){
        let joinString = '';
        if(this.joins.length > 0){
            joinString = this.joins.map((item) => {
                return `${item.type || JoinType.LEFT} ${item.name} as ${item.alias} on ${`${item.alias}.${item.on.sourceKey}`} = ${`${item.on.targetKey.alias}.${item.on.targetKey.key}`}`
            }).join(' ');
        }
        return joinString;
    }

    toSql(){
        const filedsString = this._parseFileds();
        const whereString = this._parseWhere();
        const joinString = this._parseJoins();

        const sql = `select ${filedsString} from ${this.tableName}${joinString ? ` ${joinString}` : ''} ${whereString} limit ${this.offset}, ${this.limit}`;
        return sql;
    }
}
