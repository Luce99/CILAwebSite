import { ApolloClient, InMemoryCache } from "@apollo/client";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5010";
const GRAPHQL_URI = `${API_BASE_URL}/graphql`;

function createApolloClient() {
  try {
    const client = new ApolloClient({
      uri: GRAPHQL_URI,
      cache: new InMemoryCache(),
      defaultOptions: {
        watchQuery: {
          fetchPolicy: "cache-and-network",
          errorPolicy: "all",
        },
        query: {
          fetchPolicy: "network-only",
          errorPolicy: "all",
        },
        mutate: {
          errorPolicy: "all",
        },
      },
    });

    return client;
  } catch (error) {
    console.error("Error al crear el cliente Apollo:", error);
    return null;
  }
}

const apolloClient = createApolloClient();

export default apolloClient;
