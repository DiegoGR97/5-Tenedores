import React from 'react';

import t from 'tcomb-form-native';
import formValidation from "../utils/Validation";
import inputTemplate from './templates/Input';

export const RegisterStruct = t.struct({
    name: t.String,
    email: formValidation.email,
    password: formValidation.password,
    passwordConfirmation: formValidation.password
});
//24, 8:44.

export const RegisterOptions = {
    fields: {
        name: {
            template: inputTemplate,
            config: {
                placeholder: "Escribe tu nombre y apellido.",
                iconType: "material-community",
                iconName: "account-outline"
            }
        },
        email: {
            template: inputTemplate,
            config: {
                placeholder: "Escribe tu email válido.",
                iconType: "material-community",
                iconName: "at"
            }
        },
        password: {
            template: inputTemplate,
            config: {
                placeholder: "Escribe tu contraseña.",
                password: true,
                secureTextEntry: true,
                iconType: "material-community",
                iconName: "lock-outline"
            },
        },
        passwordConfirmation: {
            template: inputTemplate,
            config: {
                placeholder: "Repite tu contraseña.",
                password: true,
                secureTextEntry: true,
                iconType: "material-community",
                iconName: "lock-reset"
            },
        }
    }
}