import React from 'react';
import { Icon } from 'react-native-elements';

import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';

// Screens

import HomesCreen from '../screens/Home';
import TopFiveScreen from '../screens/TopFive';
import SearchScreen from '../screens/Search';
import MyAccountScreen from '../screens/MyAccount/MyAccount';
import RegisterScreen from '../screens/MyAccount/Register';
import LoginScreen from '../screens/MyAccount/Login';



const homeScreenStack = createStackNavigator({
    Home: {
        screen: HomesCreen,
        navigationOptions: ({ navigation }) => ({
            title: "Home"
        })
    },
});

const topFiveScreenStack = createStackNavigator({
    TopFive: {
        screen: TopFiveScreen,
        navigationOptions: ({ navigation }) => ({
            title: "Top 5 Restaurantes"
        })
    },
});

const searchScreenStack = createStackNavigator({
    Search: {
        screen: SearchScreen,
        navigationOptions: ({ navigation }) => ({
            title: "Buscar"
        })
    },
});

const myAccountScreenStack = createStackNavigator({
    MyAccount: {
        screen: MyAccountScreen,
        navigationOptions: ({ navigation }) => ({
            title: "Mi Cuenta"
        })
    },
    Register: {
        screen: RegisterScreen,
        navigationOptions: ({ navigation }) => ({
            title: "Registro"
        })
    },
    Login: {
        screen: LoginScreen,
        navigationOptions: ({ navigation }) => ({
            title: "Login"
        })
    }
});

const RootStack = createBottomTabNavigator({
    Home: {
        screen: homeScreenStack,
        navigationOptions: ({ navigation }) => ({
            tabBarLabel: "Home",
            tabBarIcon: ({ tintColor }) =>
                <Icon
                    name="compass-outline"
                    type="material-community"
                    size={22}
                    color={tintColor} />
        })
    },
    TopFive: {
        screen: topFiveScreenStack,
        navigationOptions: ({ navigation }) => ({
            tabBarLabel: "Top 5",
            tabBarIcon: ({ tintColor }) =>
                <Icon
                    name="star-outline"
                    type="material-community"
                    size={22}
                    color={tintColor} />
        })

    },
    Search: {
        screen: searchScreenStack,
        navigationOptions: ({ navigation }) => ({
            tabBarLabel: "Search",
            tabBarIcon: ({ tintColor }) =>
                <Icon
                    name="magnify"
                    type="material-community"
                    size={22}
                    color={tintColor} />
        })

    },
    MyAccount: {
        screen: myAccountScreenStack,
        navigationOptions: ({ navigation }) => ({
            tabBarLabel: "Mi Cuenta",
            tabBarIcon: ({ tintColor }) =>
                <Icon
                    name="account-settings"
                    type="material-community"
                    size={22}
                    color={tintColor} />
        })

    },


},
    {
        //Para establecer la route original.
        initialRouteName: 'MyAccount',
        //El valor 'order' es opcional.
        order: ['Home', 'TopFive', 'Search', 'MyAccount'],
        tabBarOptions: {
            inactiveTintColor: "#646464",
            activeTintColor: "#00a680"
        }
    }

);

export default createAppContainer(RootStack);




