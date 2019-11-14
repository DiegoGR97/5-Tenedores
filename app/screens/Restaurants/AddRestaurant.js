import React, { Component } from "react";
import { StyleSheet, View, Text } from "react-native";
import { Icon, Image, Button } from "react-native-elements";
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
      const data = {
        name,
        city,
        address,
        description,
        image: ""
      };
      db.collection("restaurants")
        .add({ data })
        .then(addRestaurant => {
          console.log("Restaurante añadido:", addRestaurant.id);
          const restaurantId = addRestaurant.id;
          uploadImage(imageUriRestaurant, restaurantId, "restaurants")
            .then(uploadedImage => {
              console.log("Todo correcto", uploadedImage);
            })
            .catch(error => {
              console.log("error:", error);
            });
        })
        .catch(error => {
          this.refs.toast.show("Error de servidor. Inténtelo más tarde.");
        });
    } else {
      this.refs.toast.show("Debes de llenar todos los campos.");
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
  }
});
