import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5010";
const GRAPHQL_URI = `${API_BASE_URL}/graphql`;

const httpLink = new HttpLink({
  uri: GRAPHQL_URI,
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

export default client;
