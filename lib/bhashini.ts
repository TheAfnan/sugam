// Digital India Bhashini (National Language Translation Mission - NLTM) Integration
// Supports 12 Scheduled Indian Languages for BIS Compliance Queries

export interface BhashiniLanguage {
  code: string;
  name: string;
  nativeName: string;
  bhashiniCode: string;
}

export const BHASHINI_LANGUAGES: BhashiniLanguage[] = [
  { code: 'en', name: 'English', nativeName: 'English', bhashiniCode: 'en' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी', bhashiniCode: 'hi' },
  { code: 'hinglish', name: 'Hinglish', nativeName: 'हिंग्लिश', bhashiniCode: 'hi' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', bhashiniCode: 'bn' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', bhashiniCode: 'ta' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', bhashiniCode: 'te' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', bhashiniCode: 'mr' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', bhashiniCode: 'gu' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', bhashiniCode: 'kn' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', bhashiniCode: 'ml' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', bhashiniCode: 'pa' },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ', bhashiniCode: 'or' }
];

export const REGIONAL_GREETINGS: Record<string, string> = {
  en: 'Hello! I am SUGAM-AI, your BIS Compliance Intelligence Assistant powered by Digital India Bhashini. Ask me about any Indian Standard, timeline, fee, or test requirements.',
  hi: 'नमस्ते! मैं सुगम-एआई (SUGAM-AI) हूँ, आपका बीआईएस अनुपालन सहायक। भाषिणी (Bhashini) द्वारा संचालित। मुझसे किसी भी भारतीय मानक, शुल्क, समय-सीमा या परीक्षण के बारे में पूछें।',
  hinglish: 'Namaste! Main SUGAM-AI hoon, aapka BIS Compliance Assistant powered by Bhashini. Aap mujhse kisi bhi product, standard, fee schedule ya test ke baare mein pooch sakte hain.',
  bn: 'নমস্কার! আমি সুগম-এআই (SUGAM-AI), আপনার বিআইএস কমপ্লায়েন্স অ্যাসিস্ট্যান্ট। যে কোনো ভারতীয় মানক (IS Code), সময়সীমা এবং খরচ সম্পর্কে আমাকে জিজ্ঞাসা করুন।',
  ta: 'வணக்கம்! நான் சுகம்-ஏஐ (SUGAM-AI), உங்கள் பிஐஎஸ் இணக்க நுண்ணறிவு உதவியாளர். இந்திய தரநிலைகள், கட்டணம் மற்றும் சோதனைகள் பற்றி என்னிடம் கேளுங்கள்.',
  te: 'నమస్కారం! నేను సుగమ్-ఏఐ (SUGAM-AI), మీ బిఐఎస్ నిబంధనల సహాయకుడిని. ఏదైనా భారతీయ ప్రమాణం, కాలక్రమం మరియు ఫీజు వివరాలను నన్ను అడగండి.',
  mr: 'नमस्कार! मी सुगम-एआय (SUGAM-AI) आहे, आपला बीआयएस अनुपालन सहाय्यक. मला कोणत्याही भारतीय मानके, फी आणि आवश्यक चाचण्यांविषयी विचारा.',
  gu: 'નમસ્તે! હું સુગમ-એઆઈ (SUGAM-AI) છું, તમારો બીઆઈએસ અનુપાલન સહાયક. મને કોઈપણ ભારતીય ધોરણો, સમયરેખા અને પરીક્ષણ વિશે પૂછો.',
  kn: 'ನಮಸ್ಕಾರ! ನಾನು ಸುಗಮ್-ಎಐ (SUGAM-AI), ನಿಮ್ಮ ಬಿಐಎಸ್ ಅನುಸರಣೆ ಸಹಾಯಕ. ಭಾರತೀಯ ಮಾನದಂಡಗಳು ಮತ್ತು ಪರೀಕ್ಷಾ ವಿಧಾನಗಳ ಬಗ್ಗೆ ನನ್ನನ್ನು ಕೇಳಿ.',
  ml: 'നമസ്കാരം! ഞാൻ സുഗം-എഐ (SUGAM-AI), നിങ്ങളുടെ ബിഐഎസ് പാലിക്കൽ സഹായി. ഇന്ത്യൻ മാനദണ്ഡങ്ങളെക്കുറിച്ചും പരിശോധനകളെക്കുറിച്ചും എന്നോട് ചോദിക്കൂ.',
  pa: 'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ ਸੁਗਮ-ਏਆਈ (SUGAM-AI) ਹਾਂ, ਤੁਹਾਡਾ ਬੀਆਈਐਸ ਸਹਾਇਕ। ਕਿਸੇ ਵੀ ਭਾਰਤੀ ਮਾਪਦੰਡ, ਫੀਸ ਅਤੇ ਟੈਸਟਿੰਗ ਬਾਰੇ ਪੁੱਛੋ।',
  or: 'ନମସ୍କାର! ମୁଁ ସୁଗମ-ଏଆଇ (SUGAM-AI), ଆପଣଙ୍କ ବିଆଇଏସ ଅନୁପାଳନ ସହାୟକ। ଯେକୌଣସି ଭାରତୀୟ ମାନକ ଏବଂ ପରୀକ୍ଷଣ ବିଷୟରେ ପଚାରନ୍ତୁ।'
};

export const TRANSLATED_DESCRIPTIONS: Record<string, Record<string, string>> = {
  'is-17526': {
    en: 'Based on our grounded BIS Knowledge Base and NLP attribute matching, IS 17526:2021 directly governs Stainless Steel Vacuum Insulated Flasks and Bottles. Under the official Quality Control Order (QCO), certification is mandatory before manufacturing, importing, or selling in India.',
    hi: 'हमारे बीआईएस नॉलेज बेस और एनएलपी के अनुसार, स्टेनलेस स्टील वैक्यूम इन्सुलेटेड फ्लास्क और बोतलों के लिए IS 17526:2021 सीधे लागू होता है। डीपीआईआईटी के गुणवत्ता नियंत्रण आदेश (QCO) के तहत भारत में इसका निर्माण या बिक्री करने से पहले आईएसआई (ISI) मार्क अनिवार्य है।',
    hinglish: 'Grounded BIS Knowledge Base ke mutabiq, Stainless Steel vacuum bottles ke liye IS 17526:2021 strictly mandatory hai. DPIIT QCO ke tahat iska ISI certification zaroori hai. Niche iska complete timeline aur cost breakdown diya gaya hai.',
    bn: 'আমাদের বিআইএস ডাটাবেস অনুযায়ী, স্টেইনলেস স্টিল ভ্যাকুয়াম বোতলগুলির জন্য IS 17526:2021 বাধ্যতামূলক। সরকারি কিউসিও (QCO) নিয়ম অনুযায়ী বিক্রির পূর্বে আইএসআই মার্ক নেওয়া আবশ্যক।',
    ta: 'எங்கள் பிஐஎஸ் தரவுத்தளத்தின்படி, துருப்பிடிக்காத எஃகு வெற்றிட பாட்டில்களுக்கு IS 17526:2021 கட்டாயமாகும். அரசு QCO உத்தரவின் கீழ் இந்தியாவில் உற்பத்தி செய்வதற்கு முன் ஐஎஸ்ஐ முத்திரை அவசியம்.',
    te: 'మా బిఐఎస్ నాలెడ్జ్ బేస్ ప్రకారం, స్టెయిన్‌లెస్ స్టీల్ వాక్యూమ్ బాటిళ్లకు IS 17526:2021 తప్పనిసరిగా వర్తిస్తుంది. ప్రభుత్వం జారీ చేసిన QCO ఉత్తర్వుల ప్రకారం ఐఎస్ఐ మార్క్ తప్పనిసరి.',
    mr: 'आमच्या बीआयएस डेटाबेसनुसार, स्टेनलेस स्टील व्हॅक्यूम इन्सुलेटेड बाटल्यांसाठी IS 17526:2021 थेट लागू आहे. सरकारी QCO आदेशानुसार विक्रीपूर्वी आयएसआय (ISI) मार्क अनिवार्य आहे.',
    gu: 'અમારા બીઆઈએસ જ્ઞાન આધાર અનુસાર, સ્ટેનલેસ સ્ટીલ વેક્યુમ બોટલો માટે IS 17526:2021 સીધું લાગુ પડે છે. સરકારી QCO હેઠળ ISI માર્ક ફરજિયાત છે.',
    kn: 'ನಮ್ಮ ಬಿಐಎಸ್ ಡೇಟಾಬೇಸ್ ಪ್ರಕಾರ, ಸ್ಟೇನ್‌ಲೆಸ್ ಸ್ಟೀಲ್ ವ್ಯಾಕ್ಯೂಮ್ ಬಾಟಲಿಗಳಿಗೆ IS 17526:2021 ಕಡ್ಡಾಯವಾಗಿ ಅನ್ವಯಿಸುತ್ತದೆ. ಅಧಿಕೃತ QCO ಆದೇಶದ ಅಡಿಯಲ್ಲಿ ISI ಮಾರ್ಕ್ ಕಡ್ಡಾಯವಾಗಿದೆ.',
    ml: 'ഞങ്ങളുടെ ബിഐഎസ് ഡാറ്റാബേസ് പ്രകാരം, സ്റ്റെയിൻലെസ് സ്റ്റീൽ വാക്വം ബോട്ടിലുകൾക്ക് IS 17526:2021 നിർബന്ധമാണ്. ഔദ്യോഗിക QCO ഉത്തരവ് പ്രകാരം നിർമ്മാണത്തിന് മുൻപ് ഐഎസ്ഐ മാർക്ക് ആവശ്യമാണ്.',
    pa: 'ਸਾਡੇ ਬੀਆਈਐਸ ਡਾਟਾਬੇਸ ਅਨੁਸਾਰ, ਸਟੇਨਲੈਸ ਸਟੀਲ ਵੈਕਿਊਮ ਬੋਤਲਾਂ ਲਈ IS 17526:2021 ਲਾਜ਼ਮੀ ਹੈ। ਸਰਕਾਰੀ QCO ਅਧੀਨ ISI ਮਾਰਕ ਜ਼ਰੂਰੀ ਹੈ।',
    or: 'ଆମର ବିଆଇଏସ ଡାଟାବେସ ଅନୁଯାୟୀ, ଷ୍ଟେନଲେସ ଷ୍ଟିଲ ଭ୍ୟାକ୍ୟୁମ ବୋତଲ ପାଇଁ IS 17526:2021 ବାଧ୍ୟତାମୂଳକ। ବିକ୍ରୟ ପୂର୍ବରୁ ଆଇଏସଆଇ ମାର୍କ ଆବଶ୍ୟକ।'
  },
  'is-13252': {
    en: 'For smartphone power adapters, chargers and SMPS, IS 13252 (Part 1):2010 applies under MeitY Compulsory Registration Scheme (CRS Scheme-II). Dielectric voltage breakdown and temperature rise tests are strictly mandatory.',
    hi: 'स्मार्टफोन पावर एडेप्टर, चार्जर और एसएमपीएस के लिए MeitY की अनिवार्य पंजीकरण योजना (CRS Scheme-II) के तहत IS 13252 (Part 1):2010 लागू होता है। उच्च वोल्टेज और तापमान परीक्षण अनिवार्य हैं।',
    hinglish: 'Smartphone power adapters aur mobile chargers ke liye IS 13252 (Part 1):2010 MeitY CRS Scheme-II ke under mandatory hai. Isme factory audit nahi hota, direct lab test aur CRS registration milta hai.',
    bn: 'মোবাইল চার্জার এবং পাওয়ার অ্যাডাপ্টারের জন্য MeitY সিআরএস স্কিমের অধীনে IS 13252 (Part 1):2010 প্রযোজ্য। বৈদ্যুতিক সুরক্ষা পরীক্ষা বাধ্যতামূলক।',
    ta: 'ஸ்மார்ட்போன் சார்ஜர்கள் மற்றும் அடாப்டர்களுக்கு MeitY CRS திட்டத்தின் கீழ் IS 13252 (Part 1):2010 பொருந்தும். உயர் மின்னழுத்த பாதுகாப்பு சோதனை கட்டாயமாகும்.',
    te: 'మొబైల్ ఛార్జర్లు మరియు అడాప్టర్ల కోసం MeitY CRS స్కీమ్ క్రింద IS 13252 (Part 1):2010 వర్తిస్తుంది. విద్యుత్ భద్రతా పరీక్షలు తప్పనిసరి.',
    mr: 'स्मार्टफोन चार्जर आणि पॉवर अडॅप्टरसाठी MeitY CRS योजनेअंतर्गत IS 13252 (Part 1):2010 लागू होते. इलेक्ट्रिकल सुरक्षा चाचण्या बंधनकारक आहेत.',
    gu: 'સ્માર્ટફોન ચાર્જર અને પાવર એડેપ્ટર માટે MeitY CRS યોજના હેઠળ IS 13252 (Part 1):2010 લાગુ પડે છે. વિદ્યુત સુરક્ષા પરીક્ષણ ફરજિયાત છે.',
    kn: 'ಮೊಬೈಲ್ ಚಾರ್ಜರ್‌ಗಳು ಮತ್ತು ಅಡಾಪ್ಟರ್‌ಗಳಿಗೆ MeitY CRS ಅಡಿಯಲ್ಲಿ IS 13252 (Part 1):2010 ಅನ್ವಯಿಸುತ್ತದೆ. ವಿದ್ಯುತ್ ಸುರಕ್ಷತಾ ಪರೀಕ್ಷೆಗಳು ಕಡ್ಡಾಯ.',
    ml: 'മൊബൈൽ ചാർജറുകൾക്കും പവർ അഡാപ്റ്ററുകൾക്കും MeitY CRS സ്കീമിന് കീഴിൽ IS 13252 (Part 1):2010 ബാധകമാണ്.',
    pa: 'ਮੋਬਾਈਲ ਚਾਰਜਰਾਂ ਅਤੇ ਪਾਵਰ ਅਡੈਪਟਰਾਂ ਲਈ MeitY CRS ਸਕੀਮ ਅਧੀਨ IS 13252 (Part 1):2010 ਲਾਗੂ ਹੁੰਦਾ ਹੈ।',
    or: 'ମୋବାଇଲ ଚାର୍ଜର ପାଇଁ MeitY CRS ଯୋଜନା ଅଧୀନରେ IS 13252 (Part 1):2010 ଲାଗୁ ହୁଏ।'
  },
  'is-4151': {
    en: 'Two-wheeler motorcycle protective helmets are strictly governed by IS 4151:2015. Under Ministry of Road Transport and Highways (MoRTH) mandate, selling non-ISI helmets is a punishable criminal offense across India.',
    hi: 'दोपहिया वाहन सुरक्षात्मक हेलमेट IS 4151:2015 द्वारा कड़ाई से नियंत्रित होते हैं। सड़क परिवहन मंत्रालय (MoRTH) के आदेशानुसार, गैर-आईएसआई हेलमेट बेचना पूरे भारत में दंडनीय अपराध है।',
    hinglish: 'Two-wheeler helmets ke liye IS 4151:2015 strictly mandatory hai. MoRTH ke rules ke mutabiq non-ISI helmet bechna illegal hai. Weight limit 1.2 kg max aur impact drop test compulsory hai.',
    bn: 'মোটরসাইকেল হেলমেটের জন্য IS 4151:2015 সম্পূর্ণ বাধ্যতামূলক। সড়ক পরিবহন মন্ত্রকের নির্দেশ অনুসারে অ-আইএসআই হেলমেট বিক্রি আইনত দণ্ডনীয়।',
    ta: 'இருசக்கர வாகன ஹெல்மெட்டுகளுக்கு IS 4151:2015 கட்டாயமாகும். ஐஎஸ்ஐ முத்திரை இல்லாத ஹெல்மெட்களை விற்பது இந்தியாவில் சட்டப்படி குற்றமாகும்.',
    te: 'ద్విచక్ర వాహన హెల్మెట్లకు IS 4151:2015 ఖచ్చితంగా వర్తిస్తుంది. నాన్-ఐఎస్ఐ హెల్మెట్లను అమ్మడం చట్టరీత్యా నేరం.',
    mr: 'दुचाकीस्वारांच्या हेल्मेटसाठी IS 4151:2015 अत्यंत काटेकोरपणे लागू आहे. विना-ISI हेल्मेट विकणे हा गुन्हा आहे.',
    gu: 'દ્વિચક્રી વાહન હેલ્મેટ માટે IS 4151:2015 ફરજિયાત છે. નોન-ISI હેલ્મેટ વેચવું એ કાયદેસરનો ગુનો છે.',
    kn: 'ದ್ವಿಚಕ್ರ ವಾಹನ ಹೆಲ್ಮೆಟ್‌ಗಳಿಗೆ IS 4151:2015 ಕಡ್ಡಾಯವಾಗಿದೆ. ಐಎಸ್‌ಐ ಇಲ್ಲದ ಹೆಲ್ಮೆಟ್‌ಗಳನ್ನು ಮಾರಾಟ ಮಾಡುವುದು ಶಿಕ್ಷಾರ್ಹ ಅಪರಾಧ.',
    ml: 'ഇരുചക്ര വാഹന ഹെൽമെറ്റുകൾക്ക് IS 4151:2015 നിർബന്ധമാണ്. ഐഎസ്ഐ ഇല്ലാത്ത ഹെൽമെറ്റുകൾ വിൽക്കുന്നത് കുറ്റകരമാണ്.',
    pa: 'ਦੋਪਹੀਆ ਵਾਹਨ ਹੈਲਮੇਟਾਂ ਲਈ IS 4151:2015 ਲਾਜ਼ਮੀ ਹੈ। ਗੈਰ-ਆਈਐਸਆਈ ਹੈਲਮੇਟ ਵੇਚਣਾ ਗੈਰ-ਕਾਨੂੰਨੀ ਹੈ।',
    or: 'ଦୁଇ ଚକିଆ ହେଲମେଟ ପାଇଁ IS 4151:2015 ବାଧ୍ୟତାମୂଳକ। ବିନା-ଆଇଏସଆଇ ହେଲମେଟ ବିକ୍ରୟ ଏକ ଅପରାଧ।'
  }
};