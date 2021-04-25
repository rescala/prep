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
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//DB Connectoon
const pool = require('../database');

router.get('/', (req, res) => {
	if (req.session.username) {

		res.redirect('/casillas/home');
	} else {
		res.render('casillas/signin.hbs', { layout: 'main2' });
	}

});

router.post('/auth', async (req, res) => {
	const prueba = await pool.query('Select * from acceso where id=1;');	
	if (prueba[0].activado == 1) {
		var username = req.body.seccion;
		var password = req.body.casilla;
		if (username && password) {
			pool.query('SELECT secciones.seccion, casillas.casilla, casillas.id FROM `casillas` inner join secciones on secciones.id=casillas.id_seccion where secciones.seccion=? and casilla=?', [username, password], function (error, results, fields) {
				if (results.length > 0) {
					req.session.loggedin = true;
					req.session.username = results[0].id;
					res.redirect('/casillas/home')
				} else {
					req.flash('message', 'Casilla Inexistente');
					res.redirect('/casillas/');
				}
				res.end();
			});
		} else {
			res.send('Please enter Username and Password!');
			res.end();
		}
	} else {
		req.flash('message', 'Acceso Deshabilitado');
		res.redirect('/casillas/');
	}

});

router.get('/home', async (req, res) => {
	if (req.session.username) {
		const seccion = await pool.query('SELECT secciones.seccion as secc, casillas.casilla as cass, casillas.id FROM `casillas` inner join secciones on secciones.id=casillas.id_seccion where casillas.id=' + req.session.username);
		const votantes = await pool.query('select id,num_lista_nominal,nombres,ape_pat,ape_mal from lista_nominal where voto=0 and id_casilla=' + req.session.username);
		res.render('casillas/tabla.hbs', { seccion, votantes, layout: 'main2' });
	} else {
		res.redirect('/casillas/');
	}
});

router.put('/votar/:id', async (req, res) => {
	await pool.query('UPDATE `lista_nominal` SET `voto`=1 WHERE id=' + req.params.id);
	res.json('Actualizado');
});


router.get('/logout', (req, res) => {
	req.session.destroy();
	req.logOut();
	res.redirect('/casillas');
});

module.exports = router;