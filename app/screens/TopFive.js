import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity
} from "react-native";
import { Card, Image, Rating } from "react-native-elements";

import { firebaseApp } from "../utils/Firebase";
import firebase from "firebase/app";
import "firebase/firestore";
import Restaurant from "./Restaurants/Restaurant";
const db = firebase.firestore(firebaseApp);

export default class TopFive extends Component {
  constructor() {
    super();
    this.state = {
      restaurants: null
    };
  }
  componentDidMount = () => {
    this.loadTopFiveRestaurants();
  };
  loadTopFiveRestaurants = async () => {
    //console.log("Top 5 restaurants.");
    const restaurants = db
      .collection("restaurants")
      .orderBy("rating", "desc")
      .limit(5);

    let restaurantArray = [];
    await restaurants.get().then(response => {
      response.forEach(doc => {
        let restaurant = doc.data();
        restaurant.id = doc.id;
        //console.log("restaurant:", restaurant);
        restaurantArray.push(restaurant);
      });
      this.setState({
        restaurants: restaurantArray
      });
      //console.log("this.state:", this.state);
    });
  };

  renderRestaurants = restaurants => {
    if (restaurants) {
      return (
        <View>
          {restaurants.map((restaurant, index) => {
            let restaurantClick = {
              item: {
                restaurant: null
              }
            };
            restaurantClick.item.restaurant = restaurant;
            return (
              <TouchableOpacity
                key={index}
                onPress={() => this.restaurantClick(restaurantClick)}
              >
                <Card key={index}>
                  <Image
                    style={styles.restaurantImage}
                    resizeMode="cover"
                    source={{ uri: restaurant.image }}
                  />
                  <View style={styles.titleRating}>
                    <Text style={styles.title}>{restaurant.name}</Text>
                    <Rating
                      imageSize={20}
                      startingValue={restaurant.rating}
                      readonly
                      style={styles.rating}
                    ></Rating>
                  </View>
                  <Text style={styles.description}>
                    {restaurant.description}
                  </Text>
                </Card>
              </TouchableOpacity>
            );
          })}
        </View>
      );
    } else {
      return (
        <View style={styles.startLoadRestaurants}>
          <ActivityIndicator size="large" />
          <Text>Cargando Restaurantes</Text>
        </View>
      );
    }
  };

  restaurantClick = restaurant => {
    this.props.navigation.navigate("Restaurant", { restaurant });
  };

  render() {
    const { restaurants } = this.state;
    return (
      <ScrollView style={styles.viewBody}>
        {this.renderRestaurants(restaurants)}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  viewBody: {
    flex: 1
  },
  restaurantImage: {
    width: "100%",
    height: 200
  },
  titleRating: {
    flexDirection: "row",
    marginTop: 10
  },
  title: {
    fontSize: 20,
    fontWeight: "bold"
  },
  rating: {
    position: "absolute",
    right: 0
  },
  description: {
    color: "grey",
    marginTop: 10,
    textAlign: "justify"
  },
  startLoadRestaurants: {
    marginTop: 20,
    alignItems: "center"
  }
});
