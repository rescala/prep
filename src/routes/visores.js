const express = require('express');
const router = express.Router();
const exphbs = require('express-handlebars');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

//DB Connectoon
const pool = require('../database');

router.get('/', async (req,res) =>{
    const listado = await pool.query('SELECT lista_nominal.id as idee, case when lista_nominal.vota_pt=0 then "No" else "Si" end as vota_pt, lista_nominal.nombres as nom2,lista_nominal.ape_pat,lista_nominal.ape_mal,lista_nominal.direccion, lista_nominal.num_lista_nominal, (select secciones.seccion from secciones where secciones.id=lista_nominal.id_seccion) as seccion_lista, lista_nominal.programa, lista_nominal.monto ,casillas.id,casillas.casilla, lista_nominal.voto,lista_nominal.id_del, lista_nominal.telefono, delegados.nombres as apm, delegados.ape_pat as app1, delegados.ape_mat as app2 FROM `lista_nominal` INNER JOIN casillas on casillas.id=lista_nominal.id_casilla LEFT OUTER JOIN delegados on delegados.id=lista_nominal.id_del');
    const rojo1 = await pool.query('SELECT COUNT(*) as rojo1 FROM `lista_nominal` WHERE vota_pt>0');
    const rojo2 = await pool.query('SELECT COUNT(*) as rojo2 FROM `lista_nominal` WHERE vota_pt!=0 and voto!=0');
    const promo1 = await pool.query('SELECT COUNT(*) as promo1 FROM `lista_nominal` WHERE id_del!=0');
    const promo2 = await pool.query('SELECT COUNT(*) as promo2 FROM `lista_nominal` WHERE id_del!=0 and voto!=0');
    const negro1 = await pool.query('SELECT COUNT(*) as negro1 FROM `lista_nominal`');
    const negro2 = await pool.query('SELECT COUNT(*) as negro2 FROM `lista_nominal` WHERE voto!=0');
    const rojo1b = rojo1[0]; 
    const rojo2b = rojo2[0];
    const negro1b = negro1[0]; 
    const negro2b = negro2[0];
    const promo1b = promo1[0];
    const promo2b = promo2[0];
    res.render('visores/l_nominal.hbs',{listado, negro1b, negro2b, rojo1b, rojo2b, promo1b, promo2b, layout:'main4'}); 
});

router.get('/promotores', async (req,res) =>{
    const delegados = await pool.query('SELECT delegados.`id`, delegados.`nombres`, delegados.`ape_pat`, delegados.`ape_mat`, delegados.`telefono`, delegados.`comunidad`, delegados.`seccion`, delegados.`usuario`, delegados.`password`, delegados.`pw`, delegados.`id_mpio`, delegados.`estatus`, (select count(lista_nominal.`nombres`) from lista_nominal where lista_nominal.id_del=delegados.id) as referidos, (select COALESCE(sum(lista_nominal.voto=1),0) from lista_nominal where lista_nominal.id_del=delegados.id ) as votaron from delegados where delegados.id_mpio=92');
    res.render('visores/list-r.hbs', { delegados, layout: 'main4'});
});

router.get("/promovidos/:id", async (req, res) => {
    const id = req.params.id;
    const promovidos = await pool.query('SELECT lista_nominal.id,  case when lista_nominal.vota_pt=0 then "No" else "Si" end as vota_pt, secciones.seccion, casillas.casilla, lista_nominal.num_lista_nominal, lista_nominal.ape_pat, lista_nominal.ape_mal, lista_nominal.nombres, lista_nominal.programa, lista_nominal.monto, lista_nominal.telefono, lista_nominal.direccion FROM `lista_nominal` INNER JOIN secciones on lista_nominal.id_seccion=secciones.id INNER JOIN casillas on lista_nominal.id_casilla=casillas.id where lista_nominal.id_del='+id);
    const delegado = await pool.query('select nombres from delegados where id=?', req.params.id);
    req.session.example2 = req.params.id;
    const delegado2 = delegado[0].nombres;
    const delegado3 = req.params.id;
    res.render('./visores/promovidos.hbs', { promovidos, delegado2, delegado3, layout: 'main4' });

});

