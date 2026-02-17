import { ApolloClient, InMemoryCache } from "@apollo/client";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5010";
const GRAPHQL_URI = `${API_BASE_URL}/graphql`;

/**
 * Tiempo maximo de espera para una solicitud al servidor (en milisegundos).
 * Render.com tarda ~5-10s en despertar servicios gratuitos.
 * Usamos 12s como limite razonable: suficiente para un wake-up normal,
 * pero no tanto como para hacer esperar al usuario innecesariamente.
 */
const REQUEST_TIMEOUT_MS = 12000;

/**
 * Wrapper de fetch con timeout usando AbortController.
 * Si la solicitud excede REQUEST_TIMEOUT_MS, se aborta automaticamente.
 */
function fetchWithTimeout(uri, options) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  const fetchOptions = {
    ...options,
    signal: controller.signal,
  };

  return fetch(uri, fetchOptions).finally(() => {
    clearTimeout(timeoutId);
  });
}

function createApolloClient() {
  try {
    const client = new ApolloClient({
      uri: GRAPHQL_URI,
      cache: new InMemoryCache(),
      fetch: fetchWithTimeout,
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
