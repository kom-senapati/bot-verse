import { LanguageMetadata } from "../types";

export const fr = {
  translation: {
    like: "J'aime",
    report: "Signaler",
    chat: "Chat",
    edit: "Éditer",
    share: "Partager",
    delete: "Supprimer",
    publish: "Publier",
    unpublish: "Dépublier",
    no_bots: "Pas de bots disponibles.",
    no_images: "Pas d'images disponibles.",
    contributions: "Contributions",
    created_by: "Créé par",
    download: "Télécharger",
    joined: "Rejoint",
    cancel: "Annuler",
    continue: "Continuer",
    save: "Enregistrer",
    navbar: {
      leaderboard: "Classement",
      language: "Langue",
      hub: "Hub",
      sign_up: "S'inscrire",
      login: "Se connecter",
      logout: "Se déconnecter",
      settings: "Paramètres",
      my_chatbots: "Mes Chatbots",
      my_images: "Mes Images",
      profile: "Profil",
    },
    notfound: {
      heading: "Oups ! Il semble que la page n'existe plus",
      goto: "Pour aller à la page d'accueil",
      click: "Cliquez ici",
    },
    commandbox: {
      no_result: "Aucun résultat trouvé.",
      create_chatbot: "Créer un Chatbot",
      tts: "Texte en Parole",
      translate: "Traduction",
      image_generation: "Générer des Images",
      anonymous_chat: "Chat Anonyme",
      hub: "Hub de Marché",
      socialize: "Socialiser",
      input_ph: "Tapez une commande ou cherchez...",
    },
    message: {
      ph: "Tapez votre message...",
      loading: "Chargement des données précédentes...",
    },
    chatbot_page: {
      export: "Exporter",
      delete_all: "Tout Supprimer",
      action: "Action",
      translate: "Traduire",
      listen: "Écouter",
    },
    chatbot_view: {
      not_found: "Aucune donnée de chatbot disponible.",
      goto: "Aller au Hub",
      creator: "Créateur",
      prompt: "Instruction",
      current_ver: "Version Actuelle",
      comments: "Commentaires",
      comment: "Commentaire",
      leave_comment: "Laisser un Commentaire",
      name: "Nom",
      submit_comment: "Soumettre le Commentaire",
    },
    dashboard: {
      welcome: "Bienvenue",
      chatbot_of_day: "Chatbot du Jour",
      image_of_day: "Image du Jour",
      tip_of_day: "Astuce du Jour",
      message_of_day: "Message du Jour",
      your_chatbots: "Vos Chatbots",
      new_chatbot: "Nouveau Chatbot",
      system_chatbots: "Chatbots du Système",
      no: "Aucun chatbot !",
    },
    hub_page: {
      heading: "Hub des Chatbots et Images IA",
      search: "Recherche...",
      chatbots: "Chatbots",
      images: "Images",
      no_bots: "Pas de bots disponibles.",
      no_images: "Pas d'images disponibles.",
    },
    leaderboard_page: {
      no: "Pas de données de classement disponibles.",
      goto: "Aller au Tableau de Bord",
    },
    landing: {
      get_started: "Commencer",
      top_heading: "Bienvenue dans Bot Verse",
      top_subheading:
        "Votre hub pour des chatbots IA pour résoudre des requêtes facilement.",
      about_heading: "À propos de Bot Verse",
      about_subheading:
        "Une plateforme pour créer, partager et interagir avec des chatbots IA pour améliorer votre productivité.",
      feature_heading: "Fonctionnalités",
      f1_heading: "Gérer Vos Chatbots",
      f1_subheading:
        "Créez, mettez à jour ou supprimez facilement vos chatbots en un seul endroit.",
      f2_heading: "Partager et Découvrir",
      f2_subheading:
        "Montrez vos chatbots et explorez les créations des autres pour vous inspirer.",
      f3_heading: "Hub de Chatbots",
      f3_subheading:
        "Interagissez avec plusieurs chatbots en un seul endroit pratique.",
      f4_heading: "Chatbots Utiles",
      f4_subheading:
        "Utilisez nos chatbots pré-faits pour des solutions rapides aux tâches courantes.",
      contribute: "Contribuer",
      contribute_heading: "Open Source",
      contribute_subheading1: "Bot Verse est un projet open source.",
      contribute_subheading2:
        "Contribuez à notre développement et rejoignez notre communauté croissante de contributeurs !",
    },
    analytics: {
      title: "Résumé des Analyses",
      total_likes: "Total des J'aime",
      total_reports: "Total des Signalements",
      top_ranked_bot: "Bot le Mieux Classé",
      top_ranked_image: "Image la Mieux Classée",
      likes: "J'aime",
      my_images: "Mes Images",
      my_chatbots: "Mes Chatbots",
    },
    auth: {
      dont_account: "Vous n'avez pas de compte.",
      create_one: "Créez-en un",
      login: "Connexion",
      password: "Mot de passe",
      username: "Nom d'utilisateur",
      login_title: "Connectez-vous à votre compte",
      login_subtitle:
        "Utilisez tous les nouveaux chatbots créés par d'autres personnes comme vous.",
      signup_title: "Créer un nouveau compte",
      signup_subtitle:
        "Utilisez tous les nouveaux chatbots créés par d'autres personnes comme vous.",
      name: "Nom",
      email: "Email",
      create: "Créer",
      have_account: "Vous avez déjà un compte",
    },
    create_chatbot: {
      title: "Créer un nouveau Chatbot",
      templates: "Sélectionnez un Modèle",
      prompt: "Instruction",
      category: "Catégorie",
    },
    delete_modal: {
      title: "Êtes-vous absolument sûr ?",
      sub_title:
        "Cette action est irréversible. Cela supprimera définitivement votre chatbot et effacera ses données de nos serveurs.",
    },
    generate_image: {
      title: "Imaginez une image et créez-la",
      sub_title:
        "Voyons à quel point votre imagination est créative. Je sais que vous êtes assez créatif.",
      ph: "Entrez votre commande imaginative ici...",
      info: "Si vous souhaitez enregistrer cette image dans la base de données, cliquez sur 'Capturer'",
      capture: "Capturer",
    },
    profile_update: {
      title: "Mettre à Jour le Profil",
      bio: "Biographie",
    },
    chatbot_update: {
      title: "Mettre à Jour le Chatbot",
      revert: "Revenir",
      version: "Version",
      select_version: "Sélectionnez une version",
      revert_title: "Sélectionnez la Version pour Revenir",
    },
    tts_modal: {
      title: "Convertir du Texte en Parole et Télécharger",
      sub_title:
        "Le texte est converti en fichier audio au format MP3 qui sera téléchargé automatiquement.",
      generate: "Générer",
      generating: "Génération...",
      text: "Texte",
    },
    translate_modal: {
      title: "Traduire du Texte en Différentes Langues",
      sub_title:
        "Sélectionnez une langue pour traduire votre texte et le voir au format markdown.",
      translating: "Traduction...",
      translate: "Traduire",
    },
    settings_modal: {
      title: "Paramètres du Site",
      font_size: "Taille de la Police",
      font_size_ph: "Sélectionnez la taille de la police",
      small: "Petit",
      medium: "Moyen",
      large: "Grand",
      select_engine_title: "Clés API et Moteurs",
      select_engine: "Sélectionnez un moteur",
      api_key_ph: "Votre clé API",
    },
  },
};

export const frMetadata: LanguageMetadata = {
  name: "Français",
  code: "fr",
};
