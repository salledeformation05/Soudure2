# Création du compte Client de test

Le compte client n'a pas pu être créé automatiquement car il nécessite une clé de service Supabase avec les permissions admin.

## Méthode 1 : Via le script Node.js (RECOMMANDÉ)

1. Ajoutez votre clé de service dans le fichier `.env` :
   ```
   SUPABASE_SERVICE_ROLE_KEY=votre_cle_de_service_ici
   ```
   (Vous la trouverez dans votre projet Supabase : Settings > API > service_role key)

2. Exécutez le script :
   ```bash
   npm run create-client
   ```

Le script créera automatiquement le compte avec tous les détails nécessaires.

## Méthode 2 : Via l'interface Supabase

1. Allez sur [https://brubrxutnwydohguylae.supabase.co](https://brubrxutnwydohguylae.supabase.co)
2. Connectez-vous avec vos identifiants Supabase
3. Allez dans **Authentication** > **Users**
4. Cliquez sur **Add user** > **Create new user**
5. Remplissez les champs suivants :
   - Email: `client@alphacadeau.fr`
   - Password: `Client123!`
   - Auto Confirm User: **Activé**
6. Une fois créé, notez l'ID de l'utilisateur
7. Allez dans **Table Editor** > **profiles**
8. Cliquez sur **Insert** > **Insert row**
9. Remplissez :
   - id: [l'ID de l'utilisateur créé à l'étape 6]
   - email: `client@alphacadeau.fr`
   - full_name: `Client Test`
   - role: `client`

## Identifiants de connexion

Une fois créé, vous pourrez vous connecter avec :
- **Email** : `client@alphacadeau.fr`
- **Mot de passe** : `Client123!`

Le compte sera visible dans la liste des comptes de test sur la page de connexion.
