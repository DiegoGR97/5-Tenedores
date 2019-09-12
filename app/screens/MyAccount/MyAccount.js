import React, { Component } from "react";
import { StyleSheet, View, Text } from "react-native";
import { Button } from 'react-native-elements';

import * as firebase from 'firebase';
export default class MyAccount extends Component {

    constructor() {
        super();
        console.log("Me ejecuto primero.");
        this.state = {
            login: false
        };
    }

    async componentDidMount() {
        console.log("Me ejecuto tercero.");
        await firebase.auth().onAuthStateChanged(user => {
            //Esto da un JSON Web Token que podemos ver en un convertidor online.
            console.log("User:", user);
            if (user) {
                this.setState({
                    login: true,
                });
            } else {
                this.setState({
                    login: false
                });
            }
        });
    }


    goToScreen = nameScreen => {
        //console.log("Props:", props);
        this.props.navigation.navigate(nameScreen);
    }

    logout = () => {
        console.log("Cerrando sesión");
        firebase.auth().signOut();
    }
    render() {
        console.log("Me ejecuto segundo.");
        const { login } = this.state;


        if (login) {
            return (
                <View style={styles.viewBody}>
                    <Text> Estás loggeado correctamente.</Text>
                    <Button title="Cerrar sesión" onPress={() => this.logout()} />
                </View>
            );
        }
        else {
            return (
                < View style={styles.viewBody} >
                    <Button title="Registro" onPress={() => this.goToScreen("Register")} />
                    <Button title="Login" onPress={() => this.goToScreen("Login")} />

                </View >
            );
        }
    }
}

const styles = StyleSheet.create({
    viewBody: {
        flex: 1,
        alignItems: 'center',
        justifyContent: "center",
        backgroundColor: "#fff",
    }
})