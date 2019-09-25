//import UpdateUserInfo from './UpdateUserInfo';

export default (menuConfig = [
    {
        title: "Cambiar Nombre y Apellidos",
        iconType: "material-community",
        iconNameLeft: "account-circle",
        iconColorLeft: "#ccc",
        iconNameRight: "chevron-right",
        iconColorRight: "#ccc",
        onPress: () => UpdateUserInfo.openOverlay("Nombres y Apellidos", UpdateUserInfo.updateUserDisplayName)


    },
    {
        title: "Cambiar Email",
        iconType: "material-community",
        iconNameLeft: "at",
        iconColorLeft: "#ccc",
        iconNameRight: "chevron-right",
        iconColorRight: "#ccc",
        onPress: () =>
            console.log('Click en "Cambiar Email"')
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
]);