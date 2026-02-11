import React, { createContext, useContext, useState, useCallback } from "react";

export type Language = "en" | "hi" | "mr";

type Translations = Record<string, Record<Language, string>>;

const translations: Translations = {
  // Common
  "app.name": { en: "From Excess to Everyone", hi: "अतिरिक्त से सभी तक", mr: "अतिरिक्तातून सर्वांसाठी" },
  "app.tagline": { en: "Reduce Waste. Feed Lives.", hi: "बर्बादी कम करो। जीवन पोषित करो।", mr: "अन्न वाया घालवू नका. जगा." },
  "common.back": { en: "Back", hi: "वापस", mr: "मागे" },
  "common.submit": { en: "Submit", hi: "जमा करें", mr: "सबमिट करा" },
  "common.save": { en: "Save", hi: "सहेजें", mr: "जतन करा" },
  "common.cancel": { en: "Cancel", hi: "रद्द करें", mr: "रद्द करा" },
  "common.loading": { en: "Loading...", hi: "लोड हो रहा है...", mr: "लोड होत आहे..." },
  "common.login": { en: "Log In", hi: "लॉग इन", mr: "लॉग इन" },
  "common.signup": { en: "Sign Up", hi: "साइन अप", mr: "साइन अप" },
  "common.logout": { en: "Log Out", hi: "लॉग आउट", mr: "लॉग आउट" },
  "common.email": { en: "Email", hi: "ईमेल", mr: "ईमेल" },
  "common.password": { en: "Password", hi: "पासवर्ड", mr: "पासवर्ड" },

  // Splash
  "splash.getStarted": { en: "Get Started", hi: "शुरू करें", mr: "सुरू करा" },
  "splash.subtitle": { en: "Connect surplus food with those who need it most. Every meal matters.", hi: "अतिरिक्त भोजन को उन लोगों से जोड़ें जिन्हें इसकी सबसे ज़्यादा ज़रूरत है। हर भोजन मायने रखता है।", mr: "अतिरिक्त अन्न गरजूंपर्यंत पोहोचवा. प्रत्येक जेवण महत्त्वाचे आहे." },
  "splash.mealsShared": { en: "Meals Shared", hi: "भोजन साझा किए", mr: "जेवण शेअर केले" },
  "splash.volunteers": { en: "Volunteers", hi: "स्वयंसेवक", mr: "स्वयंसेवक" },
  "splash.ngos": { en: "NGOs", hi: "एनजीओ", mr: "एनजीओ" },

  // Roles
  "role.title": { en: "Choose Your Role", hi: "अपनी भूमिका चुनें", mr: "तुमची भूमिका निवडा" },
  "role.subtitle": { en: "How would you like to contribute?", hi: "आप कैसे योगदान देना चाहेंगे?", mr: "तुम्ही कसे योगदान देऊ इच्छिता?" },
  "role.donor": { en: "Food Donor", hi: "खाद्य दाता", mr: "अन्नदाता" },
  "role.ngo": { en: "NGO / Shelter", hi: "एनजीओ / आश्रय", mr: "एनजीओ / आश्रय" },
  "role.volunteer": { en: "Volunteer", hi: "स्वयंसेवक", mr: "स्वयंसेवक" },
  "role.admin": { en: "Admin", hi: "व्यवस्थापक", mr: "प्रशासक" },

  // Dashboard
  "dashboard.welcome": { en: "Welcome back 👋", hi: "वापसी पर स्वागत 👋", mr: "पुन्हा स्वागत 👋" },
  "dashboard.mealsShared": { en: "Meals Shared", hi: "भोजन साझा", mr: "जेवण शेअर" },
  "dashboard.foodSaved": { en: "Food Saved", hi: "भोजन बचाया", mr: "अन्न वाचवले" },
  "dashboard.impactScore": { en: "Impact Score", hi: "प्रभाव स्कोर", mr: "प्रभाव स्कोअर" },
  "dashboard.quickActions": { en: "Quick Actions", hi: "त्वरित कार्य", mr: "जलद क्रिया" },
  "dashboard.donateFood": { en: "Donate Food", hi: "भोजन दान करें", mr: "अन्न दान करा" },
  "dashboard.addNew": { en: "Add new donation", hi: "नया दान जोड़ें", mr: "नवीन देणगी जोडा" },
  "dashboard.myImpact": { en: "My Impact", hi: "मेरा प्रभाव", mr: "माझा प्रभाव" },
  "dashboard.viewStats": { en: "View stats", hi: "आँकड़े देखें", mr: "आकडेवारी पहा" },
  "dashboard.recentDonations": { en: "Recent Donations", hi: "हाल के दान", mr: "अलीकडील देणग्या" },
  "dashboard.viewAll": { en: "View All", hi: "सभी देखें", mr: "सर्व पहा" },

  // Add Donation
  "donation.title": { en: "Add Donation", hi: "दान जोड़ें", mr: "देणगी जोडा" },
  "donation.photo": { en: "Upload Food Photo", hi: "खाद्य फोटो अपलोड करें", mr: "अन्नाचा फोटो अपलोड करा" },
  "donation.foodType": { en: "Food Type", hi: "खाद्य प्रकार", mr: "अन्न प्रकार" },
  "donation.description": { en: "Food Description", hi: "खाद्य विवरण", mr: "अन्न वर्णन" },
  "donation.quantity": { en: "Serves (people)", hi: "लोगों की संख्या", mr: "लोकांची संख्या" },
  "donation.submit": { en: "Submit Donation 🤝", hi: "दान जमा करें 🤝", mr: "देणगी सबमिट करा 🤝" },
  "donation.success": { en: "Donation Added!", hi: "दान जोड़ा गया!", mr: "देणगी जोडली!" },
  "donation.matchMessage": { en: "We'll match you with nearby NGOs soon.", hi: "हम आपको जल्द ही नज़दीकी एनजीओ से जोड़ेंगे।", mr: "आम्ही तुम्हाला लवकरच जवळच्या एनजीओशी जोडू." },

  // Impact
  "impact.title": { en: "Your Impact", hi: "आपका प्रभाव", mr: "तुमचा प्रभाव" },
  "impact.totalMeals": { en: "Total Meals Shared", hi: "कुल भोजन साझा", mr: "एकूण जेवण शेअर" },
  "impact.foodSaved": { en: "Food Saved", hi: "भोजन बचाया", mr: "अन्न वाचवले" },
  "impact.co2Reduced": { en: "CO₂ Reduced", hi: "CO₂ कम किया", mr: "CO₂ कमी केले" },
  "impact.badges": { en: "Badges Earned", hi: "बैज अर्जित", mr: "बॅज मिळवले" },
  "impact.leaderboard": { en: "Leaderboard", hi: "लीडरबोर्ड", mr: "लीडरबोर्ड" },

  // Alerts
  "alerts.title": { en: "Notifications", hi: "सूचनाएं", mr: "सूचना" },
  "alerts.empty": { en: "No notifications yet", hi: "अभी कोई सूचना नहीं", mr: "अद्याप कोणत्याही सूचना नाहीत" },
  "alerts.markRead": { en: "Mark as read", hi: "पढ़ा हुआ चिन्हित करें", mr: "वाचले म्हणून चिन्हांकित करा" },

  // Profile
  "profile.title": { en: "Profile", hi: "प्रोफ़ाइल", mr: "प्रोफाइल" },
  "profile.editProfile": { en: "Edit Profile", hi: "प्रोफ़ाइल संपादित करें", mr: "प्रोफाइल संपादित करा" },
  "profile.language": { en: "Language", hi: "भाषा", mr: "भाषा" },
  "profile.settings": { en: "Settings", hi: "सेटिंग्स", mr: "सेटिंग्ज" },
  "profile.helpCenter": { en: "Help Center", hi: "सहायता केंद्र", mr: "मदत केंद्र" },
  "profile.about": { en: "About", hi: "के बारे में", mr: "विषयी" },
  "profile.displayName": { en: "Display Name", hi: "प्रदर्शन नाम", mr: "प्रदर्शन नाव" },
  "profile.phone": { en: "Phone", hi: "फ़ोन", mr: "फोन" },
  "profile.address": { en: "Address", hi: "पता", mr: "पत्ता" },

  // Nav
  "nav.home": { en: "Home", hi: "होम", mr: "होम" },
  "nav.impact": { en: "Impact", hi: "प्रभाव", mr: "प्रभाव" },
  "nav.alerts": { en: "Alerts", hi: "अलर्ट", mr: "अलर्ट" },
  "nav.profile": { en: "Profile", hi: "प्रोफ़ाइल", mr: "प्रोफाइल" },

  // Chat
  "chat.title": { en: "AI Food Assistant", hi: "AI खाद्य सहायक", mr: "AI अन्न सहाय्यक" },
  "chat.placeholder": { en: "Ask about food donation, nearby NGOs...", hi: "भोजन दान, नज़दीकी एनजीओ के बारे में पूछें...", mr: "अन्नदान, जवळच्या एनजीओ बद्दल विचारा..." },
  "chat.send": { en: "Send", hi: "भेजें", mr: "पाठवा" },

  // Videos
  "video.tagline1": { en: "Every plate shared is a life touched", hi: "हर साझा की गई थाली एक जीवन छूती है", mr: "प्रत्येक शेअर केलेली थाळी एक आयुष्य बदलते" },
  "video.tagline2": { en: "Together we can end food waste", hi: "मिलकर हम खाद्य बर्बादी खत्म कर सकते हैं", mr: "एकत्रितपणे आपण अन्न वाया जाणे थांबवू शकतो" },

  // Auth
  "auth.loginTitle": { en: "Welcome Back", hi: "वापसी पर स्वागत", mr: "पुन्हा स्वागत" },
  "auth.signupTitle": { en: "Create Account", hi: "खाता बनाएं", mr: "खाते तयार करा" },
  "auth.noAccount": { en: "Don't have an account?", hi: "खाता नहीं है?", mr: "खाते नाही?" },
  "auth.hasAccount": { en: "Already have an account?", hi: "पहले से खाता है?", mr: "आधीच खाते आहे?" },
  "auth.name": { en: "Full Name", hi: "पूरा नाम", mr: "पूर्ण नाव" },
  "auth.checkEmail": { en: "Check your email for a confirmation link!", hi: "पुष्टि लिंक के लिए अपना ईमेल जांचें!", mr: "पुष्टीकरण लिंकसाठी तुमचा ईमेल तपासा!" },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
  t: (key: string) => key,
});

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const stored = localStorage.getItem("app-language");
    return (stored as Language) || "en";
  });

  const handleSetLanguage = useCallback((lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("app-language", lang);
  }, []);

  const t = useCallback(
    (key: string) => {
      return translations[key]?.[language] || translations[key]?.en || key;
    },
    [language]
  );

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
