import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import ScanCardDialog from "../components/scan-card-dialog";
import { FaUser, FaBook, FaQrcode, FaInfoCircle, FaBookOpen, FaUsers } from "react-icons/fa";
import { MdLibraryBooks } from "react-icons/md";

export default function Home() {
  const [isScanningClient, setIsScanningClient] = useState(false);
  const [isScanningBook, setIsScanningBook] = useState(false);
  const scanCancelledRef = useRef(false);
  const navigate = useNavigate();

  const handleScanClientCard = async () => {
    setIsScanningClient(true);
    scanCancelledRef.current = false;

    try {
      const { data } = await axios.post(
        "http://localhost:3000/rfid/scan-client"
      );

      const status = data.status;

      if (!scanCancelledRef.current) {
        if (status == "timeout") {
          toast.error("Timeout: No card scanned");
        } else if (status == "rejected") {
          toast.error("Card rejected");
        } else if (status == "ok") {
          navigate(`/clients/${data.cardId}`);
        } else {
          toast.error("Unknown response status");
        }
      }
    } catch (err: any) {
      if (!scanCancelledRef.current) {
        toast.error(err?.message ?? "Request failed");
      }
    } finally {
      setIsScanningClient(false);
    }
  };

  const handleScanBookCard = async () => {
    setIsScanningBook(true);
    scanCancelledRef.current = false;

    try {
      const { data } = await axios.post(
        "http://localhost:3000/rfid/scan-book"
      );

      const status = data.status;

      if (!scanCancelledRef.current) {
        if (status == "timeout") {
          toast.error("Timeout: No card scanned");
        } else if (status == "rejected") {
          toast.error("Card rejected");
        } else if (status == "ok") {
          navigate(`/books/${data.cardId}`);
        } else {
          toast.error("Unknown response status");
        }
      }
    } catch (err: any) {
      if (!scanCancelledRef.current) {
        toast.error(err?.message ?? "Request failed");
      }
    } finally {
      setIsScanningBook(false);
    }
  };

  const handleCancelDialog = () => {
    setIsScanningClient(false);
    setIsScanningBook(false);
    axios.post("http://localhost:3000/rfid/cancel-scan");
    scanCancelledRef.current = true;
  };

  return (
    <div className="min-h-screen ">
      {/* Hero Section */}
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-black mb-6">
            <MdLibraryBooks className="text-white text-4xl" />
          </div>
          <h1 className="text-5xl font-bold tracking-tight text-neutral-900 mb-4">
            System Biblioteczny IoT
          </h1>
          <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
            Nowoczesny system zarządzania biblioteką z obsługą kart RFID.
            Skanuj karty użytkowników i książek, aby szybko uzyskać dostęp do informacji.
          </p>
        </div>

        {/* Main Action Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-16">
          {/* Scan Client Card */}
          <div
            onClick={handleScanClientCard}
            className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden border border-neutral-200 hover:border-black"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                  <FaUser className="text-white text-2xl" />
                </div>
                <FaQrcode className="text-neutral-400 text-3xl group-hover:text-blue-500 transition-colors" />
              </div>
              <h2 className="text-2xl font-bold text-neutral-900 mb-2">
                Skanuj kartę użytkownika
              </h2>
              <p className="text-neutral-600 mb-6">
                Zeskanuj kartę RFID użytkownika, aby wyświetlić jego profil,
                aktywne wypożyczenia i historię.
              </p>
              <div className="flex items-center text-blue-600 font-medium group-hover:text-blue-700">
                <span>Rozpocznij skanowanie</span>
                <span className="ml-2 group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </div>
            </div>
          </div>

          {/* Scan Book Card */}
          <div
            onClick={handleScanBookCard}
            className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden border border-neutral-200 hover:border-black"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-teal-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
                  <FaBook className="text-white text-2xl" />
                </div>
                <FaQrcode className="text-neutral-400 text-3xl group-hover:text-emerald-500 transition-colors" />
              </div>
              <h2 className="text-2xl font-bold text-neutral-900 mb-2">
                Skanuj kartę książki
              </h2>
              <p className="text-neutral-600 mb-6">
                Zeskanuj kartę RFID książki, aby wyświetlić szczegóły,
                dostępność i historię wypożyczeń.
              </p>
              <div className="flex items-center text-emerald-600 font-medium group-hover:text-emerald-700">
                <span>Rozpocznij skanowanie</span>
                <span className="ml-2 group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Access Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-neutral-200">
          <h3 className="text-2xl font-bold text-neutral-900 mb-6 flex items-center gap-3">
            <FaInfoCircle className="text-blue-500" />
            Szybki dostęp
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <button
              onClick={() => navigate("/clients")}
              className="flex items-center gap-4 p-4 rounded-xl border border-neutral-200 hover:border-black hover:bg-neutral-50 transition-all text-left group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center group-hover:bg-blue-500 transition-colors">
                <FaUsers className="text-blue-600 group-hover:text-white transition-colors" />
              </div>
              <div>
                <div className="font-semibold text-neutral-900">Użytkownicy</div>
                <div className="text-sm text-neutral-500">Przeglądaj wszystkich użytkowników</div>
              </div>
            </button>
            <button
              onClick={() => navigate("/books")}
              className="flex items-center gap-4 p-4 rounded-xl border border-neutral-200 hover:border-black hover:bg-neutral-50 transition-all text-left group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-lg bg-emerald-100 flex items-center justify-center group-hover:bg-emerald-500 transition-colors">
                <FaBookOpen className="text-emerald-600 group-hover:text-white transition-colors" />
              </div>
              <div>
                <div className="font-semibold text-neutral-900">Książki</div>
                <div className="text-sm text-neutral-500">Przeglądaj wszystkie książki</div>
              </div>
            </button>
          </div>
        </div>

        {/* Information Section */}
        <div className="bg-gradient-to-r from-neutral-900 to-neutral-800 rounded-2xl shadow-lg p-8 text-white">
          <h3 className="text-2xl font-bold mb-4">Jak to działa?</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <div className="text-3xl font-bold text-blue-400 mb-2">1</div>
              <h4 className="font-semibold mb-2">Wybierz opcję</h4>
              <p className="text-neutral-300 text-sm">
                Kliknij na kartę "Skanuj użytkownika" lub "Skanuj książkę"
              </p>
            </div>
            <div>
              <div className="text-3xl font-bold text-emerald-400 mb-2">2</div>
              <h4 className="font-semibold mb-2">Zeskanuj kartę</h4>
              <p className="text-neutral-300 text-sm">
                Przyłóż kartę RFID do czytnika. System automatycznie wykryje kartę
              </p>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-400 mb-2">3</div>
              <h4 className="font-semibold mb-2">Zobacz szczegóły</h4>
              <p className="text-neutral-300 text-sm">
                System wyświetli wszystkie informacje o użytkowniku lub książce
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Scan Dialogs */}
      {isScanningClient && (
        <ScanCardDialog
          title="Skanowanie karty użytkownika"
          subtitle="Przyłóż kartę RFID użytkownika do czytnika"
          onCancel={handleCancelDialog}
        />
      )}

      {isScanningBook && (
        <ScanCardDialog
          title="Skanowanie karty książki"
          subtitle="Przyłóż kartę RFID książki do czytnika"
          onCancel={handleCancelDialog}
        />
      )}
    </div>
  );
}
