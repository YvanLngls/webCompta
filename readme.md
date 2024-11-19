# WebCompta

Ce projet est une application web de comptabilité.

Pour le lancer il est nécessaire d'avoir une base de donnée redis.

Dans le dossier *back* exécutez la commande : `./redis.sh`\
Exécutez ensuite : `npm start` pour lancer le service backend.\
Exécutez ensuite : `ng serve` dans le dossier *front* pour lancer le service frontend.

L'application web est ensuite disponible sur **localhost:4200**.

*Notes ->*
## Organisation de la base de données

La base de donnée est organisée de la manière suivante :

infos -> informations sur la bdd (n'existe pas)\
infos.size -> nombre de tables d'entrées\
infos.i -> nom de la table i (format 3 lettres par 3 lettres)\
infos.lastTable -> id de la dernière table ouverte\
infos.category.size -> nombre de catégories possibles\
infos.category.i.name -> nom de la catégorie i

*nom_table*.infos -> informations sur la table (n'existe pas)\
*nom_table*.infos.size -> taille de la table\
*nom_table*.infos.name -> nom complet de la table\
*nom_table*.infos.type -> type (0 => table globale, 1 => table locale)\
*nom_table*.infos.balance -> balance de la table

## Catégories des dépenses

1) Maison
2) Alimentation
3) Transport
4) Vêtements
5) Loisirs
6) Santé
7) Impôts
8) Investissement
9) Cadeaux
10) Divers

## Protocole local

### Server

`getGeneralInfosServer` : Renvoies si la base de donnée est initialisée

`getTableInfosServer` : Renvoies le nombre de tables dans la base

`getTableChoiceServer` : Renvoies la liste des tables de la base

`getTotalServer` : Renvoies les sommes totales de la table courante

`getEntriesServer` : Renvoies les entrées de la table courante

### Client

`initClient` : Début d'une connexion

`submitEntryClient` : Ajoute une entrée à la table courante

`changeTableClient` : Change la table courante

`changeTableIdClient` : Modifie l'id d'une table (admin)

`getTotalClient` : Demandes les sommes totales de la table courante

`addTableClient` : Ajoute une table
