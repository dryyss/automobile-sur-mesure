# Automobile sur Mesure · Refonte du site

> Projet Magar Développement · Devis DEV-2026-ASM-001 (2 500 € net) · Novembre 2026

## 1. Le client

| | |
|---|---|
| Société | Automobile sur Mesure (« Auto sur Mesure », logo ASM) |
| Activité | Véhicules de sport, de prestige et d'exception : achat, vente, dépôt-vente, importation |
| Adresse | 8 avenue Roland Moreno, 95740 Frépillon |
| Téléphone | 06 87 42 64 46 |
| Email | contact@automobilesurmesure.com |
| Horaires | Mardi au samedi, 10h à 12h et 13h à 19h, sur rendez-vous uniquement. Fermé dimanche et lundi |
| Réseaux | Facebook, Instagram |
| Site actuel | https://www.automobilesurmesure.com (Wix) |

### Services proposés (menu actuel)

Dépôt-vente, recherche personnalisée, transport et livraison, atelier mécanique, carrosserie, detailing, administratif, garantie, assurance.

## 2. Audit du site actuel (Wix)

- Sous-menus cassés : pages dupliquées mal renommées (ex. « Detailing » pointe vers `copie-de-atelier-mécanique`, « Assurance » vers `copie-de-dépôt-vente`). Menu « Plus » vide.
- Aucun formulaire : ni estimation, ni dépôt-vente, ni contact. Contact uniquement par téléphone ou email.
- Pas de mentions légales visibles, copyright 2022.
- SEO faible : titre « Depot-vente » sans accent, canonique incohérente, images nommées `1Y3A3823.JPG`, contenu très court.
- Finitions : horaires affichés deux fois, texte parasite « Accueil: Bienvenue ».
- Le stock existe (page `/stock`, plus de 20 véhicules sur 2 pages) mais il est géré dans Wix Stores, sans vraies fiches détaillées.

## 3. Objectifs

