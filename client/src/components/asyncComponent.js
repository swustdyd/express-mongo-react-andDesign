/**
 * Created by Aaron on 2018/3/16.
 */
import React from 'react'
export const asyncComponent = (loadComponent) => {
    return class AsyncComponent extends React.Component {
        constructor(){
            super();
            this.state = {
                Component: null
            }
        }
        componentWillMount() {
            if (this.hasLoadedComponent()) {
                return;
            }

            loadComponent()
                .then((module) => { return module.default })
                .then((Component) => {
                    this.setState({ Component });
                })
                .catch((err) => {
                    console.error('Cannot load component in <AsyncComponent />');
                    throw err;
                });
        }

        hasLoadedComponent() {
            return this.state.Component !== null;
        }

        render() {
            const { Component } = this.state;
            return (Component) ? <Component {...this.props} /> : null;
        }
    }
}