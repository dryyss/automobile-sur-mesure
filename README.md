# Automobile sur Mesure

Prototype interactif du futur site (HTML, CSS et JavaScript sans build), brief et devis. Déployé tel quel sur Vercel.

| Adresse | Page | Ce qu'on peut y faire |
|---|---|---|
| `/` | Accueil | Intro animée, véhicule « À la une », sélection en carrousel, estimation rapide |
| `/vehicules` | Nos véhicules | Filtres (marque, recherche, budget, année, km, tri), favoris, adresse partageable |
| `/vehicule?v=…` | Fiche véhicule | Galerie plein écran, simulateur de financement, demande de rendez-vous, partage |
| `/depot-vente` | Dépôt-vente | Formulaire en 3 étapes avec photos (glisser-déposer) et récapitulatif |
| `/contact` | Rendez-vous | Choix du jour et de l'horaire, recherche personnalisée, plan d'accès |
| `/admin` | Back-office (démo) | Stock, statuts, « À la une », ajout de véhicule avec photos, boîte des demandes |
| `/maquette` | Ancienne maquette | Les 5 écrans d'origine (format Claude Design) |

## Démo client

Le back-office et le site partagent les données du navigateur (localStorage) :

1. Ouvrir `/admin` dans un onglet et le site dans un autre.
2. Envoyer une demande depuis une fiche, le contact ou le dépôt-vente : elle apparaît dans « Demandes » sans recharger.
3. Passer un véhicule en « Réservé » ou « Vendu », ou changer celui « À la une » : le site suit.
4. « Réinitialiser la démo » (en bas du menu du back-office) remet les données de départ.

Les données de test (`js/data.js`) : 20 véhicules du stock réel relevé, plus 2 véhicules vendus fictifs, 1 réservé et 1 brouillon pour montrer les statuts, ainsi que 9 demandes d'exemple. Les véhicules sans photo affichent un visuel « Photos en préparation ».

## Fichiers

```
index.html, vehicules.html, vehicule.html, depot-vente.html, contact.html, admin.html
css/site.css      charte et animations du site public
css/admin.css     back-office
js/data.js        stock, demandes, favoris (localStorage), formats, calcul de mensualité
js/site.js        en-tête, pied de page, animations, pages publiques
js/admin.js       back-office de démonstration
tests/            tests automatiques
maquette/         ancienne maquette
PROJET.md         brief complet · devis/ devis PDF · data/vehicules.json stock relevé
```

## Lancer en local

```bash
node tests/serve.js
```

Puis ouvrir http://localhost:5173.

## Tests

```bash
node --test tests/data.test.js tests/site.test.js
```

- `data.test.js` : cohérence du stock, statuts visibles ou masqués, demandes, favoris, réinitialisation, calcul de mensualité, stockage indisponible.
- `site.test.js` : fichiers et liens de chaque page, attributs HTML en double, conteneurs attendus par les scripts, bases SEO et accessibilité, syntaxe JS, redirections Vercel.
- `navigateur.html` : parcours complet dans un vrai navigateur (filtres, fiche, formulaires, back-office). Lancer `node tests/serve.js` puis ouvrir http://localhost:5173/tests/navigateur.html. Ce test vide les données de démo du navigateur.

Les tests tournent aussi sur GitHub à chaque push (`.github/workflows/tests.yml`). Le dossier `tests/` n'est pas déployé (`.vercelignore`).
