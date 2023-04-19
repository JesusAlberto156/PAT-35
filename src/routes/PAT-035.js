const express = require('express');
const router = express.Router();
const {isLoggedIn} =require('../lib/auth');

const pool = require('../database');

router.get('/home',isLoggedIn,async (req, res) => {
   
    const hotel = await pool.query('SELECT * FROM hotel WHERE id = ?', req.user.id);
    res.render('PAT-035/home', {hotel: hotel[0]});
    
});

router.get('/estadisticasGlobales',isLoggedIn,async (req, res) => {
   
    const hotel = await pool.query('SELECT * FROM hotel WHERE id = ?', req.user.id);
    res.render('PAT-035/estadisticasGlobales', {hotel: hotel[0]});
    
});

router.get('/empleados',isLoggedIn,async (req, res) => {
    const hotel = await pool.query('SELECT * FROM hotel WHERE id = ?', req.user.id);
    const empleados = await pool.query('SELECT * FROM empleado WHERE idhotel = ?', req.user.id);
    
    res.render('PAT-035/empleados', {hotel: hotel[0], empleados});
    
});

router.get('/editEmpleado/:idEmpleado',isLoggedIn,async (req, res) => {
    const {idEmpleado} = req.params;
    const empleado = await pool.query('SELECT * FROM empleado WHERE idEmpleado = ?', [idEmpleado]);
    console.log(empleado[0]);
    res.render('PAT-035/editEmpleado', {empleado: empleado[0]});

    
});

router.post('/editEmpleado/:idEmpleado',isLoggedIn,async (req, res) => {
    const {idEmpleado} = req.params;
    const {nombre, telefono, correo,sexo,puesto} = req.body;
    const newEmpleado = {
        nombre,
        telefono,
        correo,
        sexo,
        puesto,
        idhotel: req.user.id
    };
    await pool.query('UPDATE empleado set ? WHERE idEmpleado = ?', [newEmpleado, idEmpleado]);
    req.flash('success', 'Empleado actualizado satisfactoriamente');
    
    res.redirect('/PAT-035/empleados');

    
});


router.post('/addEmpleado', async (req, res) => {
    const {nombre, telefono, correo,sexo,puesto} = req.body;
    const newEmpleado = {
        nombre,
        telefono,
        correo,
        sexo,
        puesto,
        idhotel: req.user.id
    };
    
    await pool.query('INSERT INTO empleado set ?', [newEmpleado]);
    req.flash('success', 'Empleado guardado satisfactoriamente');
    res.redirect('/PAT-035/empleados'); 
});





router.get('/deleteEmpleado/:idEmpleado',async (req, res) => {
    const {idEmpleado} = req.params;
    await pool.query('DELETE FROM empleado WHERE idEmpleado = ?', [idEmpleado]);
    req.flash('success', 'Empleado eliminado satisfactoriamente');
    res.redirect('/PAT-035/empleados');
});

router.get('/profile',isLoggedIn,async (req, res) => {  
    const hotel = await pool.query('SELECT * FROM hotel WHERE id = ?', req.user.id);
    const numEmpleados = await pool.query('SELECT COUNT(*) AS numEmpleados FROM empleado WHERE idhotel = ?', req.user.id);
    console.log(numEmpleados[0]);
    res.render('PAT-035/profile', {hotel: hotel[0], numEmpleados: numEmpleados[0]});
});

router.get('/editProfile',isLoggedIn,async (req, res) => {
    const hotel = await pool.query('SELECT * FROM hotel WHERE id = ?', req.user.id);
    res.render('PAT-035/editProfile', {hotel: hotel[0]});
});
router.post('/editProfile',isLoggedIn,async (req, res) => {
    const {nombre, direccion, telefono, correo,descripcion} = req.body;
    const newHotel = {
        nombre,
        direccion,
        telefono,
        descripcion
    };
    await pool.query('UPDATE hotel set ? WHERE id = ?', [newHotel, req.user.id]);
   
    req.flash('success', 'Perfil actualizado satisfactoriamente');
    res.redirect('/PAT-035/profile');
});

router.get('/reportes',isLoggedIn,async (req, res) => {  
    const hotel = await pool.query('SELECT * FROM hotel WHERE id = ?', req.user.id);
    const numEmpleados = await pool.query('SELECT COUNT(*) AS numEmpleados FROM empleado WHERE idhotel = ?', req.user.id);
    console.log(numEmpleados[0]);
    res.render('PAT-035/reportes', {hotel: hotel[0], numEmpleados: numEmpleados[0]});
});


module.exports = router;