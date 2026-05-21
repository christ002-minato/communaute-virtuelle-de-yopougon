# Configuration MongoDB - Guide d'implémentation

## ✅ Fichiers créés

### Client MongoDB
- **[lib/mongodb/client.ts](lib/mongodb/client.ts)** - Connexion réutilisable avec cache global

### Schémas Mongoose
- **[lib/models/User.ts](lib/models/User.ts)** - Modèle utilisateur
- **[lib/models/Discussion.ts](lib/models/Discussion.ts)** - Modèle discussions
- **[lib/models/Resource.ts](lib/models/Resource.ts)** - Modèle ressources
- **[lib/models/Event.ts](lib/models/Event.ts)** - Modèle événements
- **[lib/models/Comment.ts](lib/models/Comment.ts)** - Modèle commentaires
- **[lib/models/Member.ts](lib/models/Member.ts)** - Modèle membres

### API Routes
- **[app/api/users/route.ts](app/api/users/route.ts)** - GET/POST utilisateurs
- **[app/api/discussions/route.ts](app/api/discussions/route.ts)** - GET/POST discussions

### Configuration
- **[.env.example](.env.example)** - Variables d'environnement requises

---

## 🚀 Configuration

### 1. Créer une base de données MongoDB

**Option A : MongoDB Atlas (Recommandé - Cloud)**
```bash
# Allez sur https://www.mongodb.com/cloud/atlas
# 1. Créer un compte (gratuit)
# 2. Créer un cluster (FREE tier disponible)
# 3. Créer une base de données
# 4. Créer un utilisateur avec mot de passe
# 5. Obtenir la chaîne de connexion
```

**Option B : MongoDB Local**
```bash
# Installer MongoDB Community Edition
# https://docs.mongodb.com/manual/installation/

# Démarrer le service
mongod

# URI local : mongodb://localhost:27017/communaute-virtuelle
```

### 2. Configurer `.env.local`

Copier `.env.example` et remplir :

```bash
# .env.local
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/communaute-virtuelle?retryWrites=true&w=majority
```

### 3. Démarrer l'app

```bash
npm run dev
```

---

## 📚 Utilisation

### Exemple : Créer une discussion

**Client (React)** :
```tsx
async function createDiscussion(data: {
  title: string;
  content: string;
  author_id: string;
}) {
  const res = await fetch('/api/discussions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}
```

**Serveur (Route Handler)** :
```ts
// Déjà implémenté dans app/api/discussions/route.ts
```

### Exemple : Récupérer les discussions

```tsx
async function getDiscussions(page = 1) {
  const res = await fetch(`/api/discussions?page=${page}`);
  return res.json();
}
```

---

## 🔄 Migration de Supabase à MongoDB

### Étapes :

1. **Exporter les données de Supabase** (CSV/JSON)
```bash
# Via la console Supabase ou psql
psql -h host -U user -d database -c \
  "COPY users TO STDOUT WITH CSV" > users.csv
```

2. **Transformer le format** (SQL → MongoDB)
```js
// Exemple : mapping des colonnes
const mongoUser = {
  email: sqlUser.email,
  name: sqlUser.name,
  avatar_url: sqlUser.avatar_url,
  created_at: new Date(sqlUser.created_at),
};
```

3. **Importer dans MongoDB**
```bash
mongoimport --uri "mongodb+srv://username:password@cluster.mongodb.net/db" \
  --collection users --file users.json --jsonArray
```

---

## 🛠️ Tâches suivantes

- [ ] Tester les API routes (`/api/users`, `/api/discussions`)
- [ ] Créer des migrations pour les données existantes
- [ ] Ajouter validation + hashage des passwords
- [ ] Implémenter authentification avec JWT/Cookies
- [ ] Ajouter des indexes MongoDB pour optimiser les requêtes
- [ ] Créer des routes pour resources, events, comments

---

## 📖 Ressources

- [Mongoose Documentation](https://mongoosejs.com/)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
