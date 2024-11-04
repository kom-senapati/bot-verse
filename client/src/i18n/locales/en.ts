import { LanguageMetadata } from "../types";

export const en = {
  translation: {
    like: "Like",
    report: "Report",
    chat: "Chat",
    edit: "Edit",
    share: "Share",
    delete: "Delete",
    publish: "Publish",
    unpublish: "Unpublish",
    no_bots: "No bots available.",
    no_images: "No Images available.",
    contributions: "Contributions",
    created_by: "Created by",
    download: "Download",
    joined: "Joined",
    cancel: "Cancel",
    continue: "Continue",
    save: "Save",
    navbar: {
      leaderboard: "Leaderboard",
      language: "Language",
      hub: "Hub",
      sign_up: "sign Up",
      login: "Login",
      logout: "Log out",
      settings: "Settings",
      my_chatbots: "My Chatbots",
      my_images: "My Images",
      profile: "Profile",
    },
    notfound: {
      heading: "Oops! Looks like the page doesn't exist anymore",
      goto: "To go to the Home Page",
      click: "Click Here",
    },
    commandbox: {
      no_result: "No results found.",
      create_chatbot: "Create Chatbot",
      tts: "Text-to-Speech Magic",
      translate: "Translate Magic",
      image_generation: "Generate Images",
      anonymous_chat: "Anonymous Chat",
      hub: "Marketplace Hub",
      socialize: "Socialize",
      input_ph: "Type a command or search...",
    },
    message: {
      ph: "Type your message..",
      loading: "Loading previous data..",
    },
    chatbot_page: {
      export: "Export",
      delete_all: "Delete All",
      action: "Action",
      translate: "Translate",
      listen: "Listen",
    },
    chatbot_view: {
      not_found: "No Chatbot data available.",
      goto: "Go to Hub",
      creator: "Creator",
      prompt: "Prompt",
      current_ver: "Current Version",
      comments: "Comments",
      comment: "Comment",
      leave_comment: "Leave a Comment",
      name: "Name",
      submit_comment: "Submit Comment",
    },
    dashboard: {
      welcome: "Welcome",
      chatbot_of_day: "Chatbot of the Day",
      image_of_day: "Image of the Day",
      tip_of_day: "Tip of the Day",
      message_of_day: "Message of the Day",
      your_chatbots: "Your Chatbots",
      new_chatbot: "New Chatbot",
      system_chatbots: "System Chatbots",
      no: "No chatbots!",
    },
    hub_page: {
      heading: "Chatbots and AI Images Hub",
      search: "Search...",
      chatbots: "Chatbots",
      images: "Images",
      no_bots: "No bots available.",
      no_images: "No Images available.",
    },
    leaderboard_page: {
      no: "No leaderboard data available.",
      goto: "Go to Dashboard",
    },
    landing: {
      get_started: "Get Started",
      top_heading: "Welcome to Bot Verse",
      top_subheading: "Your hub for AI chatbots to solve queries effortlessly.",
      about_heading: "About Bot Verse",
      about_subheading:
        "A platform for creating, sharing, and interacting with AI chatbots to enhance your productivity.",
      feature_heading: "Features",
      f1_heading: "Manage Your Chatbots",
      f1_subheading:
        "Effortlessly create, update, or delete your chatbots all in one place.",
      f2_heading: "Share and Discover",
      f2_subheading:
        "Show off your chatbots and explore others’ creations for inspiration.",
      f3_heading: "Chatbot Hub",
      f3_subheading:
        "Interact with multiple chatbots in one convenient location.",
      f4_heading: "Helpful Chatbots",
      f4_subheading:
        "Utilize our pre-made chatbots for quick solutions to common tasks.",

      contribute: "Contribute",
      contribute_heading: "Open Source",
      contribute_subheading1: "Bot Verse is an open-source project.",
      contribute_subheading2:
        "Contribute to our development and join our growing community of contributors!",
    },
    analytics: {
      title: "Analytics Summary",
      total_likes: "Total Likes",
      total_reports: "Total Reports",
      top_ranked_bot: "Top Ranked Bot",
      top_ranked_image: "Top Ranked Image",
      likes: "Likes",
      my_images: "My Images",
      my_chatbots: "My Chatbots",
    },
    auth: {
      dont_account: "Don't have an account.",
      create_one: "Create One",
      login: "Login",
      password: "Password",
      username: "Username",
      login_title: "Login to your account",
      login_subtitle: "Use all new chatbots by other people like you.",
      signup_title: "Create a new account",
      signup_subtitle: "Use all new chatbots by other people like you.",
      name: "Name",
      email: "Email",
      create: "Create",
      have_account: "Already have an account",
    },
    create_chatbot: {
      title: "Create a new Chatbot",
      templates: "Select a Template",
      prompt: "Prompt",
      category: "Category",
    },
    delete_modal: {
      title: "Are you absolutely sure?",
      sub_title:
        "This action cannot be undone. This will permanently delete your chatbot and remove it's data from our servers.",
    },

    generate_image: {
      title: "Imgine a image and generate it",
      sub_title:
        "Let's see how you imagination is. I know you are creative enough.",
      ph: "Enter your imagination prompt here...",
      info: "If you want to save this Image in database then Click 'Capture'",
      capture: "Capture",
    },

    profile_update: {
      title: "Update The Profile",
      bio: "Bio",
    },
    chatbot_update: {
      title: "Update The chatbot",
      revert: "Revert",
      version: "Version",
      select_version: "Select a version",
      revert_title: "Select Version to Revert",
    },

    tts_modal: {
      title: "Convert Text to speech and download",
      sub_title:
        "text is converted to audio file in mp3 format that will be downloaded automatically.",
      generate: "Generate",
      generating: "Generating...",
      text: "Text",
    },
    translate_modal: {
      title: "Translate Text to Different Languages",
      sub_title:
        "Select a language to translate your text and view it in markdown format.",
      translating: "Translating...",
      translate: "Translate",
    },
    settings_modal: {
      title: "Site Settings",
      font_size: "Font Size",
      font_size_ph: "Select font size",
      small: "Small",
      medium: "Medium",
      large: "Large",
      select_engine_title: "API Keys and Engines",
      select_engine: "Select engine",
      api_key_ph: "Your API key",
    },
  },
};

export const enMetadata: LanguageMetadata = {
  name: "English",
  code: "en",
};
