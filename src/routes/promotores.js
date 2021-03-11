const express = require('express');
const router = express.Router();
const exphbs = require('express-handlebars');
var app = express();
var session = require('express-session');
var bodyParser = require('body-parser');
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

//DB Connectoon
const pool = require('../database');

router.get('/', (req,res) =>{
    if (req.session.username) {
        
		res.redirect('/promotores/home');
	} else {
		res.render('promotores/signin.hbs', {layout: 'main3' });
	}
    
});

router.post('/auth', function(req, res) {
	var username = req.body.telefono;
	var password = req.body.password;
	if (username && password) {
		pool.query('SELECT delegados.id, delegados.telefono, delegados.nombres, delegados.pw FROM `delegados` where delegados.telefono=? and delegados.pw=?', [username, password], function(error, results, fields) {
			if (results.length > 0) {
				req.session.loggedin = true;
				req.session.username = results[0].id;
				res.redirect('/promotores/home')
			} else {
                req.flash('message','Promotor Inexistente');
				res.redirect('/promotores/');
			}			
			res.end();
		});
	} else {
		res.send('Please enter Username and Password!');
		res.end();
	}
});

router.get('/home', async (req,res)=> {
	if (req.session.username) {
        const lista = await pool.query('SELECT * FROM `lista_nominal` where lista_nominal.voto=0 and lista_nominal.id_del='+req.session.username);
        const delegado = await pool.query('select delegados.nombres as nombre from delegados where delegados.id='+req.session.username);
        const votados = await pool.query('SELECT count(*) as conteo FROM `lista_nominal` WHERE lista_nominal.voto=1 and lista_nominal.id_del='+req.session.username);
        const novotados = await pool.query('SELECT count(*) as conteo FROM `lista_nominal` WHERE lista_nominal.voto=0 and lista_nominal.id_del='+req.session.username);
        res.render('promotores/tabla.hbs', {lista, delegado, votados, novotados, layout: 'main3' });
	} else {
		res.redirect('/promotores/');
	}
});

router.get('/logout', (req,res) => {
    req.session.destroy();
    req.logOut();
    res.redirect('/promotores');
});

module.exports = router; 