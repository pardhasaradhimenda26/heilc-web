/**
 * Privacy notice content — the single source for the consent screen, the
 * /privacy page and the data export. DPDP Act 2023 references are inline.
 *
 * s.5(3) / s.6(3): the notice and consent request must be available in
 * English or a language in the Eighth Schedule. The short consent notice is
 * provided in English, Hindi, Tamil and Telugu; any other Eighth Schedule
 * language is provided on request through the grievance channel.
 */
import { GRIEVANCE_OFFICER } from "@/lib/site";

export type NoticeLanguage = "en" | "hi" | "ta" | "te";

export const NOTICE_LANGUAGES: { code: NoticeLanguage; label: string }[] = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिन्दी" },
  { code: "ta", label: "தமிழ்" },
  { code: "te", label: "తెలుగు" },
];

export interface ConsentNotice {
  title: string;
  intro: string;
  items: string[];
  rights: string;
  grievance: string;
  checkbox: string;
  fullNotice: string;
}

const email = GRIEVANCE_OFFICER.email;

export const CONSENT_NOTICE: Record<NoticeLanguage, ConsentNotice> = {
  en: {
    title: "Before you sign in",
    intro: "HEILC will process the following personal data:",
    items: [
      "Your name, email (or phone number) and sign-in provider ID — to create and secure your account.",
      "Your onboarding answers (who you are, what you need, your company) — to personalise this site, the HEILC assistant and proposals.",
      "What you send us (requests, chat messages, proposal details) — to reply to you and prepare work for you.",
    ],
    rights:
      "You can withdraw consent or delete your account at any time from your Account page, as easily as you gave it.",
    grievance: `Questions or grievances: Grievance Officer, ${email}. If your grievance is not resolved, you can complain to the Data Protection Board of India.`,
    checkbox:
      "I am 18 or older, and I consent to HEILC processing this data for these purposes.",
    fullNotice: "Read the full privacy notice",
  },
  hi: {
    title: "साइन इन करने से पहले",
    intro: "HEILC निम्नलिखित व्यक्तिगत डेटा प्रोसेस करेगा:",
    items: [
      "आपका नाम, ईमेल (या फ़ोन नंबर) और साइन-इन प्रदाता आईडी — आपका खाता बनाने और सुरक्षित रखने के लिए।",
      "ऑनबोर्डिंग के आपके उत्तर (आप कौन हैं, आपको क्या चाहिए, आपकी कंपनी) — इस साइट, HEILC असिस्टेंट और प्रस्तावों को आपके अनुसार बनाने के लिए।",
      "आप जो हमें भेजते हैं (अनुरोध, चैट संदेश, प्रस्ताव की जानकारी) — आपको जवाब देने और आपके लिए काम तैयार करने के लिए।",
    ],
    rights:
      "आप किसी भी समय अपने 'अकाउंट' पेज से सहमति वापस ले सकते हैं या अपना खाता हटा सकते हैं — उतनी ही आसानी से जितनी आसानी से आपने सहमति दी थी।",
    grievance: `प्रश्न या शिकायत: शिकायत अधिकारी, ${email}। शिकायत का समाधान न होने पर आप भारतीय डेटा संरक्षण बोर्ड से शिकायत कर सकते हैं।`,
    checkbox:
      "मेरी आयु 18 वर्ष या उससे अधिक है, और मैं इन उद्देश्यों के लिए HEILC द्वारा इस डेटा को प्रोसेस करने की सहमति देता/देती हूँ।",
    fullNotice: "पूरी गोपनीयता सूचना पढ़ें",
  },
  ta: {
    title: "உள்நுழைவதற்கு முன்",
    intro: "HEILC பின்வரும் தனிப்பட்ட தரவைச் செயலாக்கும்:",
    items: [
      "உங்கள் பெயர், மின்னஞ்சல் (அல்லது தொலைபேசி எண்) மற்றும் உள்நுழைவு வழங்குநர் அடையாளம் — உங்கள் கணக்கை உருவாக்கவும் பாதுகாக்கவும்.",
      "தொடக்கக் கேள்விகளுக்கான உங்கள் பதில்கள் (நீங்கள் யார், உங்களுக்கு என்ன தேவை, உங்கள் நிறுவனம்) — இந்தத் தளம், HEILC உதவியாளர் மற்றும் முன்மொழிவுகளை உங்களுக்கு ஏற்றவாறு அமைக்க.",
      "நீங்கள் எங்களுக்கு அனுப்புபவை (கோரிக்கைகள், அரட்டைச் செய்திகள், முன்மொழிவு விவரங்கள்) — உங்களுக்குப் பதிலளிக்கவும் உங்களுக்கான வேலையைத் தயாரிக்கவும்.",
    ],
    rights:
      "உங்கள் 'கணக்கு' பக்கத்திலிருந்து எப்போது வேண்டுமானாலும் ஒப்புதலைத் திரும்பப் பெறலாம் அல்லது கணக்கை நீக்கலாம் — ஒப்புதல் அளித்த அதே எளிமையுடன்.",
    grievance: `கேள்விகள் அல்லது குறைகள்: குறைதீர்ப்பு அலுவலர், ${email}. உங்கள் குறை தீர்க்கப்படாவிட்டால், இந்திய தரவுப் பாதுகாப்பு வாரியத்திடம் புகார் அளிக்கலாம்.`,
    checkbox:
      "எனக்கு 18 வயது அல்லது அதற்கு மேல் ஆகிறது; இந்த நோக்கங்களுக்காக HEILC இந்தத் தரவைச் செயலாக்க நான் ஒப்புதல் அளிக்கிறேன்.",
    fullNotice: "முழு தனியுரிமை அறிவிப்பைப் படிக்கவும்",
  },
  te: {
    title: "సైన్ ఇన్ చేసే ముందు",
    intro: "HEILC కింది వ్యక్తిగత డేటాను ప్రాసెస్ చేస్తుంది:",
    items: [
      "మీ పేరు, ఇమెయిల్ (లేదా ఫోన్ నంబర్) మరియు సైన్-ఇన్ ప్రొవైడర్ ఐడి — మీ ఖాతాను సృష్టించడానికి మరియు సురక్షితంగా ఉంచడానికి.",
      "ఆన్‌బోర్డింగ్ ప్రశ్నలకు మీ సమాధానాలు (మీరు ఎవరు, మీకు ఏమి కావాలి, మీ కంపెనీ) — ఈ సైట్, HEILC అసిస్టెంట్ మరియు ప్రతిపాదనలను మీకు తగినట్లుగా మార్చడానికి.",
      "మీరు మాకు పంపేవి (అభ్యర్థనలు, చాట్ సందేశాలు, ప్రతిపాదన వివరాలు) — మీకు సమాధానం ఇవ్వడానికి మరియు మీ కోసం పనిని సిద్ధం చేయడానికి.",
    ],
    rights:
      "మీ 'ఖాతా' పేజీ నుండి ఎప్పుడైనా మీ సమ్మతిని ఉపసంహరించుకోవచ్చు లేదా ఖాతాను తొలగించవచ్చు — సమ్మతి ఇచ్చినంత సులభంగానే.",
    grievance: `ప్రశ్నలు లేదా ఫిర్యాదులు: ఫిర్యాదుల అధికారి, ${email}. మీ ఫిర్యాదు పరిష్కారం కాకపోతే, మీరు భారత డేటా రక్షణ బోర్డుకు ఫిర్యాదు చేయవచ్చు.`,
    checkbox:
      "నా వయస్సు 18 సంవత్సరాలు లేదా అంతకంటే ఎక్కువ, మరియు ఈ ప్రయోజనాల కోసం HEILC ఈ డేటాను ప్రాసెస్ చేయడానికి నేను సమ్మతిస్తున్నాను.",
    fullNotice: "పూర్తి గోప్యతా నోటీసు చదవండి",
  },
};

