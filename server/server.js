require('./config/config')
const express = require('express')
const mongoose = require('mongoose')



const app = express()
const bodyParser = require('body-parser')

//servira para trabajar con estos formatos, pertenece a body parser npm (son middleware)
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use(require('./routes/usuario'));

//para conectar a la base de datos, cuando se hace inserciones mongoose crea toda la estructura
//segundo parametro se agrego para arreglar warning "deprecation" en el MongoClient constructor

mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true }, (err, res) => {
    if (err) throw err;
    console.log('Base de datos ONLINE!');
});


app.listen(process.env.PORT, () => {
    console.log(`escuchando puerto ${process.env.PORT}`)
});