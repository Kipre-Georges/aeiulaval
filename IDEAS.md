# 💡 Idées & Backlog — AEIULAVAL

Fichier de travail pour noter les idées d'amélioration, fonctionnalités à ajouter, et
améliorations techniques. Pour chaque idée : statut, priorité, et notes d'implémentation.

Statuts : 🆕 nouveau · 🚧 en cours · ✅ fait · ❄️ glacé

---

## 📥 Nouvelles idées (16 mai 2026)

### 🆕 Page dédiée "Installer l'application"
**Priorité : moyenne**
Une page accessible via `/installer` (ou similaire) qui explique pas à pas comment installer
la PWA selon l'appareil de l'utilisateur :

- 💻 Ordinateur Windows (Chrome, Edge, Firefox)
- 🍎 Mac (Safari, Chrome)
- 📱 iPhone / iPad (Safari obligatoire)
- 📱 Android (Chrome, Samsung Internet, Brave)

**Idées d'implémentation**
- Détection automatique du device → afficher la bonne procédure en avant
- Possibilité de voir les autres procédures dans des accordéons / onglets
- Captures d'écran / illustrations pour chaque étape (reprendre les visuels des PDF manuels)
- Bouton "Télécharger le PDF" pour avoir une version offline du guide
- Section FAQ : "Ça ne marche pas, que faire ?"

---

### 🆕 Onglet "Dernières notifications" (centre de notifications in-app)
**Priorité : moyenne**
Un petit menu / panneau accessible depuis la nav ou un icône cloche qui affiche les
dernières notifications OneSignal envoyées. Permet aux utilisateurs de :
- Consulter les notifs reçues même s'ils les ont manquées
- Voir un historique des annonces de l'asso
- Cliquer sur une notif pour aller à l'event correspondant

**Idées d'implémentation**
- OneSignal a une API REST pour lister les notifications envoyées par l'app
- Récupérer la liste au chargement (cache 5 min côté navigateur)
- Affichage : badge avec compteur sur l'icône cloche, panneau qui s'ouvre au clic
- Persistance côté local : marquer les notifs comme lues (localStorage)
- Style : liste verticale, titre + body + date + lien si applicable
- Note technique : la REST API OneSignal nécessite un User Auth Key (secret) → impossible
  côté frontend statique pur. Solutions possibles :
  - Netlify Function pour proxy les appels (recommandé)
  - OneSignal a un endpoint public limité ?
  - Alternative : tenir un fichier `content/notifications.json` mis à jour via le CMS
    quand on envoie une notif (manuel mais simple)

---

## 🚀 Idées prioritaires (du brainstorm précédent)

### 🆕 Auto-update intelligente du PWA
**Priorité : haute (discuté le 16 mai)**
Améliorer le Service Worker pour :
- Activer immédiatement la nouvelle version sans attendre la fermeture
- Détecter automatiquement les nouvelles versions en arrière-plan
- Afficher une petite bannière "Nouvelle version disponible" avec bouton "Mettre à jour"

**Effort : ~50 lignes, 10 min**

---

### 🆕 Inscription en ligne aux événements
**Priorité : haute**
Permettre aux visiteurs de s'inscrire à un événement :
- Formulaire simple (nom, email, +1 ?)
- Envoi d'un email au bureau de l'asso (via Formspree ou Netlify Forms)
- Compteur "X personnes inscrites" sur la fiche event
- Liste des inscrits accessible via un Google Sheet ou directement dans le CMS

---

### 🆕 Petites annonces étudiantes
**Priorité : haute (fort impact)**
Section pour logement, covoiturage, vente entre étudiants ivoiriens.
- Catégories : Logement, Colocation, Covoiturage, Vente, Service, Recherche
- Champ par annonce : titre, description, prix, contact, photo, date d'expiration
- Modération par le bureau de l'asso via le CMS
- Idéalement filtrage / recherche

---

### 🆕 Chatbot Akwaba (IA)
**Priorité : haute (différenciateur fort)**
Assistant IA qui répond aux questions des nouveaux arrivants :
- Logement, immigration, démarches université, vie à Québec
- Bulle de chat en bas à droite
- Stack : Claude API ou OpenAI via Netlify Function
- Coût : ~5$/mois en usage léger
- L'IA aurait accès au contenu du site (ressources, événements) en contexte

---

## 🌟 Idées identitaires "Akwaba spirit"

