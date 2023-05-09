const express = require('express');
const router = express.Router();

const pasport = require('passport');

router.get('/signup', (req, res) => {
    res.render('auth/signup');
});

router.post('/signup',pasport.authenticate('local.signup', {
        successRedirect: '/PAT-035/home',
        failureRedirect: '/signup',
        failureFlash: true
}));

router.get('/signin', (req, res) => {

    res.render('auth/signin');

});


router.post('/signin', (req, res, next) => {
    console.log(req.body);
    if (req.body.correo == 'adminPat@gmail.com') {
        pasport.authenticate('local.signinadmin', {
            successRedirect: '/PAT-035/administrador',
            failureRedirect: '/signin',
            failureFlash: true
        })(req, res, next);
    }else{
        pasport.authenticate('local.signin', {
            successRedirect: '/PAT-035/home',
            failureRedirect: '/signin',
            failureFlash: true
        })(req, res, next);
    }

    
    
});

router.get('/profile', (req, res) => {
    res.send('profile');
});

router.get('/logout', (req, res) => {
    req.logOut((err) => {
        if (err) {
            console.log(err);
        }
        req.flash('success', 'Sesion cerrada correctamente');
        res.redirect('/signin');
        
    });
});
 


module.exports = router;