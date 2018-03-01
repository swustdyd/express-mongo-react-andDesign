/**
 * Created by Aaron on 2018/2/28.
 */
import React from 'react'

class TableList extends React.Component{
    constructor(){
        super();
        this.state = {
            ths: [],
            dataArray: []
        }
    }

    createThead(theadDatas){
        let ths = [];
        if(ths && ths.length > 0){
            theadDatas.forEach(function (item, index) {
                ths.push(<th>{item.name}</th>)
            });
        }
        return <thead>{ths}</thead>;
    }

    createTbody(tbodyDatas, theadDatas){
        let trs = [];
        if(tbodyDatas && tbodyDatas.length > 0 && theadDatas && theadDatas.length > 0){
            tbodyDatas.forEach(function (itemOfTr, index) {
                let tds = [];
                theadDatas.forEach(function (itemOfTh, index) {
                    tds.push(<td>{itemOfTr[itemOfTh.key]}</td>)
                });
                trs.push(<tr>{tds}</tr>)
            })
        }
        return <tbody>{trs}</tbody>;
    }

    render(){
        return(
            <table>
                {this.createThead(this.state.ths)}
                {this.createTbody(this.state.dataArray, this.state.ths)}
            </table>
        );
    }
}
export default TableList;