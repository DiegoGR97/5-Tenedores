import React, { Component } from 'react';
import { StyleSheet, View, Text, ImagePickerIOS } from 'react-native';
import { Avatar, Button } from 'react-native-elements';
import Toast, { DURATION } from 'react-native-easy-toast';
import solucionTimer from '../../../../lib/solucionTimer';


import UpdateUserInfo from './UpdateUserInfo';

import * as firebase from "firebase";
import * as Permissions from 'expo-permissions';
import * as ImagePicker from "expo-image-picker";



export default class UserInfo extends Component {
    constructor(props) {
        super(props);

        this.state = {
            ...props,
            userInfo: {
                displayName: "",
                email: "",
                photoUrl: ""
            }
        }
    }

    componentDidMount = async () => {
        await this.getUserInfo();
        //console.log("state.userInfo:", this.state.userInfo);
    };

    //https://invertase.io/oss/react-native-firebase/v6/auth/reference/userinfo
    //http://avatars.adorable.io/   
    getUserInfo = async () => {
        const user = firebase.auth().currentUser;
        //console.log("Logged user:", user);
        await user.providerData.forEach(userInfo => {
            //console.log("userInfo:", userInfo);
            this.setState({
                userInfo
            });
        })
    };

    reauthenticate = currentPassword => {
        const user = firebase.auth().currentUser;
        //console.log("user.email:", user.email);
        const credentials = firebase.auth.EmailAuthProvider.credential(
            user.email,
            currentPassword
        );
        return user.reauthenticateWithCredential(credentials);
    };

    checkUserAvatar = photoURL => {
        return photoURL ? photoURL : "https://api.adorable.io/avatars/285/abott@adorable.png";
    }

    updateUserDisplayName = async (newDisplayName) => {
        const update = {
            displayName: newDisplayName
        }
        await firebase.auth().currentUser.updateProfile(update);
        this.getUserInfo();
    }

    updateUserEmail = async (newEmail, password) => {
        console.log("newEmail:", newEmail);
        console.log("password:", password);
        this.reauthenticate(password).then((user) => {
            const userNow = firebase.auth().currentUser;
            userNow.updateEmail(newEmail).then(() => {
                this.refs.toast.show((
                    "Email actualizado a " + newEmail +
                    " correctamente. \nVuelva a iniciar sesión."), 1500, () => {
                        firebase.auth().signOut();
                    })

            }).catch(error => {
                console.log(error);
                this.refs.toast.show(error, 1500)
            })
        }).catch(error => {
            console.log("Tu contraseña no es correcta.", error);
            this.refs.toast.show("Tu contraseña no es correcta.", 1500)
        })

    }


    returnUpdateUserInfoComponent = userInfoData => {
        if (userInfoData.hasOwnProperty("uid")) {
            return (
                <UpdateUserInfo
                    userInfo={this.state.userInfo}
                    updateUserDisplayName={this.updateUserDisplayName}
                    updateUserEmail={this.updateUserEmail}
                    updateUserPassword={this.updateUserPassword}
                />
            );
        }
    }

    updateUserPassword = async (currentPassword, newPassword) => {
        //console.log("currentPassword:", currentPassword);
        //console.log("newPassword:", newPassword);
        this.reauthenticate(currentPassword).then(() => {
            const user = firebase.auth().currentUser;
            user.updatePassword(newPassword).then(() => {
                this.refs.toast.show(
                    "Contraseña actualizada correctamente. Vuelve a iniciar sesión.",
                    1500,
                    () => {
                        firebase.auth().signOut();
                    });
            }).catch((error) => {
                this.refs.toast.show("Error en el servidor. " + error, 1500);
            })

        }).catch(error => {
            this.refs.toast.show("Tu contraseña actual introducida no es correcta.", 1500);

        })
    }

    updateUserPhotoURL = async photoUri => {
        const update = {
            photoURL: photoUri
        }
        await firebase.auth().currentUser.updateProfile(update);
        this.getUserInfo();
    }

