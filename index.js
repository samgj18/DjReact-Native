/**
 * @format
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import {AppRegistry} from 'react-native';
import React from 'react';
import App from './App';
import {name as appName} from './app.json';
import { createStore, compose, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import reducer from './Applications/Stores/Reducers/auth';


const composeEnhances = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const store = createStore(reducer, composeEnhances(
    applyMiddleware(thunk)
))

const app = () => (
    <Provider store={store}>
       <App/>
    </Provider>
  )

AppRegistry.registerComponent(appName, () => app);
