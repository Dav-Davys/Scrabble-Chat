Exemple d'utilsation de was_framework.

Cette application présente un exemple d'utilisation du framework "was_framework" de Node js. Nous y implémentons une version du Scrabble qui intègre un mini chat.

Afin de la tester procéder comme suit :

1- Exécuter le script suivant pour créer la base de données.

    create database database_name;
    create table users (login varchar(15) not null primary key, email varchar(20) not null unique, pwd  varchar(50))';
    
2- Lancer l'application : node server.js

3- A vous de jouer.
