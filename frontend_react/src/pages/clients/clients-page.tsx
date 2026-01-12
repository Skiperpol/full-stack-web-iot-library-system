import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "../../components/loading";
import ErrorInfo from "../../components/error-info";
import ClientTile from "../../components/clients/client-tile";
import type { Client } from "../../types/client";
import Button from "../../components/button";
import ScanCardDialog from "../../components/scan-card-dialog";
import { toast } from "react-toastify";
import { MdPlaylistAdd } from "react-icons/md";
import { FaRegAddressCard } from "react-icons/fa";

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isCardScanning, setIsCardScanning] = useState(false);
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

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorInfo />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100">
      <div className="mx-auto max-w-6xl px-4 py-8">
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
                {clients.length} {clients.length === 1 ? "użytkownik" : clients.length < 5 ? "użytkowników" : "użytkowników"}
              </span>

              <Button type="button" variant="primary" onClick={handleAddClient}>
                <MdPlaylistAdd />
                <span>Dodaj użytkownika</span>
              </Button>

              <Button
                type="button"
                variant="primary"
                onClick={handleScanClientCard}
                bgColor="bg-blue-600 hover:bg-blue-700"
              >
                <FaRegAddressCard />
                <span>Skanuj kartę</span>
              </Button>
            </div>
          </div>
        </header>

        {clients.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-neutral-300 bg-white px-8 py-16 text-center shadow-sm">
            <div className="mx-auto w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mb-4">
              <MdPlaylistAdd className="text-3xl text-neutral-400" />
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">
              Brak użytkowników
            </h3>
            <p className="text-sm text-neutral-500 mb-6 max-w-md mx-auto">
              Dodaj nowego użytkownika, aby rozpocząć zarządzanie członkami biblioteki
            </p>
            <Button type="button" variant="primary" onClick={handleAddClient}>
              <MdPlaylistAdd />
              <span>Dodaj pierwszego użytkownika</span>
            </Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {clients.map((client) => (
              <ClientTile
                key={client.cardId}
                client={client}
                onClick={() => handleOpenClient(client.cardId)}
              />
            ))}
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
