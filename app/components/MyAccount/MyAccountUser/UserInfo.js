import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Avatar } from 'react-native-elements';
import Toast, { DURATION } from 'react-native-easy-toast';

import UpdateUserInfo from './UpdateUserInfo';

import * as firebase from "firebase";

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
                />
            );
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
                        source={{ uri: this.checkUserAvatar(photoURL) }}
                        containerStyle={styles.userInfoAvatar}
                    />
                    <View>
                        <Text style={styles.displayName}> {displayName} </Text>
                        <Text> {email} </Text>
                    </View>

                </View>
                {this.returnUpdateUserInfoComponent(this.state.userInfo)}

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
    }
});