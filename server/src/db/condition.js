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

export const OrderType = {
    ASC: 'asc',
    DESC: 'desc'
}

export const JoinType = {
    LEFT: 'left join',
    RIGHT: 'right join',
    INNER: 'inner join'
}

type WhereItem = {
    name: string,
    alias: string,
    value: any,
    opType: string,
    logicOpType: string
}

type FiledItem = {
    name: string,
    alias: string,
    as: string
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
    type: string
}

type GroupBy = {
    name: string,
    alias: string
}

type OrderBy = {
    name: string,
    alias: string,
    type: string
}

export default class Condition{
    constructor(fileds: Array<string|FiledItem> = [], 
        where: WhereItem[] = [], joins: Joins[] = [], groupBy: GroupBy[] = [], orderBy: OrderBy[] = []){  
        this.tableName = '';
        this.fileds = fileds;
        this.where = where;
        this.joins = joins;
        this.offset = 0,
        this.limit = QueryDefaultOptions.pageSize,
        this.distinct = false;
        this.distinctFileds = [];
        this.orderBy = orderBy;
        this.groupBy = groupBy;
    }
    setTableName(tableName: string){
        this.tableName = tableName;
    }
    setOffset(offset: number){
        this.offset = offset;
    }

    setDistinct(value: boolean, ...distinctFileds){
        this.distinct = value;
        this.distinctFileds = distinctFileds;
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

    addOrderBY(item: OrderBy){
        this.orderBy.push(item);
    }

    addGroupBy(item: GroupBy){
        this.groupBy.push(item)
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

    _parseOrder(){
        let orderString = '';
        if(this.orderBy.length > 0){
            orderString += 'order by '
            orderString += this.orderBy.map((item) => {
                return `${item.alias ? `${item.alias}.${item.name}` : item.name} ${item.type || OrderType.ASC}`
            }).join(', ');
        }
        return orderString;
    }

    _parseGroup(){
        let groupString = '';
        if(this.groupBy.length > 0){
            groupString += 'group by '
            groupString += this.groupBy.map((item) => {
                return `${item.alias ? `${item.alias}.${item.name}` : item.name}`
            }).join(', ');
        }
        return groupString;
    }

    toSql(){              
        if(!this.tableName){
            throw new Error('tablename can\'t be null')
        }
        const filedsString = this._parseFileds();
        const whereString = this._parseWhere();
        const joinString = this._parseJoins();
        const groupString = this._parseGroup();
        const orderString = this._parseOrder();
        const sql = `select${this.distinct ? ' distinct' : ''} ${filedsString} from ${this.tableName}${joinString ? ` ${joinString}` : ''}${whereString ? ` ${whereString}` : ''}${groupString ?` ${groupString}` : ''}${orderString ? ` ${orderString}` : ''} limit ${this.offset}, ${this.limit}`;
        return sql;
    }
}
