import React, { Component } from "react";
import { StyleSheet, View, ActivityIndicator, ScrollView } from "react-native";
import {
  Image,
  Icon,
  ListItem,
  Button,
  Text,
  Rating,
  Avatar
} from "react-native-elements";
import Toast, { DURATION } from "react-native-easy-toast";

import { firebaseApp } from "../../utils/Firebase";
import firebase from "firebase/app";
import "firebase/firestore";
import { FlatList } from "react-native-gesture-handler";

const db = firebase.firestore(firebaseApp);

/* ES IMPORTANTE NOTAR QUE NO SE PUEDE UTILIZAR EFICAZMENTE LAS PROPIAEDADES ON
 onEndReached={} ni onEndReachedThreshold={} adentro de un ScrollView */

export default class Restaurant extends Component {
  constructor(props) {
    super(props);
    //console.log("props:", props);

    this.state = {
      reviews: null,
      startReview: null,
      reviewsLimit: 3,
      isLoading: true
    };
  }

  componentDidMount() {
    this.checkAddReviewUser();
    this.loadReviews();
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
        //return true;
        return false;
      } else {
        return false;
      }
    });
    return false;
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

  handleLoadMore = async () => {
    console.log("Cargando nuevos reviews.");
    const { reviewsLimit, startReview } = this.state;
    const {
      id
    } = this.props.navigation.state.params.restaurant.item.restaurant;
    let resultReviews = [];

    this.state.reviews.forEach(doc => {
      resultReviews.push(doc);
    });

    const newReviews = db
      .collection("reviews")
      .where("idRestaurant", "==", id)
      .orderBy("createdAt", "desc")
      .startAfter(startReview.data().createdAt)
      .limit(reviewsLimit);

    await newReviews.get().then(response => {
      if (response.docs.length > 0) {
        this.setState({
          startReview: response.docs[response.docs.length - 1]
        });
      } else {
        //console.log("response.docs.length <= 0");
        this.setState({
          isLoading: false
        });
      }
      response.forEach(doc => {
        let review = doc.data();
        resultReviews.push({ review });
        //console.log("restaurant:", restaurant);
      });

      this.setState({
        reviews: resultReviews
      });
    });
  };

  loadReviews = async () => {
    //console.log("Loading reviews...");
    const { reviewsLimit } = this.state;
    const {
      id
    } = this.props.navigation.state.params.restaurant.item.restaurant;

    let reviewsResult = [];

    const reviews = db
      .collection("reviews")
      .where("idRestaurant", "==", id)
      .orderBy("createdAt", "desc")
      .limit(reviewsLimit);

    return await reviews
      .get()
      .then(response => {
        //console.log("response:", response);

        this.setState({
          startReview: response.docs[response.docs.length - 1]
        });

        response.forEach(doc => {
          let review = doc.data();
          reviewsResult.push({ review });
        });

        this.setState({
          reviews: reviewsResult
        });

        //console.log("this.state.reviews:", this.state.reviews);
      })
      .catch(error => {
        console.log("error en FB request en loadReviews:", error);
      });
  };

  renderFlatList = reviews => {
    //console.log("reviews:", reviews);
    if (reviews) {
      return (
        <FlatList
          data={reviews}
          renderItem={this.renderRow}
          keyExtractor={(item, index) => index.toString()}
          /*  onEndReached={this.handleLoadMore}
          onEndReachedThreshold={0.1} */
          ListFooterComponent={this.renderFooter}
        />
      );
    } else {
      return (
        <View style={styles.startLoadReviews}>
          <ActivityIndicator size="large" />
          <Text>Cargando Reviews</Text>
        </View>
      );
    }
  };

  renderRow = reviewItem => {
    //console.log("review en renderRow:", review);
    //console.log("reviewItem.item:", reviewItem.item);
    //console.log("reviewItem.item.review:", reviewItem.item.review);
    const {
      title,
      review,
      rating,
      idUser,
      createdAt,
      avatarUser
    } = reviewItem.item.review;
    //console.log("title:", title);
    const createReview = new Date(createdAt.seconds * 1000);
    //console.log("avatarUser:", avatarUser);
    //console.log("createReview:", createReview);

    const avatar = avatarUser
      ? avatarUser
      : "https://api.adorable.io/avatars/285/abott@adorable.png";
    return (
      <View style={styles.viewReview}>
        <View style={styles.viewImage}>
          <Avatar
            source={{
              uri: avatar
            }}
            size="large"
            rounded
            containerStyle={styles.userAvatarImage}
          />
        </View>

        <View style={styles.viewInfo}>
          <Text style={styles.reviewTitle}>{title}</Text>
          <Text style={styles.reviewText}>{review}</Text>
          <Rating imageSize={15} startingValue={rating}></Rating>
          <Text style={styles.reviewDate}>
            {createReview.getDate()}/{createReview.getMonth() + 1}/
            {createReview.getFullYear()} - {createReview.getHours()}:
            {createReview.getMinutes()}
          </Text>
        </View>
      </View>
    );
  };

  renderFooter = () => {
    const {
      id,
      name
    } = this.props.navigation.state.params.restaurant.item.restaurant;

    this.props.navigation.navigate("AddRestaurantReview", {
      id,
      name
    });

    return (
      <View style={styles.reviewsInvitationView}>
        <Text
          onPress={() =>
            this.props.navigation.navigate("Reviews", {
              id,
              name
            })
          }
          style={styles.linkLoginText}
        >
          VER MÁS REVIEWS
        </Text>
      </View>
    );
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

    const { reviews } = this.state;

    const listExtraInfo = [
      {
        text: `${city}, ${address}`,
        iconName: "map-marker",
        iconType: "material-community",
        action: null
      }
    ];

    return (
      <ScrollView style={styles.viewBody}>
        {/* <View style={styles.viewBody}> */}
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

        <View style={{ textAlign: "center" }}>
          <Text style={styles.commentsTitle}>Comentarios</Text>
        </View>
        {this.renderFlatList(reviews)}
      </ScrollView>
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
  },
  startLoadReviews: {
    marginTop: 20,
    alignItems: "center"
  },
  viewReview: {
    flexDirection: "row",
    margin: 10,
    paddingBottom: 20,
    borderBottomColor: "#e3e3e3",
    borderBottomWidth: 1
  },
  viewImage: {
    marginRight: 15
  },
  userAvatarImage: {
    width: 50,
    height: 50
  },
  viewInfo: {
    flex: 1,
    alignItems: "flex-start"
  },
  reviewTitle: {
    fontWeight: "bold"
  },
  reviewText: {
    paddingTop: 2,
    color: "grey",
    marginBottom: 5
  },
  reviewDate: {
    marginTop: 5,
    color: "grey",
    fontSize: 12
  },
  commentsTitle: {
    fontSize: 20,
    textAlign: "center",
    marginTop: 10,
    marginBottom: 20,
    fontWeight: "bold"
  },
  reviewsLoader: {
    marginTop: 10,
    marginBottom: 10
  },
  reviewsNotFound: {
    marginTop: 10,
    marginBottom: 10,
    alignItems: "center"
  },
  seeMoreReviewsText: {
    color: "#00a680",
    fontWeight: "bold"
  },
  reviewsInvitationView: {
    margin: 20,
    flex: 1,
    alignItems: "center"
  }
});
