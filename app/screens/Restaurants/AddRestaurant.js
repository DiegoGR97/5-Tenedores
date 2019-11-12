import React, { Component } from "react";
import { StyleSheet, View, Text } from "react-native";

import t from "tcomb-form-native";
const Form = t.form.Form;
import {
  AddRestaurantStruct,
  AddRestaurantOptions
} from "../../forms/AddRestaurant";

export default class AddRestaurant extends Component {
  constructor() {
    super();
    this.state = {
      formData: {
        name: "",
        city: "",
        address: "",
        description: ""
      }
    };
  }
  render() {
    return (
      <View style={styles.viewBody}>
        <View>
          <Form
            ref="addRestaurantForm"
            type={AddRestaurantStruct}
            options={AddRestaurantOptions}
            value={this.state.formData}
          />
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
