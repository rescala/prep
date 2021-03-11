const express = require('express');
const router = express.Router();
const passport = require('../lib/passport');
const {isLoggedIn} = require('../lib/auth');
const helpers = require('../lib/helpers');

//DB Connectoon
const pool = require('../database');

//Función de render de datos
router.get('/', isLoggedIn, async (req,res)=>{
    const delegados = await pool.query('select * from delegados where id_mpio=?',req.session.example);
    res.render('delegados/list.hbs', {delegados});
});

router.get('/registrar', isLoggedIn, async (req,res)=>{
    const delegados = await pool.query('select * from delegados where id_mpio=?',req.session.example);
    res.render('delegados/list-r.hbs', {delegados});
});

//Función de muestra de sección de registro de delegados
router.get('/add', isLoggedIn, async (req,res)=>{
    const secc_del = await pool.query('select seccion from secciones where mpio=?',req.session.example);
    res.render('./delegados/add.hbs',{secc_del});
});

//Función asíncrona para registro de datos de delegados
router.post('/add', isLoggedIn, async (req,res)=>{
    const {nombres,ape_pat,ape_mat,telefono,comunidad,seccion,usuario, password} = req.body;
    const id_mpio = req.session.example;
    const newdelegado = {
        nombres,
        ape_pat,
        ape_mat,
        telefono,
        comunidad,
        seccion,
        usuario,
        password,
        id_mpio
    };
    newdelegado.password = await helpers.encryptPassword(password);
    await pool.query('Insert into delegados set ?',[newdelegado]);
    req.flash('success','Promotor Agregado Satisfactoriamente');
    res.redirect("/delegados/registrar");
});

//Función de eliminación de datos mediante ID
router.get("/delete/:id", isLoggedIn, async (req,res)=>{
    const id = req.params.id;
    await pool.query('delete from delegados where id=?',id);
    await pool.query('UPDATE `lista_nominal` SET `vota_pt`=0,`id_del`=0 WHERE id_del=?',id);
    req.flash('success','Promotor Eliminado Satisfactoriamente');
    res.redirect("/delegados/registrar");

});

//Función de render datos a editar
router.get("/edit/:id", isLoggedIn, async (req,res)=>{
    const id = req.params.id;
    const delegados = await pool.query('select * from delegados where id=?',id);
    const secc_del = await pool.query('select seccion from secciones where mpio=?',req.session.example);
    res.render('./delegados/edit.hbs',{delegados : delegados[0],secc_del});

});

router.get("/promovidos/:id", isLoggedIn, async (req,res)=>{
    const id = req.params.id;
    //console.log(id);
    const promovidos = await pool.query('select id,num_lista_nominal,nombres, ape_pat, ape_mal,telefono,direccion,(select secciones.seccion from secciones inner join delegados on secciones.id=delegados.seccion where delegados.id=?) as casilla from lista_nominal where lista_nominal.id_del=?',[id,id]);
    //console.log(promovidos);
    const delegado = await pool.query('select nombres from delegados where id=?',req.params.id);
    req.session.example2 = req.params.id;
    //console.log(delegado[0].nombres);
    const delegado2 = delegado[0].nombres;
    const listado = await pool.query('SELECT  lista_nominal.id, lista_nominal.nombres as nom2,lista_nominal.ape_pat,lista_nominal.ape_mal,lista_nominal.direccion, (select secciones.seccion from secciones where secciones.id=lista_nominal.id_seccion) as seccion_lista,casillas.casilla FROM `lista_nominal` INNER JOIN casillas on casillas.id=lista_nominal.id_casilla where lista_nominal.id_del=0');
    res.render('./delegados/promovidos.hbs',{promovidos,delegado2,listado});

});

router.post("/promovidos/add/:id", isLoggedIn, async (req,res) => {
    req.flash('success','Promovido agregado satisfactoriamente: ');
    await pool.query('UPDATE lista_nominal SET lista_nominal.vota_pt=1, lista_nominal.id_del=? where id = ?', [req.session.example2,req.params.id]);
    res.redirect("/delegados/registrar");
});

router.post("/promovidos/delete/:id", isLoggedIn, async (req,res) => {
    req.flash('success','Promovido eliminado satisfactoriamente: ');
    await pool.query('UPDATE lista_nominal SET lista_nominal.vota_pt=0, lista_nominal.id_del=0 where id = ?', [req.params.id]);
    res.redirect("/delegados/registrar");
});

//Función de edición 
router.post("/edit/:id", isLoggedIn, async(req, res)=>{
    const {id} = req.params;
    if (req.body.password) {
        const {nombres, ape_pat,ape_mat, usuario, seccion, password, pw} = req.body;
        const editarDelegado = {
            nombres,
            ape_pat,
            ape_mat,
            usuario,
            seccion,
            password,
            pw
        };
        editarDelegado.password = await helpers.encryptPassword(password);
        editarDelegado.pw = password;
        await pool.query('UPDATE delegados SET ? where id = ?', [editarDelegado,id]);   
    }else{
        const {nombres, ape_pat,ape_mat, usuario, seccion} = req.body;
        const editarDelegado = {
            nombres,
            ape_pat,
            ape_mat,
            usuario,
            seccion
        };
        await pool.query('UPDATE delegados SET ? where id = ?', [editarDelegado,id]);   
    }
    req.flash('success','Datos del Promotor Editados Satisfactoriamente');
    res.redirect("/delegados/registrar");
});


module.exports = router;