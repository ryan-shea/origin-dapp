import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { ApolloProvider } from 'react-apollo'

import App from 'components/app'

import Store from './Store'
import client from './services/graphql'

ReactDOM.render(
  <ApolloProvider client={client}>
    <Provider store={Store}>
      <App />
    </Provider>
  </ApolloProvider>,
  document.getElementById('root')
)