### ❄️ Akwaba Box (mot Nouchi + recette + son)
Construite puis retirée le 16 mai. À retravailler avec un meilleur design éventuellement.

### ❄️ Carte interactive "D'où viennent les Ivoiriens de Laval"
Construite puis retirée le 16 mai. Concept à garder en tête, peut-être avec une vraie
carte vectorielle GeoJSON plus tard.

### 🆕 Mur des témoignages
Faire défiler horizontalement des témoignages d'anciens membres avec photo.

### 🆕 Playlist Spotify embarquée
Une playlist collaborative de l'asso, embed Spotify dans une section dédiée.

### 🆕 Compte à rebours animé
Vers le prochain event, en gros sur la page d'accueil (J-12 avant la Soirée Garba).

### 🆕 Mode "Harmattan" vs "Hiver québécois"
Toggle de thème complet avec ambiance qui change selon la saison choisie.

### 🆕 Custom cursor 🇨🇮
Curseur avec petit drapeau sur les sections clés.

---

## ⚡ Quick wins (1h chacun)

### 🆕 Boutons partage sur events
WhatsApp, Facebook, copier le lien, partager natif (Web Share API mobile).

### 🆕 Téléchargement .ics
Bouton "Ajouter à mon calendrier" qui génère un fichier .ics pour chaque event.

### 🆕 QR code par event
Générer dynamiquement un QR code qui pointe vers la page de l'event, pour partager
en physique (flyers, affiches).

### 🆕 Newsletter
Intégration Mailchimp / Buttondown pour collecter les emails.

### 🆕 Section Sponsors/Partenaires
Dans le footer ou page dédiée. Avec logos.

---

## 🏗️ Gros morceaux

### 🆕 Adhésion + cotisation en ligne (Stripe)
Devenir membre officiel avec paiement Stripe. Donne accès à des avantages.

### 🆕 Espace membre privé
Login, profil, événements personnalisés, badges, historique participation.

### 🆕 Multilangue FR/EN
Pour les anglophones de Laval.

### 🆕 Forum / discussions
Categories : Vie étudiante, Côte d'Ivoire, Évents, etc.

---

## 🛠️ Améliorations techniques

### 🆕 Netlify Image CDN
Automatiquement compresser / convertir en WebP toutes les images uploadées par le CMS.
Format URL : `/.netlify/images?url=/path&w=800&q=80`.

### 🆕 Compression auto à l'upload
Script qui compresse les images > 1 Mo automatiquement avant qu'elles soient commitées.

### 🆕 Sentry ou autre monitoring
Capturer les erreurs JS en production pour debug.

### 🆕 Tests E2E avec Playwright
Tester automatiquement les parcours critiques (install PWA, abonnement notif, etc.).

---

## ✅ Déjà fait

- ✅ CMS Decap complet avec sections dynamiques
- ✅ Thème personnalisable (couleurs + polices) depuis le CMS
- ✅ Section Bureau galactique
- ✅ SEO complet (sitemap, robots, Schema.org Organization + Event, OG image)
- ✅ Accessibilité (ARIA, contraste WCAG AA, focus visible, touch targets 44+ px)
- ✅ Responsive complet (3 breakpoints)
- ✅ PWA installable (manifest, icônes dynamiques)
- ✅ Service Worker avec cache offline
- ✅ Install prompt custom (Android + iOS)
- ✅ Notifications push via OneSignal
- ✅ Toast in-app quand notif arrive en foreground
- ✅ Sécurité hardened (CSP, HSTS, X-Frame, Permissions-Policy, rehype-sanitize)
- ✅ Performance (image compressée 8.5 Mo → 134 Ko, content-visibility, GPU layers)
- ✅ Affiliation Université Laval (logo officiel SVG)
- ✅ Police corporate (Plus Jakarta Sans + Inter)
- ✅ Crédit "le fils de Akouba" en gradient

---

## 📒 Notes diverses

- L'image Sadio Mané initiale faisait 8.5 Mo et plombait le score Lighthouse à 59.
  Maintenant 134 Ko, le score devrait remonter franchement.
- 5 abonnés OneSignal au 16 mai (1 Chrome + 4 Apple Web).
- Le score Mozilla Observatory était à C/50 puis remonté avec netlify.toml.
- Polices changées en Plus Jakarta Sans / Inter pour un look plus corporate.
