import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import axios from 'axios';

import App from './bootstrap/app';
import loadWidget from './bootstrap/markerio';
import reportWebVitals from './reportWebVitals';
import { runtimeEnv } from './utils/runtime-env';

axios.defaults.withCredentials = true;
const client = new ApolloClient({
  uri: `${runtimeEnv.apiUrl()}/graphql`,
  cache: new InMemoryCache(),
  credentials: 'include',
});

const container: Element = document.getElementById('root')!;
const root = createRoot(container);
root.render(
  <React.StrictMode data-id="000106">
    <ApolloProvider client={client} data-id="000107">
      <BrowserRouter data-id="000108">
        <App data-id="000109" />
      </BrowserRouter>
    </ApolloProvider>
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
loadWidget();
