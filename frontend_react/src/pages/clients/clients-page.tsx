import axios from "axios";
import { useEffect, useRef, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "../../components/loading";
import ErrorInfo from "../../components/error-info";
import type { Client } from "../../types/client";
import Button from "../../components/button";
import ScanCardDialog from "../../components/scan-card-dialog";
import { toast } from "react-toastify";
import { MdPlaylistAdd } from "react-icons/md";
import { FaRegAddressCard } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isCardScanning, setIsCardScanning] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const scanCancelledRef = useRef(false);

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get<Client[]>("http://localhost:3000/clients")
      .then((res) => setClients(res.data))
      .catch((e) => setError(e?.message ?? "Request failed"))
      .finally(() => setLoading(false));
  }, []);

  const handleAddClient = () => {
    navigate("/clients/add-form");
  };

  const handleScanClientCard = async () => {
    setIsCardScanning(true);
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
      setIsCardScanning(false);
    }
  };

  const handleOpenClient = (id: string) => {
    navigate(`/clients/${id}`);
  };

  const handleCancelDialog = () => {
    setIsCardScanning(false);
    axios.post("http://localhost:3000/rfid/cancel-scan");
    scanCancelledRef.current = true;
  };

  const filteredClients = useMemo(() => {
    if (!searchQuery.trim()) return clients;
    
    const query = searchQuery.toLowerCase().trim();
    return clients.filter((client) => {
      const nameMatch = client.name.toLowerCase().includes(query);
      const emailMatch = client.email.toLowerCase().includes(query);
      const cardIdMatch = client.cardId.toLowerCase().includes(query);
      return nameMatch || emailMatch || cardIdMatch;
    });
  }, [clients, searchQuery]);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorInfo />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100">
      <div className="mx-auto max-w-9xl px-4 py-8">
        <header className="mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-neutral-900 mb-2">
                Użytkownicy biblioteki
              </h1>
              <p className="text-lg text-neutral-600">
                Zarządzaj członkami biblioteki i ich aktywnymi wypożyczeniami
              </p>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <span className="inline-flex h-10 items-center rounded-full border border-neutral-200 bg-white px-6 text-sm font-semibold text-neutral-700 shadow-sm">
                {filteredClients.length} {filteredClients.length === 1 ? "użytkownik" : filteredClients.length < 5 ? "użytkowników" : "użytkowników"}
              </span>

            <Button type="button" variant="primary" onClick={handleAddClient}>
              <MdPlaylistAdd />
              <span>Add client</span>
            </Button>

            <Button
              type="button"
              variant="primary"
              onClick={handleScanClientCard}
            >
              <FaRegAddressCard />
              <span>Scan client card</span>
            </Button>
          </div>

          <div className="mb-6">
            <div className="relative max-w-md">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="Szukaj po imieniu, emailu lub ID karty..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </header>

        {clients.length === 0 ? (
          <div className="rounded-xl border border-dashed border-neutral-200 bg-neutral-50 px-4 py-10 text-center text-sm text-neutral-500">
            No clients yet. Add someone in the admin panel and they&apos;ll show
            up here.
          </div>
        ) : filteredClients.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-neutral-300 bg-white px-8 py-16 text-center shadow-sm">
            <div className="mx-auto w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mb-4">
              <FaSearch className="text-3xl text-neutral-400" />
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">
              Nie znaleziono użytkowników
            </h3>
            <p className="text-sm text-neutral-500 mb-6 max-w-md mx-auto">
              Spróbuj zmienić kryteria wyszukiwania
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-neutral-50 border-b border-neutral-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                      ID Karty
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                      Imię i nazwisko
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                      Aktywne wypożyczenia
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                      Wszystkie wypożyczenia
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                      Akcje
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-neutral-200">
                  {filteredClients.map((client) => {
                    const activeBorrows = client.borrows.filter((b) => !b.returnedAt);
                    
                    return (
                      <tr
                        key={client.cardId}
                        onClick={() => handleOpenClient(client.cardId)}
                        className="hover:bg-neutral-50 cursor-pointer transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-mono text-neutral-600">
                            {client.cardId}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-semibold text-neutral-900">
                            {client.name}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-neutral-600">
                            {client.email}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                              activeBorrows.length > 0
                                ? "bg-blue-100 text-blue-800 border border-blue-200"
                                : "bg-neutral-100 text-neutral-600 border border-neutral-200"
                            }`}
                          >
                            {activeBorrows.length} {activeBorrows.length === 1 ? "aktywne" : activeBorrows.length < 5 ? "aktywne" : "aktywnych"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-neutral-600">
                            {client.borrows.length} {client.borrows.length === 1 ? "wypożyczenie" : client.borrows.length < 5 ? "wypożyczenia" : "wypożyczeń"}
                          </div>
                        </td>
                        <td className="px-6 py-3 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenClient(client.cardId);
                            }}
                            className="text-blue-600 hover:text-blue-900 font-semibold"
                          >
                            Szczegóły
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {isCardScanning && (
        <ScanCardDialog
          title="Client page"
          subtitle="Please scan the client's card"
          onCancel={handleCancelDialog}
        />
      )}
    </div>
  );
}