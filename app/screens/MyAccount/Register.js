import React, { Component } from "react";
import { StyleSheet, View, ActivityIndicator } from "react-native";
import { Button, Text, Image } from 'react-native-elements';
import Toast, { DURATION } from 'react-native-easy-toast';

import t from 'tcomb-form-native';
const Form = t.form.Form;
import { RegisterStruct, RegisterOptions } from '../../forms/Register';

import * as firebase from 'firebase';
export default class Register extends Component {
    constructor() {
        super();

        this.state = {
            registerStruct: RegisterStruct,
            registerOptions: RegisterOptions,
            formData: {
                name: "",
                email: "",
                password: "",
                passwordConfirmation: ""
            },
            formErrorMessage: ""
        };
    }

    register = () => {

        const { password, passwordConfirmation } = this.state.formData;
        console.log(this.state.formData);
        if (password === passwordConfirmation) {
            console.log("Contraseñas iguales.");
            const validate = this.refs.registerForm.getValue();

            if (validate) {
                console.log("Formulario correcto.");
                this.setState({
                    formErrorMessage: ""
                });
                firebase.auth().createUserWithEmailAndPassword(validate.email, validate.password).then(resolve => {
                    //console.log("Registro correcto.");
                    this.refs.toast.show('Registro exitoso.', 2000, () => {
                        this.props.navigation.navigate("MyAccount");
                        //También funciona.
                        //this.props.navigation.goBack();

                    });
                }).catch(err => {
                    this.refs.toast.show('El email ya está en uso', 2000);
                    //console.log("Error en el registro:", err);
                })
            }
            else {
                this.setState({
                    formErrorMessage: "Formulario inválido."
                })
            }
        }
        else {
            this.setState({
                formErrorMessage: "Las contraseñas no coinciden."
            })
        }

    };

    onChangeFormRegister = (formValue) => {
        this.setState({
            formData: formValue
        })
    }

    render() {
        const { registerStruct, registerOptions, formErrorMessage } = this.state;
        return (
            < View style={styles.viewBody} >
                <View style={styles.centeredImage} >
                    <Image
                        source={require('../../../assets/img/5-tenedores-letras-icono-logo.png')}
                        containerStyle={styles.containerLogo}
                        style={styles.logo}
                        PlaceholderContent={<ActivityIndicator />}
                        resizeMode="contain"
                    />
                </View>

                <Form
                    ref="registerForm"
                    type={registerStruct}
                    options={registerOptions}
                    value={this.state.formData}
                    onChange={(formValue) => this.onChangeFormRegister(formValue)}
                />
                <Button buttonStyle={styles.buttonRegisterContainer}
                    title="Registrar" onPress={() => this.register()} />
                <Text style={styles.formErrorMessage}>
                    {formErrorMessage} </Text>
                <Toast
                    ref="toast"
                    style={{ backgroundColor: 'black' }}
                    position='bottom'
                    positionValue={250}
                    fadeInDuration={750}
                    fadeOutDuration={1000}
                    opacity={0.8}
                    textStyle={{ color: '#fff' }}
                />

            </View >
        );
    }
}

const styles = StyleSheet.create({
    viewBody: {
        flex: 1,
        justifyContent: "center",
        marginLeft: 40,
        marginRight: 40,
    },
    centeredImage: {
        alignItems: "center",
        justifyContent: "center",
    },
    containerLogo: {
        alignItems: "center",
        marginBottom: 30,
        justifyContent: "center",
        display: "flex",
    },
    logo: {
        width: 300,
        height: 150
    },
    buttonRegisterContainer: {
        backgroundColor: "#00a680",
        marginTop: 20,
        marginLeft: 10,
        marginRight: 10
    },
    formErrorMessage: {
        color: "#f00",
        textAlign: "center",
        marginTop: 30
    }
})