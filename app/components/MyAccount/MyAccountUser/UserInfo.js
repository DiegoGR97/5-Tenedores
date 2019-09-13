import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Avatar } from 'react-native-elements';

import * as firebase from "firebase";

export default class UserInfo extends Component {
    constructor(state) {
        super();
    }

    render() {
        return (
            <View>
                <Text>UserInfo</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    viewUserInfo: {
        alignItems: "center",
        flexDirection: "row"
    }
});