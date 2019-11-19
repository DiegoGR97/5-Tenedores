import React, { Component } from "react";
import { StyleSheet, View, Text } from "react-native";

export default class Restaurant extends Component {
  constructor(props) {
    super(props);
    //console.log("props:", props);
  }

  render() {
    const {
      name
    } = this.props.navigation.state.params.restaurant.item.restaurant;
    return (
      <View style={styles.viewBody}>
        <Text>{name}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  viewBody: {
    flex: 1
  }
});
