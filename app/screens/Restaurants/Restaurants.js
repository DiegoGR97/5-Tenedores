import React, { Component } from "react";
import { StyleSheet, View, Text } from "react-native";
import ActionButton from "react-native-action-button";
import Icon from "react-native-vector-icons/Ionicons";

import { firebaseApp } from "../../utils/Firebase";
import firebase from "firebase/app";
import "firebase/firestore";
const db = firebase.firestore(firebaseApp);

//import * firebase from "firebase";

export default class Restaurants extends Component {
  constructor() {
    super();

    this.state = {
      login: false,
      restaurants: null,
      startRestaurants: null,
      restaurantsLimit: 8
    };
  }

  componentDidMount() {
    this.checkLogin();
    this.loadRestaurants();
  }

  checkLogin = () => {
    //console.log("checkLogin()");
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.setState({
          login: true
        });
      } else {
        this.setState({
          login: false
        });
      }
    });
  };

  loadRestaurants = async () => {
    //console.log("Cargando restaurantes.");
    const { restaurantsLimit } = this.state;
    let restaurantsResult = [];

    const restaurants = db
      .collection("restaurants")
      .orderBy("createdAt", "desc")
      .limit(restaurantsLimit);

    await restaurants.get().then(response => {
      //console.log("response.docs:", response.docs);
      this.setState({
        startRestaurants: response.docs[response.docs.length - 1]
      });
      response.forEach(doc => {
        let restaurant = doc.data();
        restaurant.id = doc.id;
        console.log("restaurant:", restaurant);
        restaurantsResult.push({ restaurant });
      });

      this.setState({
        restaurants: restaurantsResult
      });

      console.log("this.state.restaurants:", this.state.restaurants);
    });
  };

  goToScreen = screenName => {
    this.props.navigation.navigate(screenName);
  };

  loadActionButton = () => {
    const { login } = this.state;

    if (login) {
      return (
        <ActionButton
          buttonColor="#00a680"
          onPress={() => {
            this.goToScreen("AddRestaurant");
          }}
        />
      );
    } else {
      return null;
    }
  };
  render() {
    return (
      <View style={styles.viewBody}>
        <Text>Restaurants Screen.</Text>
        {this.loadActionButton()}

        {/* <ActionButton buttonColor="rgba(231,76,60,1)">
                    <ActionButton.Item buttonColor='#9b59b6' title="New Task" onPress={() => console.log("notes tapped!")}>
                        <Icon name="md-create" style={styles.actionButtonIcon} />
                    </ActionButton.Item>
                    <ActionButton.Item buttonColor='#3498db' title="Notifications" onPress={() => {console.log("Click on notifications.") }}>
                        <Icon name="md-notifications-off" style={styles.actionButtonIcon} />
                    </ActionButton.Item>
                    <ActionButton.Item buttonColor='#1abc9c' title="All Tasks" onPress={() => { }}>
                        <Icon name="md-done-all" style={styles.actionButtonIcon} />
                    </ActionButton.Item>
                </ActionButton> */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  viewBody: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff"
  }
});
