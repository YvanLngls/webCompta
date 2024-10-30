## Organisation de la base de données

`sudo systemctl start redis`

La base de donnée est organisée de la manière suivante :

infos -> informations sur la bdd
infos.size -> nombre de tables d'entrées
infos.i -> nom de la table i (format 3 lettres par 3 lettres)
infos.lastTable -> id de la dernière table ouverte

*nom_table*.infos -> informations sur la table
*nom_table*.infos.size -> taille de la table
*nom_table*.infos.name -> nom complet de la table