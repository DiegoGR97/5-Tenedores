import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Image, Button, SocialIcon, Divider } from 'react-native-elements';
import Toast, { DURATION } from 'react-native-easy-toast';
import { ActivityIndicator } from 'react-native';
import t from "tcomb-form-native";
import Expo from 'expo';

const Form = t.form.Form;
import { LoginStruct, LoginOptions } from '../../forms/Login';
import * as firebase from 'firebase';
import { FacebookApi } from '../../utils/Social';
import * as Facebook from "expo-facebook";



export default class Login extends Component {
    constructor() {
        super();

        this.state = {
            loginStruct: LoginStruct,
            loginOptions: LoginOptions,
            loginData: {
                email: "",
                password: "",
            },
            loginErrorMessage: "",
        };
    }

    login = () => {
        console.log("Haciendo el login.");
        console.log(this.state.loginData);
        const validate = this.refs.loginForm.getValue();
        if (!validate) {
            this.setState({
                loginErrorMessage: "Datos de formulario inválidos."
            })
        }
        else {
            this.setState({
                loginErrorMessage: ""
            });
            firebase.auth().signInWithEmailAndPassword(validate.email, validate.password)
                .then(() => {
                    console.log("Login correcto.")
                }).catch(error => {

                    //Esta opción es más segura.
                    //this.refs.toastLogin.show("Login incorrecto", 2500);

                    //Esta opción es más amigable con el usuario
                    const errorCode = error.code;
                    if (errorCode === "auth/wrong-password") {
                        this.refs.toastLogin.show("Contraseña incorrecta", 2500);
                    }
                    if (errorCode === "auth/user-not-found") {
                        this.refs.toastLogin.show("Usuario no encontrado", 2500);
                    }

                })
        }
    }

    loginFacebook = async () => {
        const { type, token } = await Facebook.logInWithReadPermissionsAsync(
            FacebookApi.application_id,
            { permissions: FacebookApi.permissions }
        );
        if (type == "success") {
            const credentials = firebase.auth.FacebookAuthProvider.credential(token);
            firebase.auth().signInWithCredential(credentials).then(() => {
                this.refs.toastLogin.show("Login correcto", 500, () => {
                    this.props.navigation.goBack();
                })
            }).catch(error => {
                this.refs.toastLogin.show("Error accediendo a Firebase., inténtelo más tarde.");
            })
            console.log("Credentials:", credentials);
        } else if (type == "cancel") {
            this.refs.toastLogin.show("Inicio de sesión cancelado", 500);
        } else {
            this.refs.toastLogin.show("Error desconocido, inténtelo más tarde.", 500);
        }
    };

    onChangeFormLogin = (formValue) => {
        console.log("Changed form Login:", formValue);
        this.setState({
            loginData: formValue
        });
    };

    render() {
        const { loginStruct, loginOptions, loginErrorMessage } = this.state;

        return (
            <View style={styles.viewBody}>
                <Image
                    source={require('../../../assets/img/5-tenedores-letras-icono-logo.png')}
                    containerStyle={styles.containerLogo}
                    style={styles.logo}
                    PlaceholderContent={<ActivityIndicator />}
                    resizeMode="contain"
                />

                <View style={styles.viewForm}>
                    <Form
                        ref="loginForm"
                        type={loginStruct}
                        options={loginOptions}
                        value={this.state.loginData}
                        onChange={(formValue) => this.onChangeFormLogin(formValue)} />
                    <Button
                        buttonStyle={styles.buttonLoginContainer}
                        title="Login"
                        onPress={() => this.login()} />
                    <Text style={styles.loginErrorMessage}>{loginErrorMessage}</Text>
                    <Divider style={styles.divider} />
                    <SocialIcon
                        title='Iniciar sesión con Facebook'
                        button type='facebook'
                        onPress={() => this.loginFacebook()}
                    />
                </View>

                <Toast
                    ref="toastLogin"
                    position="bottom"
                    positionValue={300}
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
    viewBody: {
        flex: 1,
        marginLeft: 40,
        marginRight: 40,
        marginTop: 40,
    },
    containerLogo: {
        alignItems: "center"
    },
    logo: {
        width: 300,
        height: 150
    },
    viewForm: {
        marginTop: 50
    },

    buttonLoginContainer: {
        backgroundColor: "#00a680",
        marginTop: 20,
        marginLeft: 10,
        marginRight: 10,
    },
    loginErrorMessage: {
        color: "red",
        textAlign: "center",
        marginTop: 20
    },
    divider: {
        backgroundColor: "#00a680",
        marginBottom: 20
    }

})