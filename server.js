					/*-----------------------------------------------
					 * Scrabble && mini Chat par Davy NZE, UVSQ 2013.
					 * ----------------------------------------------*/
				

	/*---------------------
	 * Module dependencies.
	 *---------------------*/
var fmwk = require('was_framework');
var app_db = require('./db');
var fonctions = require('./fonctions');


var users = {};
var jeux = {};
	
	/*--------------------------------
	 * Configuration de l'application
	 *--------------------------------*/
var opts = {
  db: {
    type: 'mysql',
    host: 'localhost',
    user: 'root',
    password: 'davys',
    database: 'projet'
  }, 
  default_route: '/index',
  socket_io: true
}

	/*----------------
	 * L'application
	 *----------------*/
var app = fmwk(opts);


	/*----------- Route vers l'index ------------*/

app.f_routes.index = function(req, res)
{
	if (req.session.loggedin)
		res.render('index.mu', {title : 'WAS_Scrabble', etat:'Déconnexion'});
	else
		res.render('index.mu', {title : 'WAS_Scrabble', etat:'Connexion'});
};

	/*----------- Enregistrement d'un nouvel utilisateur ------------*/

app.f_routes.sign = function(req, res)
{
	if(req.session.loggedin) {
		// If loggedin, redirect to home page
		res.redirect('/jeu');
    } 
    else if (req.method == 'POST') 
    {
		app_db.sign(req, function(err, result, message) 
		{
		    if (err)
		    {
				console.error(err);
				res.send(500, 'Internal Server Error');
		    } else if (result) 
		    {
					/* Initialisation de la session */
				req.session.loggedin = result;

					/* L'id de l'user correspondra a son login */
				var id = req.session.loggedin.login;

					/* Enregistrement de la connexion */
				users[id] = req.session.loggedin;

					/* Redirection vers le jeu */
				res.redirect('/jeu');
		    } else 
				res.render('sign.mu', {sign : 'Enregistrement', erreur:'Mail déjà lié à un compte'});
		});
    } else {
		res.render('sign.mu', {sign : 'Enregistrement'});
    }
};


	/*----------------- Authentification d'un utilisateur -----------------*/

app.f_routes.login = function(req, res)
{
	if(req.session.loggedin)
		res.redirect('/logout');
	else
	{
		if(req.method == 'POST') 
		{
			app_db.login(req, function(err, result, message) 
			{
				if (err)
				{
					console.error(err);
					res.send(500, 'Internal Server Error');
				}
				if (result) 
				{
						/* Initialisation de la session */
					req.session.loggedin = result[0];

						/* L'id de l'user correspondra a son login */
					var id = req.session.loggedin.login;

						/* Enregistrement de la connexion */
					users[id] = req.session.loggedin;
					
						/* Redirection vers la page perso */
					res.redirect('/jeu');
				} else 
				{
					console.log('Erreur '+message);
					res.render('login.mu', {login : 'Connexion'});
				}
			});
		}else 
			res.render('login.mu', {login : 'Connexion'});
	}
};


	/*-------------------- Déconnexion d'un utilisateur ------------------------*/

app.f_routes.logout = function(req, res) 
{
	if(req.session.loggedin)
	{
		delete users[req.session.loggedin.login];
	    req.session.loggedin = null;
	   	req.session.destroy();
		res.redirect('/');
	}
	else
		res.redirect('/login');
};


	/* ----------------- Direction sur la fenêtre de jeu  ------------------*/

app.f_routes.jeu = function(req, res) 
{
	if (req.session.loggedin) 
		res.render('jeu.mu', {title : 'Jeu', userLog:req.session.loggedin.login});	
    else
		res.redirect('/login');
}; 


	/*------------------ La route vers l'aide du jeu -----------------------*/
app.f_routes.aide = function(req, res)
{
	if (req.session.loggedin)
		res.render('aide.mu', {title : 'Aide', etat:'Déconnexion'});
	else
		res.render('aide.mu', {title : 'Aide', etat:'Connexion'});
};

	/*--------------------- A propos du projet --------------------------*/
app.f_routes.a_propos = function(req, res)
{
	if (req.session.loggedin)
		res.render('propos.mu', {title : 'A propos', etat:'Déconnexion'});
	else
		res.render('propos.mu', {title : 'A propos', etat:'Connexion'});
};

	
	/*--------------------------------
	 * Parite communication : sockets
	 *--------------------------------*/

app.io.set('log level', 2);

	/* Objet contenant les utilisateurs connectés */
var userConnecte = {};

	/* Objet contenant les conversations */
var conversations = {};


