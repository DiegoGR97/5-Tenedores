import React, { Component } from "react";
import { StyleSheet, View, ActivityIndicator } from "react-native";
import { Icon, Image, Button, Text, Overlay } from "react-native-elements";
//import { Permissions, ImagePicker } from "expo";
import Toast, { DURATION } from "react-native-easy-toast";
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";
import { uploadImage } from "../../utils/UploadImage";

import t from "tcomb-form-native";
const Form = t.form.Form;
import {
  AddRestaurantStruct,
  AddRestaurantOptions
} from "../../forms/AddRestaurant";

import { firebaseApp } from "../../utils/Firebase";
import firebase from "firebase/app";
import "firebase/firestore";
const db = firebase.firestore(firebaseApp);

export default class AddRestaurant extends Component {
  constructor() {
    super();
    this.state = {
      loading: false,
      imageUriRestaurant: "",
      formData: {
        name: "",
        city: "",
        address: "",
        description: ""
      }
    };
  }

  isImageRestaurant = image => {
    if (image) {
      return (
        <Image
          source={{ uri: image }}
          style={{ width: 500, height: 150 }}
        ></Image>
      );
    } else {
      return (
        <Image
          source={require("../../../assets/img/no-image.jpg")}
          style={{ width: 500, height: 150 }}
        ></Image>
      );
    }
  };

  uploadImage = async () => {
    const permissionResult = await Permissions.askAsync(
      Permissions.CAMERA_ROLL
    );

    if (permissionResult.status === "denied") {
      this.refs.toast.show(
        "Es necesario aceptar los permisos de la galería.",
        1500
      );
    } else {
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true
      });
      if (result.cancelled) {
        this.refs.toast.show("Has cerrado la galería de imágenes", 1500);
      } else {
        //console.log(result);
        this.setState({
          imageUriRestaurant: result.uri
        });
      }
    }

    //console.log("Uploading image...");
  };

  onChangeFormAddRestaurant = formValue => {
    this.setState({
      formData: formValue
    });
    //console.log(this.state);
  };

  addRestaurant = () => {
    console.log("addRestaurant()");
    //console.log(this.state);
    const { imageUriRestaurant } = this.state;
    const { name, city, address, description } = this.state.formData;
    this.setState({
      loading: true
    });

    //Para probar la función uploadImage().
    /* uploadImage(imageUriRestaurant, "mifotorestaurante", "restaurants")
      .then(response => {
        console.log("Todo correcto", response);
      })
      .catch(error => {
        console.log("error:", error);
      }); */

    if (imageUriRestaurant && name && city && address && description) {
      //console.log("Formulario lleno.");
      db.collection("restaurants")
        .add({
          name,
          city,
          address,
          description,
          image: "",
          createdAt: new Date()
        })
        .then(addRestaurant => {
          console.log("Restaurante añadido:", addRestaurant.id);
          const restaurantId = addRestaurant.id;
          uploadImage(imageUriRestaurant, restaurantId, "restaurants")
            .then(uploadedImage => {
              console.log("Todo correcto", uploadedImage);
              const restaurantRef = db
                .collection("restaurants")
                .doc(restaurantId);

              restaurantRef
                .update({ image: uploadedImage })
                .then(() => {
                  console.log("Restaurante creado correctamente.");
                  this.refs.toast.show(
                    "Restaurante creado correctamente.",
                    100,
                    () => {
                      this.props.navigation.goBack();
                    }
                  );
                  this.setState({ loading: false });
                })
                .catch(error => {
                  console.log("error en update:", error);
                  this.refs.toast.show(
                    "Error de servidor. Inténtelo más tarde."
                  );
                  this.setState({ loading: false });
                });
            })
            .catch(error => {
              console.log("error en uploadImage:", error);
              this.refs.toast.show("Error de servidor. Inténtelo más tarde.");
              this.setState({ loading: false });
            });
        })
        .catch(error => {
          this.refs.toast.show("Error de servidor. Inténtelo más tarde.");
          this.setState({ loading: false });
        });
    } else {
      this.refs.toast.show("Debes de llenar todos los campos.");
      this.setState({ loading: false });
    }
  };

  render() {
    const { imageUriRestaurant } = this.state;
    return (
      <View style={styles.viewBody}>
        <View style={styles.viewPhoto}>
          {this.isImageRestaurant(imageUriRestaurant)}
        </View>
        <View>
          <Form
            ref="addRestaurantForm"
            type={AddRestaurantStruct}
            options={AddRestaurantOptions}
            value={this.state.formData}
            onChange={formValue => this.onChangeFormAddRestaurant(formValue)}
          />
        </View>
        <View style={styles.viewIconUploadPhoto}>
          <Icon
            name="camera"
            type="material-community"
            color="#7A7A7A"
            iconStyle={styles.addPhotoIcon}
            onPress={() => this.uploadImage()}
          />
        </View>
        <View style={styles.viewBtnAddRestaurant}>
          <Button
            title="Crear Restaurante"
            onPress={() => this.addRestaurant()}
            buttonStyle={styles.btnAddRestaurant}
          />
        </View>

        <View></View>

        <Overlay
          overlayStyle={styles.overlayLoading}
          isVisible={this.state.loading}
          width="auto"
          height="auto"
        >
          <View>
            <Text style={styles.overlayLoadingText}>Creando Restaurante</Text>
            <ActivityIndicator size="large" color="#00a680"></ActivityIndicator>
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
        ></Toast>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  viewBody: {
    flex: 1
  },
  viewPhoto: {
    alignItems: "center",
    height: 150,
    marginBottom: 20,
    marginTop: 10
  },
  viewIconUploadPhoto: {
    flex: 1,
    alignItems: "flex-start",
    marginLeft: 12
  },
  addPhotoIcon: {
    backgroundColor: "#e3e3e3",
    padding: 17,
    paddingBottom: 14,
    margin: 0
  },
  viewBtnAddRestaurant: {
    flex: 1,
    justifyContent: "flex-end"
  },
  btnAddRestaurant: {
    backgroundColor: "#00a680",
    margin: 20
  },
  overlayLoading: {
    padding: 20
  },
  overlayLoadingText: {
    color: "#00a680",
    marginBottom: 20,
    fontSize: 20
  }
});
