import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App';
import { BrowserRouter } from "react-router-dom";

import Reducer from './reducers';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import promiseMiddleware from 'redux-promise';
import ReduxThunk from 'redux-thunk';

// redux 비동기 처리를 위한 redux-promise, redux-thunk 미들웨어
const createStoreWithMiddleware = applyMiddleware(promiseMiddleware, ReduxThunk)(createStore);

// 크롬 확장프로그램인 redux devtools에서 redux의 상태를 확인하기 위함
// redux Provider로 컴포넌트를 감싸서 전역에서 redux를 사용할 수 있게 함.
ReactDOM.render(
    <Provider
        store={createStoreWithMiddleware(
            Reducer,
            window.__REDUX_DEVTOOLS_EXTENSION__ &&
            window.__REDUX_DEVTOOLS_EXTENSION__()
        )}
    >
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </Provider>
		, document.getElementById('root')
);