/** Itemised data inventory (s.5(1)(i)): what, why, on what basis, how long. */
export interface DataItem {
  data: string;
  purpose: string;
  basis: string;
  retention: string;
}

export const DATA_INVENTORY: DataItem[] = [
  {
    data: "Name, email address or phone number, and the ID from your sign-in provider (Google or Facebook)",
    purpose: "Create your account, keep it secure, and address you by name",
    basis: "Your consent (s.6), given before sign-in",
    retention: "Until you delete your account, or 3 years after your last activity (you get 48 hours' notice first)",
  },
  {
    data: "Onboarding answers: who you are, what you need, company, role, stage, timeline, an optional goal and phone number",
    purpose: "Choose which version of the site you see (startup, enterprise or student), and personalise the assistant and proposals",
    basis: "Your consent (s.6)",
    retention: "Same as your account; edit or remove any answer from your Account page",
  },
  {
    data: "Contact requests and proposal inputs you submit",
    purpose: "Reply to you and prepare the work you asked about",
    basis: "Your consent (s.6) and the purpose you voluntarily gave the data for (s.7(a))",
    retention: "3 years from submission, or until you delete your account",
  },
  {
    data: "Messages you type into the HEILC assistant",
    purpose: "Generate the assistant's reply",
    basis: "Your consent (s.6)",
    retention: "Not stored by HEILC. Sent to our AI provider only to generate the reply",
  },
  {
    data: "Approximate location (country, city, time zone) derived from your IP address",
    purpose: "Adapt the homepage to your region — only if you allow personalisation",
    basis: "Your consent (s.6) via the privacy choices banner",
    retention: "Kept in your own browser for up to 24 hours; never stored by HEILC",
  },
  {
    data: "Consent records and sign-in, export and deletion events",
    purpose: "Prove notice and consent (s.6(10)) and detect misuse of your account",
    basis: "Legal obligation under the DPDP Act and Rules",
    retention: "1 year; unlinked from you if you delete your account",
  },
  {
    data: "Grievances you raise",
    purpose: "Investigate and respond to your grievance (s.13)",
    basis: "Legal obligation under the DPDP Act",
    retention: "1 year after the grievance is resolved",
  },
];

/** s.11(1)(b): who personal data is shared with. All act as Data Processors. */
export interface Processor {
  name: string;
  role: string;
  location: string;
}

export const PROCESSORS: Processor[] = [
  { name: "Supabase", role: "Account sign-in and database", location: "Region chosen at setup (Mumbai, India recommended)" },
  { name: "Vercel", role: "Website hosting and delivery", location: "Global edge network" },
  { name: "Groq (and Anthropic as fallback)", role: "Generates assistant replies and proposals", location: "United States" },
  { name: "Resend", role: "Sends sign-in codes and delivers request notifications to the HEILC team", location: "United States (sending region: Tokyo, Japan)" },
  { name: "Google and Meta (Facebook)", role: "Only if you choose them to sign in; they confirm your identity", location: "As per their own policies" },
  { name: "Spline", role: "Serves the 3D robot on the homepage (receives your IP address as any web request does)", location: "As per their own policy" },
];

export const GRIEVANCE_TIMELINE = {
  acknowledge: "within 72 hours",
  resolve: "within 30 days, and never later than the 90 days the DPDP Rules allow",
};
