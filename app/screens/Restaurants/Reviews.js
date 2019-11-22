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

export default class Reviews extends Component {
  constructor(props) {
    super(props);
    //console.log("props:", props);

    this.state = {
      reviews: null,
      startReview: null,
      reviewsLimit: 6,
      isLoading: true
    };
  }

  componentDidMount() {
    this.loadReviews();
  }

  loadReviews = async () => {
    //console.log("Loading reviews...");
    const { reviewsLimit } = this.state;
    /* const { id } = this.props.navigation.state.params.restaurant.item.restaurant; */
    /*  console.log(
      "this.props.navigation.state.params:",
      this.props.navigation.state.params
    ); */
    const { id } = this.props.navigation.state.params;
    //console.log("id:", id);

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

  handleLoadMore = async () => {
    //console.log("Cargando nuevos reviews.");
    const { reviewsLimit, startReview } = this.state;
    const { id } = this.props.navigation.state.params;
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

  renderFlatList = reviews => {
    //console.log("reviews:", reviews);
    if (reviews) {
      return (
        <FlatList
          data={reviews}
          renderItem={this.renderRow}
          keyExtractor={(item, index) => index.toString()}
          onEndReached={this.handleLoadMore}
          onEndReachedThreshold={0.1}
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
    if (this.state.isLoading) {
      return (
        <View style={styles.restaurantsLoader}>
          <ActivityIndicator size="large" />
        </View>
      );
    } else {
      return (
        <View style={styles.restaurantsNotFound}>
          <Text>No quedan reviews por cargar...</Text>
        </View>
      );
    }
  };

  render() {
    const { reviews } = this.state;
    return (
      <View style={styles.viewBody}>
        <View style={{ textAlign: "center" }}>
          <Text style={styles.commentsTitle}>Comentarios</Text>
        </View>
        {this.renderFlatList(reviews)}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  viewBody: {
    flex: 1
  },
  commentsTitle: {
    fontSize: 20,
    textAlign: "center",
    marginTop: 10,
    marginBottom: 20,
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
  restaurantsNotFound: {
    marginTop: 10,
    marginBottom: 10,
    alignItems: "center"
  }
});
