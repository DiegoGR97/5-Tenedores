import React from 'react';

import t from 'tcomb-form-native';
import formValidation from "../utils/Validation";
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
            label: "Nombre (*)",
            placeholder: "Escribe tus nombres y apellidos.",
            error: "Nombre inválido"
        },
        email: {
            label: "Email (*)",
            placeholder: "Escribe tu email.",
            error: "Email inválido"
        },
        password: {
            label: "Contraseñas (*)",
            placeholder: "Escribe tu contraseña.",
            error: "Contraseña inválida",
            password: true,
            secureTextEntry: true
        },
        passwordConfirmation: {
            label: "Repetir contraseña.",
            placeholder: "Repite tu contraseña.",
            error: "Contraseña inválida",
            password: true,
            secureTextEntry: true
        }
    }
}