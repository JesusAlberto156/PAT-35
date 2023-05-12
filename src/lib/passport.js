const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const pool = require('../database');
const helpers = require('../lib/helpers');

passport.use('local.signin', new LocalStrategy({
    usernameField: 'correo',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, correo, password, done) => {
    const hotel = await pool.query('SELECT * FROM hotel_access WHERE correo = ?', [correo]);
    if(hotel.length > 0){
        if(hotel[0].estatus == 1){
            if(hotel.length > 0){
                const validPassword = await helpers.matchPassword(password, hotel[0].password);
                if(validPassword){
                    done(null, hotel[0], req.flash('success', 'Bienvenido ' + hotel[0].nombre));
                }else{
                    done(null, false, req.flash('message', 'Contraseña incorrecta'));
                }
            }else{
                return done(null, false, req.flash('message', 'El correo no existe'));
            }  
        }else if(hotel[0].estatus == 0){
            return done(null, false, req.flash('message', 'La cuenta no ha sido activada'));
        }else if(hotel[0].estatus == 3){
            return done(null, false, req.flash('message', 'La cuenta ha sido bloqueada'));
        }


    }else{
        return done(null, false, req.flash('message', 'El correo no existe'));  
    }

}));

passport.use('local.signup', new LocalStrategy({
    usernameField: 'correo',
    passwordField: 'password', 
    passReqToCallback: true
}, async (req, correo, password, done) => {
    const hotel = await pool.query('SELECT * FROM hotel_access where correo = ?', [correo]);
    const pasen = await helpers.encryptPassword(password);
 
    if (hotel.length > 0 && hotel[0].estatus == 0 && helpers.verifyPass(password)) { 
        await pool.query('UPDATE hotel_access SET password = ?, estatus = ? WHERE correo = ?', [pasen, 1, correo]);
        
        return done(null, hotel[0]);
    } else {
        if (!helpers.verifyPass(password)) {
            
            req.flash('message', 'La contraseña debe tener al menos 8 caracteres, un número y una letra');
        } else if (hotel.length > 0 && hotel[0].estatus == 1) {
            
            req.flash('message', 'La cuenta ya está activada');
        } else {
            
            req.flash('message', 'El correo no existe o ya fue actualizada la contraseña');
        }
        return done(null, null);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
}); 

passport.deserializeUser(async (id, done) => {  
    const rows = await pool.query('SELECT * FROM hotel_access WHERE id = ?', [id]);
    done(null, rows[0]);
});

