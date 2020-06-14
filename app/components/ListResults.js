import React, { useState } from "react";
import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import { List, ActivityIndicator, Avatar, Text } from "react-native-paper";
import { FlatList, View } from "react-native";

const SEARCH_REPOSITORIES = gql`
  query Search($text: String!, $after: String) {
    search(query: $text, type: REPOSITORY, first: 20, after: $after) {
      repositoryCount
      edges {
        cursor
        node {
          ... on Repository {
            id
            name
            nameWithOwner
            description
            stargazers {
              totalCount
            }
            owner {
              login
              avatarUrl
            }
            createdAt
            primaryLanguage {
              name
            }
            licenseInfo {
              name
            }
          }
        }
      }
    }
  }
`;

const Item = ({ repository, navigation }) => {
  return (
    <List.Item
      left={(props) => (
        <Avatar.Image
          size={20}
          source={{
            uri: repository.owner.avatarUrl,
          }}
        />
      )}
      title={repository.nameWithOwner}
      description={repository.description}
      right={(props) => (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text>{repository.stargazers.totalCount}</Text>
          <Avatar.Icon
            icon="star-outline"
            size={40}
            style={{
              marginRight: 0,
              marginLeft: 0,
              backgroundColor: "#fff",
            }}
            color="#0B212C"
          />
        </View>
      )}
      style={{
        borderStyle: "solid",
        borderBottomWidth: 2,
        borderBottomColor: "#CAC1BF",
        backgroundColor: "white",
      }}
      onPress={() =>
        navigation.navigate("Repository", { repository: repository })
      }
    />
  );
};

const ListResults = ({ text, after, navigation }) => {
  const [loadingMore, setLoaginMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const { loading, error, data, refetch, fetchMore, networkStatus } = useQuery(
    SEARCH_REPOSITORIES,
    {
      variables: { text, after },
    }
  );

  if (loading)
    return (
      <ActivityIndicator
        animating={true}
        size="large"
        style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        color="#0B212C"
      />
    );
  if (error) return `Error! ${error}`;

  return (
    <FlatList
      data={data.search.edges}
      renderItem={(repository) => (
        <Item repository={repository.item.node} navigation={navigation} />
      )}
      keyExtractor={(item, index) => index.toString()}
      refreshing={networkStatus === 4}
      onRefresh={() => refetch}
      onEndReachedThreshold={1}
      onEndReached={() => {
        setLoaginMore(true);
        fetchMore({
          variables: {
            after: data.search.edges[data.search.edges.length - 1].cursor,
          },
          updateQuery: (prev, { fetchMoreResult }) => {
            if (!fetchMoreResult || fetchMoreResult.search.edges.length === 0) {
              setLoaginMore(false);
              setHasMore(false);
              return prev;
            }
            setLoaginMore(false);
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
        loadingMore ? (
          <Text style={{ textAlign: "center" }}>Loading more...</Text>
        ) : (
          !hasMore && (
            <Text style={{ textAlign: "center" }}>No more repositories</Text>
          )
        )
      }
    />
  );
};

export default ListResults;
