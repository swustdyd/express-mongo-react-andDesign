/**
 * Created by Aaron on 2018/3/2.
 */
import React from 'react'
import { HashRouter, Route } from 'react-router-dom'
import ReactDom from 'react-dom'
import HMFLayout from './hmfLayout'
import IndexPage from './modules/index/index'
import MoviePage from './modules/movie/movie'
import UserPage from './modules/user/user'

import './common/common.scss'

ReactDom.render(
    <HashRouter>
        <HMFLayout>
            <Route exact path="/" component={IndexPage}/>
            <Route path="/moviePage" component={MoviePage}/>
            <Route path="/userPage" component={UserPage}/>
        </HMFLayout>
    </HashRouter>,
    document.getElementById('app')
);