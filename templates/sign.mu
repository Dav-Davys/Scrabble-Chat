<!DOCTYPE html>
<html>
  <head>
    <link rel="stylesheet" href="../static/style.css">
    <title>{{sign}}</title>
  </head>

  <body>
	<div id ="containerDebut">
		<div id ="menu">
			<li><a href='/index'>Accueil</a></li>
			<li><a href='/a_propos'>A propos</a></li>
			<li><a href='/aide'>Aide ?</a></li>
			<div id = "menuDroite">
				<li><a href='/login'>Connexion</a></li>	
			</div>
		</div>
		<div id = "divSign">
			<fieldset>
				<legend>{{sign}}</legend></br>
				<form id='' action ='' method='post'>
					Login : <input id='login' type='text' name='login' value='' />
					Email : <input id='email' type='email' name='email' value='' />
					Password : <input id='pwd' type='password' name='pwd' /><br>&nbsp;&nbsp; &nbsp;&nbsp; &nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp; &nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp; &nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp; &nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp; &nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp; &nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp; &nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp; &nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp; &nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp; &nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp; &nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp; &nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp; &nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp; &nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp; &nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp; &nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp; &nbsp; 
					<input id='reset' type='reset' value='Annuler' />
					<input id='submit' type='submit' value='Valider' />
				</form>
			</fieldset>
			<p>{{erreur}}</p>
		</div>
	</div>
	<div id ="footer">Copyright Davys 2013</div>
  </body>
</html>
