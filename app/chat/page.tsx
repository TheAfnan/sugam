'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, User, Send, Copy, Download, ExternalLink, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import jsPDF from 'jspdf';
import { useLanguageStore, LANGUAGES } from '@/lib/store';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  citedStandards?: string[];
  timeline?: { total_days: number };
  cost?: { min: number; max: number };
}

const TRANSLATIONS: Record<string, any> = {
  en: {
    title: "SUGAM Chat",
    subtitle: "AI-powered BIS certification assistant",
    clear: "Clear Chat",
    basedOn: "Based on",
    timeline: "Estimated Timeline",
    cost: "Estimated Cost",
    copy: "Copy message",
    download: "Download PDF",
    searching: "Searching standards...",
    prompt: "Describe your product or ask about Indian Standards...",
    hint: "Ask about certification procedures, timelines, costs, or specific Indian Standards",
    enter: "Press Enter to send",
    send: "Send",
    welcome: "Welcome to SUGAM! I'm here to help you find Indian Standards, understand certification procedures, and guide you through the BIS process. What product or service would you like to get certified?",
    error: "I could not reach the BIS assistant right now. Please check your connection and try again."
  },
  hi: {
    title: "सुगम चैट",
    subtitle: "AI-संचालित BIS प्रमाणन सहायक",
    clear: "चैट साफ़ करें",
    basedOn: "आधारित मानक",
    timeline: "अनुमानित समयसीमा",
    cost: "अनुमानित लागत",
    copy: "संदेश कॉपी करें",
    download: "PDF डाउनलोड करें",
    searching: "मानक खोजे जा रहे हैं...",
    prompt: "अपने उत्पाद का वर्णन करें या भारतीय मानकों के बारे में पूछें...",
    hint: "प्रमाणन प्रक्रिया, समयसीमा, लागत या भारतीय मानकों के बारे में पूछें",
    enter: "भेजने के लिए Enter दबाएं",
    send: "भेजें",
    welcome: "सुगम में आपका स्वागत है! मैं भारतीय मानकों, प्रमाणन प्रक्रिया और BIS के बारे में आपकी सहायता करूंगा। आप किस उत्पाद या सेवा को प्रमाणित कराना चाहते हैं?",
    error: "BIS सहायक से संपर्क नहीं हो सका। कृपया अपना कनेक्शन जांचें और फिर प्रयास करें।"
  },
  ta: {
    title: "சுகம் அரட்டை",
    subtitle: "AI மூலம் இயக்கப்படும் BIS சான்றிதழ் உதவியாளர்",
    clear: "அரட்டையை அழி",
    basedOn: "ஆதாரம்",
    timeline: "மதிப்பிடப்பட்ட காலம்",
    cost: "மதிப்பிடப்பட்ட செலவு",
    copy: "செய்தியை நகலெடு",
    download: "PDF பதிவிறக்கு",
    searching: "தரநிலைகள் தேடப்படுகின்றன...",
    prompt: "உங்கள் தயாரிப்பை விவரிக்கவும் அல்லது இந்திய தரநிலைகள் பற்றி கேட்கவும்...",
    hint: "சான்றிதழ் நடைமுறை, காலம், செலவு அல்லது இந்திய தரநிலைகள் பற்றி கேளுங்கள்",
    enter: "அனுப்ப Enter அழுத்தவும்",
    send: "அனுப்பு",
    welcome: "சுகமிற்கு வரவேற்கிறோம்! இந்திய தரநிலைகள் மற்றும் BIS சான்றிதழ் செயல்முறையில் உதவுகிறேன். எந்த தயாரிப்பு அல்லது சேவைக்கு சான்றிதழ் வேண்டும்?",
    error: "BIS உதவியாளரை அணுக முடியவில்லை. இணைப்பைச் சரிபார்த்து மீண்டும் முயற்சிக்கவும்."
  },
  te: {
    title: "సుగమ్ చాట్",
    subtitle: "AI ఆధారిత BIS ధృవీకరణ సహాయకుడు",
    clear: "చాట్ క్లియర్ చేయండి",
    basedOn: "ఆధారం",
    timeline: "అంచనా సమయం",
    cost: "అంచనా ఖర్చు",
    copy: "సందేశాన్ని కాపీ చేయండి",
    download: "PDF డౌన్‌లోడ్",
    searching: "ప్రమాణాలు వెతుకుతున్నాం...",
    prompt: "మీ ఉత్పత్తిని వివరించండి లేదా భారతీయ ప్రమాణాల గురించి అడగండి...",
    hint: "ధృవీకరణ ప్రక్రియ, సమయం, ఖర్చు లేదా భారతీయ ప్రమాణాల గురించి అడగండి",
    enter: "పంపడానికి Enter నొక్కండి",
    send: "పంపండి",
    welcome: "సుగమ్‌కు స్వాగతం! భారతీయ ప్రమాణాలు మరియు BIS ధృవీకరణ ప్రక్రియలో నేను సహాయపడతాను.",
    error: "BIS సహాయకుడిని చేరుకోలేకపోయాం."
  },
  kn: {
    title: "ಸುಗಮ್ ಚಾಟ್",
    subtitle: "AI ಆಧಾರಿತ BIS ಪ್ರಮಾಣೀಕರಣ ಸಹಾಯಕ",
    clear: "ತೆರವುಗೊಳಿಸಿ",
    basedOn: "ಆಧಾರಿತ",
    timeline: "ಅಂದಾಜು ಸಮಯ",
    cost: "ಅಂದಾಜು ವೆಚ್ಚ",
    copy: "ಸಂದೇಶ ನಕಲಿಸಿ",
    download: "PDF ಡೌನ್‌ಲೋಡ್",
    searching: "ಹುಡುಕಲಾಗುತ್ತಿದೆ...",
    prompt: "ಉತ್ಪನ್ನವನ್ನು ವಿವರಿಸಿ...",
    hint: "ಭಾರತೀಯ ಮಾನದಂಡಗಳ ಬಗ್ಗೆ ಕೇಳಿ",
    enter: "Enter ಒತ್ತಿ",
    send: "ಕಳುಹಿಸಿ",
    welcome: "ಸುಗಮ್‌ಗೆ ಸ್ವಾಗತ! ಭಾರತೀಯ ಮಾನದಂಡಗಳು ಮತ್ತು BIS ಪ್ರಮಾಣೀಕರಣದಲ್ಲಿ ಸಹಾಯ ಮಾಡುತ್ತೇನೆ.",
    error: "ಸಂಪರ್ಕಿಸಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ."
  },
  ml: {
    title: "സുഗം ചാറ്റ്",
    subtitle: "AI അധിഷ്ഠിത BIS സർട്ടിഫിക്കേഷൻ സഹായി",
    clear: "മായ്ക്കുക",
    basedOn: "അടിസ്ഥാനം",
    timeline: "കണക്കാക്കിയ സമയം",
    cost: "കണക്കാക്കിയ ചെലവ്",
    copy: "പകർത്തുക",
    download: "PDF ഡൗൺലോഡ്",
    searching: "തിരയുന്നു...",
    prompt: "ഉൽപ്പന്നം വിവരിക്കുക...",
    hint: "ഇന്ത്യൻ മാനദണ്ഡങ്ങളെക്കുറിച്ച് ചോദിക്കുക",
    enter: "Enter അമർത്തുക",
    send: "അയയ്ക്കുക",
    welcome: "സുഗമിലേക്ക് സ്വാഗതം! BIS സർട്ടിഫിക്കേഷൻ നടപടികൾ മനസ്സിലാക്കാൻ ഞാൻ സഹായിക്കും.",
    error: "ബന്ധപ്പെടാനായില്ല."
  },
  mr: {
    title: "सुगम चॅट",
    subtitle: "AI-आधारित BIS प्रमाणन सहाय्यक",
    clear: "साफ करा",
    basedOn: "आधारित",
    timeline: "अंदाजे कालावधी",
    cost: "अंदाजे खर्च",
    copy: "कॉपी करा",
    download: "PDF डाउनलोड",
    searching: "शोधत आहे...",
    prompt: "उत्पादनाचे वर्णन करा...",
    hint: "प्रमाणन प्रक्रिया, कालावधीबद्दल विचारा",
    enter: "Enter दाबा",
    send: "पाठवा",
    welcome: "सुगममध्ये स्वागत आहे! भारतीय मानके आणि BIS प्रमाणन प्रक्रियेत मी मदत करेन.",
    error: "संपर्क होऊ शकला नाही."
  },
  gu: {
    title: "સુગમ ચેટ",
    subtitle: "AI આધારિત BIS પ્રમાણન સહાયક",
    clear: "સાફ કરો",
    basedOn: "આધારિત",
    timeline: "અંદાજિત સમય",
    cost: "અંદાજિત ખર્ચ",
    copy: "કૉપી કરો",
    download: "PDF ડાઉનલોડ",
    searching: "શોધી રહ્યાં છીએ...",
    prompt: "ઉત્પાદનનું વર્ણન કરો...",
    hint: "ભારતીય ધોરણો વિશે પૂછો",
    enter: "Enter દબાવો",
    send: "મોકલો",
    welcome: "સુગમમાં આપનું સ્વાગત છે! ભારતીય ધોરણો અને BIS પ્રમાણનમાં મદદ કરીશ.",
    error: "સંપર્ક થઈ શક્યો નથી."
  },
  pa: {
    title: "ਸੁਗਮ ਚੈਟ",
    subtitle: "AI ਆਧਾਰਿਤ BIS ਸਰਟੀਫਿਕੇਸ਼ਨ ਸਹਾਇਕ",
    clear: "ਸਾਫ਼ ਕਰੋ",
    basedOn: "ਆਧਾਰਿਤ",
    timeline: "ਅੰਦਾਜ਼ਨ ਸਮਾਂ",
    cost: "ਅੰਦਾਜ਼ਨ ਲਾਗਤ",
    copy: "ਕਾਪੀ ਕਰੋ",
    download: "PDF ਡਾਊਨਲੋਡ",
    searching: "ਲੱਭੇ ਜਾ ਰਹੇ ਹਨ...",
    prompt: "ਉਤਪਾਦ ਦਾ ਵੇਰਵਾ ਦਿਓ...",
    hint: "ਭਾਰਤੀ ਮਿਆਰਾਂ ਬਾਰੇ ਪੁੱਛੋ",
    enter: "Enter ਦਬਾਓ",
    send: "ਭੇਜੋ",
    welcome: "ਸੁਗਮ ਵਿੱਚ ਜੀ ਆਇਆਂ ਨੂੰ! ਮੈਂ ਭਾਰਤੀ ਮਿਆਰਾਂ ਅਤੇ BIS ਸਰਟੀਫਿਕੇਸ਼ਨ ਵਿੱਚ ਮਦਦ ਕਰਾਂਗਾ।",
    error: "ਸੰਪਰਕ ਨਹੀਂ ਹੋ ਸਕਿਆ।"
  },
  bn: {
    title: "সুগম চ্যাট",
    subtitle: "AI-চালিত BIS সার্টিফিকেশন সহায়ক",
    clear: "পরিষ্কার করুন",
    basedOn: "ভিত্তি",
    timeline: "আনুমানিক সময়",
    cost: "আনুমানিক খরচ",
    copy: "কপি করুন",
    download: "PDF ডাউনলোড",
    searching: "খোঁজা হচ্ছে...",
    prompt: "পণ্যের বর্ণনা দিন...",
    hint: "সার্টিফিকেশন প্রক্রিয়া ও খরচ সম্পর্কে জানুন",
    enter: "Enter চাপুন",
    send: "পাঠান",
    welcome: "সুগমে স্বাগতম! ভারতীয় মান এবং BIS সার্টিফিকেশন প্রক্রিয়ায় আপনাকে সাহায্য করব।",
    error: "যোগাযোগ করা যায়নি।"
  },
  or: {
    title: "ସୁଗମ ଚାଟ୍",
    subtitle: "AI ଆଧାରିତ BIS ପ୍ରମାଣୀକରଣ ସହାୟକ",
    clear: "ସଫା କରନ୍ତୁ",
    basedOn: "ଆଧାରିତ",
    timeline: "ଆନୁମାନିକ ସମୟ",
    cost: "ଆନୁମାନିକ ଖର୍ଚ୍ଚ",
    copy: "କପି କରନ୍ତୁ",
    download: "PDF ଡାଉନଲୋଡ୍",
    searching: "ଖୋଜାଯାଉଛି...",
    prompt: "ଉତ୍ପାଦ ବର୍ଣ୍ଣନା କରନ୍ତୁ...",
    hint: "ଭାରତୀୟ ମାନକ ବିଷୟରେ ପଚାରନ୍ତୁ",
    enter: "Enter ଦବାନ୍ତୁ",
    send: "ପଠାନ୍ତୁ",
    welcome: "ସୁଗମକୁ ସ୍ୱାଗତ! ଭାରତୀୟ ମାନକ ଏବଂ BIS ପ୍ରମାଣୀକରଣରେ ମୁଁ ସାହାଯ୍ୟ କରିବି।",
    error: "ସଂଯୋଗ ଯାଞ୍ଚ କରନ୍ତୁ।"
  }
};

