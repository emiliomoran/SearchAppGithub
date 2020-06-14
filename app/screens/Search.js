import React, { useState } from "react";
import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import { Searchbar } from "react-native-paper";
import { FlatList, Text, SafeAreaView, View } from "react-native";

const SEARCH_REPOSITORIES = gql`
  query Search($text: String!, $after: String) {
    search(query: $text, type: REPOSITORY, first: 100, after: $after) {
      repositoryCount
      edges {
        cursor
        node {
          ... on Repository {
            id
            nameWithOwner
            openGraphImageUrl
            description
          }
        }
      }
    }
  }
`;

const Results = ({ text, after }) => {
  const { loading, error, data, refetch, fetchMore, networkStatus } = useQuery(
    SEARCH_REPOSITORIES,
    {
      variables: { text, after },
    }
  );

  if (loading) return <Text>Loading...</Text>;
  if (error) return `Error! ${error}`;

  console.log("total", data.search.repositoryCount);
  console.log("longitud", data.search.edges.length);

  return (
    <FlatList
      data={data.search.edges}
      renderItem={(repository) => (
        <Text key={repository.item.cursor}>
          {repository.item.node.nameWithOwner}
        </Text>
      )}
      keyExtractor={(item, index) => index.toString()}
      refreshing={networkStatus === 4}
      onRefresh={() => refetch}
      onEndReachedThreshold={1}
      onEndReached={() => {
        console.log("ENTRA A MORER");
        fetchMore({
          variables: {
            after: data.search.edges[data.search.edges.length - 1].cursor,
          },
          updateQuery: (prev, { fetchMoreResult }) => {
            console.log("ENTRA A UPDATE");
            //console.log(fetchMoreResult);
            if (!fetchMoreResult || fetchMoreResult.search.edges.length === 0) {
              console.log("NO MORE");
              return prev;
            }
            console.log("SI MORE");
            //return prev.search.edges.concat(fetchMoreResult.search.edges);
            return {
              ...prev,
              search: {
                ...prev.search,
                edges: prev.search.edges.concat(fetchMoreResult.search.edges),
              },
            };
          },
        });
      }}
      ListFooterComponent={
        loading ? (
          <Text>Loading more...</Text>
        ) : (
          <Text>No more repositories</Text>
        )
      }
    />
  );
};

const Search = () => {
  const [text, setText] = useState("");

  return (
    <View style={{ flex: 1 }}>
      <Searchbar
        placeholder="Search"
        onChangeText={setText}
        value={text}
        after={null}
      />
      <Results text={text} />
    </View>
  );
};

export default Search;
