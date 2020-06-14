import React from "react";
import { View } from "react-native";
import { Card, Title, Paragraph, Text, Avatar } from "react-native-paper";
import moment from "moment";

const Repository = (props) => {
  const { route } = props;
  const { repository } = route.params;

  return (
    <View style={{ margin: 15 }}>
      <Card>
        <Card.Title
          subtitle={moment(repository.createdAt).format("MMMM Do, YYYY")}
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
        />
        <Card.Content>
          <Title>{repository.name}</Title>
          <Paragraph>{repository.description}</Paragraph>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Avatar.Image
              size={18}
              source={{
                uri: repository.owner.avatarUrl,
              }}
            />
            <Text style={{ marginTop: 10 }}> {repository.owner.login}</Text>
          </View>
          <View style={{ flexDirection: "row" }}>
            <Text style={{ marginTop: 10, textAlign: "left" }}>
              {repository.primaryLanguage
                ? repository.primaryLanguage.name
                : ""}
            </Text>
            <Text style={{ marginTop: 10, position: "absolute", right: 0 }}>
              {repository.licenseInfo ? repository.licenseInfo.name : ""}
            </Text>
          </View>
        </Card.Content>
      </Card>
    </View>
  );
};

export default Repository;
