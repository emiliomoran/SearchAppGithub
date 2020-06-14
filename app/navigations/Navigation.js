import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialIcons } from "@expo/vector-icons";
//Screens
import Search from "../screens/Search";
import Repository from "../screens/Repository";

const SearchStack = createStackNavigator();

function SearchStackScreen() {
  return (
    <SearchStack.Navigator>
      <SearchStack.Screen
        name="Search"
        component={Search}
        options={{
          title: "Search Github",
          headerStyle: {
            backgroundColor: "#0B212C",
          },
          headerTitleStyle: {
            color: "#fff",
          },
        }}
      />
      <SearchStack.Screen
        name="Repository"
        component={Repository}
        options={({ route }) => ({
          title: route.params.repository.nameWithOwner,
          headerStyle: {
            backgroundColor: "#0B212C",
          },
          headerTitleStyle: {
            color: "#fff",
          },
          headerTintColor: "#fff",
        })}
      />
    </SearchStack.Navigator>
  );
}

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        tabBarOptions={{
          activeTintColor: "#0B212C",
          inactiveTintColor: "gray",
        }}
      >
        <Tab.Screen
          name="Search"
          component={SearchStackScreen}
          options={{
            tabBarIcon: ({ color, size }) => {
              return <MaterialIcons name="search" color={color} size={size} />;
            },
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
