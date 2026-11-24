# Automobile sur Mesure

Maquette du site, brief et devis. Le site public sert les écrans de `maquette/`.

| Adresse | Écran |
|---|---|
| `/` | Accueil |
| `/vehicules` | Nos véhicules |
| `/depot-vente` | Dépôt-vente |
| `/fiche` | Fiche véhicule |
| `/admin` | Back-office |

Les photos sont dans `assets/photos/`, le stock relevé dans `data/vehicules.json`, le brief dans `PROJET.md`, le devis dans `devis/`.

## Lancer en local

```bash
python -m http.server 4173
```

Puis ouvrir `http://localhost:4173/maquette/accueil.dc.html`.
