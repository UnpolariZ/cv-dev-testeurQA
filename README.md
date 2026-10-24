# ORBITAL — CV interactif / V14

CV français : Three.js 0.180.0, GSAP 3.13.0 et ScrollTrigger. Bibliothèques incluses, sans CDN.

## Lancement local dans VS Code

1. Décompressez le ZIP dans un nouveau dossier, puis ouvrez `orbital-cv` dans VS Code.
2. Terminal > Nouveau terminal :

```sh
npm run dev
```

3. Ouvrez http://localhost:3000. Ctrl+C arrête le serveur.

Node.js 18+ recommandé. Aucun `npm install` nécessaire.
Alternative : `npx serve .` (ouvrez l'adresse affichée).
N'ouvrez pas index.html par double-clic : les modules nécessitent HTTP.
Si le port est occupé, arrêtez l'ancien serveur ou utilisez `npx serve .`.

## Cette version — mobile et sélecteur de console

- Mobile : suppression de `margin-top:25px` sur le footer contact. `margin-top:auto` le repousse au bas du bloc flex.
- Mobile : suppression de la hauteur minimale d'un écran sur la citation « La curiosité est le moteur. La rigueur, le cap. ». Espacement vertical resserré ; desktop conservé.
- Ajout d'un sélecteur Développeur / Testeur QA dans l'en-tête de la console holographique. Il est synchronisé avec le sélecteur situé plus haut dans la section, accessible au clavier et adapté aux deux thèmes.
- Les trois onglets de compétences changent selon le profil sélectionné. La présentation de la console est conservée.

## Personnaliser

- `profile.js` : identité, ville, introduction, email, GitHub, LinkedIn.
- `index.html` : textes et structure du CV.
- `ui.js` : compétences, console, projets et animations du contenu.
- `avatar.js` : géométrie du personnage original, sans modèle distant.
- `choreography.js` : poses et placements des sept chapitres.
- `scene.js` : robot, éclairage, gestes et réactions au défilement.
- `motion.js` : clips articulés et paramètres de mouvement.
- `welcome.js` : chronologie du salut et animations d’attente.
- `titles.js` : saisie des titres et entrée du titre principal.
- `transition.js` : geste de présentation entre les chapitres.
- `reading.js` : ouverture du livre et visée de lecture.
- `theme.js` : thème, bouton et préférence locale.
- `effects.js` : reflets et lumière au pointeur, magnétisme des boutons et ondes au clic.
- `navigation.js` : défilement guidé et paliers de lecture.
- `style.css` : apparence, responsive et impression.

Le prénom Philippe est prérempli d'après le contexte fourni. Le nom de famille et les coordonnées sont à compléter. Vérifiez les dates et contenus avant de diffuser le CV. Le personnage est une mascotte originale, pas un portrait ressemblant à une personne réelle.

Le parcours couvre Boulanger, la formation M2I et les projets personnels connus. Les missions récentes ne sont pas détaillées faute d'informations précises. Les visuels de projets sont des illustrations CSS ; les applications présentées ne sont pas livrées avec le CV.

Le contact ouvre le logiciel email si une adresse est configurée. Sinon, un message explique où l'ajouter. Les liens sociaux apparaissent après configuration HTTPS. Aucun tracker, collecte de données ou service externe.

## Vérifications réalisées

- DOM Linkedom : changements Dev/QA depuis les deux sélecteurs, synchronisation des états, trois onglets par profil et sélection des contenus.
- Présence des règles mobiles : marge de 25 px retirée et hauteur minimale de la citation neutralisée.
- Ancres, ressources et intégrité du ZIP.

La capture fournie a été consultée. La prévisualisation navigateur reste indisponible dans l'environnement ; le placement visuel final sur appareil mobile n'a pas pu être vérifié ici.

## Licences

Three.js : MIT, texte dans `vendor/THREE-LICENSE.txt`.
GSAP : en-têtes conservés ; métadonnées dans `vendor/GSAP-package.json` ; conditions sur https://gsap.com/standard-license/.
