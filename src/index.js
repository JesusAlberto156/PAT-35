const express = require('express');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const path = require('path');
const flash = require('connect-flash');
const session = require('express-session');
const MySQLStore = require('express-mysql-session');
const { database } = require('./keys');
const passport = require('passport');
const twilio = require('twilio');
const accountSid = 'AC18a58ad0a44348a2f6a6a941818a26df'; // Reemplaza con tu Account SID de Twilio
const authToken = '097d496acf3ec9cabf947237841090b9'; // Reemplaza con tu Auth Token de Twilio
const client = twilio(accountSid, authToken);

//inicializaciones
const app = express();
require('./lib/passport');


//settings
app.set('port', process.env.PORT || 4000);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: require('./lib/handlebars')
}));
app.set('view engine', '.hbs');


//middlewares
app.use(session({
    secret: 'mysqlnodesession',
    resave: false,
    saveUninitialized: false,
    store: new MySQLStore(database)
    
}))
app.use(flash());
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());



//global variables
app.use((req, res, next) => {
    app.locals.success = req.flash('success');
    app.locals.message = req.flash('message');
    app.locals.user = req.user;
    next();
});

//routes
app.use(require('./routes/index'));
app.use(require('./routes/authentication'));
app.use(require('./routes/Encuesta'));
app.use('/PAT-035', require('./routes/PAT-035'));


// public
app.use(express.static(path.join(__dirname, 'public')));

// Ruta para renderizar la página de envío de mensajes
app.get('/', (req, res) => {
    res.render('main');
});

// Ruta para enviar el mensaje de WhatsApp
app.post('/Enviar',(req, res) => {
    const numero = req.body.numero;
    const mensaje = req.body.mensaje;
    const nombre = req.body.nombre;
    console.log(numero);
    console.log(mensaje);
    console.log(nombre);
    // Utiliza la biblioteca twilio para enviar el mensaje de WhatsApp
    client.messages
    .create({
        body: mensaje,
        from: '+12706068036', // Reemplaza con tu número de WhatsApp de Twilio
        to: numero
    })
    .then(() => {
        req.flash('success','Mensaje enviado exitosamente al empleado ' + nombre + '.');
        res.redirect('/PAT-035/empleados');
    })
    .catch((error) => {
        console.error('Error al enviar el mensaje:', error);
        req.flash('message','Error al enviar el mensaje al empleado ' + nombre + '.');
        res.redirect('/PAT-035/empleados');
    });
});

//starting the server
app.listen(app.get('port'), () => {
    console.log('Server on port', app.get('port'))
});
