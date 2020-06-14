import React, { useState } from "react";
import { Searchbar } from "react-native-paper";
import { View } from "react-native";
import ListResults from "../components/ListResults";

const Search = (props) => {
  const { navigation } = props;
  const [text, setText] = useState("");

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <Searchbar placeholder="Search" onChangeText={setText} value={text} />
      <ListResults text={text} after={null} navigation={navigation} />
    </View>
  );
};

export default Search;
