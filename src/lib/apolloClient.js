import { ApolloClient, InMemoryCache } from '@apollo/client'
import { HttpLink } from '@apollo/client/link/http'

// En dev  -> '/graphql'
// En Pages -> '/viajes-cristian-torres-PFY2202/graphql'
const GRAPHQL_URL = `${import.meta.env.BASE_URL}graphql`

export const apolloClient = new ApolloClient({
  link: new HttpLink({ uri: GRAPHQL_URL }),
  cache: new InMemoryCache(),
})