router.get('/secciones-r/', async (req, res) => {
    const muni = await pool.query('select nombre from municipio where id=92');
    const secciones = await pool.query('select secciones.id,secciones.seccion,municipio.nombre, (select count(lista_nominal.id) from lista_nominal where lista_nominal.id_seccion=secciones.id) as votantes, (select COALESCE(sum(lista_nominal.voto=1),0) from lista_nominal where lista_nominal.id_seccion=secciones.id ) as votos, (select count(lista_nominal.vota_pt) from lista_nominal where lista_nominal.id_seccion=secciones.id and lista_nominal.vota_pt>0) as votantes_pt, (select count(lista_nominal.vota_pt) from lista_nominal where lista_nominal.id_seccion=secciones.id and lista_nominal.vota_pt>0 and lista_nominal.voto>0) as votos_pt, (select count(lista_nominal.id_del) from lista_nominal where lista_nominal.id_seccion=secciones.id and lista_nominal.id_del>0) as referidos, (select count(lista_nominal.id_del) from lista_nominal where lista_nominal.id_seccion=secciones.id and lista_nominal.id_del>0 and lista_nominal.voto>0) as votos_referidos from secciones INNER join municipio on secciones.mpio=municipio.id where mpio=92');
    muni2 = muni[0].nombre;
    res.render('visores/seccion-r.hbs', { secciones, muni2, layout:'main4'});
});

router.get('/seccion/lista/:id', async (req, res) => {
    const id = req.params.id;
    const lista = await pool.query('SELECT lista_nominal.id as idd, lista_nominal.nombres as nom2,lista_nominal.ape_pat,lista_nominal.ape_mal,lista_nominal.direccion, lista_nominal.num_lista_nominal, (select secciones.seccion from secciones where secciones.id=lista_nominal.id_seccion) as seccion_lista, lista_nominal.programa, lista_nominal.monto ,casillas.id,casillas.casilla, lista_nominal.voto,  case when lista_nominal.vota_pt=0 then "No" else "Si" end as vota_pt,lista_nominal.id_del, lista_nominal.telefono, delegados.nombres as apm, delegados.ape_pat as app1, delegados.ape_mat as app2 FROM `lista_nominal` INNER JOIN casillas on casillas.id=lista_nominal.id_casilla LEFT OUTER JOIN delegados on delegados.id=lista_nominal.id_del WHERE lista_nominal.id_seccion=? ORDER by casilla asc, num_lista_nominal asc', id);
    const lista2 = lista;
    const rojo1 = await pool.query('SELECT COUNT(*) as rojo1 FROM `lista_nominal` WHERE vota_pt>0 and lista_nominal.id_seccion='+id);
    const rojo2 = await pool.query('SELECT COUNT(*) as rojo2 FROM `lista_nominal` WHERE vota_pt!=0 and voto!=0 and lista_nominal.id_seccion='+id);
    const promo1 = await pool.query('SELECT COUNT(*) as promo1 FROM `lista_nominal` WHERE id_del!=0 and lista_nominal.id_seccion='+id);
    const promo2 = await pool.query('SELECT COUNT(*) as promo2 FROM `lista_nominal` WHERE id_del!=0 and voto!=0 and lista_nominal.id_seccion='+id);
    const negro1 = await pool.query('SELECT COUNT(*) as negro1 FROM `lista_nominal` WHERE lista_nominal.id_seccion='+id);
    const negro2 = await pool.query('SELECT COUNT(*) as negro2 FROM `lista_nominal` WHERE voto!=0 and lista_nominal.id_seccion='+id);
    const rojo1b = rojo1[0]; 
    const rojo2b = rojo2[0];
    const negro1b = negro1[0]; 
    const negro2b = negro2[0];
    const promo1b = promo1[0];
    const promo2b = promo2[0];
    res.render('visores/lista-r.hbs', {lista, negro1b, negro2b, rojo1b, rojo2b, promo1b, promo2b, layout: 'main4'});
});

module.exports = router; 