    uploadImage = async (uri, imageName) => {
        //console.log("URI:", uri);
        //console.log("imageName:", imageName);

        /* return new Promise((resolve, reject) => {
            let xhr = new XMLHttpRequest();
              xhr.onerror = reject;
              xhr.onreadystatechange = () => {
                  if (xhr.readyState === 4) {
                      resolve(xhr.response);
                  }
              }
              xhr.open("GET", uri);
              xhr.responseType = "blob";
              xhr.send();
        }).then(async resolve => { */
        await fetch(uri)
            .then(async resul => {
                let ref = firebase.storage().ref().child("avatar/" + imageName);
                return await ref.put(resolve);
            }).catch(error => {
                this.refs.toast.show(
                    "Error al subir la imagen al servidor, inténtelo más tarde.",
                    1500
                );
            })
    };

    changeAvatarUser = async () => {
        //console.log("Change Avatar User.")
        const permissionResult = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        //console.log(permissionResult)
        if (permissionResult.status === "denied") {
            this.refs.toast.show("Es necesario aceptar los permisos de galería.");
        }
        else {
            console.log("Permisos de galería otorgados.")
            const result = await ImagePicker.launchImageLibraryAsync({
                allowsEditing: true,
                aspect: [4, 3]
            })
            //console.log("Result:", result);
            if (result.cancelled) {
                this.refs.toast.show("Has cerrado la galería.", 1500);
            }
            else {
                const { uid } = this.state.userInfo;
                console.log("Has seleccionado una imagen:", result);
                this.uploadImage(result.uri, uid).then(resolve => {
                    this.refs.toast.show("Avatar actualizado correctamente.");
                    firebase.storage().ref("avatar/" + uid).getDownloadURL().then(resolve => {
                        console.log(resolve);
                        this.updateUserPhotoURL(resolve);
                    }).catch(error => {
                        this.refs.toast.show("Error al recuperar el avatar del servidor.", 1500);
                    })
                }).catch(error => {
                    this.refs.toast.show(
                        "Error al actualizar el avatar. Inténtelo más tarde. "
                        + error)
                });
            }

        }
    }



    render() {
        const { displayName, email, photoURL } = this.state.userInfo;
        //console.log(this.checkUserAvatar(photoURL));
        return (
            <View>
                <View style={styles.viewUserInfo}>
                    <Avatar
                        rounded
                        size="large"
                        showEditButton
                        onEditPress={() => this.changeAvatarUser()}
                        source={{ uri: this.checkUserAvatar(photoURL) }}
                        containerStyle={styles.userInfoAvatar}

                    />
                    <View>
                        <Text style={styles.displayName}> {displayName} </Text>
                        <Text> {email} </Text>
                    </View>

                </View>
                {this.returnUpdateUserInfoComponent(this.state.userInfo)}

                <Button
                    title="Cerrar sesión"
                    onPress={() => firebase.auth().signOut()}
                    buttonStyle={styles.btnSignOut}
                    titleStyle={styles.btnSignOutText}
                />

                <Toast
                    ref="toast"
                    position="bottom"
                    positionValue={250}
                    fadeInDuration={1000}
                    fadeOutDuration={1000}
                    opacity={0.8}
                    textStyle={{ color: "#fff" }}
                />

            </View>
        )
    }
}

const styles = StyleSheet.create({
    viewUserInfo: {
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        paddingTop: 30,
        paddingBottom: 30,
        backgroundColor: "#f2f2f2"
    },
    userInfoAvatar: {
        marginRight: 20,
    },
    displayName: {
        fontWeight: "bold",
    },
    btnSignOut: {
        marginTop: 30,
        borderRadius: 0,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#e3e3e3',
        borderBottomWidth: 1,
        borderBottomColor: '#e3e3e3',
        paddingTop: 15,
        paddingBottom: 15
    },
    btnSignOutText: {
        color: '#00a680'

    }
});