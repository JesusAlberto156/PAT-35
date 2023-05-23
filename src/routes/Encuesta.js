const express = require('express');
const router = express.Router();

const pool = require('../database');
const helpers = require('../lib/helpers');

router.get('/:idHotel/:idEncuesta/encuesta/:idEmpleado', async (req, res) => {
    var currentDate = new Date();
    var idEncuesta =req.params.idEncuesta; 
    var fechaActual = currentDate.toISOString().slice(0, 10);
    const empleado = await pool.query('SELECT * FROM empleado WHERE idEmpleado = ?',[req.params.idEmpleado]);
    console.log(empleado);
    var fechaInicio = empleado[0].fecha_ingreso.toISOString().slice(0, 10);
    var antiguedad = helpers.getDiferenciaFecha(fechaInicio, fechaActual);
    console.log(antiguedad);
    if(antiguedad > 90){
        const check = await pool.query('SELECT * FROM respuestas WHERE idEncuesta = ? AND idEmpleado = ?', [req.params.idEncuesta, req.params.idEmpleado]);
        if (check.length > 0) {
            res.render('Encuesta/completada');
        }
        else{
        const {idHotel, idEncuesta, idEmpleado} = req.params;
        console.log(idHotel, idEncuesta, idEmpleado);
        const hotel = await pool.query('Select * from hotel where id = ?', [idHotel]);
        const empleado = await pool.query('Select * from empleado where idEmpleado = ?', [idEmpleado]);

        console.log(empleado[0]);
        res.render('Encuesta/encuesta', {hotel: hotel[0], empleado: empleado[0],idEncuesta});
        }
    }else {
        res.render('Encuesta/NoPermitida');
    }
});

router.post('/:idHotel/:idEncuesta/encuesta/:idEmpleado', async (req, res) => {
    console.log("------------------------------");
    
    const {
        Pregunta1,
        Pregunta2,
        Pregunta3,
        Pregunta4,
        Pregunta5,
        Pregunta6,
        Pregunta7,
        Pregunta8,
        Pregunta9,
        Pregunta10,
        Pregunta11,
        Pregunta12,
        Pregunta13,
        Pregunta14,
        Pregunta15,
        Pregunta16,
        Pregunta17,
        Pregunta18,
        Pregunta19,
        Pregunta20,
        Pregunta21,
        Pregunta22,
        Pregunta23,
        Pregunta24,
        Pregunta25,
        Pregunta26,
        Pregunta27,
        Pregunta28,
        Pregunta29,
        Pregunta30,
        Pregunta31,
        Pregunta32,
        Pregunta33,
        Pregunta34,
        Pregunta35,
        Pregunta36,
        Pregunta37,
        Pregunta38,
        Pregunta39,
        Pregunta40,
        Pregunta41,
        Pregunta42,
        Pregunta43,
        Pregunta44,
        Pregunta45,
        Pregunta46,
        Pregunta47,
        Pregunta48,
        Pregunta49,
        Pregunta50,
        Pregunta51,
        Pregunta52,
        Pregunta53,
        Pregunta54,
        Pregunta55,
        Pregunta56,
        Pregunta57,
        Pregunta58,
        Pregunta59,
        Pregunta60,
        Pregunta61,
        Pregunta62,
        Pregunta63
    } = req.body;
    const newEncuesta = {
        idEncuesta: req.params.idEncuesta,
        idEmpleado: req.params.idEmpleado,
        fecha: new Date(),
        Pregunta1,
        Pregunta2,
        Pregunta3,
        Pregunta4,
        Pregunta5,
        Pregunta6,
        Pregunta7,
        Pregunta8,
        Pregunta9,
        Pregunta10,
        Pregunta11,
        Pregunta12,
        Pregunta13,
        Pregunta14,
        Pregunta15,
        Pregunta16,
        Pregunta17,
        Pregunta18,
        Pregunta19,
        Pregunta20,
        Pregunta21,
        Pregunta22,
        Pregunta23,
        Pregunta24,
        Pregunta25,
        Pregunta26,
        Pregunta27,
        Pregunta28,
        Pregunta29,
        Pregunta30,
        Pregunta31,
        Pregunta32,
        Pregunta33,
        Pregunta34,
        Pregunta35,
        Pregunta36,
        Pregunta37,
        Pregunta38,
        Pregunta39,
        Pregunta40,
        Pregunta41,
        Pregunta42,
        Pregunta43,
        Pregunta44,
        Pregunta45,
        Pregunta46,
        Pregunta47,
        Pregunta48,
        Pregunta49,
        Pregunta50,
        Pregunta51,
        Pregunta52,
        Pregunta53,
        Pregunta54,
        Pregunta55,
        Pregunta56,
        Pregunta57,
        Pregunta58,
        Pregunta59,
        Pregunta60,
        Pregunta61,
        Pregunta62,
        Pregunta63


    };
    console.log(newEncuesta);
    await pool.query('INSERT INTO respuestas set ?', [newEncuesta]);
    res.render('Encuesta/completada');
    

});
// /1/1/encuesta/1 
module.exports = router;

/* const {idHotel, idEncuesta, idEmpleado} = req.params;
    const {respuesta1, respuesta2, respuesta3, respuesta4, respuesta5, respuesta6, respuesta7, respuesta8, respuesta9, respuesta10, respuesta11, respuesta12, respuesta13, respuesta14, respuesta15, respuesta16, respuesta17, respuesta18, respuesta19, respuesta20, respuesta21, respuesta22, respuesta23, respuesta24, respuesta25, respuesta26, respuesta27, respuesta28, respuesta29, respuesta30, respuesta31, respuesta32, respuesta33, respuesta34, respuesta35, respuesta36, respuesta37, respuesta38, respuesta39, respuesta40, respuesta41, respuesta42, respuesta43, respuesta44, respuesta45, respuesta46, respuesta47, respuesta48, respuesta49, respuesta50, respuesta51, respuesta52, respuesta53, respuesta54, respuesta55, respuesta56, respuesta57, respuesta58, respuesta59, respuesta60, respuesta61, respuesta62, respuesta63, respuesta64, respuesta65, respuesta66, respuesta67, respuesta68, respuesta69, respuesta70, respuesta71, respuesta72, respuesta73, respuesta74, respuesta75, respuesta76, respuesta77, respuesta78, respuesta79, respuesta80, respuesta81, respuesta82, respuesta83, respuesta84, respuesta85, respuesta86, respuesta87, respuesta88, respuesta89, respuesta90, respuesta91, respuesta92, respuesta93, respuesta94, respuesta95, respuesta96, respuesta97, respuesta98, respuesta99, respuesta100} = req.body;
    const newEncuesta = {
        idHotel,
        idEncuesta,
        idEmpleado,
        respuesta1,
        respuesta2,
        respuesta3,
        respuesta4,
        respuesta5,
        respuesta6,
        respuesta7,
        respuesta8,
        respuesta9,
        respuesta10,
        respuesta11,
        respuesta12,
        respuesta13,
        respuesta14,
        respuesta15,
        respuesta16,
        respuesta17,
        respuesta18,
        respuesta19,
        respuesta20,
        respuesta21,
        respuesta22,
        respuesta23,
        respuesta24,
        respuesta25,
        respuesta26,
        respuesta27,
        respuesta28,
        respuesta29,
        respuesta30,
        respuesta31,
        respuesta32,
        respuesta33,
        respuesta34,
        respuesta35,
        respuesta36,
        respuesta37,
        respuesta38,
        respuesta39 */