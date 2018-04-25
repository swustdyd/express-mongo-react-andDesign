/**
 * Created by Aaron on 2018/3/2.
 */
import './polyfill'
import './common/common'
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
import Nav from './nav'
import Footer from './footer'
import { asyncComponent } from './components/asyncComponent'
const MoviePage = asyncComponent(() => import (/* webpackChunkName: "movie" */ './containers/movie/moviePage'))
const UserPage = asyncComponent(() => import (/* webpackChunkName: "user" */ './containers/user/userPage'))

import './app.scss'

let middleware = [];
middleware.push(Thunk);
if(__DEV__){
    middleware.push(Logger);
}

let store = createStore(
    AppReducer,
    applyMiddleware(...middleware)
);

ReactDom.render(
    <Provider store={store}>
        <HashRouter>
            <HMFLayout
                header={Nav}
                content={
                    <div>
                        <Route exact path="/" component={IndexPage}/>
                        <Route path="/moviePage" component={MoviePage}/>
                        <Route path="/userPage" component={UserPage}/>
                    </div>
                }
                footer={Footer}
            >
                <Modal />
            </HMFLayout>
        </HashRouter>
    </Provider>,
    document.getElementById('app')
);