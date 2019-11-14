import React from "react";
import { StyleSheet, Text, View } from "react-native";
//import HomeScreen from "./app/screens/Home";
import UserNavigation from "./app/navigations/User";

import { firebaseApp } from "./app/utils/Firebase";

export default function App() {
  return (
    <View style={styles.container}>
      <UserNavigation />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
