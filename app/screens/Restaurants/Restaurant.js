import React, { Component } from "react";
import { StyleSheet, View, ActivityIndicator } from "react-native";
import { Image, Icon, ListItem, Button, Text } from "react-native-elements";
import Toast, { DURATION } from "react-native-easy-toast";

import { firebaseApp } from "../../utils/Firebase";
import firebase from "firebase/app";
import "firebase/firestore";

const db = firebase.firestore(firebaseApp);

export default class Restaurant extends Component {
  constructor(props) {
    super(props);
    //console.log("props:", props);
  }

  componentDidMount() {
    this.checkAddReviewUser();
  }

  checkUserLogin = () => {
    const user = firebase.auth().currentUser;
    if (user) {
      return true;
    }
    return false;
  };

  loadButtonAddReview = () => {
    const {
      id,
      name
    } = this.props.navigation.state.params.restaurant.item.restaurant;

    if (!this.checkUserLogin()) {
      return (
        <Text>
          Para escribir un review debes iniciar sesión. Puedes hacerlo dando tap{" "}
          <Text
            onPress={() => this.props.navigation.navigate("Login")}
            style={styles.linkLoginText}
          >
            AQUÍ
          </Text>
        </Text>
      );
    } else {
      return (
        <Button
          title="Añadir comentario"
          onPress={() => this.gotToScreenAddReview()}
          buttonStyle={styles.btnAddReview}
        />
      );
    }
  };

  checkAddReviewUser = () => {
    const user = firebase.auth().currentUser;
    const userUID = user.uid;
    const restaurantID = this.props.navigation.state.params.restaurant.item
      .restaurant.id;

    //console.log("userUID:", userUID);
    //console.log("restaurantID:", restaurantID);

    const reviewsRef = db.collection("reviews");
    const queryRef = reviewsRef
      .where("idUser", "==", userUID)
      .where("idRestaurant", "==", restaurantID);

    return queryRef.get().then(resolve => {
      const reviewCount = resolve.size;
      //console.log("reviewCount:", reviewCount);

      if (reviewCount > 0) {
        return true;
      } else {
        return false;
      }
    });
  };

  gotToScreenAddReview = () => {
    this.checkAddReviewUser().then(resolve => {
      //console.log("resolve:", resolve);
      if (resolve) {
        this.refs.toast.show(
          "Ya has enviado un review. No puedes enviar más.",
          2000
        );
      } else {
        const {
          id,
          name
        } = this.props.navigation.state.params.restaurant.item.restaurant;

        this.props.navigation.navigate("AddRestaurantReview", {
          id,
          name
        });
      }
    });
  };

  render() {
    const {
      id,
      name,
      city,
      address,
      description,
      image
    } = this.props.navigation.state.params.restaurant.item.restaurant;

    const listExtraInfo = [
      {
        text: `${city}, ${address}`,
        iconName: "map-marker",
        iconType: "material-community",
        action: null
      }
    ];

    return (
      <View style={styles.viewBody}>
        <View style={styles.viewImage}>
          <Image
            source={{ uri: image }}
            PlaceholderContent={<ActivityIndicator />}
            style={styles.imageRestaurant}
          />
        </View>

        <View style={styles.viewRestaurantBasicInfo}>
          <Text style={styles.restaurantName}>{name}</Text>
          <Text style={styles.restaurantDescription}>{description}</Text>
        </View>

        <View style={styles.viewRestaurantExtraInfo}>
          <Text style={styles.restaurantExtraInfoTitle}>
            Información Sobre el Restaurante
          </Text>
          {listExtraInfo.map((item, index) => (
            <ListItem
              key={index}
              title={item.text}
              leftIcon={<Icon name={item.iconName} type={item.iconType} />}
            />
          ))}
        </View>

        <View style={styles.viewBtnAddReview}>
          {this.loadButtonAddReview()}
        </View>

        <Toast
          ref="toast"
          position="bottom"
          positionValue={320}
          fadeInDuration={1000}
          fadeOutDuration={1000}
          opacity={0.8}
          textStyle={{ color: "#fff" }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  viewBody: {
    flex: 1
  },
  viewImage: {
    width: "100%"
  },
  imageRestaurant: {
    width: "100%",
    height: 200,
    resizeMode: "cover"
  },
  viewRestaurantBasicInfo: {
    margin: 15
  },
  restaurantName: {
    fontSize: 20,
    fontWeight: "bold"
  },
  restaurantDescription: {
    marginTop: 5,
    color: "grey"
  },
  viewRestaurantExtraInfo: {
    margin: 15,
    marginTop: 25
  },
  restaurantExtraInfoTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10
  },
  viewBtnAddReview: {
    margin: 20
  },
  btnAddReview: {
    backgroundColor: "#00a680"
  },
  linkLoginText: {
    color: "#00a680",
    fontWeight: "bold"
  }
});
