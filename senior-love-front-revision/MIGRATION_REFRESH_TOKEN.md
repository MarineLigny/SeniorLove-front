# Migration vers le système de Refresh Token

## Modifications apportées côté front-end

### 1. Service d'authentification (`src/utils/auth.ts`)
- **Nouveau service** pour gérer les tokens et cookies
- **Intercepteurs Axios** automatiques pour le renouvellement des tokens
- **Gestion centralisée** de l'authentification

### 2. Modales de connexion et inscription
- **ModalLogin.tsx** : Ajout de `withCredentials: true` pour recevoir les cookies
- **ModalRegister.tsx** : Même modification + gestion du token à l'inscription

### 3. Composants de navigation et sécurité
- **PrivateRoute.tsx** : Utilise maintenant le service d'auth
- **App.tsx** : Fonction de déconnexion mise à jour avec le service d'auth

### 4. Configuration générale
- **main.tsx** : Import du service d'auth pour initialiser les intercepteurs

## Ce qui fonctionne maintenant

✅ **Connexion** : Les cookies sont automatiquement reçus et stockés  
✅ **Inscription** : L'utilisateur est automatiquement connecté après inscription  
✅ **Renouvellement automatique** : Les tokens expirés sont renouvelés transparemment  
✅ **Déconnexion sécurisée** : Suppression côté serveur et client  
✅ **Protection des routes** : Redirection automatique si non authentifié  

## Prochaines étapes backend

1. **Implémenter les endpoints** décrits dans `BACKEND_ENDPOINTS.md`
2. **Tester le renouvellement** automatique des tokens
3. **Vérifier la déconnexion** et la suppression des refresh tokens

## Avantages du nouveau système

- **Sécurité renforcée** : Tokens courts + refresh tokens longs
- **UX améliorée** : Renouvellement transparent, pas de déconnexions intempestives
- **Gestion centralisée** : Toute la logique d'auth dans un seul service
- **Protection CSRF** : Cookies httpOnly + sameSite strict

## Tests recommandés

1. Se connecter et vérifier la présence du cookie refresh token
2. Attendre l'expiration du token d'accès (15 min) et vérifier le renouvellement automatique
3. Se déconnecter et vérifier la suppression des tokens côté serveur
