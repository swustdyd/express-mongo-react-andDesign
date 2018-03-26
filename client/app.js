/**
 * Created by Aaron on 2018/3/2.
 */
import 'babel-polyfill'
import 'fetch-polyfill'
import React from 'react'
import { HashRouter, Route } from 'react-router-dom'
import ReactDom from 'react-dom'
import HMFLayout from './hmfLayout'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import Thunk from 'redux-thunk'
import Logger from 'redux-logger'
import AppReducer from './reducers/app'
import Modal from './containers/common/customModal'
import IndexPage from './containers/index/index'
import { asyncComponent } from './components/asyncComponent'
const MoviePage = asyncComponent(() => import (/* webpackChunkName: "movie" */ "./containers/movie/movie"))
const UserPage = asyncComponent(() => import (/* webpackChunkName: "user" */ "./containers/user/user"))

import './app.scss'

let store = createStore(
    AppReducer,
    applyMiddleware(Thunk, Logger)
);

ReactDom.render(
    <Provider store={store}>
        <HashRouter>
            <HMFLayout>
                <Route exact path="/" component={IndexPage}/>
                <Route path="/moviePage" component={MoviePage}/>
                <Route path="/userPage" component={UserPage}/>
                <Modal />
            </HMFLayout>
        </HashRouter>
    </Provider>,
    document.getElementById('app')
);