1. Un site premium à la hauteur des véhicules vendus.
2. Un catalogue que le client gère seul (ajout, modification, statut réservé ou vendu).
3. Générer des demandes : estimation dépôt-vente, rendez-vous, recherche personnalisée.
4. Gagner en visibilité locale (Frépillon, Val-d'Oise, véhicules de prestige).
5. Des photos homogènes avec masquage automatique des plaques et fond studio.

## 4. Maquette

- Maquette en ligne : https://claude.ai/artifact/12SKTFK5WHWJdydWdAB1Ru
- Sources dans `maquette/` (5 écrans : Accueil, Nos véhicules, Fiche véhicule, Dépôt-vente, Back-office).

### Charte graphique (reprise du site actuel)

| Élément | Valeur |
|---|---|
| Fond | Noir `#000000`, variantes `#070707`, `#0D0D0D` |
| Texte | Blanc `#FFFFFF`, gris `#BDBDBD`, `#9A9A9A`, `#8C8C8C` |
| Fond clair (sections contrastées) | `#F6F5F3` / `#F9F9F9` |
| Filets | `rgba(255,255,255,0.12)` à `0.25` |
| Titres | Cormorant Garamond 400/500, italique pour les accents (police utilisée sur leur site actuel) |
| Texte courant | Montserrat 300 à 600 (équivalent libre de Proxima Nova, utilisée sur leur site) |
| Libellés | Montserrat 500/600, majuscules, interlettrage 0.18em à 0.34em |
| Logo | Monogramme ASM + « AUTOMOBILE SUR MESURE », blanc sur noir (`assets/logo-asm.jpg`) |
| Style | Aucune animation au scroll (le parallax a été écarté). Survols discrets uniquement |

## 5. Arborescence

```
/                         Accueil
/vehicules                Catalogue (filtres)
/vehicules/[slug]         Fiche véhicule
/depot-vente              Dépôt-vente + formulaire d'estimation
/recherche-personnalisee  Formulaire de recherche
/services/[slug]          Une page par service (8 pages)
/la-societe               Présentation
/videos                   Vidéos
/temoignages              Avis clients
/contact                  Contact, horaires, carte, prise de RDV
/mentions-legales
/confidentialite
/admin                    Back-office (Payload)
```

## 6. Contenu des pages

### Accueil
- Bandeau supérieur : horaires sur RDV, téléphone, réseaux.
- En-tête : logo centré, menu réparti à gauche et à droite, bouton « Rendez-vous ».
- Ouverture : grande photo, titre « L'exception, sur mesure. », vignette « À la une » (véhicule mis en avant depuis le back-office), les 4 métiers (Achat, Vente, Dépôt-vente, Importation).
- Bande des marques (Porsche, Lamborghini, Ferrari, Bentley, Mercedes-AMG, Audi Sport, BMW M).
- Présentation de la maison.
- Sélection du moment : 6 véhicules (année, km, puissance, prix).
- Dépôt-vente : texte + mini formulaire « Estimation rapide » qui renvoie vers `/depot-vente`.
- Services : liste numérotée des 8 services.
- Bloc rendez-vous : adresse, horaires, téléphone, email, WhatsApp.

### Catalogue
- Filtres : marque, budget max, année min, kilométrage max, tri (prix, récents, kilométrage).
- Compteur de résultats, cartes véhicules, encart « Vous ne trouvez pas votre modèle ? » vers la recherche personnalisée.
- Les véhicules « Vendu » ne s'affichent pas. Les « Réservé » s'affichent avec un badge.

### Fiche véhicule
- Galerie (photo principale + vignettes, visionneuse plein écran).
- Encadré : marque, modèle, version, prix, 4 infos clés, boutons Rendez-vous / Appeler / WhatsApp.
- Caractéristiques complètes, équipements, description.
- Formulaire « Ce véhicule vous intéresse ? » (nom, téléphone, jour souhaité, reprise oui/non).
- Véhicules similaires (même marque ou même gamme de prix).

### Dépôt-vente
- 4 étapes : Estimation, Préparation, Diffusion, Vente.
- Formulaire : marque, modèle, année, km, prix souhaité, photos (upload multiple), nom, téléphone, email, précisions, consentement RGPD.

## 7. Back-office (Payload CMS)

Écrans prévus dans la maquette :
- **Véhicules** : compteurs (en ligne, réservés, valeur du stock, demandes à traiter), tableau du stock, changement de statut en un clic.
- **Ajouter / modifier un véhicule** : informations, équipements, mise en avant « À la une », photos avec options « Masquer la plaque » et « Fond studio ».
- **Demandes** : boîte de réception des formulaires (dépôt-vente, rendez-vous, recherche, info véhicule), statut traité / non traité.

### Collections

**vehicles**
| Champ | Type | Notes |
|---|---|---|
| title | text | généré : marque + modèle |
| slug | text | unique, généré |
| brand | relationship → brands | |
| model | text | ex. « 911 (992) GT3 RS » |
| version | text | ex. « 4.0 PDK 525 ch Pack Weissach » |
| firstRegistration | text ou date | format MM/AAAA |
| mileage | number | km |
| power | number | ch |
| gearbox | select | PDK, automatique, manuelle… |
| fuel | select | essence, hybride, diesel, électrique |
| color | text | |
| price | number | € TTC |
| status | select | `draft`, `online`, `reserved`, `sold` |
| featured | checkbox | vignette « À la une » de l'accueil |
| photos | upload (hasMany) → media | ordre modifiable |
| equipment | array of text | |
| description | richText | |
| warranty | text | |
| seo | group | title, description, image |

**brands** : name, slug, logo (optionnel).

**media** : upload avec `maskPlate` (checkbox), `studioBackground` (checkbox), `original` et `processed` (deux tailles d'image), `alt`.

**leads**
| Champ | Type | Notes |
|---|---|---|
| type | select | `depot`, `rdv`, `recherche`, `info` |
| name, phone, email | text | |
| vehicle | relationship → vehicles | pour `info` et `rdv` |
| payload | json | champs propres au formulaire (marque, km, budget…) |
| photos | upload (hasMany) | pour `depot` |
| status | select | `new`, `done` |
| createdAt | date | auto |

**services** : title, slug, excerpt, content, image, order.
**testimonials** : author, text, rating, source (Google…), date.
**videos** : title, url (YouTube / Instagram), thumbnail.

**Global `settings`** : téléphone, email, adresse, horaires, liens réseaux, WhatsApp, texte du bandeau.

## 8. Traitement automatique des photos

- Déclenché par un hook `afterChange` sur `media` quand `maskPlate` ou `studioBackground` est coché.
- Masquage de plaque : détection de la plaque puis floutage ou remplacement par une plaque ASM.
- Fond studio : détourage du véhicule puis pose sur le fond showroom du client.
- L'original est toujours conservé, le site affiche la version traitée.
- Même mécanique que sur le projet Lease Auto : réutiliser le code.
- [À CONFIRMER] Service utilisé pour la détection et le détourage (API externe ou modèle hébergé) et qui paie l'éventuel abonnement.

## 9. Formulaires et notifications

- Dépôt-vente, rendez-vous, recherche personnalisée, info véhicule, contact.
- Enregistrement dans `leads` + email au client (contact@automobilesurmesure.com) avec les photos en pièces jointes ou en liens.
- Accusé de réception automatique au visiteur.
- Anti-spam : champ caché + limitation de fréquence (ou Turnstile).

## 10. SEO local

- Titres et descriptions par page, une page par service.
- Données structurées : `AutoDealer` (LocalBusiness) sur le site, `Car` / `Offer` sur chaque fiche.
- Sitemap XML automatique (véhicules en ligne inclus), robots.txt.
- Images nommées et décrites (alt) automatiquement à partir de la fiche.
- Redirections 301 depuis les anciennes URL Wix (`/stock`, pages `copie-de-*`, fiches produits).
- Mise à jour de la fiche Google (horaires, site, photos, catégorie « Concessionnaire automobile »).

## 11. Stack technique

- Next.js 15 (App Router) + Payload CMS v3 dans le même projet.
- Base de données : Postgres (Neon) ou MongoDB Atlas.
- Stockage des images : S3 compatible ou Vercel Blob.
- Hébergement : Vercel.
- Emails : Resend ou SMTP du client.
- Polices : Cormorant Garamond + Montserrat via `next/font`.

## 12. Données de départ

`data/vehicules.json` contient les 20 véhicules relevés sur la page 1 du stock actuel (marque, modèle, année, km, prix). La page 2 n'a pas été relevée. Script d'import à prévoir, ou saisie par le client depuis le back-office.

## 13. Planning (3 à 4 semaines après acompte et réception des contenus)

| Semaine | Travail |
|---|---|
| 1 | Validation maquette, mise en place Next.js + Payload, collections, import du stock |
| 2 | Pages publiques : accueil, catalogue, fiche, dépôt-vente, services |
| 3 | Formulaires, notifications, traitement photos, back-office |
| 4 | SEO, redirections, recette avec le client, mise en ligne, formation |

## 14. Devis

DEV-2026-ASM-001, 2 500 € net (TVA non applicable, art. 293 B du CGI), valable jusqu'au 20/12/2026.

| N° | Prestation | Montant |
|---|---|---|
| 01 | Conception graphique sur mesure | 500 € |
| 02 | Création du site vitrine premium | 650 € |
| 03 | Catalogue de véhicules administrable | 450 € |
| 04 | Traitement automatique des photos | 250 € |
| 05 | Formulaires et prise de rendez-vous | 250 € |
| 06 | Référencement local | 250 € |
| 07 | Mise en ligne et prise en main | 150 € |

Règlement : 30 % à la signature (750 €), solde à la mise en ligne (1 750 €). [À CONFIRMER]
Non inclus : hébergement et nom de domaine. [À CONFIRMER]

## 15. À récupérer auprès du client

- Photos originales en haute définition (celles de la maquette sont des captures basse résolution du site actuel).
- Accès au nom de domaine (pour la bascule depuis Wix).
- Fiche complète de chaque véhicule : couleur, options, garantie, description.
- Textes de la page « La société », vidéos, avis clients.
- Fond showroom souhaité pour le traitement des photos.
- Mentions légales : raison sociale, SIRET, responsable de publication.

## 16. Contenu de l'archive

```
PROJET.md                     ce document
devis/                        devis PDF
maquette/                     sources des 5 écrans (format Claude Design, images en chemins relatifs)
assets/logo-asm.jpg           logo du client
assets/photos/                photos récupérées sur le site actuel (basse résolution)
data/vehicules.json           stock relevé sur le site actuel
```
