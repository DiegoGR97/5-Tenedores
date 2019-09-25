import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { ListItem } from 'react-native-elements';

import menuConfig from "./MenuConfig";
import OverlayOneInput from "../../Elements/OverlayOneInput";
import OverlayTwoInputs from '../../Elements/OverlayTwoInput';

export default class UpdateUserInfo extends Component {

    constructor(props) {
        super(props);

        this.state = {
            ...props,
            overlayComponent: null,
            menuItems: [
                {
                    title: "Cambiar Nombre y Apellidos",
                    iconType: "material-community",
                    iconNameLeft: "account-circle",
                    iconColorLeft: "#ccc",
                    iconNameRight: "chevron-right",
                    iconColorRight: "#ccc",
                    onPress: () => this.openOverlay(
                        "Nombres y Apellidos",
                        this.updateUserDisplayName,
                        props.userInfo.displayName)


                },
                {
                    title: "Cambiar Email",
                    iconType: "material-community",
                    iconNameLeft: "at",
                    iconColorLeft: "#ccc",
                    iconNameRight: "chevron-right",
                    iconColorRight: "#ccc",
                    onPress: () => this.openOverlayTwoInputs(
                        "Email", "Password",
                        props.userInfo.email,
                        this.updateUserEmail)
                },
                {
                    title: "Cambiar Contraseña",
                    iconType: "material-community",
                    iconNameLeft: "lock-reset",
                    iconColorLeft: "#ccc",
                    iconNameRight: "chevron-right",
                    iconColorRight: "#ccc",
                    onPress: () =>
                        console.log('Click en "Cambiar Contraseña"')

                }
            ]
        };
    }

    openOverlay = (placeholder, updateFunction, inputValue) => {
        this.setState({

            overlayComponent:
                <OverlayOneInput
                    isVisibleOverlay={true}
                    placeholder={placeholder}
                    updateFunction={updateFunction}
                    inputValue={inputValue} />
        });

    };

    updateUserDisplayName = async (newDisplayName) => {
        if (newDisplayName) {
            this.state.updateUserDisplayName(newDisplayName);
        }
        this.setState({
            overlayComponent: null
        })

    }

    openOverlayTwoInputs = (placeholderOne, placeholderTwo, inputValueOne, updateFunction) => {
        this.setState({
            overlayComponent:
                <OverlayTwoInputs
                    isVisibleOverlay={true}
                    placeholderOne={placeholderOne}
                    placeholderTwo={placeholderTwo}
                    updateFunction={updateFunction}
                    inputValueOne={inputValueOne}
                    inputValueTwo=""
                    isPassword={true}
                />
        })
    }

    updateUserEmail = async (newEmail, password) => {
        console.log("updateUserEmail()");
        const oldEmail = this.props.userInfo.email;
        if (oldEmail != newEmail) {
            this.state.updateUserEmail(newEmail, password);
        }
        this.setState({
            overlayComponent: null
        })
    }


    render() {
        const { menuItems } = this.state;
        const { overlayComponent } = this.state;
        return (
            <View>
                {menuItems.map((item, index) => (
                    <ListItem
                        key={index}
                        title={item.title}
                        leftIcon={{
                            type: item.iconType,
                            name: item.iconNameLeft,
                            color: item.iconColorLeft
                        }}
                        rightIcon={{
                            type: item.iconType,
                            name: item.iconNameRight,
                            color: item.iconColorRight
                        }}
                        onPress={item.onPress}
                        containerStyle={styles.contentContainerStyle}
                    />
                ))}

                {overlayComponent}


            </View>
        );
    }
}

const styles = StyleSheet.create({
    contentContainerStyle: {
        borderBottomWidth: 1,
        borderBottomColor: "#e3e3d3"
    }
});