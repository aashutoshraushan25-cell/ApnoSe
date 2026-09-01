# 🌸 अपनों से (ApnoSe) - वरिष्ठ व पारिवारिक सोशल प्लेटफॉर्म

> **"अपनों से जुड़ें, दिल से बात करें"** — एक सरल, सुरक्षित और सुलभ पारिवारिक सोशल नेटवर्क, विशेष रूप से वरिष्ठ नागरिकों (40+ एवं बुजुर्गों) के लिए डिज़ाइन किया गया।

[![Node.js CI](https://github.com/aashutoshraushan25-cell/ApnoSe/actions/workflows/ci.yml/badge.svg)](https://github.com/aashutoshraushan25-cell/ApnoSe/actions/workflows/ci.yml)
[![Vite](https://img.shields.io/badge/Vite-6.x-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Supported-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.x-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

---

## ✨ प्रमुख विशेषताएं (Key Features)

- **💬 आधुनिक व सुलभ बातचीत (Messages)**:
  - **Text-to-Speech (बोलकर सुनें)**: वरिष्ठ नागरिक किसी भी संदेश के पास बने स्पीकर बटन से हिंदी आवाज़ में संदेश सुन सकते हैं।
  - **इंटरैक्टिव वॉइस नोट्स**: 1-टैप में वॉइस नोट रिकॉर्ड करें व वेवफॉर्म प्लेयर के साथ सुनें।
  - **त्वरित आशीर्वाद व संदेश पट्टी**: *🙏 सादर प्रणाम*, *🌸 शुभ प्रभात*, *❤️ खुश रहो बेटा*, *☕ चाय पी ली?* आदि।
  - **1-टच कॉलिंग**: सीधे चैट हेडर से ऑडियो और वीडियो कॉल शुरू करें।
  - **संपर्क विवरण व सुरक्षा सलाह**: धोखाधड़ी व साइबर सुरक्षा से बचाव के लिए स्पष्ट निर्देश।

- **👨‍👩‍👧 पारिवारिक सुरक्षा व जुड़ाव**:
  - परिवार के सदस्यों का अलग से सेक्शन और रिश्ते के अनुसार फ़िल्टर।
  - जन्मदिवस व शादी की सालगिरह के स्वतः स्मरण व ग्रीटिंग्स।
  - आपातकालीन सहायता व सुरक्षा केंद्र।

- **🎙️ सरल वॉइस-टू-पोस्ट (Voice Posting)**:
  - बोलकर पोस्ट लिखने और वॉइस स्टेटस शेयर करने की सुविधा।

- **👓 वरिष्ठ अनुकूल यूआई (Accessibility First)**:
  - बड़े टेक्स्ट फ़ॉन्ट विकल्प (Normal / Large / Extra Large)।
  - हाई कॉन्ट्रास्ट मोड (High Contrast Mode)।
  - स्पष्ट देवनागरी व हिंदी टाइपोग्राफी।

---

## 🛠️ तकनीकी ढांचा (Tech Stack)

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons, Canvas Confetti
- **Backend**: Node.js, Express.js, Mongoose
- **Database**: MongoDB (Local / Atlas)
- **Audio & Speech**: Web Speech API (SpeechRecognition & SpeechSynthesis)
- **CI/CD**: GitHub Actions

---

## 🚀 शुरुआत कैसे करें (Getting Started)

### 1. रिपॉजिटरी क्लोन करें

```bash
git clone https://github.com/aashutoshraushan25-cell/ApnoSe.git
cd ApnoSe
```

### 2. पैकेज इंस्टॉल करें

```bash
npm install
```

### 3. पर्यावरण चर (.env) कॉन्फ़िगर करें

रूट डायरेक्टरी में `.env` फ़ाइल बनाएं:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/apnose
```

### 4. एप्लिकेशन चलाएं

- **Full-Stack (Frontend + Backend दोनों एक साथ)**:

  ```bash
  npm run dev:all
  ```

- **केवल Frontend (Vite Dev Server)**:

  ```bash
  npm run dev
  ```

  ब्राउज़र में खोलें: `http://localhost:5173`

- **केवल Backend (Modular REST API + Real-Time Socket.IO Server)**:

  ```bash
  npm run backend:dev
  ```

  बैकएंड पोर्ट: `http://localhost:5000` (API: `/api/v1`)

- **डेटाबेस में डेमो डेटा सीड करें (Seed Database)**:

  ```bash
  npm run seed
  ```

- **टेस्ट सूट चलाएं (Run Tests)**:

  ```bash
  npm test
  ```

- **Production Build**:

  ```bash
  npm run build
  npm run backend:build
  ```

---

## 📂 प्रोजेक्ट संरचना (Project Structure)

```text
ApnoSe/
├── .github/
│   └── workflows/
│       └── ci.yml               # GitHub Actions CI Workflow
├── server/
│   └── index.js                 # Express + MongoDB API Server
├── src/
│   ├── components/              # React UI Components
│   │   ├── assistant/           # AI सारथी बॉट
│   │   ├── auth/                # लॉगिन व लैंडिंग पेज
│   │   ├── birthdays/           # जन्मदिन व सालगिरह
│   │   ├── calls/               # ऑडियो व वीडियो कॉल
│   │   ├── common/              # Toast, मॉडल्स
│   │   ├── communities/         # कम्युनिटी मंच
│   │   ├── family/              # परिवार सदस्य
│   │   ├── feed/                # पोस्ट्स व टाइमलाइन
│   │   ├── friends/             # मित्र सूची
│   │   ├── layout/              # Navbar, Sidebar, BottomNav
│   │   ├── messages/            # बातचीत व संदेश (Messages)
│   │   ├── notifications/       # नोटिफिकेशन
│   │   ├── profile/             # प्रोफ़ाइल
│   │   ├── safety/              # सुरक्षा केंद्र
│   │   └── settings/            # सेटिंग्स व फॉन्ट स्केल
│   ├── context/                 # State Providers (Auth, App, Language, Accessibility)
│   ├── data/                    # Mock Data
│   ├── services/                # Speech Service (TTS & STT)
│   └── types/                   # TypeScript Interfaces
├── .env.example
├── package.json
└── vite.config.ts
```

---

## 📄 लाइसेंस (License)

यह प्रोजेक्ट [ISC License](LICENSE) के अंतर्गत उपलब्ध है।
