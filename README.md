# Projet Technologies Web

## Groupe 5

**Brahim NAJI** - **Thomas MORETTI**

---

## Présentation

Application de **gestion de cours en ligne** moderne et intuitive.

* **Les professeurs** créent, organisent, modifient et publient des cours.
* **Les étudiants** recherchent, s’inscrivent et suivent les cours publiés.
* **QCM interactifs** intégrés dans chaque chapitre.
* **Chatbot IA intégré à chaque cours**, permettant aux étudiants de poser des **questions en temps réel**.
* **Résumés générés par IA** pour faciliter la compréhension des chapitres.

> **Points forts du projet** :
>
> * L’utilisation d’une **intelligence artificielle** pour générer automatiquement des **résumés concis et pertinents** à partir du contenu des chapitres.
> * Un **chatbot intelligent** par cours, permettant aux étudiants d’obtenir des **réponses instantanées et personnalisées**.
> * **Suivi précis des performances étudiantes** via des **statistiques détaillées par quiz**.

---

## Technologies Utilisées (Frontend)

| Technologie               | Rôle                                          |
| ------------------------- | --------------------------------------------- |
| **React 18**              | Interface utilisateur réactive                |
| **TypeScript**            | Sécurité du typage et maintenabilité          |
| **Vite**                  | Build ultra-rapide et développement fluide    |
| **Tailwind CSS**          | Styling moderne, responsive, utilitaire       |
| **React Router**          | Navigation SPA fluide                         |
| **TanStack React Query**  | Gestion des appels API, cache, refetch        |
| **React Hook Form + Zod** | Formulaires robustes avec validation          |
| **React Quill**           | Éditeur WYSIWYG (contenu riche HTML)          |
| **Recharts**              | Graphiques de progression (barres colorées)   |
| **Lucide Icons**          | Icônes légères et modernes                    |
| **React Toastify**        | Notifications utilisateur élégantes           |
| **Axios**                 | Requêtes HTTP vers le backend                 |
| **JWT Decode**            | Gestion de l’authentification locale          |

## Technologies Utilisées (Backend)

| Technologie        | Rôle                                        |
|--------------------|---------------------------------------------|
| **NestJS**         | Framework NodeJS                            |
| **TypeScript**     | Sécurité du typage et maintenabilité        |
| **Mongoose**       | ODM pour MongoDB                            |
| **BCrypt**         | Hashage de mot de passe                     |
| **Pino**           | Logger de requête HTTP                      |
| **JWT**            | Authentification                            |
| **Swagger**        | Documentation des routes de l'API           |
| **Jest**           | Tests unitaires                             |

---

## Fonctionnalités Détaillées

### Authentification & Compte Utilisateur

| Fonctionnalité                 | Description                                            |
| ------------------------------ | ------------------------------------------------------ |
| **Création de compte**         | Inscription avec email et mot de passe...              |
| **Connexion / Déconnexion**    | Authentification sécurisée avec JWT                    |
| **Modification du profil**     | Mise à jour des informations personnelles              |
| **Changement de mot de passe** | Réinitialisation ou modification sécurisée             |
| **Suppression de compte**      | L’utilisateur peut supprimer définitivement son compte |

---

### Enseignant (Teacher)

| Fonctionnalité                 | Description                                                         |
| ------------------------------ | ------------------------------------------------------------------- |
| **Création de cours**          | Titre, description, tags, image de couverture                       |
| **Modification / Suppression** | Mise à jour ou suppression des cours créés                          |
| **Gestion des chapitres**      | Ajout, édition, suppression, réordonnancement                       |
| **Éditeur riche**              | Mise en forme (gras, listes, code, titres, liens)                   |
| **Résumé IA**                  | Généré automatiquement après sauvegarde du chapitre                 |
| **QCM par chapitre**           | Création de questions à choix multiples                             |
| **Test du QCM**                | Mode visualisation avec réponses                                    |
| **Commentaires**               | Répondre, supprimer ses propres commentaires                        |
| **Publication**                | Bouton "Publier" pour rendre le cours public                        |
| **Liste des inscrits**         | Nom, prénom, email des étudiants                                    |
| **Dashboard complet**          | Vue d’ensemble des cours créés, statistiques globales               |
| **Statistiques détaillées des performances étudiantes** | **Nouveau** : Tableau complet par étudiant avec : <br> • Score par quiz <br> • Moyenne globale <br> • Quizzes passés / restants |

---

### Étudiant

| Fonctionnalité            | Description                                                               |
| ------------------------- | ------------------------------------------------------------------------- |
| **Recherche de cours**    | Filtre par titre, tags, enseignant                                        |
| **Inscription**           | Bouton "S’inscrire" sur les cours publiés                                 |
| **Lecture des chapitres** | Contenu HTML formaté                                                      |
| **Résumé IA**             | Synthèse rapide du chapitre                                               |
| **QCM interactif**        | Réponses en temps réel, progression                                       |
| **Résultat immédiat**     | Score en %, feedback visuel (vert/orange/rouge)                           |
| **Commentaires**          | Ajouter, voir ou supprimer ses propres commentaires                       |
| **Chatbot IA**            | Poser des questions en temps réel sur le cours, génération de réponses IA |
| **Historique**            | Réponses sauvegardées côté backend                                        |
| **Profil utilisateur**    | Modifier ses informations et mot de passe, supprimer son compte           |

---

## Lancer l’Application (Frontend + Backend)

> **Prérequis** :
>
> * Node.js ≥ 18
> * npm
> * Git
> * Base de données MongoDB (hébergée ou locale)

### 1. Cloner le projet

```bash
git clone <URL_DU_REPO>
cd projet-technologies-web-grp-5
```

### 2. Créer les fichiers `.env` dans `packages/backend/` et  `packages/frontend/`

```env
# packages/backend/.env
MONGO_HOST=cluster0.mongodb.net
MONGO_USER=
MONGO_PASSWORD=
MONGO_DATABASE=
MONGO_APP_NAME=Cluster0

JWT_SECRET=votre_secret_key

OLLAMA_API_URL=votre_url_ollama
OLLAMA_MODEL=votre_model_ollama
```

```env
# packages/frontend/.env
VITE_API_URL=http://localhost:3000
```


### 3. Installer les dépendances

```bash
npm install
```

### 4. Lancer le backend

```bash
npm run start:backend
```

API disponible sur : [http://localhost:3000](http://localhost:3000)

### 5. Lancer le frontend (dans un nouveau terminal)

```bash
npm run start:frontend
```

Application disponible sur : [http://localhost:5173](http://localhost:5173)

