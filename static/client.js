		/*----------------------------------------- Partie jQuery--------------------------------------------*/

$(function(){

	var socket = io.connect('http://localhost');

		/* Le dictionnaire */
	 var dict = {};
	 var contenuJeu = {};
	 var jeuxEncours;

	
	/*---------------------------- Ajout d'un utilisateur et choix de l'adversaire --------------------------*/

	 	/* Connexion au server et transmission du nom */
	socket.on('connect', function()
	{
	 	socket.emit('maConnection', {
	 		nom : $('#menuNom').text()
	 	});
	});


	 	/* Nouvel utilisateur */
	 socket.on('newUser', function(liste)
	 {
	 		/* On rajoute l'utilisateur qui vient de se connecter à la liste*/
	 	var lien = '#';
	 	var classe = 'classe';
	 	$('#choixAdversaire').append('<tr id='+liste.login+'><td class='+classe+' id='+liste.login+'>\
	 		<a href='+lien+'>'+liste.login+'</a></td> <td>'+liste.email+'</td> </tr>');

	 		/* Ajout au menu déroulant */
	 	$('#name').append('<option value='+liste.login+'>'+liste.login+'</option>'); 	
	});

	 	/* Un utilisateur se deconnecte */
	socket.on('bye', function(login){
	 	$('#'+login).remove();
	});

	 	/* Un utilisateur a été choisi dans le menu déroulant*/
	$('#choix').submit(function(event)
	{
	 	event.preventDefault();

	 		/* On vérifie la qu'on n'a pas cliqué sur choisir avec une valeur vide  */
	 	if($("#name option:selected").text().length != 0)
	 	{
	 			/* Envoi du choix au serveur */
		 	socket.emit('demandeJeu', {
		 		demandeur : $('#menuNom').text(),
		 		demande   : $.trim($("#name option:selected").text())
		 	}); 	
	 	}
	 	else
	 		alert('Vous n\'avez pas choisi d\'adversaire');
	});


	/* ------------------------------------- Gestion des messages ---------------------------------------*/

		/* Un message a été envoyé */
	$('#formMessage').submit(function(event)
	{
		event.preventDefault();
		socket.emit('newMsg', { message : $('#msg').val() });
		$('#msg').val('');
		$('#msg').focus();
	});

		/* Un nouveau message a été reçu */
	socket.on('newMsg', function(message)
	{
		if(message.destination == $('#menuNom').text())
	 	{
	 		$('#mesMessages').append('<div class="myMsg"> <p class="auteur">'+message.user+'\
	 			</p><p class="contenu">'+message.message+'</p><p class="date">'+message.heure+'</p></div>');
	 		$('#mesMessages').animate({scrollTop : $('#mesMessages').prop('scrollHeight') }, 300);
	 	}
	 	if(message.user == $('#menuNom').text())
	 	{
	 		$('#mesMessages').append('<div class="myMsg"> <p class="auteur">'+message.user+'</p>\
	 			<p class="contenu">'+message.message+'</p><p class="date">'+message.heure+'</p></div>');
	 		$('#divMessage').animate({scrollTop : $('#divMessage').prop('scrollHeight') }, 300);
	 	}	

	});

	/*---------------------------------------- Actions de jeux---------------------------------------------*/

	 	/* On envoie la demande de jeux au deuxieme joueur */
	 socket.on('demandeJeu', function(gamers)
	 {
	 		/* Si c'est a nous que la demande s'adresse */
	 	if(gamers.demande == $('#menuNom').text())
	 	{
	 		resultat = confirm(gamers.demandeur+' vous a envoye une demande de jeu, l\'acceptez vous ?'); 

	 			/* Si la demande est acceptée */
	 		if(resultat == 1)
		 	{
		 		socket.emit('jeuAccepte', {
		 			demande : gamers.demande,
		 			demandeur : gamers.demandeur
		 		});
		 	}
		 	else
		 	{
		 		socket.emit('jeuRefuse', {
		 			demande : gamers.demande,
		 			demandeur : gamers.demandeur
		 		});
		 	}
	 	}
	 	
	 });

	 	/* Click sur le bouton jouer */
    $('#jouer').click(function(event)
    {
    	event.preventDefault();
    	var tabTest = {};
    	if(contenuJeu.length == 0)
    		alert('Vous n\'avez rien jouer');
    	else
    	{
    		var j = 0;
    		for(i in contenuJeu)
    		{
    			var obj = {};
    			obj.initial = contenuJeu[i].init;

    			var s = contenuJeu[i].valeur.split(' ');
    			obj.valeur  = s[0];

    			obj.lieu = contenuJeu[i].depot;

    			var v = contenuJeu[i].depValeur.split(' ');
    			obj.valeurLieu = v[0];

    			tabTest[i] = obj;
    		}
    		socket.emit('jeuxValide', {
    			jeu : tabTest
    		});
    	}
    });

    	/* Un jeu a été validé*/
    socket.on('jeuxValide', function(data)
    {
    	var tab = data.jeu;
    	var p = mesPositions();
    	var a = trierObjet(tab);
    	console.log(a);

    	console.log(alignementCorrect(a, p));

    	//if(alignementCorrect(a, p) == true)
    	//{
    		//console.log('Ici...');

    		if(data.obligation == true)
	    	{
	    		console.log('obligation');
	    			/* Si l'une des lettres a été placées sur le centre */
	    		for(i in a)
	    		{
	    			if(a[i]=='77')
	    			{
	    				var motForme = formationMot(a, tab);
	    			
	    					/* Si le mot existe dans le dictionnaire */
						if(dict[motForme.mot.toLowerCase()] !== undefined)
						{
							socket.emit('motCorrect', {
	    						donnees  : tab,
	    						resultat : motForme
	    					});
						}	
						else
						{
							socket.emit('motIncorrect', {
	    						donnees  : tab,
	    						resultat : motForme
	    					});
						}
	    				console.log(motForme);
	    				//console.log(tab.donnees)
	    				
	    			}
	    		}
	    	}
	    	else
	    	{	
	    		var motForme = formationMot(a, tab);
	    					/* Si le mot existe dans le dictionnaire */
				if(dict[motForme.mot.toLowerCase()] !== undefined)
				{
					socket.emit('motCorrect', {
	    				donnees  : tab,
	    				resultat : motForme
	    			});
				}	
				else
				{
					socket.emit('motIncorrect', {
	    				donnees  : tab,
	    				resultat : motForme
	    			});
				}
	    	}
	    	//socket.emit('erreur', data);
    	//}emit('erreur', data);
    });

	socket.on('motIncorrect', function(data){
		var motJoue = data.resultat.mot;

		alert('Le mot  " '+motJoue+' " est incorrect   ');
		for(i in data.donnees)
    	{
  				/* Suppression de toutes les lettres placées */
    		$('#'+data.donnees[i].lieu).removeClass($('#'+data.donnees[i].lieu).attr('class'));
    		$('#'+data.donnees[i].lieu).addClass(''+data.donnees[i].valeurLieu+'');
    		$('#'+data.donnees[i].lieu).droppable( "option", "disabled", false );

    			/* On les remet dans le sac */
    		$('#'+data.donnees[i].initial).removeClass($('#'+data.donnees[i].initial).attr('class'));
    		$('#'+data.donnees[i].initial).addClass(''+data.donnees[i].valeur+'');
    	}
    		/* On efface ce qui a été joué */
    	contenuJeu = {};
	});

		/* Jouer quand c'est mon tour */
    socket.on('monTour', function(data)
    {
    	if(data.aQuiLeTour == $('#menuNom').text())
    	{		
    		var histo = {};
    		contenuJeu = {};
    		var caseDepart = {case1 : 'case1', case2 : 'case2', case3 : 'case3', case4:'case4', case5:'case5', case6:'case6', case7:'case7'};
    		var i = 0;
    			/* On surveille les dépots sur la grille */
			$('#grille td').droppable({
		      	drop: function(event, ui) {

		      		var t = $(ui.draggable).attr('id');
		      		
		      			/* Si le pion provient du chevalet*/
		      		if(caseDepart[t] !== undefined)
		      		{
		      			var obj = {};
		      				/* Je récup les positions de départ et dépot */
			      		obj.init   	  = $(ui.draggable).attr('id');
			      		obj.valeur    = $(ui.draggable).attr('class');
			      		obj.depot     = $(this).attr('id');
			      		obj.depValeur = $(this).attr('class');


			      		contenuJeu[obj.init] = obj;
			      		
			      		histo.depot = obj;
			      		
			      		$(ui.draggable).draggable( "option", "revert", true );
			      		$(this).removeClass(obj.depValeur);
			      		$(this).addClass($(ui.draggable).attr('class'));
			      		$(ui.draggable).removeClass($(ui.draggable).attr('class'));
		      			$(ui.draggable).addClass('caseBlanche');
		      			
		      			$(this).droppable( "option", "disabled", true );
		      			$(this).draggable();


		      		}
		      			/* Si le pions est déplacé sur la grille */
		      		else
		      		{
		      				/* On récup l'ancienne position */
		      			var debut = histo.depot.depValeur;

		      				/* On la change avec la nouvelle position */
		      			histo.depot.depValeur = $(this).attr('class');
		      			histo.depot.depot = $(this).attr('id');

		      			var copieClasse = $(ui.draggable).attr('class');

		      			$(ui.draggable).draggable("option", "revert", true );
		      			$(ui.draggable).removeClass(copieClasse);
		      			$(ui.draggable).addClass(debut);

		      			$(this).removeClass($(this).attr('class'));
			      		$(this).addClass(copieClasse);
		      			
			      		$(this).droppable( "option", "disabled", true );
		      			$(this).draggable();
		      		}
		        }
		    });
    	}
    		/*  Si je suis en attente, certains de mes boutons sont bloqués */
    	if(data.attente == $('#menuNom').text())
    	{
    		$('#passer').attr('disabled', true);
    		$('#jouer').attr('disabled', true);
    		$('#changer').attr('disabled', true);
    	}

    });

		/* Un joueur a terminé son jeu */
	socket.on('nvellePioche', function(data)
	{
		var score 	= data.resultat.points;
		var motJoue = data.resultat.mot;
		var sac = data.sac;

			/*Choix des pions */ 
		$( ".caseBlanche" ).each(function (a, domEle) {
	       	var lettre;
	       	if(sac.length > 0)
	       	{
	     		var bool = false;
	       		var indice = getRandomInt(0, sac.length);

	       		sac = supprimeLettre(sac);

	       		lettre = sac[indice];	
	   			delete sac[indice];
	       	}
	       	else
	       		lettre = 'caseBlanche';
	       	
	       	$(domEle).removeClass('caseBlanche');
	       	$(domEle).addClass(''+lettre+'');

	       	$(domEle).draggable(function(){
	       	 	$(domEle).draggable( "option", "containment", "monContainer");
	       	});
	     });
		sac = supprimeLettre(sac);
		data.sac = sac;

		$('#usrSc').text(score);
	    $('#nbrP').text(sac.length);

    	for(i in data.donnees)
    	{
    			/* On empêche le déplacement des éléments joué*/
    		$('#'+data.donnees[i].lieu).draggable("option", "disabled", true);
    	}

    	socket.emit('piocheOk', data);

	});

		/* L'autre a fini de jouer et a repioché*/
	socket.on('piocheOk', function(data)
	{
		if(data.adversaire == $('#menuNom').text())
		{
			var score 	= data.resultat.points;
			var motJoue = data.resultat.mot;

			alert(data.moi +' a marqué '+score+' points en jouant '+motJoue+'    ');

				/* On débloque les boutons */
			$('#passer').attr('disabled', false);
    		$('#jouer').attr('disabled', false);
    		$('#changer').attr('disabled', false);

    			/* Mise à jour les pions et le score */
    		for(i in data.donnees)
    		{
    				/* Mise à jour de la grille de l'adversaire*/
    			$('#'+data.donnees[i].lieu).removeClass($('#'+data.donnees[i].lieu).attr('class'));
    			$('#'+data.donnees[i].lieu).addClass(''+data.donnees[i].valeur+'');
    		}
    			/* Mise à jour des score */
	      	$('#adSc').text(score);
	      	$('#nbrP').text(data.sac.length);
	      	socket.emit('pretAjouer', {
	      		sac : data.sac
	      	});
		}

	});

    	/* Le jeu a été accepté : le joueur demandandeur choisi ses pions */
	socket.on('chxJetonsJoueur1', function(donnees)
	{
	 	if(donnees.demandeur == $('#menuNom').text())
	 	{
	 			/* On cache le bouton de choix */
	 		$('#choix').fadeOut();
	 			/* On affiche les div cachés */
	 		$('#conteneurBouton').show();
	 		$('#conteneurJeton').show();
	 		$('#mRech').show();
	 		$('#mMess').show();
	 		$('#mScore').show()

		 	$( ".caseBlanche" ).each(function (a, domEle) {
	       		var lettre;
	       		if(donnees.sac.length > 0)
	       		{
	       			var bool = false;
	       			var indice = getRandomInt(0, donnees.sac.length);

	       			donnees.sac = supprimeLettre(donnees.sac);

	       			lettre = donnees.sac[indice];	
	       			delete donnees.sac[indice];
	       		}
	       		else
	       			lettre = 'caseBlanche';
	       	
	       		$(domEle).removeClass('caseBlanche');
	       	 	$(domEle).addClass(''+lettre+'');


	       	 	$(domEle).draggable(function(){
	       	 		$(domEle).draggable( "option", "containment", "monContainer");
	       	 	});
	      	});
	      		/* On renvoie les données au serveur */

	      	donnees.sac = supprimeLettre(donnees.sac);

	      	var mScore = $('#cntMS').html();
	 		$('#cntMS').remove();

	 		var obj = {
	 			usr : donnees.demandeur,
	 			mS    	 : '0',
	 			ad   : donnees.demande,
	 			adS      : '0', 
	 			p   	 : donnees.sac.length
	 		};

	 		$('#menuScore').append('<p id="cntMS">'+obj.usr+' : <span id="usrSc">'+ obj.mS+'</span></br>\
	 			'+obj.ad+' : <span id="adSc">'+obj.adS+'</span></br>Pions restants : <span id="nbrP"> '+obj.p+'</span></p>');
				
				/* Le joueur 1 a choisi ses jetons */
	      	socket.emit('jetonJoueur1Ok', {
	      		sac 		: donnees.sac,
	      		demandeur   : donnees.demandeur,
	      		demande 	: donnees.demande
	      	});
		}
	});

		/* Le second joueur choisi ses pions */
	socket.on('chxJetonsJoueur2', function(donnees)
	{
	 		/* On cache le bouton de choix */
	 		$('#choix').fadeOut();
	 			/* On affiche les div cachés */

	 		$('#conteneurBouton').show();
	 		$('#conteneurJeton').show();
	 		$('#mRech').show();
	 		$('#mMess').show();

	 	if(donnees.demande == $('#menuNom').text())
	 	{
	 		$('#choix').fadeOut();
	 		$('#conteneurBouton').show();
	 		$('#conteneurJeton').show();
	 		$('#mScore').show();

		 	$( ".caseBlanche" ).each(function (a, domEle) {
	       		var lettre;
	       		if(donnees.sac.length > 0)
	       		{
	       			var bool = false;
	       			var indice = getRandomInt(0, donnees.sac.length);

	       			donnees.sac = supprimeLettre(donnees.sac);

	       			lettre = donnees.sac[indice];	
	       			delete donnees.sac[indice];
	       		}
	       		else
	       			lettre = 'caseBlanche';
	       	
	       		$(domEle).removeClass('caseBlanche');
	       	 	$(domEle).addClass(''+lettre+'');


	       	 	$(domEle).draggable(function(){
	       	 		$(domEle).draggable( "option", "containment", "monContainer");
	       	 	});
	      	});

	      	donnees.sac = supprimeLettre(donnees.sac);

	      	var mScore = $('#cntMS').html();
	 		$('#cntMS').remove();

	 		var obj = {
	 			usr 	 : donnees.demande,
	 			mS    	 : '0',
	 			ad  	 : donnees.demandeur,
	 			adS      : '0', 
	 			p        : donnees.sac.length
	 		};

	 		$('#menuScore').append('<p id="cntMS">'+obj.usr+' : <span id="usrSc">'+ obj.mS+'</span></br>\
	 			'+obj.ad+' : <span id="adSc">'+obj.adS+'</span></br>Pions restants : <span id="nbrP">: '+obj.p+'</span></p>');
	      	
	      		/* On récupère les jetons restants et on les renvoie au serveur */
	      	socket.emit('startOk', {
	      		sac 		: donnees.sac,
	      		demandeur   : donnees.demandeur,
	      		demande 	: donnees.demande
	      	});
		}
	});

		/* Une recherche (d'un mot) a été lancée */
	$('#formRecherche').submit(function(event)
	{
		event.preventDefault();

		$('#resultRecherche').val('');
		var champ = $('#champRecherche').val();

		$('#champRecherche').val('');
		
			/* Si on n'a pas rentré un mot vide */
		if(champ.length != 0)
		{
			if(dict[champ.toLowerCase()] !== undefined)
				$('#resultRecherche').val('Le mot "'+champ+'" existe');
			else
				$('#resultRecherche').val('Le mot "'+champ+'" est inexistant');
		}
	});

		/* Le jeu peut commencer */
	socket.on('startOk', function(data)
	{
		if(data.demande == $('#menuNom').text() || data.demandeur == $('#menuNom').text())
		{
				/* On charge le dictionnaire pour les deux joueurs*/
			$.get( "../static/dico.txt", function(source) 
			{
	      		var mots = source.split( "\n" );
	      		for ( var i = 0; i < mots.length; i++)
	      		  	dict[mots[i]] = mots[i];
	      	});
	      
	      		/* On actualise les scores et le nombre de pions */
	      	$('#usrSc').text('0');
	      	$('#adSc').text('0');
	      	$('#nbrP').text(data.sac.length);
		}
	});
});

	/*--------------------------------------- Partie js classique ------------------------------------------*/

	/* Fonction permettant de former le mot avec les lettres jouées et comptant les points */
