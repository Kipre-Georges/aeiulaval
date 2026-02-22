# Site AEIULAVAL — On est ensemble !

Bon dèh, c'est le site web de l'Association des Étudiants Ivoiriens à l'Université Laval. Le truc est trop bien : n'importe quel membre du bureau peut modifier le site sans savoir coder. Tu cliques, tu modifies, c'est réglé !

## Comment ça marche ?

Le site utilise :
- **Next.js** — pour que le site charge vite vite
- **Decap CMS** — un tableau de bord où tu peux tout modifier facilement
- **Netlify** — hébergement gratuit (oui oui, gratuit !)
- **GitHub** — pour sauvegarder tout le contenu

## Mettre le site en ligne (même si tu connais rien)

### Étape 1 : Créer le dépôt GitHub

Si tu es là, c'est que normalement c'est déjà fait. Mais si jamais :

```bash
cd aeiulaval
git init
git add .
git commit -m "Mon premier commit"
git push
```

### Étape 2 : Déployer sur Netlify

1. Va sur [app.netlify.com](https://app.netlify.com) et connecte-toi
2. Clique sur **"Add new site"** puis **"Import an existing project"**
3. Connecte ton compte GitHub et choisis le repo `aeiulaval`
4. Configuration :
   - **Build command** : `npm run build`
   - **Publish directory** : `out`
5. Clique sur **Deploy** et attends 2-3 minutes

C'est tout ! Ton site est en ligne.

### Étape 3 : Activer l'administration

Pour que le bureau puisse modifier le site :

1. Dans ton tableau de bord Netlify, va dans **Site configuration → Identity**
2. Clique **Enable Identity**
3. Sous **Registration**, mets **Invite only** (comme ça n'importe qui peut pas entrer)
4. Sous **Services → Git Gateway**, active **Enable Git Gateway**

### Étape 4 : Inviter les membres du bureau

1. Va dans **Identity → Invite users**
2. Entre les emails des gars du bureau
3. Ils vont recevoir un email, ils cliquent dessus et c'est bon

### Étape 5 : Modifier le contenu

Une fois que tout est configuré, les membres peuvent aller sur :

```
https://ton-site.netlify.app/admin/
```

Là-bas on peut modifier :
- Les infos du site (nom, description, numéros WhatsApp, etc.)
- Les membres du bureau
- Les événements (soirées, ateliers, tout ça)
- Les guides pour les nouveaux (logement, immigration, santé...)
- Les articles de blog
- Les photos des événements

Même pas compliqué !

## Les pages du site

| Page | C'est quoi ? |
|-----|-------------|
| `/` | Page d'accueil avec tout : événements, ressources, contact |
| `/evenements` | Tous les événements de l'association |
| `/evenements/[nom]` | Les détails d'un événement |
| `/ressources` | Guides pratiques pour les nouveaux |
| `/ressources/[nom]` | Détail d'un guide |
| `/blog` | Les actualités |
| `/blog/[nom]` | Un article complet |
| `/galerie` | Albums photos |
| `/galerie/[nom]` | Photos d'un événement |
| `/admin/` | Le tableau de bord pour modifier le site |

## Pour les développeurs

Si tu veux modifier le code ou tester en local :

```bash
# Installer ce qu'il faut
npm install

# Lancer le site sur ton ordi
npm run dev
```

Après tu vas sur `http://localhost:3000` et tu verras le site.

### Tester le CMS en local

Si tu veux tester le tableau de bord sans déployer sur Netlify :

```bash
# Terminal 1
npm run dev

# Terminal 2 (ouvre un autre terminal)
npm run cms
```

Va sur `http://localhost:3000/admin/` et tu pourras modifier le contenu.

**Note** : Après le déploiement Netlify, pense à réactiver `git-gateway` dans `public/admin/config.yml`.

## Où sont stockés les contenus ?

```
content/
├── settings/       → Les paramètres du site
├── bureau/         → Les membres du bureau (1 fichier par personne)
├── events/         → Les événements
├── resources/      → Les guides pour nouveaux
├── blog/           → Les articles
└── gallery/        → Les albums photos
```

Tout est dans des fichiers texte. Tu peux les modifier directement ou passer par le CMS.

## Personnaliser le site

### Changer les couleurs

Les couleurs sont dans `src/app/globals.css` :
```css
--orange: #E8611A;   /* Orange du drapeau */
--green: #009A44;    /* Vert du drapeau */
--cream: #FFF9F3;    /* Fond clair */
--dark: #1A1108;     /* Texte foncé */
```

### Ajouter un logo

Remplace le drapeau dans `src/components/Nav.tsx` par ton logo.

### Avoir ton propre nom de domaine

Dans Netlify : **Domain management → Add custom domain** et suis les instructions.

## Passation de pouvoir

Quand le bureau change en fin d'année :

1. Le nouveau président récupère l'accès GitHub et Netlify
2. Tu retires les anciens membres dans **Netlify → Identity**
3. Tu invites les nouveaux membres
4. Et voilà, on continue !

Le site continuera à tourner tranquillement, aucun stress.

---

Fait pour la communauté ivoirienne de Laval. On est ensemble !
