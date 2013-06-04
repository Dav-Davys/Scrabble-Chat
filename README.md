Exemple d'utilsation de was_framework.

Cette application présente un exemple d'utilisation du framework "was_framework" de Node js. Nous y implémentons une version du Scrabble qui intègre un mini chat.

Pour plus d'informations sur was_framework consultez le lien suivant : https://github.com/defeo/was_framework


Afin de la tester procéder comme suit :

1- Télécharger l'application.

Si vous avez node js installé sur votre machine, passer à l'étape 2. 
Si non merci de bien vouloir vous rendre sur nodejs.org pour l'installer.

2- Exécuter le script suivant pour créer la base de données.

    create database database_name;
    create table users (login varchar(15) not null primary key, email varchar(20) not null unique, pwd  varchar(50))';
    
3- Lancer l'application : node server.js

4- A vous de jouer.
