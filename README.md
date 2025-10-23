# 💕 Senior Love - Frontend

![React](https://img.shields.io/badge/React-19.1.0-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-3178C6?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-7.0.3-646CFF?logo=vite)
![Sass](https://img.shields.io/badge/Sass-1.89.2-CC6699?logo=sass)

**Senior Love** est une plateforme de rencontre dédiée aux seniors, conçue pour faciliter les connexions authentiques entre personnes de 60 ans et plus. L'application offre une interface moderne et accessible, permettant de créer un profil, rechercher des partenaires compatibles, participer à des événements et échanger par messagerie.

> 🤝 **Projet réalisé en binôme avec Emmanuelle Eiselé**  
> Le backend de ce projet est disponible sur le portfolio d'Emmanuelle Eiselé.

---

## 📋 Table des matières

- [Fonctionnalités principales](#-fonctionnalités-principales)
- [Technologies utilisées](#-technologies-utilisées)
- [Architecture & Authentification](#-architecture--authentification)
- [Installation](#-installation)
- [Routes principales](#-routes-principales)
- [Exemples de requêtes API](#-exemples-de-requêtes-api)
- [Structure du projet](#-structure-du-projet)
- [Déploiement](#-déploiement)

---

## ✨ Fonctionnalités principales

### 👤 Gestion des utilisateurs
- **Inscription & Connexion** : Création de compte avec validation des données
- **Profil personnalisé** : Modification des informations personnelles, avatar, centres d'intérêt
- **Recherche de profils** : Filtrage par âge, localisation, centres d'intérêt
- **Vues de profils** : Consultation des profils d'autres utilisateurs

### 💬 Messagerie
- **Conversations privées** : Échange de messages asynchrones
- **Liste de contacts** : Gestion des conversations actives


### 🎉 Événements
- **Participation** : Inscription aux événements
- **Recherche** : Filtrage par localisation

### 🔒 Administration
- **Dashboard admin** : Gestion des utilisateurs et modération
- **Statistiques** : Vue d'ensemble de l'activité de la plateforme
- **Evenements** : Création, modification suppression d'événements.

---

## 🛠 Technologies utilisées

### Core
- **[React](https://react.dev/)** `19.1.0` - Bibliothèque JavaScript pour construire l'interface utilisateur
- **[TypeScript](https://www.typescriptlang.org/)** `5.8.3` - Typage statique pour JavaScript
- **[Vite](https://vitejs.dev/)** `7.0.3` - Build tool ultra-rapide

### Routing & State
- **[React Router DOM](https://reactrouter.com/)** `7.6.3` - Navigation côté client
- **React Hooks** - Gestion d'état (useState, useEffect, etc.)

### HTTP & Authentification
- **[Axios](https://axios-http.com/)** `1.10.0` - Client HTTP avec intercepteurs
- **JWT + Refresh Token** - Authentification sécurisée avec renouvellement automatique

### Styling
- **[Sass](https://sass-lang.com/)** `1.89.2` - Préprocesseur CSS
- **Architecture SCSS modulaire** - Organisation par composants et éléments

### UI & Icônes
- **[Lucide React](https://lucide.dev/)** `0.525.0` - Bibliothèque d'icônes modernes

### Analytics & Monitoring
- **[Vercel Analytics](https://vercel.com/analytics)** `1.5.0` - Analyse du trafic et performances

### Qualité du code
- **[ESLint](https://eslint.org/)** `9.31.0` - Linter JavaScript/TypeScript
- **TypeScript ESLint** `8.36.0` - Règles ESLint pour TypeScript

### Gestionnaire de paquets
- **[pnpm](https://pnpm.io/)** `10.13.1` - Gestionnaire de paquets performant

---

## 🔐 Architecture & Authentification

### Système d'authentification avec Refresh Token

L'application utilise un système moderne d'authentification basé sur **JWT** avec **Refresh Token** pour une sécurité optimale :

#### Fonctionnement

1. **Connexion initiale** :
   - L'utilisateur se connecte avec email/mot de passe
   - Le backend renvoie :
     - Un **Access Token** (JWT, durée courte ~15min) stocké dans `localStorage`
     - Un **Refresh Token** (durée longue ~7 jours) stocké dans un cookie **HttpOnly**

2. **Requêtes authentifiées** :
   - Chaque requête API inclut automatiquement l'Access Token dans l'en-tête `Authorization: Bearer <token>`
   - Les cookies sont envoyés automatiquement grâce à `withCredentials: true`

3. **Renouvellement automatique** :
   - Si l'API renvoie une erreur `401 Unauthorized`, l'intercepteur Axios :
     - Met les requêtes en file d'attente
     - Appelle automatiquement `/refresh-token` avec le Refresh Token (cookie)
     - Récupère un nouvel Access Token
     - Rejoue toutes les requêtes en attente avec le nouveau token
   - Si le Refresh Token est expiré/invalide → déconnexion automatique

4. **Déconnexion** :
   - Appel à `/logout` pour supprimer le Refresh Token côté serveur
   - Nettoyage du `localStorage`

#### Avantages de cette approche

- ✅ **Sécurité renforcée** : Le Refresh Token n'est jamais accessible en JavaScript (HttpOnly cookie)
- ✅ **Expérience utilisateur fluide** : Pas de déconnexion brutale, renouvellement transparent
- ✅ **Protection XSS** : Les cookies HttpOnly ne peuvent pas être volés par injection de script
- ✅ **Gestion des sessions multiples** : File d'attente pour éviter les appels simultanés

#### Implémentation (src/utils/auth.ts)

```typescript
// Intercepteur pour ajouter le token à chaque requête
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Intercepteur pour gérer le refresh automatique
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Tentative de refresh automatique
      const response = await api.post('/refresh-token');
      localStorage.setItem('accessToken', response.data.token);
      // Rejouer la requête originale
      return api(originalRequest);
    }
    return Promise.reject(error);
  }
);
```

---

## 📦 Installation

### Prérequis

- **Node.js** : Version 18 ou supérieure
- **pnpm** : Gestionnaire de paquets (recommandé)

### Étapes

1. **Cloner le repository**

```bash
git clone https://github.com/MarineLigny/SeniorLove-front.git
cd SeniorLove-front
```

2. **Installer pnpm (si non installé)**

```bash
npm install -g pnpm
```

3. **Installer les dépendances**

```bash
pnpm install
```

4. **Configuration de l'environnement**

Le backend est configuré pour pointer vers : `https://seniorlove-back-znlu.onrender.com`  
(Vous pouvez modifier l'URL dans `src/utils/auth.ts` si nécessaire)

5. **Lancer le serveur de développement**

```bash
pnpm dev
```

L'application sera accessible sur **http://localhost:5173**

### Commandes disponibles

```bash
# Développement
pnpm dev          # Lance le serveur de développement

# Build
pnpm build        # Compile le projet pour la production

# Linting
pnpm lint         # Vérifie le code avec ESLint

# Preview
pnpm preview      # Prévisualise le build de production
```

---

## 🗺 Routes principales

### Routes publiques

| Route | Composant | Description |
|-------|-----------|-------------|
| `/` | `HomePage` | Page d'accueil avec présentation |
| `/confidentiality` | `Confidentiality` | Politique de confidentialité |
| `*` | `NotFoundPage` | Page 404 |

### Routes utilisateur authentifié

| Route | Composant | Description |
|-------|-----------|-------------|
| `/profile` | `ProfilePage` | Profil de l'utilisateur connecté |
| `/profile/:pseudo` | `ProfilPageViewer` | Affichage du profil d'un autre utilisateur |
| `/meet` | `MeetPage` | Page de recherche de profils |
| `/mymessage` | `MyMessagePage` | Liste des conversations |
| `/message/:contactId` | `ConversationPage` | Conversation avec un utilisateur |
| `/event` | `EventsPage` | Liste des événements |
| `/event/:id` | `EventPage` | Détails d'un événement |

### Routes admin

| Route | Composant | Description |
|-------|-----------|-------------|
| `/dashboard` | `Dashboard` | Panneau d'administration (réservé aux admins) |

---

## 🔌 Exemples de requêtes API

### Authentification

```typescript
// Connexion
POST /login
Body: { email: string, password: string }
Response: { token: string, user: UserObject }
+ Cookie: refreshToken (HttpOnly)

// Inscription
POST /register
Body: { email, password, pseudo, birthdate, gender, ... }
Response: { message: string }

// Refresh token (automatique)
POST /refresh-token
Cookies: refreshToken
Response: { token: string }

// Déconnexion
POST /logout
Cookies: refreshToken
Response: { message: string }
```

### Profil utilisateur (CRUD)

```typescript
// Récupérer mon profil
GET /myprofile
Headers: Authorization: Bearer <token>
Response: UserObject

// Modifier mon profil
PUT /myprofile
Headers: Authorization: Bearer <token>
Body: { pseudo?, bio?, city?, interests?, ... }
Response: { message: string, user: UserObject }

// Supprimer mon compte
DELETE /myprofile
Headers: Authorization: Bearer <token>
Response: { message: string }

// Voir un profil public
GET /profile/:pseudo
Headers: Authorization: Bearer <token>
Response: PublicUserObject
```

### Recherche de profils

```typescript
// Rechercher des profils avec filtres
GET /meet?gender=female&ageMin=50&ageMax=70&city=Paris&interests=cinema,voyage
Headers: Authorization: Bearer <token>
Response: UserObject[]
```

### Événements (CRUD)

```typescript
// Liste des événements
GET /event
Headers: Authorization: Bearer <token>
Response: EventObject[]

// Créer un événement
POST /event
Headers: Authorization: Bearer <token>
Body: { title, description, date, location, category }
Response: { message: string, event: EventObject }

// Détails d'un événement
GET /event/:id
Headers: Authorization: Bearer <token>
Response: EventObject

// Modifier un événement
PUT /event/:id
Headers: Authorization: Bearer <token>
Body: { title?, description?, date?, ... }
Response: { message: string, event: EventObject }

// Supprimer un événement
DELETE /event/:id
Headers: Authorization: Bearer <token>
Response: { message: string }

// Participer à un événement
POST /event/:id/participate
Headers: Authorization: Bearer <token>
Response: { message: string }
```

### Messagerie

```typescript
// Liste des conversations
GET /mymessage
Headers: Authorization: Bearer <token>
Response: ConversationObject[]

// Messages d'une conversation
GET /message/:contactId
Headers: Authorization: Bearer <token>
Response: MessageObject[]

// Envoyer un message
POST /message/:contactId
Headers: Authorization: Bearer <token>
Body: { content: string }
Response: { message: string, data: MessageObject }
```

---

## 📁 Structure du projet

```
senior-love-front/
├── public/                      # Assets statiques
│   └── img/                     # Images (avatars, photos)
├── src/
│   ├── @types/                  # Définitions TypeScript
│   │   ├── events.d.ts          # Types pour les événements
│   │   ├── interest.d.ts        # Types pour les centres d'intérêt
│   │   ├── message.d.ts         # Types pour la messagerie
│   │   ├── navbar.d.ts          # Types pour la navbar
│   │   └── users.d.ts           # Types pour les utilisateurs
│   │
│   ├── components/              # Composants réutilisables
│   │   ├── EventCard.tsx        # Carte d'événement
│   │   ├── FilterBar.tsx        # Barre de filtres
│   │   ├── Footer.tsx           # Pied de page
│   │   ├── Loader.tsx           # Indicateur de chargement
│   │   ├── ModalAddEvent.tsx    # Modal de création d'événement
│   │   ├── ModalLogin.tsx       # Modal de connexion
│   │   ├── ModalRegister.tsx    # Modal d'inscription
│   │   ├── MyEventCard.tsx      # Carte "Mes événements"
│   │   ├── MyMessageCard.tsx    # Carte de conversation
│   │   ├── NavBar.tsx           # Barre de navigation
│   │   ├── PrivateRoute.tsx     # Route protégée
│   │   ├── updateEvent.tsx      # Modal de modification d'événement
│   │   └── UserCard.tsx         # Carte de profil utilisateur
│   │
│   ├── pages/                   # Pages de l'application
│   │   ├── 404/                 # Page 404
│   │   ├── Conversation/        # Page de conversation
│   │   ├── Event/               # Détails d'un événement
│   │   ├── Events/              # Liste des événements
│   │   ├── HomePage/            # Page d'accueil
│   │   ├── Meet/                # Recherche de profils
│   │   ├── Meet-Profils/        # Liste des conversations
│   │   ├── MyProfile/           # Mon profil
│   │   ├── ProfilViewers/       # Profil d'un autre utilisateur
│   │   ├── Confidentiality.tsx  # Confidentialité
│   │   └── Dashboard.tsx        # Dashboard admin
│   │
│   ├── scss/                    # Styles SCSS
│   │   ├── base/                # Styles de base
│   │   │   ├── _variable.scss   # Variables CSS
│   │   │   └── reset.scss       # Reset CSS
│   │   ├── elements/            # Styles des composants
│   │   │   ├── btn.scss         # Boutons
│   │   │   ├── footer.scss      # Pied de page
│   │   │   ├── loader.scss      # Loader
│   │   │   ├── modals.scss      # Modales
│   │   │   ├── navbar.scss      # Navbar
│   │   │   ├── searchBar.scss   # Barre de recherche
│   │   │   └── userCard.scss    # Cartes utilisateur
│   │   └── style.scss           # Import principal
│   │
│   ├── utils/                   # Utilitaires
│   │   ├── auth.ts              # Service d'authentification + Axios
│   │   ├── calculateAge.tsx     # Calcul d'âge
│   │   └── unescape.tsx         # Décodage HTML
│   │
│   ├── App.tsx                  # Composant principal
│   ├── main.tsx                 # Point d'entrée
│   ├── index.scss               # Styles globaux
│   └── vite-env.d.ts            # Types Vite
│
├── eslint.config.js             # Configuration ESLint
├── index.html                   # Template HTML
├── package.json                 # Dépendances npm
├── pnpm-lock.yaml               # Lockfile pnpm
├── tsconfig.json                # Configuration TypeScript
├── vite.config.ts               # Configuration Vite
└── vercel.json                  # Configuration Vercel
```

---

## 🚀 Déploiement

L'application est optimisée pour le déploiement sur **Vercel** :

```bash
# Build de production
pnpm build

# Les fichiers compilés se trouvent dans dist/
```

Le fichier `vercel.json` configure le routage pour React Router.

---

## 👥 Équipe

**Projet réalisé en binôme** :
- **Marine Ligny** - Backend + Frontend (ce repository)
- **Emmanuelle Eiselé** - Frontend + Backend ([Voir son portfolio](https://github.com/EmmanuelleEisele)) // voir la maquette Figma ([Figma](https://www.figma.com/design/d7HFWC2Nk0u54pGNRu5gLK/SeniorLove?node-id=0-1&p=f&t=yB58B1DGX0syeheJ-0))

---

## 📄 Licence

Ce projet est un projet étudiant réalisé dans le cadre d'une formation en développement web.

---

## 🙏 Remerciements

- École O'Clock pour l'accompagnement
- La communauté React et TypeScript
- Tous les testeurs et utilisateurs

---

**Fait avec ❤️ pour les seniors**
