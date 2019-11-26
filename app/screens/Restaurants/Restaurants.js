import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity
} from "react-native";
import { Image } from "react-native-elements";
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
      startRestaurant: null,
      restaurantsLimit: 8,
      isLoading: true
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
      this.setState({
        startRestaurant: response.docs[response.docs.length - 1]
      });
      response.forEach(doc => {
        let restaurant = doc.data();
        restaurant.id = doc.id;
        //console.log("restaurant:", restaurant);
        restaurantsResult.push({ restaurant });
      });

      this.setState({
        restaurants: restaurantsResult
      });
      //console.log("this.state.restaurants:", this.state.restaurants);
    });
  };

  goToScreen = screenName => {
    this.props.navigation.navigate(screenName);
    //this.goToScreen("AddRestaurant")
  };

  loadActionButton = () => {
    const { login } = this.state;

    if (login) {
      return (
        <ActionButton
          buttonColor="#00a680"
          onPress={() =>
            this.props.navigation.navigate("AddRestaurant", {
              loadRestaurants: this.loadRestaurants
            })
          }
        />
      );
    } else {
      return null;
    }
  };

  handleLoadMore = async () => {
    //console.log("Cargando nuevos restaurantes.");
    const { restaurantsLimit, startRestaurant } = this.state;
    let resultRestaurants = [];

    this.state.restaurants.forEach(doc => {
      resultRestaurants.push(doc);
    });

    /* console.log(
      "startRestaurant.data().createdAt:",
      startRestaurant.data().createdAt
    ); */

    const newRestaurants = db
      .collection("restaurants")
      .orderBy("createdAt", "desc")
      .startAfter(startRestaurant.data().createdAt)
      .limit(restaurantsLimit);

    await newRestaurants.get().then(response => {
      if (response.docs.length > 0) {
        this.setState({
          startRestaurant: response.docs[response.docs.length - 1]
        });
      } else {
        //console.log("response.docs.length <= 0");
        this.setState({
          isLoading: false
        });
      }
      response.forEach(doc => {
        let restaurant = doc.data();
        restaurant.id = doc.id;
        resultRestaurants.push({ restaurant });
        //console.log("restaurant:", restaurant);
      });

      this.setState({
        restaurants: resultRestaurants
      });
    });
  };

  renderRow = restaurant => {
    const {
      name,
      city,
      address,
      description,
      image
    } = restaurant.item.restaurant;

    return (
      <TouchableOpacity onPress={() => this.restaurantClick(restaurant)}>
        <View style={styles.viewRestaurant}>
          <View style={styles.viewRestaurantImage}>
            <Image
              resizeMode="cover"
              source={{ uri: image }}
              style={styles.restaurantImage}
            />
          </View>
          <View>
            <Text style={styles.flatlistRestaurantName}>{name}</Text>
            <Text style={styles.flatlistRestaurantAddress}>
              {city}, {address}
            </Text>
            <Text style={styles.flatlistRestaurantDescription}>
              {description.substr(0, 80)}...
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  renderFooter = () => {
    if (this.state.isLoading) {
      return (
        <View style={styles.restaurantsLoader}>
          <ActivityIndicator size="large" />
        </View>
      );
    } else {
      return (
        <View style={styles.restaurantsNotFound}>
          <Text>No quedan restaurantes por cargar...</Text>
        </View>
      );
    }
  };

  RenderFlatList = restaurants => {
    //console.log("Restaurants in loadRenderFlatlist:", restaurants);
    //const { restaurants } = this.state;
    if (restaurants) {
      return (
        <FlatList
          data={restaurants}
          renderItem={this.renderRow}
          keyExtractor={(item, index) => index.toString()}
          onEndReached={this.handleLoadMore}
          onEndReachedThreshold={0.1}
          ListFooterComponent={this.renderFooter}
        ></FlatList>
      );
    } else {
      return (
        <View style={styles.startLoadRestaurants}>
          <ActivityIndicator size="large" />
          <Text>Cargando restaurantes.</Text>
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
      <View style={styles.viewBody}>
        {this.RenderFlatList(restaurants)}
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
    flex: 1
  },
  startLoadRestaurants: {
    marginTop: 20,
    alignItems: "center"
  },
  viewRestaurant: {
    flexDirection: "row",
    margin: 10
  },
  viewRestaurantImage: {
    marginRight: 15
  },
  restaurantImage: {
    width: 80,
    height: 80
  },
  flatlistRestaurantName: {
    fontWeight: "bold"
  },
  flatlistRestaurantAddress: {
    paddingTop: 2,
    color: "grey",
    width: 300
  },
  flatlistRestaurantDescription: {
    paddingTop: 2,
    color: "grey",
    width: 300
  },
  restaurantsLoader: {
    marginTop: 10,
    marginBottom: 10
  },
  restaurantsNotFound: {
    marginTop: 10,
    marginBottom: 10,
    alignItems: "center"
  }
});