app.io.sockets.on('connection', function(socket) 
{	
	var actuel;

		/* Actualisation de la liste des connectés */
	for(var i in userConnecte)
		socket.emit('newUser', userConnecte[i]);

		/* Connexion d'un utilisateur*/
	socket.on('maConnection', function(donnees)
	{
		if(userConnecte.length < 2)
			app.io.sockets.emit('oneUser');

			/* Si l'utilisateur n'est pas encore lié à sa socket */
		if(users[donnees.nom].socket === undefined)
		{	
				/* On créé un id avec le login */
			var id = donnees.nom;
			actuel = id;

				/* On lie l'user a sa socket */
			users[id].socket = socket;

			var obj  = {};
			obj.login = donnees.nom;
			obj.email  = users[id].email;

				/* Enregistrement des informations du nouvel utilisateur */
			userConnecte[id] = obj;
			
				/* Emission de l'arrivée d'un nouvel utilisateur*/
			socket.broadcast.emit('newUser', obj);
		}	
	});

		/* Un user a envoyé une demande jeu */
	socket.on('demandeJeu', function(data)
	{
			/* On renvoie la demande de jeu pour qu'elle soit récupée par l'interessé */
		socket.broadcast.emit('demandeJeu', data);
	});

		/* Le deuxième joueur a accepté  le jeu */
	socket.on('jeuAccepte', function(data)
	{
			/* On génère les pions pour le jeu */
		var sacJetons = fonctions.genererTableau();

			/* On insere le sac de jeton dans les données */
		data.sac = sacJetons;

			/* Un identifiant pour le jeu */
		var idJeu 	= data.demandeur+data.demande;
		
			/* Initialisation des paramètres de conversation */
		conversations[data.demandeur] = data.demande;
		conversations[data.demande] = data.demandeur;

			/* Enregistrement du jeux */
		jeux[idJeu] = data;


		var ob = {};
		ob.adversaire = data.demande;
		ob.score = '0';

		var ob1 = {};
		ob1.adversaire = data.demandeur;
		ob1.score = '0';

		jeux[data.demande] = ob1;
		jeux[data.demandeur] = ob;

			/* Emission de l'événement permettant au premier joueur de choisir ses pions */
		app.io.sockets.emit('chxJetonsJoueur1', data);
	});

		/* Le joueur 1 a choisi ses pions */
	socket.on('jetonJoueur1Ok', function(data){
		app.io.sockets.emit('chxJetonsJoueur2', data);
	});

		/* Les deux joueurs ont choisi leurs pions */
	socket.on('startOk', function(data)
	{
		app.io.sockets.emit('startOk', data);
		jeux[data.demandeur].sac = data.sac;
		jeux[data.demande].sac = data.sac;

			/* On permet au joueur 1 de commencer à jouer, et on bloque le joueur 2 */
		app.io.sockets.emit('monTour', {
			aQuiLeTour		: data.demandeur,
			attente			: data.demande
		});
	});

		/* Un joueur est pret à jouer */
	socket.on('pretAjouer', function(data)
	{
		jeux[actuel].sac = data.sac;
		jeux[jeux[actuel].adversaire].sac = data.sac;

		app.io.sockets.emit('monTour', {
			aQuiLeTour		: actuel,
			attente			: jeux[actuel].adversaire
		});
	});

		/* Un jeux a été validé */
	socket.on('jeuxValide', function(data)
	{
		var ad = jeux[jeux[actuel].adversaire].score;

		if(jeux[actuel].score == '0' && ad == '0')
			data.obligation = true;
		else
			data.obligation = false;
		
		socket.emit('jeuxValide', data);
	});

		/* Le mot joué est correct */
	socket.on('motCorrect', function(data)
	{
		jeux[actuel].score = data.resultat.points;
		data.adversaire = jeux[actuel].adversaire;
		data.sac = jeux[actuel].sac;
		data.moi = actuel;

			/* le jeux a été pris en compte */
		socket.emit('nvellePioche', data);
	});

	socket.on('jeuRefuse', function(donnees){
		/* Pas implementé */
	});

	socket.on('piocheOk', function(data){
		socket.broadcast.emit('piocheOk', data);
	});

		/*---------------- Partie chat --------------------*/

		/* Nouveau message */
	socket.on('newMsg', function(message)
	{
			/* La destination du message */
		message.destination = conversations[actuel]

			/* La source */
		message.user = actuel;

			/* Date du message */
		date = new Date();
		h = date.getHours();
		m = date.getMinutes();
		heure = h+' : '+m;
		message.heure = heure;

			/* Transmission du message */
		app.io.sockets.emit('newMsg', message);
	});

		/* Déconnexion */
	socket.on('disconnect', function(){
		delete userConnecte[actuel];
		app.io.sockets.emit('bye', actuel);
	});
});

	/* Mon serveur sur le port 12345 */
app.start(12345);  
