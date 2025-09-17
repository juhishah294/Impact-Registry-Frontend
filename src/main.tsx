import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ApolloClient, ApolloProvider, InMemoryCache, createHttpLink, from } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { onError } from '@apollo/client/link/error'
import { BrowserRouter } from 'react-router-dom'
import Routes from './routes'
import { AuthProvider } from './contexts/auth-context'
import NavigationProvider from './components/navigation-provider'
import './index.css'

const httpLink = createHttpLink({
  uri: import.meta.env.VITE_GRAPHQL_BACKEND_URL || 'http://localhost:4000/graphql',
})

const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ extensions, message }) => {
      if (extensions) {
        if (extensions.code === 'JWT_EXPIRED') {
          console.log('JWT expired detected in Apollo error link')
          localStorage.removeItem('token')
          // The auth context will handle showing the login dialog
        } else if (extensions.code === 'AUTHENTICATION_ERROR' || extensions.code === 'UNAUTHENTICATED') {
          console.log('Authentication error detected')
          localStorage.removeItem('token')
        }
      }
      
      // Handle enum errors gracefully - don't treat them as critical errors
      if (message.includes('cannot represent value')) {
        console.warn('GraphQL enum error:', message)
        // Don't clear token or redirect for enum errors
        return
      }
    })
  }
  if (networkError) console.log(`[Network error]: ${networkError}`)
})

function getToken() {
  return 'Bearer ' + localStorage.getItem('token')
}

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      authorization: getToken(),
      'Apollo-Require-Preflight': 'true',
    },
  }
})

const client = new ApolloClient({
  link: from([errorLink, authLink.concat(httpLink)]),
  connectToDevTools: process.env.NODE_ENV !== 'production',
  cache: new InMemoryCache(),
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ApolloProvider client={client}>
      <BrowserRouter>
        <NavigationProvider>
          <AuthProvider>
            <Routes />
          </AuthProvider>
        </NavigationProvider>
      </BrowserRouter>
    </ApolloProvider>
  </StrictMode>
)