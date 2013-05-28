<!DOCTYPE html>
<html>
  <head>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js"></script>
  	<script src="http://code.jquery.com/jquery-1.9.1.js"></script>
 	<script src="http://code.jquery.com/ui/1.10.3/jquery-ui.js"></script>

    <script type="text/javascript" src="/socket.io/socket.io.js"></script>
    <script type="text/javascript" src="../static/mustache.js"></script>
    <script type="text/javascript" src="../static/client.js"></script>
    
    <link rel="stylesheet" href="../static/style.css">
    <link rel="stylesheet" href="../static/styleJeu.css">

    <title>{{title}}</title>
  </head>

  <body>
  	<!-- <div id="fenAide" title="Aide">
		<p>Si vous avez renconter des problèmes merci de bien vouloir vous débrouiller tout seul. Loooool.
		(Contenu à mettre)</p>
	</div> 
	<div id="fenReglement" title="Reglement">
		<p>Il n'y a pas de règles, défoulez vous!!!! 
		Ici aussi</p>
	</div>-->
		<div id="menuGauche">
			<fieldset>
				<legend>Menu Principal</legend>
				<fieldset id="mScore">
					<legend> Score </legend>

					<div id="menuScore">
						<p id="cntMS">{{user}}  {{meScore}} </br>{{adversaire}}  {{adScore}}</br>{{Pions}} {{pions}}</p>
					</div>	
				</fieldset>
				<fieldset id="mRech">
					<legend> Vérifier un mot : </legend>
					<div id ="menuRecherche">
						<form action= "" align="center" id="formRecherche">
							<input id="champRecherche" type="text" /> 
							<input type="submit" value="Rechercher" /></br>
							<textarea id = "resultRecherche"readonly="readonly" rows="3" cols="27"></textarea>
						</form>
					</div>
				</fieldset>
				<fieldset id="mMess">
					<legend> Messagerie </legend>
					
					<form action="" id="formMessage">
	      				<input type="text" id="msg" class="text"/>
	      				<input type="submit" id="send" value="Envoyer un message " class="submit"/>
	   				</form>
	   				
	   				<div id="menuMessage">
						<div id="divMessage">
							<fieldset id="mesMessages">
								
							</fieldset>
						</div>
					</div>
				</fieldset>
				
				<fieldset id="mUser">
					<legend> Utilisateur(s) connecté(s) </legend>
			
					<div id="tabDonnees">
						<form  method='post'>
							<table border=1 id='choixAdversaire'>
								<tr>
									<td>Login</td>
									<td>Email</td>
								</tr>
								<!--{{#users}} -->
								
								<!--{{/users}}-->
							</table>
						</form>
					</div>
					<form id="choix">
  						<select id="name">

   						</select>
   						<input type="submit" value="Choix adversaire"> 
   					</form>
				</fieldset>
				
			</fieldset>
		</div>
	<div id ="monContainer">
		<div id ="menu">
			<li><a href='#' id="aide">Aide ?</a></li>	
			<li><a href="#" id="reglement">Reglement</a></li>
			<div id = "menuDroite"><li>Bonjour &nbsp;&nbsp;&nbsp;&nbsp;<div id="menuNom">{{userLog}}</div></li>
				<li><a href='/logout'>Déconnexion</a></li>	
			</div>
		</div>
		<div id ="grille">
		<table border=3 align="center">
			<tr>
				<td id="00" class="motTriple"></td>
				<td id="01" class="blanc"></td>
				<td id="02" class="blanc"></td>
				<td id="03" class="lettreDouble"></td>
				<td id="04" class="blanc"></td>
				<td id="05" class="blanc"></td>
				<td id="06" class="blanc"></td>
				<td id="07" class="motTriple"></td>
				<td id="08" class="blanc"></td>
				<td id="09" class="blanc"></td>
				<td id="010" class="blanc"></td>
				<td id="011" class="lettreDouble"></td>
				<td id="012" class="blanc"></td>
				<td id="013" class="blanc"></td>
				<td id="014" class="motTriple"></td>
			</tr>
			<tr>
				<td id="10" class="blanc"></td>
				<td id="11" class="motDouble"></td>
				<td id="12" class="blanc"></td>
				<td id="13" class="blanc"></td>
				<td id="14" class="blanc"></td>
				<td id="15" class="lettreTriple"></td>
				<td id="16" class="blanc"></td>
				<td id="17" class="blanc"></td>
				<td id="18" class="blanc"></td>
				<td id="19" class="lettreTriple"></td>
				<td id="110" class="blanc"></td>
				<td id="111" class="blanc"></td>
				<td id="112" class="blanc"></td>
				<td id="113" class="motDouble"></td>
				<td id="114" class="blanc"></td>
			</tr>
			<tr>
				<td id="20"></td>
				<td id="21"></td>
				<td id="22" class="motDouble"></td>
				<td id="23"></td>
				<td id="24"></td>
				<td id="25"></td>
				<td id="26" class="lettreDouble"></td>
				<td id="27"</td>
				<td id="28" class="lettreDouble"></td>
				<td id="29"></td>
				<td id="210"></td>
				<td id="211"></td>
				<td id="212" class="motDouble"></td>
				<td id="213"></td>
				<td id="214"></td>
			</tr>
			<tr>
				<td id="30" class="lettreDouble"></td>
				<td id="31"></td>
				<td id="32"></td>
				<td id="33" class="motDouble"></td>
				<td id="34"></td>
				<td id="35"></td>
				<td id="36"></td>
				<td id="37" class="lettreDouble"></td>
				<td id="38"></td>
				<td id="39"></td>
				<td id="310"></td>
				<td id="311" class="motDouble"></td>
				<td id="312"></td>
				<td id="313"></td>
				<td id="314" class="lettreDouble"></td>
			</tr>
			<tr>
				<td id="40"></td>
				<td id="41"></td>
				<td id="42"></td>
				<td id="43"></td>
				<td id="44" class="motDouble"></td>
				<td id="45"></td>
				<td id="46"></td>
				<td id="47"></td>
				<td id="48"></td>
				<td id="49"></td>
				<td id="410" class="motDouble"></td>
				<td id="411"></td>
				<td id="412"></td>
				<td id="413"></td>
				<td id="414"></td>
			</tr>
			<tr>
				<td id="50"></td>
				<td id="51" class="lettreTriple"></td>
				<td id="52"></td>
				<td id="53"></td>
				<td id="54"></td>
				<td id="55" class="lettreTriple"></td>
				<td id="56"></td>
				<td id="57"></td>
				<td id="58"></td>
				<td id="59" class="lettreTriple"></td>
				<td id="510"></td>
				<td id="511"></td>
				<td id="512"></td>
				<td id="513" class="lettreTriple"></td>
				<td id="514"></td>
			</tr>
			<tr>
				<td id="60"></td>
				<td id="61"></td>
				<td id="62" class="lettreDouble"></td>
				<td id="63"></td>
				<td id="64"></td>
				<td id="65"></td>
				<td id="66" class="lettreDouble"></td>
				<td id="67"></td>
				<td id="68" class="lettreDouble"></td>
				<td id="69"></td>
				<td id="610"></td>
				<td id="611"></td>
				<td id="612" class="lettreDouble"></td>
				<td id="613"></td>
				<td id="614"></td>
			</tr>
			<tr>
				<td id="70" class="motTriple"></td>
				<td id="71"></td>
				<td id="72"></td>
				<td id="73" class="lettreDouble"></td>
				<td id="74"></td>
				<td id="75"></td>
				<td id="76"></td>
				<td id="77" class="centre"></td>
				<td id="78"></td>
				<td id="79"></td>
				<td id="710"></td>
				<td id="711" class="lettreDouble"></td>
				<td id="712"></td>
				<td id="713"></td>
				<td id="714" class="motTriple"></td>
			</tr>
			<tr>
				<td id="80"></td>
				<td id="81"></td>
				<td id="82" class="lettreDouble"></td>
				<td id="83" ></td>
				<td id="84"></td>
				<td id="85"></td>
				<td id="86" class="lettreDouble"></td>
				<td id="87"></td>
				<td id="88" class="lettreDouble"></td>
				<td id="89"></td>
				<td id="810"></td>
				<td id="811"></td>
				<td id="812" class="lettreDouble"></td>
				<td id="813"></td>
				<td id="814"></td>
			</tr>
			<tr>
				<td id="90"></td>
				<td id="91" class="lettreTriple"></td>
				<td id="92"></td>
				<td id="93"></td>
				<td id="94"></td>
				<td id="95" class="lettreTriple"></td>
				<td id="96"></td>
				<td id="97"></td>
				<td id="98"></td>
				<td id="99" class="lettreTriple"></td>
				<td id="910"></td>
				<td id="911"></td>
				<td id="912"></td>
				<td id="913" class="lettreTriple"></td>
				<td id="914"></td>
			</tr>
			<tr>
				<td id="100"></td>
				<td id="101"></td>
				<td id="102"></td>
				<td id="103"></td>
				<td id="104" class="motDouble"></td>
				<td id="105"></td>
				<td id="106"></td>
				<td id="107"></td>
				<td id="108"></td>
				<td id="109"></td>
				<td id="1010" class="motDouble"></td>
				<td id="1011"></td>
				<td id="1012"></td>
				<td id="1013"></td>
				<td id="1014"></td>
			</tr>
			<tr>
				<td id="110" class="lettreDouble"></td>
				<td id="111"></td>
				<td id="112"></td>
				<td id="113" class="motDouble"></td>
				<td id="114"></td>
				<td id="115"></td>
				<td id="116"></td>
				<td id="117" class="lettreDouble"></td>
				<td id="118"></td>
				<td id="119"></td>
				<td id="1110"></td>
				<td id="1111" class="motDouble"></td>
				<td id="1112"></td>
				<td id="1113"></td>
				<td id="1114" class="lettreDouble"></td>
			</tr>
			<tr>
				<td id="120"></td>
				<td id="121"></td>
				<td id="122" class="motDouble"></td>
				<td id="123"></td>
				<td id="124"></td>
				<td id="125"></td>
				<td id="126" class="lettreDouble"></td>
				<td id="127"></td>
				<td id="128" class="lettreDouble"></td>
				<td id="129"></td>
				<td id="1210"></td>
				<td id="1211"></td>
				<td id="1212" class="motDouble"></td>
				<td id="1213"></td>
				<td id="1214"></td>
			</tr>
			<tr>
				<td id="130"></td>
				<td id="131" class="motDouble"></td>
				<td id="132"></td>
				<td id="133"></td>
				<td id="134"></td>
				<td id="135" class="lettreTriple"></td>
				<td id="136"></td>
				<td id="137"></td>
				<td id="138"></td>
				<td id="139" class="lettreTriple"></td>
				<td id="1310"></td>
				<td id="1311"></td>
				<td id="1312"></td>
				<td id="1313" class="motDouble"></td>
				<td id="1314"></td>
			</tr>
			<tr>
				<td id="140" class="motTriple"></td>
				<td id="141"></td>
				<td id="142"></td>
				<td id="143" class="lettreDouble"></td>
				<td id="144"></td>
				<td id="145"></td>
				<td id="146" ></td>
				<td id="147" class="motTriple"></td>
				<td id="148"></td>
				<td id="149"></td>
				<td id="1410"></td>
				<td id="1411" class="lettreDouble"></td>
				<td id="1412" ></td>
				<td id="1413"></td>
				<td id="1414" class="motTriple"></td>
			</tr>
		</table>
		
		<fieldset>
		<div id="conteneurJeton">
			<ul id ="mesJetons">			
				<div id="case1" class="caseBlanche"></div>
				<div id="case2" class="caseBlanche"></div>
				<div id="case3" class="caseBlanche"></div>
				<div id="case4" class="caseBlanche"></div>
				<div id="case5" class="caseBlanche"></div>
				<div id="case6" class="caseBlanche"></div>
				<div id="case7" class="caseBlanche"></div>
			</ul>
		</div>
		</fieldset>
		<div id="conteneurBouton">
			<fieldset>
				<input id = "jouer" class="bout" type="button" value="Jouer">
				<input id = "passer" class="bout" type="button" value="Passer">
				<input id = "changer" class="bout" type="button" value="Changer">
				<input id = "abandonner" class="bout" type="button" value="Abandonner">
			</fieldset>
		</div>
	</div>
	</div>
  </body>
</html>
