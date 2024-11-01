## Organisation de la base de données

`sudo systemctl start redis`

La base de donnée est organisée de la manière suivante :

infos -> informations sur la bdd (n'existe pas)
infos.size -> nombre de tables d'entrées
infos.i -> nom de la table i (format 3 lettres par 3 lettres)
infos.lastTable -> id de la dernière table ouverte

*nom_table*.infos -> informations sur la table (n'existe pas)
*nom_table*.infos.size -> taille de la table
*nom_table*.infos.name -> nom complet de la table

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