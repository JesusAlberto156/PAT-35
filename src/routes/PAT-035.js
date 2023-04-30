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
    const numEncuestas = await pool.query('SELECT COUNT(*) as numEncuestas FROM encuesta WHERE idhotel = ?', req.user.id);
    const EncuestaActiva = await pool.query('SELECT * FROM encuesta WHERE idhotel = ? AND estatus = 0', req.user.id);
    const numRespuestas = await pool.query('SELECT COUNT(*) as numRespuestas FROM respuestas WHERE idEncuesta = ?', EncuestaActiva[0].idEncuesta);
    const EmpleadoNoRespondio = await pool.query('SELECT EM.nombre,EM.sexo FROM empleado AS EM LEFT JOIN respuestas AS R ON EM.idEmpleado = R.idEmpleado AND R.idEncuesta = ? WHERE R.idEncuesta IS NULL;', [EncuestaActiva[0].idEncuesta]);
    EmpleadoNoRespondio.forEach(function(empleado) {
        empleado.fecha = EncuestaActiva[0].fecha;
      });
    const totalEmpleados = empleados.length;
    const completadoPorcentaje = numRespuestas[0].numRespuestas ;
    console.log(EncuestaActiva)
    const noCompletadoPorcentaje = totalEmpleados - completadoPorcentaje;
    console.log(completadoPorcentaje);
    console.log(noCompletadoPorcentaje);
    const totalRespuestas = await pool.query('SELECT count(*) FROM respuestas AS R INNER JOIN  encuesta AS EN ON EN.idEncuesta= R.idEncuesta AND EN.idHotel= ?', req.user.id); 
    res.render('PAT-035/empleados', {hotel: hotel[0], empleados,completadoPorcentaje, noCompletadoPorcentaje, numEncuestas: numEncuestas[0].numEncuestas, totalEmpleados,fecha: EncuestaActiva[0].fecha, EmpleadoNoRespondio, totalRespuestas: totalRespuestas[0]['count(*)']});
    
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
    const EncuestaActiva = await pool.query('SELECT * FROM encuesta WHERE idhotel = ? AND estatus = 0', req.user.id);
    const reporteRespuestas = await pool.query('select  idEncuesta, idEmpleado, fecha from respuestas where  IdEncuesta=?', EncuestaActiva[0].idEncuesta);
    console.log(reporteRespuestas);
    res.render('PAT-035/reportes', {hotel: hotel[0], numEmpleados: numEmpleados[0], reporteRespuestas});
});

router.get('/startEncuesta',async (req, res) => {
    const fecha = new Date();
    const newEncuesta = {
        fecha,
        estatus: 0,
        idhotel: req.user.id
    };
    const hayEncuesta = await pool.query('SELECT * FROM encuesta WHERE idhotel = ? AND estatus = 0', req.user.id);
    if(hayEncuesta.length > 0){
        req.flash('message', 'Ya existe una encuesta activa');
        res.redirect('/PAT-035/empleados');

    }else{
        await pool.query('INSERT INTO encuesta set ?', [newEncuesta]);
        req.flash('success', 'Encuesta iniciada satisfactoriamente');
        res.redirect('/PAT-035/empleados');
    }
    
});

router.get('/verEncuesta/:idEncuesta/:idEmpleado',async (req, res) => {
    const respuestas = await pool.query('select * from respuestas where idEmpleado = ? and IdEncuesta=?', [req.params.idEmpleado, req.params.idEncuesta]);
    console.log(respuestas);
    res.render('PAT-035/encuestaReporte', {respuestas : respuestas[0]});
});


module.exports = router;