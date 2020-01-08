import React, { Component } from "react";
import {
  StyleSheet,
  View,
  ActivityIndicator,
  BackHandler,
  Alert
} from "react-native";
import { AirbnbRating, Button, Text, Overlay } from "react-native-elements";
import Toast, { DURATION } from "react-native-easy-toast";

import t from "tcomb-form-native";
const Form = t.form.Form;
import {
  AddRestaurantReviewOptions,
  AddRestaurantReviewStruct
} from "../../forms/AddRestaurantReview";

import { firebaseApp } from "../../utils/Firebase";
import firebase from "firebase/app";
import "firebase/firestore";
const db = firebase.firestore(firebaseApp);

export default class AddRestaurantReview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      formData: {
        title: "",
        review: ""
      }
    };
  }

  componentDidMount() {
    this.backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      this.handleBackPress
    );
    //console.log(this.state);
  }

  componentWillUnmount() {
    this.backHandler.remove();
  }

  handleBackPress = async () => {
    //console.log("Handling backPress.");

    //HACER ESTO CON STATES.
    // Lo que está comentado no funciona idealmente porque a veces la propiedad value
    // del tag Form no es actualizada inmediatamente tras escribir en el form entonces
    // a veces sí dejaba salir del form sin ningún prompt.

    /*   let formValue = await this.refs.addRestaurantReviewForm.getValue();
    console.log("formValue:", formValue); */

    const ratingValue = this.refs.rating.state.position;
    //console.log("ratingValue:", ratingValue);

    const { formData } = this.state;
    //console.log("formData:", formData);

    let dataProvided = null;

    /* if (formValue != null || !(Number(ratingValue) === Number(0))) {
      if (formValue != null) {
        if (formValue.title != null || formValue.review != null) {
          dataProvided = true;
        }
      } */
    if (!(Number(ratingValue) === Number(0))) {
      dataProvided = true;
    }
    if (formData.title != "" || formData.review != "") {
      dataProvided = true;
    }

    //console.log("dataProvided:", dataProvided);

    if (dataProvided) {
      Alert.alert(
        "¡Atención!",
        "¿Seguro que quieres salir y descartar la información que ya escribiste?",
        [
          {
            text: "No Salir",
            onPress: () => {
              return true;
            },
            style: "cancel"
          },
          {
            text: "Salir",
            onPress: () => {
              this.props.navigation.goBack();
            }
          }
        ],
        { cancelable: false }
      );
      return true;
    } else {
      console.log("FormData y ratingValue vacíos.");
      this.props.navigation.goBack();
      //return false;
    }
    /*  } else {
      console.log("FormData está vacío.");
      this.props.navigation.goBack();
      //return false;
    } */
  };

  sendReview = () => {
    //console.log("Has enviado el formulario de review.");
    //console.log("this.refs.rating:", this.refs.rating);
    const ratingValue = this.refs.rating.state.position;
    // console.log("ratingValue:", ratingValue);

    const user = firebase.auth().currentUser;

    this.setState({
      loading: true
    });

    if (ratingValue == 0) {
      this.setState({
        loading: false
      });
      this.refs.toast.show("Tienes que puntuar al restaurante.", 1500);
    } else {
      const validate = this.refs.addRestaurantReviewForm.getValue();
      if (!validate) {
        this.setState({
          loading: false
        });
        this.refs.toast.show("Completa el formulario.", 1500);
      } else {
        //El formulario no viene vacío.
        const user = firebase.auth().currentUser;
        //console.log("user:", user);
        const data = {
          idUser: user.uid,
          avatarUser: user.photoURL,
          idRestaurant: this.props.navigation.state.params.id,
          title: validate.title,
          review: validate.review,
          rating: ratingValue,
          createdAt: new Date()
        };

        db.collection("reviews")
          .add(data)
          .then(response => {
            const restaurantRef = db
              .collection("restaurants")
              .doc(this.props.navigation.state.params.id);

            restaurantRef.get().then(response => {
              const restaurantData = response.data();
              const ratingTotal = restaurantData.ratingTotal + ratingValue;
              const votesCount = restaurantData.votesCount + 1;
              const rating = ratingTotal / votesCount;

              restaurantRef
                .update({ rating, ratingTotal, votesCount })
                .then(() => {
                  this.setState({
                    loading: false
                  });
                  this.refs.toast.show(
                    "Review enviado correctamente.",
                    1500,
                    () => {
                      this.props.navigation.state.params.loadReviews();
                      this.props.navigation.goBack();
                    }
                  );
                });
            });
          })
          .catch(error => {
            console.log("Error en Firebase:", error);
            this.setState({
              loading: false
            });
            this.refs.toast.show(
              "Error en el servidor. Por favor intente más tarde.",
              1500
            );
          });
      }
    }
  };

  onChangeFormRegister = formValue => {
    this.setState({
      formData: formValue
    });
    //console.log("this.state:", this.state);
  };

  render() {
    const { loading } = this.state;
    return (
      <View style={styles.viewBody}>
        <View style={styles.viewRating}>
          <AirbnbRating
            ref="rating"
            count={5}
            reviews={[
              "Pésimo",
              "Deficiente",
              "Normal",
              "Muy Bueno",
              "Excelente"
            ]}
            defaultRating={0}
            size={35}
          />
        </View>

        <View style={styles.formReview}>
          <Form
            ref="addRestaurantReviewForm"
            type={AddRestaurantReviewStruct}
            options={AddRestaurantReviewOptions}
            value={this.state.formData}
            onChange={formValue => this.onChangeFormRegister(formValue)}
          />
        </View>

        <View style={styles.viewSendReview}>
          <Button
            buttonStyle={styles.sendReviewButton}
            onPress={() => this.sendReview()}
            title="Enviar"
          ></Button>
        </View>

        <Overlay
          overlayStyle={styles.overlayLoading}
          isVisible={loading}
          width="auto"
          height="auto"
        >
          <View>
            <Text style={styles.overlayLoadingText}>Enviando Review</Text>
            <ActivityIndicator size="large" color="#00a680" />
          </View>
        </Overlay>

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
  viewRating: {
    height: 110,
    backgroundColor: "#f2f2f2"
  },
  formReview: {
    margin: 10,
    marginTop: 40
  },
  viewSendReview: {
    flex: 1,
    justifyContent: "flex-end",
    marginBottom: 30,
    marginLeft: 20,
    marginRight: 20
  },
  sendReviewButton: {
    backgroundColor: "#00a680"
  },
  overlayLoading: {
    padding: 40
  },
  overlayLoadingText: {
    color: "#00a680",
    marginBottom: 20,
    fontSize: 20
  }
});
