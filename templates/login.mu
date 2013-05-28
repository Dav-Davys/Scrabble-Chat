<!DOCTYPE html>
<html>
  <head>
    <link rel="stylesheet" href="../static/style.css">
    <title>{{login}}</title>
  </head>
  <body>
	<div id ="containerDebut">
		<div id ="menu">
			<li><a href='/index'>Accueil</a></li>
			<li><a href='/sign'>Inscription</a></li>
			<li><a href='/a_propos'>A propos</a></li>
			<li><a href='/aide'>Aide</a></li>
		</div>
			<div id ="divSign">
			</br>
				<fieldset>
					<legend>{{login}}</legend>
					<form id='' method='post'>
						Username : <input id='user' type='text' name='login' />
						Password : <input id='pass' type='password' name='pwd' />
						<input id='reset' type='reset' value='Annuler' />
						<input id='submit' type='submit' value='Valider' />
					</form>
				</fieldset>
			</div>
	</div>
	<div id ="footer">Copyright Davys 2013</div>
  </body>
</html>
