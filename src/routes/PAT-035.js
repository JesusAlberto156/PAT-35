const express = require('express');
const router = express.Router();
const {isLoggedIn} =require('../lib/auth');

const pool = require('../database');
const helpers = require('../lib/helpers');

router.get('/home',isLoggedIn,async (req, res) => {
   
    const hotel = await pool.query('SELECT * FROM hotel WHERE id = ?', req.user.id);
    const EncuestaActiva = await pool.query('SELECT * FROM encuesta WHERE idhotel = ? AND estatus = 0', req.user.id);
    console.log(EncuestaActiva);
    let respuestas = await pool.query('SELECT * FROM respuestas WHERE idEncuesta = ?', EncuestaActiva[0].idEncuesta);

    respuestas=helpers.cambioArray(respuestas);         
    let total = helpers.total(respuestas);
    const general = helpers.general(total);
    let prom = helpers.promedioGeneral(total);
    let accionGen = helpers.accionGen(prom);
    let estadogen = helpers.estadoGen(prom);
    let colorGen = helpers.colorGen(prom);
    let totalCat1 = helpers.totalCAT1(respuestas);
    let totalCat2 = helpers.totalCAT2(respuestas);
    let totalCat3 = helpers.totalCAT3(respuestas);
    let totalCat4 = helpers.totalCAT4(respuestas);
    let cat1 = helpers.CAT1(totalCat1);
    let cat2 = helpers.CAT2(totalCat2);
    let cat3 = helpers.CAT3(totalCat3);
    let cat4 = helpers.CAT3(totalCat4);
    console.log(respuestas);
    console.log(total);
    console.log(general);
    console.log(prom);
    console.log(estadogen);

    console.log(totalCat1);
    console.log(cat1);
    console.log(totalCat2);
    console.log(cat2);
    console.log(totalCat3);
    console.log(cat3);
    console.log(totalCat4);
    console.log(cat4);
    
    
    
    res.render('PAT-035/home', {hotel: hotel[0],general,accionGen,estadogen,colorGen,cat1,cat2,cat3,cat4});
    
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
    const totalEmpleados = empleados.length;
    const totalRespuestas = await pool.query('SELECT count(*) FROM respuestas AS R INNER JOIN  encuesta AS EN ON EN.idEncuesta= R.idEncuesta AND EN.idHotel= ?', req.user.id); 
    if (EncuestaActiva.length>0){
    const numRespuestas = await pool.query('SELECT COUNT(*) as numRespuestas FROM respuestas WHERE idEncuesta = ?', EncuestaActiva[0].idEncuesta);
    const EmpleadoNoRespondio = await pool.query('SELECT EM.nombre,EM.sexo FROM empleado AS EM LEFT JOIN respuestas AS R ON EM.idEmpleado = R.idEmpleado AND R.idEncuesta = ? WHERE R.idEncuesta IS NULL and EM.idHotel=?', [[EncuestaActiva[0].idEncuesta],req.user.id]);
    EmpleadoNoRespondio.forEach(function(empleado) {
        empleado.fecha = EncuestaActiva[0].fecha;
      });
    
    const completadoPorcentaje = numRespuestas[0].numRespuestas ;
    console.log(EncuestaActiva)
    const noCompletadoPorcentaje = totalEmpleados - completadoPorcentaje;
    console.log(completadoPorcentaje);
    console.log(noCompletadoPorcentaje);

    const telEmpleados = await pool.query('SELECT EM.nombre,EM.telefono,EM.idEmpleado FROM empleado AS EM LEFT JOIN respuestas AS R ON EM.idEmpleado = R.idEmpleado AND R.idEncuesta = ? WHERE R.idEncuesta IS NULL and EM.idHotel=?', [[EncuestaActiva[0].idEncuesta],req.user.id]);
    
    const links = helpers.genLinks(telEmpleados, req.user.id, EncuestaActiva[0].idEncuesta);
    console.log(links);

    res.render('PAT-035/empleados', {hotel: hotel[0], empleados,completadoPorcentaje, noCompletadoPorcentaje, numEncuestas: numEncuestas[0].numEncuestas, totalEmpleados,fecha: EncuestaActiva[0].fecha, EmpleadoNoRespondio, totalRespuestas: totalRespuestas[0]['count(*)']});
    }else{
        console.log("entra a esto")
        res.render('PAT-035/empleados', {hotel: hotel[0], empleados, numEncuestas: numEncuestas[0].numEncuestas, totalEmpleados,totalRespuestas: totalRespuestas[0]['count(*)'],links});
    }
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
    
    if (EncuestaActiva.length>0){
    const reporteRespuestas = await pool.query('select  idEncuesta, idEmpleado, fecha from respuestas where  IdEncuesta=?', EncuestaActiva[0].idEncuesta);
    console.log(reporteRespuestas);
    res.render('PAT-035/reportes', {hotel: hotel[0], numEmpleados: numEmpleados[0], reporteRespuestas});
    }else {
        
        res.render('PAT-035/reportes', {hotel: hotel[0], numEmpleados: numEmpleados[0]});

    }
   
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

router.get('/administrador',async (req, res) => {
    
    res.render('PAT-035/administrador');
});

//lsof -i :4000
//kill -9 PID

module.exports = router;