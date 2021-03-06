const express = require('express');
const router = express.Router();
const { isLoggedIn, isNotLoggedIn } = require('../lib/auth');

//DB Connectoon
const pool = require('../database');

router.get('/show', isLoggedIn, async (req, res) => {
    const municipio = await pool.query('select * from municipio where id_dist_loc=8');
    res.render('secciones/tabla.hbs', { municipio });
});

router.get('/', (req, res) => {
    res.redirect('/mpios/show');
});

router.get('/secciones/', isLoggedIn, async (req, res) => {
    const muni = await pool.query('select nombre from municipio where id=?', req.session.example);
    const secciones = await pool.query('select secciones.id,secciones.seccion,municipio.nombre from secciones INNER join municipio on secciones.mpio=municipio.id where mpio=?', req.session.example);
    muni2 = muni[0].nombre;
    res.render('secciones/seccion.hbs', { secciones, muni2 });
});

router.get('/secciones-r/', isLoggedIn, async (req, res) => {
    const muni = await pool.query('select nombre from municipio where id=?', req.session.example);
    const secciones = await pool.query('select secciones.id,secciones.seccion,municipio.nombre from secciones INNER join municipio on secciones.mpio=municipio.id where mpio=?', req.session.example);
    muni2 = muni[0].nombre;
    res.render('secciones/seccion-r.hbs', { secciones, muni2 });
});


router.get('/seccion/casilla/:id', isLoggedIn, async (req, res) => {
    const id = req.params.id;
    const secciones = await pool.query('SELECT casillas.id,secciones.seccion,casillas.casilla,casillas.tipo_casilla FROM `casillas` inner join secciones on secciones.id=casillas.id_seccion WHERE casillas.id_seccion=?', id);
    const idSecc = req.params.id;
    res.render('secciones/casilla.hbs', { secciones, idSecc });
});

router.get('/seccion/casilla-r/:id', isLoggedIn, async (req, res) => {
    const id = req.params.id;
    const secciones = await pool.query('SELECT casillas.id,secciones.seccion,casillas.casilla,casillas.tipo_casilla FROM `casillas` inner join secciones on secciones.id=casillas.id_seccion WHERE casillas.id_seccion=?', id);
    const idSecc = req.params.id;
    res.render('secciones/casilla-r.hbs', { secciones, idSecc });
});

router.get('/seccion/casillas/lista/:id', isLoggedIn, async (req, res) => {
    const id = req.params.id;
    const listado = await pool.query('SELECT lista_nominal.num_lista_nominal,casillas.id,casillas.casilla, lista_nominal.voto, lista_nominal.vota_pt, lista_nominal.id_del, lista_nominal.telefono, delegados.nombres, delegados.ape_pat, delegados.ape_mat FROM `lista_nominal` INNER JOIN casillas on casillas.id=lista_nominal.id_casilla LEFT OUTER JOIN delegados on delegados.id=lista_nominal.id_del WHERE id_casilla=?', id);
    const lugar = await pool.query('SELECT lista_nominal.num_lista_nominal, lista_nominal.id from lista_nominal where id_casilla='+id+' order by num_lista_nominal ASC');
    res.render('secciones/lista.hbs', { listado, id, lugar });
});

router.get('/seccion/casillas/lista-r/:id', isLoggedIn, async (req, res) => {
    const id = req.params.id;
    const listado = await pool.query('SELECT lista_nominal.id as idd,lista_nominal.num_lista_nominal,casillas.id,casillas.casilla, lista_nominal.voto, lista_nominal.vota_pt, lista_nominal.id_del, lista_nominal.telefono, delegados.nombres, delegados.ape_pat, delegados.ape_mat FROM `lista_nominal` INNER JOIN casillas on casillas.id=lista_nominal.id_casilla LEFT OUTER JOIN delegados on delegados.id=lista_nominal.id_del WHERE id_casilla=?', id);
    const lugar = await pool.query('SELECT lista_nominal.num_lista_nominal, lista_nominal.id from lista_nominal where id_casilla='+id+' order by num_lista_nominal ASC');
    res.render('secciones/lista-r.hbs', { listado, id, lugar });
});

