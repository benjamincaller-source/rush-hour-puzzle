# Rush Hour Puzzle - Guide de publication App Store

## Prérequis

### 1. Installer Xcode (obligatoire)
```bash
# Depuis le Mac App Store, installer "Xcode" (gratuit, ~12 Go)
# Après installation, ouvrir Xcode une première fois pour installer les composants
# Puis configurer la ligne de commande :
sudo xcode-select --switch /Applications/Xcode.app/Contents/Developer
```

### 2. Compte Apple Developer (obligatoire pour l'App Store)
- Aller sur https://developer.apple.com/programs/
- S'inscrire au programme Apple Developer (**99 $/an**)
- Attendre la validation (24-48h)

### 3. Installer CocoaPods (si nécessaire)
```bash
sudo gem install cocoapods
```

---

## Étapes pour publier

### Étape 1 : Ouvrir le projet dans Xcode
```bash
cd ~/rush-hour-puzzle
npm run cap:sync    # Synchronise les assets web vers iOS
npm run cap:open    # Ouvre le projet Xcode
```

### Étape 2 : Configurer le signing dans Xcode
1. Dans Xcode, cliquer sur **App** dans le navigateur de projet (icône bleue)
2. Onglet **Signing & Capabilities**
3. Cocher **Automatically manage signing**
4. Sélectionner votre **Team** (votre compte Apple Developer)
5. Le **Bundle Identifier** est déjà configuré : `com.benjamincaller.rushhour`
   - Si ce bundle ID est déjà pris, changez-le (ex: `com.votredomaine.rushhour`)

### Étape 3 : Tester sur simulateur
1. En haut de Xcode, choisir un simulateur (ex: "iPhone 16")
2. Cliquer sur ▶ (Run) ou `Cmd+R`
3. L'app devrait se lancer dans le simulateur

### Étape 4 : Tester sur un vrai appareil (recommandé)
1. Brancher votre iPhone/iPad en USB
2. Le sélectionner comme destination en haut de Xcode
3. Cliquer sur ▶ (Run)
4. La première fois, aller sur iPhone dans **Réglages > Général > Gestion des appareils** pour faire confiance au certificat

### Étape 5 : Préparer pour l'App Store

#### Dans Xcode :
1. Sélectionner **App** > onglet **General**
2. Vérifier :
   - **Display Name** : `Rush Hour Puzzle`
   - **Version** : `1.0.0`
   - **Build** : `1`
3. Sélectionner **Any iOS Device** comme destination
4. Menu **Product > Archive**
5. Une fois l'archive créée, cliquer **Distribute App**
6. Choisir **App Store Connect** > **Upload**

#### Dans App Store Connect (https://appstoreconnect.apple.com) :
1. **Mes apps** > **+** > **Nouvelle app**
2. Remplir :
   - **Nom** : Rush Hour Puzzle
   - **Langue principale** : Français (ou English)
   - **Bundle ID** : com.benjamincaller.rushhour
   - **SKU** : rushhourpuzzle
3. Remplir les métadonnées :

**Description (suggestion)** :
> Libérez la voiture rouge ! Rush Hour est un puzzle de logique classique avec 140 niveaux
> répartis en 4 difficultés (Débutant, Intermédiaire, Avancé, Expert).
>
> Déplacez les véhicules pour créer un chemin vers la sortie.
> Utilisez l'indice si vous êtes bloqué, ou regardez la solution automatique.
>
> Caractéristiques :
> • 140 niveaux de difficulté croissante
> • Glisser-déposer intuitif
> • Système d'indices et résolution automatique
> • Sauvegarde de progression
> • Design soigné avec animations 3D CSS

**Mots-clés** : puzzle, rush hour, logique, voiture, casse-tête, sliding, block, jeu

**Catégorie** : Jeux > Puzzle

**Classification** : 4+ (pas de contenu sensible)

4. Ajouter des **captures d'écran** (obligatoire) :
   - iPhone 6.9" (iPhone 16 Pro Max) : 1320 x 2868 px
   - iPad 13" (iPad Pro) : 2064 x 2752 px
   - Utiliser le simulateur Xcode pour capturer (`Cmd+S` dans le simulateur)

5. Soumettre pour **Review** (relecture Apple, 24-48h en général)

---

## Commandes utiles

```bash
# Reconstruire et synchroniser après modification du HTML
npm run cap:sync

# Ouvrir dans Xcode
npm run cap:open

# Lancer sur un appareil connecté
npm run cap:run

# Régénérer l'icône
node generate-icon.mjs

# Régénérer le splash screen
node generate-splash.mjs
```

---

## Structure du projet

```
rush-hour-puzzle/
├── index.html              ← Votre jeu (source de vérité)
├── www/                    ← Copie pour Capacitor (auto-généré)
├── capacitor.config.ts     ← Configuration Capacitor
├── ios/                    ← Projet Xcode natif
│   └── App/
│       ├── App.xcodeproj   ← Ouvrir ceci avec Xcode
│       └── App/
│           ├── public/     ← Assets web copiés par Capacitor
│           ├── Assets.xcassets/
│           │   ├── AppIcon.appiconset/   ← Icône de l'app
│           │   └── Splash.imageset/      ← Écran de démarrage
│           └── Info.plist
├── generate-icon.mjs       ← Génère l'icône 1024x1024
├── generate-splash.mjs     ← Génère le splash screen
└── APP_STORE_GUIDE.md      ← Ce guide
```

## Notes importantes

- **Chaque modification de `index.html`** nécessite `npm run cap:sync` pour être reflétée dans l'app iOS
- Le **Bundle ID** (`com.benjamincaller.rushhour`) doit être unique sur l'App Store
- Apple rejette les apps qui sont de simples "web views" sans valeur ajoutée. Rush Hour est un jeu complet avec 140 niveaux, un solveur, et des animations — cela devrait passer sans problème
- L'app fonctionne **100% hors ligne** (pas de serveur), ce qui est un plus pour Apple
