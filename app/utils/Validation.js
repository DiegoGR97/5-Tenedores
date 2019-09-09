import t from 'tcomb-form-native';

export default fromValidation = {
    email: t.refinement(t.String, (value) => {
        return /@/.test(value);
    }),
    password: t.refinement(t.String, (value) => {
        return value.length >= 6;
    })
}