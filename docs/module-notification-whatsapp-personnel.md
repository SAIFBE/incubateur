# Module de notification WhatsApp du personnel

Ce module permet a l'administrateur d'informer le personnel CMC lorsqu'un evenement est publie.

## Principe

- Le personnel n'a pas de compte et ne se connecte jamais.
- L'administrateur gere une liste de contacts WhatsApp.
- L'application genere un message WhatsApp a partir de l'evenement.
- L'envoi reste manuel : copier le message dans un groupe ou ouvrir WhatsApp pour un contact.
- Laravel conserve l'historique des notifications marquees comme envoyees.

## Donnees conservees

- Contacts personnel : nom, fonction, departement, telephone, numero WhatsApp normalise, statut actif.
- Historique : evenement, contact optionnel, mode groupe ou individuel, message envoye, date, administrateur.

## Limite volontaire

Le module n'utilise pas l'API WhatsApp. Il ne fait aucun envoi automatique afin de rester simple, gratuit et controle par l'administrateur.