function formationMot(tab, obj)
{
	var valeurLetrres = valeurDesLettres();
	var tmp = {};
	var nbrPoints = 0;
	var mot='';

	var autresMots = {};

	var motT=1, motD=1, lettreD, lettreT;

		/* Formation du mot et comptage des points */
	for(i in tab)
	{
		for(j in obj)
		{
			if(tab[i] == obj[j].lieu)
			{
				mot = mot+obj[j].valeur;
				if(obj[j].valeurLieu == 'lettreTriple')
					nbrPoints = nbrPoints + 3*(valeurLetrres[obj[j].valeur]);
				if(obj[j].valeurLieu == 'lettreDouble')
					nbrPoints = nbrPoints + 2*(valeurLetrres[obj[j].valeur]);
				else
					nbrPoints = nbrPoints + valeurLetrres[obj[j].valeur];

				if(obj[j].valeurLieu == 'motTriple')
					motT++;
				if(obj[j].valeurLieu == 'motDouble')
					motD++;
			}

		}
	}

		/* Mots formés avec les lettres déjà présentes */
	/*for(i in tab)
	{
		for(j in obj)
		{
			if(tab[i] == obj[j].lieu)
			{
				
			}

		}
	}*/


	nbrPoints = nbrPoints*motT*motD;
	tmp.mot = mot;
	tmp.points = nbrPoints
	return tmp;
}


	/* Cette fonction permet de générer un nombre aléatoire entre min et max */
