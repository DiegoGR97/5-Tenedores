import React, { Component } from "react";
import { StyleSheet, View, Text } from "react-native";

export default class AddRestaurantReview extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.viewBody}>
        <View>
          <Text> Add Restaurant Review.</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  viewBody: {
    flex: 1
  }
});
