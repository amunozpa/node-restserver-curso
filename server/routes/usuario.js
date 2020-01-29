const express = require('express')

const bcrypt = require('bcrypt')
const _ = require('underscore');

const Usuario = require('../models/usuario')

const app = express()

//Consulta de usuarios
app.get('/usuarios', function(req, res) {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    //.exec es de mongoose
    //el segundo parametro me filtra los campos deseados 'nombre email role estado google img'
    Usuario.find({ estado: true }, 'nombre email role estado google img')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Usuario.count({ estado: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    usuarios,
                    cuantos: conteo
                });
            })


        })


})

//creacion de usuarios
app.post('/usuarios', function(req, res) {

    let body = req.body;

    //crea instacia del model que creara en la BD
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        //bcrypt.hashSync -> encripta data y 10 vueltas 
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    //lo grabamos en la BD
    usuario.save((err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        //forma provisional para ocultar campo que no necesita ver el usuario
        //usuarioDB.password = null;

        res.json({
            ok: true,
            usuario: usuarioDB
        });

    });
});

//actualizacion de usuarios
app.put('/usuarios/:id', function(req, res) {

    let id = req.params.id;
    // _.pick() pertenece a la libreria underscores, permite tener una copia de l objeto s con los elementeos requeridos.
    //los campós no mencionados no seran modficados (como pasword y google)
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

    //el metodo find usado lo implementa mongoose
    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        })

    })

})

//Cambio de estado para usuario activos(se opto por no borrar)
app.delete('/usuarios/:id', function(req, res) {
    let id = req.params.id;

    let cambiaEstado = {
        estado: false
    }

    Usuario.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, usuarioBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (usuarioBorrado === null) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            usuario: usuarioBorrado
        });
    });


});


module.exports = app;