function formatText(text: string) {
  return String(text || '')
    .replace(/\r\n/g, '\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function renderInline(text: string, keyPrefix: string) {
  return text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={`${keyPrefix}-${i}`}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code key={`${keyPrefix}-${i}`} className="rounded bg-gray-100 px-1 py-0.5 text-xs text-teal-800 font-mono">
          {part.slice(1, -1)}
        </code>
      );
    }
    return <span key={`${keyPrefix}-${i}`}>{part}</span>;
  });
}

function MarkdownRenderer({ content }: { content: string }) {
  const blocks = formatText(content).split(/\n\s*\n/).filter(Boolean);

  return (
    <div className="space-y-3 text-sm leading-relaxed text-gray-800">
      {blocks.map((block, bIdx) => {
        const lines = block.split('\n').filter((l) => l.trim());

        // Table detection
        if (lines.length >= 2 && lines.every((l) => l.includes('|'))) {
          const contentLines = lines.filter(
            (l) => !/^\s*\|?\s*:?-+:?\s*(\|\s*:?-+:?\s*)+\|?\s*$/.test(l)
          );
          return (
            <div key={bIdx} className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm my-3">
              <table className="min-w-full text-left text-xs">
                <tbody>
                  {contentLines.map((row, rIdx) => {
                    const cells = row
                      .split('|')
                      .filter((_, i, arr) => !(i === 0 && !arr[0].trim()) && !(i === arr.length - 1 && !arr[arr.length - 1].trim()));
                    return (
                      <tr key={rIdx} className={rIdx === 0 ? 'bg-teal-50/70 font-semibold text-teal-900 border-b border-teal-100' : 'border-t border-gray-100 hover:bg-gray-50/50'}>
                        {cells.map((cell, cIdx) => (
                          <td key={cIdx} className="px-3.5 py-2.5 align-top">
                            {renderInline(cell.trim(), `${bIdx}-${rIdx}-${cIdx}`)}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          );
        }

        // Bullet list
        if (lines.every((l) => /^\s*(?:[-*•])\s*/.test(l))) {
          return (
            <ul key={bIdx} className="list-disc space-y-1.5 pl-5 text-gray-700">
              {lines.map((l, lIdx) => (
                <li key={lIdx}>{renderInline(l.replace(/^\s*(?:[-*•])\s*/, ''), `${bIdx}-${lIdx}`)}</li>
              ))}
            </ul>
          );
        }

        // Numbered list
        if (lines.every((l) => /^\s*\d+[.)]\s+/.test(l))) {
          return (
            <ol key={bIdx} className="list-decimal space-y-1.5 pl-5 text-gray-700">
              {lines.map((l, lIdx) => (
                <li key={lIdx}>{renderInline(l.replace(/^\s*\d+[.)]\s+/, ''), `${bIdx}-${lIdx}`)}</li>
              ))}
            </ol>
          );
        }

        // Headings & paragraphs
        return (
          <div key={bIdx} className="space-y-1">
            {lines.map((line, lIdx) => {
              const hMatch = line.match(/^#{1,3}\s+(.+)/);
              if (hMatch) {
                return (
                  <h3 key={lIdx} className="text-base font-bold text-teal-900 mt-2">
                    {renderInline(hMatch[1], `${bIdx}-${lIdx}`)}
                  </h3>
                );
              }
              return (
                <p key={lIdx} className="m-0 text-gray-700 leading-relaxed">
                  {renderInline(line, `${bIdx}-${lIdx}`)}
                </p>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

export default function ChatPage() {
  const { activeLanguage, setLanguage } = useLanguageStore();
  const t = TRANSLATIONS[activeLanguage] || TRANSLATIONS.en;

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: t.welcome,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    setMessages((prev) =>
      prev.length === 1 && prev[0].id === '1' ? [{ ...prev[0], content: t.welcome }] : prev
    );
  }, [t.welcome]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userText = input.trim();
    const userMsg: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: userText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          language: activeLanguage,
          conversation_history: messages.slice(-5),
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Chat request failed');
      }

      const payload = data.data || data;
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: payload.message || payload.response || 'Guidance received.',
        timestamp: new Date(),
        citedStandards: payload.citedStandards || payload.metadata?.sources?.map((s: any) => s.standard_number),
        timeline: payload.timeline,
        cost: payload.cost,
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error('Chat error:', err);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: t.error,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleDownloadPdf = (msg: Message) => {
    const doc = new jsPDF('p', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let currentY = 20;

    const addText = (text: string, size: number, isBold: boolean = false) => {
      doc.setFont('helvetica', isBold ? 'bold' : 'normal');
      doc.setFontSize(size);
      const lines = doc.splitTextToSize(text, pageWidth - 40);
      lines.forEach((l: string) => {
        if (currentY > pageHeight - 20) {
          doc.addPage();
          currentY = 20;
        }
        doc.text(l, 20, currentY);
        currentY += 7;
      });
    };

    addText('SUGAM — BIS Compliance & Standards Dossier', 16, true);
    currentY += 4;
    addText(`Generated: ${msg.timestamp.toLocaleString()}`, 9);
    currentY += 6;
    addText(msg.content.replace(/[*#|`-]/g, ''), 11);

    if (msg.citedStandards && msg.citedStandards.length > 0) {
      currentY += 6;
      addText('Referenced Standards:', 12, true);
      addText(msg.citedStandards.join(', '), 10);
    }

    doc.save(`sugam-bis-dossier-${msg.timestamp.toISOString().slice(0, 10)}.pdf`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-3.5 sticky top-0 z-30 shadow-xs">
        <div className="flex items-center justify-between max-w-5xl mx-auto">
          <div className="flex items-center gap-4">
            <Link href="/" className="p-1.5 rounded-lg text-gray-500 hover:text-teal-600 hover:bg-gray-100 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-teal-600 to-emerald-600 rounded-xl flex items-center justify-center shadow-sm">
                <span className="text-white font-black text-xs">SU</span>
              </div>
              <div>
                <h1 className="text-base font-bold text-gray-900 leading-tight">{t.title}</h1>
                <p className="text-xs text-gray-500">{t.subtitle}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={activeLanguage}
              onChange={(e) => setLanguage(e.target.value)}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-xs font-medium text-gray-700 bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none cursor-pointer"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.nativeName}
                </option>
              ))}
            </select>

            <button
              onClick={() => setMessages([messages[0]])}
              className="px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {t.clear}
            </button>
          </div>
        </div>
      </header>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 max-w-4xl w-full mx-auto">
        <AnimatePresence initial={false}>
          {messages.map((m) => {
            const isUser = m.type === 'user';
            return (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className={`mb-6 flex ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex gap-3 max-w-2xl sm:max-w-3xl ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                  {/* Avatar */}
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      isUser ? 'bg-teal-600 text-white' : 'bg-teal-100 text-teal-800'
                    }`}
                  >
                    {isUser ? <User size={16} /> : <Bot size={16} />}
                  </div>

                  {/* Bubble */}
                  <div
                    className={`rounded-2xl px-5 py-4 ${
                      isUser
                        ? 'bg-teal-600 text-white shadow-sm'
                        : 'bg-white border border-gray-200/80 shadow-sm'
                    }`}
                  >
                    {isUser ? (
                      <p className="m-0 text-sm whitespace-pre-wrap leading-relaxed">{m.content}</p>
                    ) : (
                      <MarkdownRenderer content={m.content} />
                    )}

                    {/* Cited Standards */}
                    {m.citedStandards && m.citedStandards.length > 0 && (
                      <div className="mt-4 pt-3 border-t border-gray-100">
                        <p className="text-xs font-semibold text-gray-500 mb-2">{t.basedOn}:</p>
                        <div className="flex flex-wrap gap-2">
                          {m.citedStandards.map((std, sIdx) => (
                            <Link
                              key={sIdx}
                              href={`/compare`}
                              className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-200 hover:bg-teal-100 transition-colors"
                            >
                              {std}
                              <ExternalLink size={11} className="ml-1.5" />
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Timeline & Cost card */}
                    {(m.timeline || m.cost) && (
                      <div className="mt-4 pt-3 border-t border-gray-100">
                        <div className="grid grid-cols-2 gap-4 text-xs bg-gray-50 p-3 rounded-xl border border-gray-100">
                          {m.timeline && (
                            <div>
                              <p className="font-semibold text-gray-500 mb-0.5">{t.timeline}</p>
                              <p className="text-sm font-bold text-teal-800">{m.timeline.total_days} days</p>
                            </div>
                          )}
                          {m.cost && (
                            <div>
                              <p className="font-semibold text-gray-500 mb-0.5">{t.cost}</p>
                              <p className="text-sm font-bold text-teal-800">
                                ₹{m.cost.min?.toLocaleString('en-IN')} – ₹{m.cost.max?.toLocaleString('en-IN')}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Action buttons for Bot */}
                    {!isUser && (
                      <div className="flex items-center gap-2 mt-3 pt-2 border-t border-gray-100">
                        <button
                          onClick={() => handleCopy(m.content)}
                          className="p-1.5 text-gray-400 hover:text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
                          title={t.copy}
                        >
                          <Copy size={14} />
                        </button>
                        <button
                          onClick={() => handleDownloadPdf(m)}
                          className="p-1.5 text-gray-400 hover:text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
                          title={t.download}
                        >
                          <Download size={14} />
                        </button>
                      </div>
                    )}

                    <p className={`text-[10px] mt-2 ${isUser ? 'text-teal-100' : 'text-gray-400'}`}>
                      {m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Loading Indicator */}
        {isLoading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start mb-6">
            <div className="flex gap-3 max-w-2xl">
              <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center flex-shrink-0">
                <Bot size={16} />
              </div>
              <div className="bg-white border border-gray-200 shadow-sm rounded-2xl px-4 py-3 flex items-center gap-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-teal-600 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-teal-600 rounded-full animate-bounce [animation-delay:0.15s]" />
                  <div className="w-2 h-2 bg-teal-600 rounded-full animate-bounce [animation-delay:0.3s]" />
                </div>
                <span className="text-xs font-medium text-gray-500">{t.searching}</span>
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="border-t border-gray-200 bg-white px-4 sm:px-6 py-4 sticky bottom-0 z-20">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSend} className="flex gap-3">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t.prompt}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none text-sm transition-all shadow-xs"
              disabled={isLoading}
            />
            <motion.button
              type="submit"
              disabled={!input.trim() || isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-3 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white rounded-xl font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm flex items-center gap-2"
            >
              <Send size={15} />
              <span className="hidden sm:inline">{t.send}</span>
            </motion.button>
          </form>

          <div className="flex items-center justify-between mt-2.5 text-[11px] text-gray-400">
            <p>{t.hint}</p>
            <p className="hidden sm:inline">{t.enter}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
