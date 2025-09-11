# Nouveaux endpoints backend nécessaires

## 1. Endpoint de renouvellement de token

**POST** `/refresh-token`

**Description :** Renouvelle l'access token en utilisant le refresh token stocké dans les cookies.

**Headers :**
- `Cookie: refreshToken=<refresh_token_value>`

**Réponse de succès :**
```json
{
  "token": "nouveau_access_token",
  "message": "Token renouvelé avec succès"
}
```


**Réponse d'erreur :**
```json
{
  "message": "Refresh token invalide ou expiré"
}
```

## 2. Endpoint de déconnexion

**POST** `/logout`

**Description :** Déconnecte l'utilisateur et supprime le refresh token de la base de données.

**Headers :**
- `Cookie: refreshToken=<refresh_token_value>`

**Réponse de succès :**
```json
{
  "message": "Déconnexion réussie"
}
```

## Implementation côté backend

Ajouter dans votre routeur :

```javascript
// Route pour renouveler le token
router.post('/refresh-token', async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;
    
    if (!refreshToken) {
      return next(new UnauthorizedError("Refresh token manquant"));
    }

    // Vérifier le refresh token
    const decoded = verifyRefreshToken(refreshToken);
    
    // Vérifier si le token existe en BDD
    const storedToken = await RefreshToken.findOne({ 
      where: { token: refreshToken, userId: decoded.id } 
    });
    
    if (!storedToken) {
      return next(new UnauthorizedError("Refresh token invalide"));
    }

    // Générer un nouveau access token
    const newAccessToken = generateToken({ 
      id: decoded.id,
      // Ajouter d'autres infos utilisateur si nécessaire
    });

    res.json({
      token: newAccessToken,
      message: "Token renouvelé avec succès"
    });
  } catch (error) {
    return next(new UnauthorizedError("Refresh token invalide ou expiré"));
  }
});

// Route pour déconnexion
router.post('/logout', async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;
    
    if (refreshToken) {
      // Supprimer le refresh token de la BDD
      await RefreshToken.destroy({ where: { token: refreshToken } });
    }

    // Supprimer le cookie
    res.clearCookie('refreshToken');
    
    res.json({ message: "Déconnexion réussie" });
  } catch (error) {
    console.error("Erreur lors de la déconnexion:", error);
    res.json({ message: "Déconnexion réussie" }); // On répond OK même en cas d'erreur
  }
});
```
