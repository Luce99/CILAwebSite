import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './src/App';
import reportWebVitals from './src/reportWebVitals';
import {StateProvider} from "./src/StateProvider"
import reducer, {initialState} from "./src/reducer"
import {ApolloClient, ApolloProvider, InMemoryCache, HttpLink} from '@apollo/client'

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: 'http://localhost:5010/graphql'
  })
})


ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
    <StateProvider InitialState={initialState} reducer={reducer}>
    <App />
    </StateProvider>
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
