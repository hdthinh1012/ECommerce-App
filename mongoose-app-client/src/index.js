import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { CookiesProvider } from 'react-cookie';
import App from './App';
import store from './global/store';

import { fetchMenu, fetchCategories } from "./pages/menu/menuSlice";

store.dispatch(fetchMenu());
store.dispatch(fetchCategories());

ReactDOM.render(
  <React.StrictMode>
    <CookiesProvider>
      <Provider store={store}>
        <App />
      </Provider>
    </CookiesProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// "start": "set HTTPS=true&& set SSL_CRT_FILE=./certificates/server.crt&& set SSL_KEY_FILE=./certificates/server.key&& react-scripts start",