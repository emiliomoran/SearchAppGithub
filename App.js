import React from "react";
import { ApolloClient } from "apollo-boost";
import { ApolloProvider } from "@apollo/react-hooks";
import { createHttpLink } from "apollo-link-http";
import { setContext } from "apollo-link-context";
import { InMemoryCache } from "apollo-cache-inmemory";
import Navigation from "./app/navigations/Navigation";
import { Provider as PaperProvider } from "react-native-paper";
import { ACCESS_TOKEN } from "react-native-dotenv";

const httpLink = createHttpLink({
  uri: "https://api.github.com/graphql",
});

const authLink = setContext((_, { headers }) => {
  const token = ACCESS_TOKEN;
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default function App() {
  return (
    <ApolloProvider client={client}>
      <PaperProvider>
        <Navigation />
      </PaperProvider>
    </ApolloProvider>
  );
}