function getRandomInt(min, max) 
{
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

	/* Fonction vérifiant si les pions joués sont correctement alignés */
function alignementCorrect(tab, mesPositions)
{
	var indice = tab[0].substring(0,2);
	
	if(tab.length > 1)
	{
		var indice2 = tab[1].substring(0,2);

			/* Si nous sommes sur la même ligne */
		if(indice == indice2)
		{
			for(cle in tab)
			{
				console.log('Dans la boucle '+ tab[cle]);
					/* En ligne */
				if(verifLigne(tab[cle], indice, mesPositions) == false)
					return false;
			}
			return true;
			//return 'ligne';	
		}
		else
		{
			var indice3;//= tab[0].substring(0,2);
			if(tab[0].length == 2)
				indice3 = tab[0].substring(1,2);
			else if(tab[0].length == 3)
			{
				indice3 = tab[0].substring(2,3);
			}
			else
				indice3 = tab[0].substring(2,4);

			var colonne = positionsColonne();
			
			for(cle in tab)
			{
					/* En colonne */
				if(verifLigne(tab[cle], indice3, colonne) == false)
					return false;
			}
			return true;
			//return 'colonne';	
		}
	}
	else
		return true;	
}

	/* Fonction vérifiant si les pions sont placés en ligne */
function verifLigne(cle, indice, tab)
{
	var tmp = tab[indice];
	for(i in tmp)
	{
		if(tmp[i] == cle)
		{
			return true;
		}
	}
	return false;
}

	/* Fonction permettant de trier un tableau */
function trierObjet(obj)
{
		/* Copie des positions ou les pions ont été posés */
	var tab = [];
	var j = 0;
	for(i in obj)
	{
		tab[j] = obj[i].lieu;
		j++;
	}
		
		/* Renvoi du tableau trier*/
	return (tab.sort(function(n1, n2){return n1-n2;}));
}


	/* Cette fonction génère les différents positions pouvant être occupées en ligne */
function mesPositions()
{
	var mesPositions = {};

	for(i=0; i<15;i++)
	{
		var obj = {};
		for(j=0; j<15;j++)
		{
			obj[i+''+j] = ''+i+''+j+'';
		}
		mesPositions[i] = obj;
	}
	return mesPositions;
}

	/* Cette fonction génère les différents positions pouvant être occupées en ligne */
function positionsColonne()
{
	var mesPositions = {};
	var k = 0;

	while(k<15)
	{
		var obj = {};
		for(j=0; j<15;j++)
		{
			obj[j+''+k] = ''+j+''+k+'';
		}
		mesPositions[k] = obj;
		k++;
	}
	return mesPositions;
}

	/* Cette fonction permet de supprimer les lettres qui été choisies */
function supprimeLettre(sac)
{
	var copieSac = [], j=0;
	for(i in sac)
	{
	    if(sac[i] != null)
	    {
	       	copieSac[j] = sac[i];
	       	j++;
	    }
	}
	return copieSac;
}

	/* Cette fonction permet de copier un objet */
function copieObjet(obj)
{
	var tmp = {};
	for(i in obj)
		tmp[i] = obj[i];
	return tmp;
}




	/* Si fonction permet de dire si le mot a été formé avec des lettres déjà placées */
function consecutif(alignement, obj, mesPositions)
{
	if(alignement != false)
	{
		var trie = trierObjet(obj);
		var taille = mesPositions.length;
		var base = trie[0];

			/* Si les pions sont bien rangés en ligne */
		if(alignement == 'ligne')
		{
			for(j=0; j<taille; j++)
				if(mesPositions[base, j] != trie[j])
					return false;
			return true;
		}
			/* En colonne*/
		else
		{
			for(j=0; j<taille; j++)
				if(mesPositions[j, base] != trie[j])
					return false;
			return true;
		}
	}
}

	/* Fonction renvoyant les valeurs des lettres */
function valeurDesLettres()
{
	var valeurLetrre = {
	 	A : 1,
	 	B : 3,
	 	C : 3, 
	 	D : 2, 
	 	E : 1,
	 	F : 4,
	 	G : 2, 
	 	H : 4, 
	 	I : 1,
	 	J : 8,
	 	K : 10, 
	 	L : 1, 
	 	M : 2,
	 	N : 1,
	 	O : 1, 
	 	P : 3, 
	 	Q : 8,
	 	R : 1,
	 	S : 1, 
	 	T : 1, 
	 	U : 1,
	 	V : 4,
	 	W : 10, 
	 	X : 10, 
	 	Y : 10,
	 	Z : 10,
	 	_ : 0
	};
	return valeurLetrre;
}
