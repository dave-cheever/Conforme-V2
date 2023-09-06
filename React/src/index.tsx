import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import axios from 'axios';

import App from './bootstrap/app';
import reportWebVitals from './reportWebVitals';

axios.defaults.withCredentials = true;
const client = new ApolloClient({
  uri: `${process.env.REACT_APP_API_URL}/graphql`,
  cache: new InMemoryCache(),
  credentials: 'include',
});

const container: Element = document.getElementById('root')!;
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <ApolloProvider client={client} data-id="8377c6dc8ec1">
      <BrowserRouter data-id="d92d8185dfdb">
        <App data-id="6100e14c5fd2" />
      </BrowserRouter>
    </ApolloProvider>
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
