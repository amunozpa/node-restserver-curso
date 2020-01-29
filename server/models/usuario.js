const mongoose = require('mongoose');
const Uniquevalidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol valido'
};

let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'El correo es necesario']
    },
    password: {
        type: String,
        required: [true, 'La contraseña es necesario']
    },
    img: {
        type: String,
        required: false
    }, //no obligatorio
    role: {
        type: String,
        default: 'USER_ROLE',
        //enum valida que solo acepte los valores validos
        enum: rolesValidos
    }, //default: 'USER_ROLE'
    estado: {
        type: Boolean,
        default: true
    }, //boolean
    google: {
        type: Boolean,
        default: false
    } //boolean

});

//aqui no se usa funcion flecha porque se necesita usar el this || se usa para no mostrar la constraseña
//se obtiene el objeto y se le quita el password, finalmente se retorna el objeto(asi ya no lo muestra)
usuarioSchema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject;
}

//para personalizar el mensjae de error 
usuarioSchema.plugin(Uniquevalidator, { message: '{PATH} debe de ser único' })

module.exports = mongoose.model('Usuario', usuarioSchema);