router.post('/seccion/casilla/lista/add/:id', isLoggedIn, async (req, res) => {
    const lugar = req.body.lugar;
    const casilla = await pool.query('SELECT id_casilla,num_lista_nominal from lista_nominal where id=?', lugar);
    const lista = casilla[0].num_lista_nominal;
    const casilla2 = casilla[0].id_casilla;
    const seccion = await pool.query('SELECT id_seccion from casillas where id=' + casilla2);
    const seccion2 = seccion[0].id_seccion;
    const registros = await pool.query('SELECT num_lista_nominal,id from lista_nominal where id_casilla =' + casilla2 + ' and num_lista_nominal>' + lista + ' order by num_lista_nominal ASC');
    var y;
    if (registros[0]) {
        y = registros[0].num_lista_nominal;
        for (let index = 0; index < registros.length; index++) {
            var x = registros[index].num_lista_nominal + 1;
            var w = registros[index].id;
            await pool.query('UPDATE `lista_nominal` SET `num_lista_nominal`=' + x + ' WHERE id=' + w);
        }
        await pool.query('INSERT INTO `lista_nominal`(`num_lista_nominal`, `id_casilla`, `id_seccion`) VALUES (' + y + ',' + casilla2 + ',' + seccion2 + ')');
    } else {
        const registros2 = await pool.query('SELECT  MAX(num_lista_nominal) as num_lista_nominal,id from lista_nominal where id_casilla =' + casilla2 + ' order by num_lista_nominal ASC');
        y = registros2[0].num_lista_nominal+1;
        await pool.query('INSERT INTO `lista_nominal`(`num_lista_nominal`, `id_casilla`, `id_seccion`) VALUES (' + y + ',' + casilla2 + ',' + seccion2 + ')');
    }
    res.redirect('/mpios/secciones-r');
});

router.get("/seccion/casillas/lista/eliminar/:id", isLoggedIn, async (req,res)=>{
    const lugar = req.params.id;
    const casilla = await pool.query('SELECT id_casilla,num_lista_nominal from lista_nominal where id='+lugar);
    const lista = casilla[0].num_lista_nominal;
    const casilla2 = casilla[0].id_casilla;
    const seccion = await pool.query('SELECT id_seccion from casillas where id=' + casilla2);
    const seccion2 = seccion[0].id_seccion;
    const registros = await pool.query('SELECT num_lista_nominal,id from lista_nominal where id_casilla =' + casilla2 + ' and num_lista_nominal>' + lista + ' order by num_lista_nominal ASC');
    var y;
    if (registros[0]) {
        y = registros[0].num_lista_nominal;
        for (let index = 0; index < registros.length; index++) {
            var x = registros[index].num_lista_nominal - 1;
            var w = registros[index].id;
            await pool.query('UPDATE `lista_nominal` SET `num_lista_nominal`=' + x + ' WHERE id=' + w);
        }
        await pool.query('delete from lista_nominal where id='+lugar);
    } else {
        const registros2 = await pool.query('SELECT  MAX(num_lista_nominal) as num_lista_nominal,id from lista_nominal where id_casilla =' + casilla2 + ' order by num_lista_nominal ASC');
        y = registros2[0].num_lista_nominal+1;
        await pool.query('delete from lista_nominal where id='+lugar);
    }
    res.redirect('/mpios/secciones-r');
});

router.get('/seccion/casillas/lista/editar/:id', isLoggedIn, async(req,res)=>{
    const id = req.params.id;
    const datos = await pool.query('select * from lista_nominal where id='+id);
    const datos2 = datos[0];
    res.render('secciones/edit.hbs',datos2);
});

router.post('/seccion/casillas/lista/editar/:id', isLoggedIn, async(req,res)=>{
    const id = req.params.id;
    const {nombres, ape_pat,ape_mal,direccion, telefono} = req.body;
    const datos = {
        nombres,
        ape_pat,
        ape_mal,
        direccion,
        telefono
    };
    await pool.query('UPDATE lista_nominal SET ? where id = ?', [datos,id]);
    res.redirect('/mpios/secciones-r');
});

router.post('/seccion/casillas/lista/registrar/:id', isLoggedIn, async (req, res) => {
    const repeticiones = req.body.votantes;
    const id_casilla = req.body.id;
    //console.log(repeticiones, id_casilla);
    for (var i = 0; i < repeticiones; i++) {
        const num_lista_nominal = i + 1;
        const newR = { id_casilla, num_lista_nominal };
        await pool.query('INSERT INTO `lista_nominal` set ?', [newR]);
    };
    req.flash('success', 'Se han creados los espacios');
    res.redirect('/mpios/secciones');
});

router.post('/seccion/casillas/registrar/:id', isLoggedIn, async (req, res) => {
    const tipo_casilla = req.body.tipo;
    const id_seccion = req.params.id;
    const casilla = (tipo_casilla.substring(0, 1) + req.body.casilla);
    const newCasilla = { id_seccion, casilla, tipo_casilla };
    //console.log(newCasilla);
    await pool.query('INSERT INTO `casillas` set ?', [newCasilla]);
    res.redirect('/mpios/secciones-r');
});

module.exports = router;