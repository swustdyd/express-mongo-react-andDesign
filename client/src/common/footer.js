/**
 * Created by Aaron on 2018/3/26.
 */
import React from 'react'
import moment from 'moment'

class Footer extends React.Component{
    render(){
        return(
            <div>
                Demo ©2016~{moment(new Date()).format('YYYY')} Created by AaronDeng
            </div>
        );
    }
}
export default Footer;