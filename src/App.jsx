import { useState, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { motion, AnimatePresence } from "framer-motion";
import {
  ReceiptText,
  Settings,
  UploadCloud,
  Zap,
  Copy,
  CheckCircle2,
  Menu,
  X,
  Moon,
  Sun,
  Calculator,
  Users,
} from "lucide-react";

// KONFIGURASI AI - Mengambil key dari Environment Variables
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

async function fileToGenerativePart(file) {
  const base64EncodedDataPromise = new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result.split(",")[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
}

function App() {
  const [activeTab, setActiveTab] = useState("hitung");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [instruction, setInstruction] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resultText, setResultText] = useState("");
  const [copyText, setCopyText] = useState("SALIN KE WA 🚀");
  const [cooldown, setCooldown] = useState(0);

  // Timer untuk sistem Anti-Spam
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setFileName(e.target.files[0].name);
    }
  };

  const handleHitung = async () => {
    if (!file) return alert("Upload foto struknya dulu bosku! 📄");
    if (!instruction) return alert("Isi dulu siapa bayar apa ya! ✍️");
    if (cooldown > 0) return;

    setIsLoading(true);
    setResultText("");

    try {
      // Menggunakan Gemini 2.5 Flash terbaru
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      const imagePart = await fileToGenerativePart(file);

      const promptText = `Kamu adalah asisten kalkulator patungan yang SUPER AKURAT. Lakukan perhitungan secara logis dan step-by-step.
      
      INSTRUKSI PEMBAGIAN DARI USER: "${instruction}"

      LANGKAH KERJA WAJIB:
      1. BACA HARGA ASLI: Cari harga menu di struk. JANGAN mengarang harga.
      2. COCOKKAN PESANAN: Kelompokkan menu untuk masing-masing orang.
      3. CARI BIAYA TAMBAHAN: Totalkan Pajak/PB1, Service Charge, dan Pembulatan (Rounding). Abaikan angka kembalian.
      4. BAGI RATA BIAYA TAMBAHAN: Ambil total biaya tambahan, lalu BAGI RATA ke semua orang yang ada di instruksi.
      5. HASIL AKHIR: (Total Menu Orang) + (Hasil Bagi Rata Pajak). Bulatkan ke Rupiah terdekat.

      OUTPUT FORMAT (WhatsApp Style):
      ---
      📝 *RINCIAN PATUNGAN*
      ---
      • *[Nama Orang]*: Rp [Total Per Orang]
        _(Detail: [Menu] + Patungan Pajak Rp [Nominal Pajak])_
      
      ---
      💰 *TOTAL AKHIR*: Rp [Grand Total Struk]
      ---
      📌 *Transfer ke:* [Info Rekening jika ada]`;

      const result = await model.generateContent([promptText, imagePart]);
      setResultText(result.response.text());
      setCooldown(15);
    } catch (error) {
      console.error(error);
      if (error.message.includes("429")) {
        setResultText("⚠️ Google lagi sibuk. Tunggu 30 detik ya!");
        setCooldown(30);
      } else {
        setResultText(
          "Waduh, gagal konek ke AI. Cek API Key Gemini kamu ya! 🔌",
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(resultText).then(() => {
      setCopyText("BERHASIL DISALIN! ✅");
      setTimeout(() => setCopyText("SALIN KE WA 🚀"), 2000);
    });
  };

  const navItems = [
    { id: "hitung", label: "HITUNG PATUNGAN", icon: <Calculator size={24} /> },
    { id: "settings", label: "PENGATURAN", icon: <Settings size={24} /> },
  ];

  const themeBg = isDarkMode
    ? "bg-[#1a1a1a] text-[#f4f4f0]"
    : "bg-[#f4f4f0] text-black";
  const borderStyle = isDarkMode
    ? "border-4 border-white"
    : "border-4 border-black";
  const shadowStyle = isDarkMode
    ? "shadow-[6px_6px_0px_0px_rgba(255,255,255,1)]"
    : "shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]";
  const cardBg = isDarkMode ? "bg-[#2a2a2a]" : "bg-white";

  return (
    <div
      className={`relative flex min-h-screen font-sans overflow-hidden transition-colors duration-300 ${themeBg}`}
    >
      {/* Background Dots */}
      <div
        className="absolute inset-0 z-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(${isDarkMode ? "#ffffff" : "#000000"} 2px, transparent 2px)`,
          backgroundSize: "24px 24px",
        }}
      ></div>

      {/* Header Mobile */}
      <div
        className={`md:hidden fixed top-0 left-0 w-full p-4 flex justify-between items-center z-50 ${isDarkMode ? "bg-[#1a1a1a]" : "bg-[#FFD600]"} border-b-4 ${isDarkMode ? "border-white" : "border-black"}`}
      >
        <div className="flex items-center gap-2 font-black text-xl tracking-tight uppercase">
          <Zap fill={isDarkMode ? "#FF90E8" : "#000"} size={24} /> BagiRata
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className={`p-2 ${borderStyle} ${isDarkMode ? "bg-[#333]" : "bg-white"} shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}
        >
          {isMobileMenuOpen ? (
            <X size={24} strokeWidth={3} />
          ) : (
            <Menu size={24} strokeWidth={3} />
          )}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <nav
        className={`fixed md:relative z-40 inset-y-0 left-0 transform ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 transition-transform duration-300 ease-in-out flex flex-col w-72 ${isDarkMode ? "bg-[#222] border-white" : "bg-[#FFD600] border-black"} border-r-4 p-6`}
      >
        <div className="hidden md:flex items-center gap-3 mb-12 mt-4">
          <div
            className={`p-2 ${borderStyle} bg-[#FF90E8] text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}
          >
            <Zap fill="currentColor" size={32} />
          </div>
          <span className="text-3xl font-black uppercase tracking-tighter">
            BagiRata
          </span>
        </div>

        <div className="space-y-4 mt-12 md:mt-0 flex-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setIsMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-4 px-5 py-4 font-black text-lg transition-all border-4 ${
                activeTab === item.id
                  ? `bg-[#90C4FF] text-black border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]`
                  : `${isDarkMode ? "bg-[#333] border-transparent text-white hover:border-white" : "bg-transparent border-transparent hover:border-black hover:bg-white"}`
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        {/* Footer Credit Desktop */}
        <div
          className={`mt-auto pt-6 border-t-4 ${isDarkMode ? "border-white" : "border-black"}`}
        >
          <p className="font-black text-xs uppercase tracking-wider mb-2 opacity-70">
            Build By:
          </p>
          <div
            className={`p-3 ${isDarkMode ? "bg-[#FF90E8] text-black" : "bg-white text-black"} border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}
          >
            <p className="font-black text-sm uppercase truncate">
              M. Ridho Febrian
            </p>
          </div>
        </div>
      </nav>

      <main className="flex-1 p-5 pt-24 md:pt-12 md:p-12 overflow-y-auto z-10">
        <AnimatePresence mode="wait">
          {activeTab === "hitung" && (
            <motion.div
              key="hitung"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="max-w-6xl mx-auto"
            >
              <header className="mb-10 border-b-4 border-black pb-4 inline-block">
                <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase">
                  AYO PATUNGAN! 💸
                </h2>
              </header>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
                {/* Input Section */}
                <div
                  className={`${cardBg} ${borderStyle} ${shadowStyle} p-6 md:p-8 space-y-8`}
                >
                  <div>
                    <label className="block font-black text-xl mb-4 uppercase flex items-center gap-2">
                      <UploadCloud size={28} /> 1. UPLOAD STRUK
                    </label>
                    <label
                      className={`block border-4 border-dashed ${isDarkMode ? "border-white bg-[#333]" : "border-black bg-[#E8F4FF]"} p-10 flex flex-col items-center justify-center cursor-pointer transition-colors`}
                    >
                      <ReceiptText size={48} className="mb-4" />
                      <span className="text-lg font-bold text-center uppercase">
                        {fileName ? `✅ ${fileName}` : "KLIK UNTUK PILIH FOTO"}
                      </span>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                    </label>
                  </div>

                  <div>
                    <label className="block font-black text-xl mb-4 uppercase flex items-center gap-2">
                      <Users size={28} /> 2. SIAPA BAYAR APA?
                    </label>
                    <textarea
                      rows="4"
                      className={`w-full ${borderStyle} p-5 font-bold text-lg resize-none focus:outline-none ${isDarkMode ? "bg-[#333] text-white" : "bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"}`}
                      placeholder="Contoh: Ridho bayar Gacoan, Fahmi bayar Mie LV 3, Afnan bayar Siomay..."
                      value={instruction}
                      onChange={(e) => setInstruction(e.target.value)}
                    ></textarea>
                  </div>

                  <button
                    onClick={handleHitung}
                    disabled={isLoading || cooldown > 0}
                    className={`w-full ${isDarkMode ? "bg-[#23C552] text-black border-white" : "bg-[#FF90E8] text-black border-black"} border-4 font-black text-2xl py-5 flex justify-center items-center gap-3 uppercase transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[6px] active:translate-y-[6px] disabled:opacity-50`}
                  >
                    {isLoading
                      ? "MIKIR DULU..."
                      : cooldown > 0
                        ? `TUNGGU ${cooldown} DETIK ⏳`
                        : "PROSES DENGAN GEMINI ⚡"}
                    {!isLoading && cooldown === 0 && <Zap size={28} />}
                  </button>
                </div>

                {/* Result Section */}
                <div
                  className={`${cardBg} ${borderStyle} ${shadowStyle} p-6 md:p-8 min-h-[500px] flex flex-col`}
                >
                  <h3 className="font-black text-2xl mb-6 uppercase flex items-center gap-3 border-b-4 border-black pb-4 inline-flex">
                    <CheckCircle2
                      size={32}
                      className={isDarkMode ? "text-[#23C552]" : "text-black"}
                    />{" "}
                    HASIL AI
                  </h3>

                  {isLoading ? (
                    <div className="flex-1 flex flex-col items-center justify-center gap-6">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          repeat: Infinity,
                          duration: 1,
                          ease: "linear",
                        }}
                        className="border-4 border-black p-4 bg-[#FFD600] rounded-full"
                      >
                        <Zap size={48} />
                      </motion.div>
                      <p className="text-xl font-black uppercase animate-pulse">
                        Menghitung dengan Pintar...
                      </p>
                    </div>
                  ) : resultText ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex flex-col h-full"
                    >
                      <div
                        className={`p-6 border-4 ${borderStyle} font-mono text-base font-bold leading-relaxed overflow-y-auto max-h-[400px] mb-6 whitespace-pre-wrap ${isDarkMode ? "bg-[#111]" : "bg-[#FDFDFD]"}`}
                      >
                        {resultText}
                      </div>
                      <button
                        onClick={handleCopy}
                        className={`mt-auto flex items-center justify-center gap-3 w-full py-5 ${isDarkMode ? "bg-[#FFD600] text-black border-white" : "bg-[#23C552] text-black border-black"} border-4 font-black text-xl uppercase transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[6px] active:translate-y-[6px]`}
                      >
                        <Copy size={24} /> {copyText}
                      </button>
                    </motion.div>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
                      <Calculator
                        size={64}
                        strokeWidth={1}
                        className="mb-6 opacity-30"
                      />
                      <p className="font-black text-2xl uppercase">
                        KOSONG BOSKU!
                      </p>
                      <p className="text-lg font-bold mt-2 opacity-70">
                        Upload struk dulu di sebelah kiri.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "settings" && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="max-w-3xl mx-auto"
            >
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase mb-10 border-b-4 border-black pb-4 inline-block">
                PENGATURAN ⚙️
              </h2>

              <div
                className={`${cardBg} ${borderStyle} ${shadowStyle} p-8 space-y-8`}
              >
                <div
                  className={`flex justify-between items-center pb-6 border-b-4 ${isDarkMode ? "border-white" : "border-black"}`}
                >
                  <div>
                    <h4 className="font-black text-2xl uppercase">DARK MODE</h4>
                    <p className="font-bold text-lg opacity-70">
                      Ubah tampilan jadi gelap
                    </p>
                  </div>
                  <button
                    onClick={() => setIsDarkMode(!isDarkMode)}
                    className={`w-20 h-10 border-4 ${borderStyle} flex items-center px-1 transition-all duration-300 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${isDarkMode ? "bg-[#90C4FF] justify-end" : "bg-[#FF90E8] justify-start"}`}
                  >
                    <motion.div
                      layout
                      className={`w-6 h-6 ${isDarkMode ? "bg-black text-white" : "bg-white text-black"} border-2 border-black flex items-center justify-center`}
                    >
                      {isDarkMode ? <Moon size={16} /> : <Sun size={16} />}
                    </motion.div>
                  </button>
                </div>

                <div className="pt-2">
                  <label className="font-black text-2xl uppercase block mb-4">
                    API KEY GEMINI
                  </label>
                  <input
                    type="password"
                    value="••••••••••••••••••••••••••••"
                    readOnly
                    className={`w-full ${borderStyle} p-5 font-bold text-lg bg-[#E8F4FF] text-black focus:outline-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}
                  />
                  <p className="text-sm font-bold mt-2 opacity-60">
                    *Tersembunyi demi keamanan.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer Credit Mobile */}
        <div className="md:hidden mt-12 mb-6 text-center">
          <p className="font-black text-[10px] uppercase opacity-50 mb-1">
            Developed By
          </p>
          <p
            className={`font-black text-xs uppercase tracking-widest border-b-2 ${isDarkMode ? "border-white" : "border-black"} inline-block`}
          >
            M. Ridho Febrian
          </p>
        </div>
      </main>
    </div>
  );
}

export default App;
