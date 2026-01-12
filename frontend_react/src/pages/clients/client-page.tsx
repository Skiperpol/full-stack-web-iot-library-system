import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "../../components/loading";
import ErrorInfo from "../../components/error-info";
import Button from "../../components/button";
import type { Client } from "../../types/client";
import { MdPlaylistAdd } from "react-icons/md";
import { IoMdReturnLeft } from "react-icons/io";
import { toast } from "react-toastify";
import ScanCardDialog from "../../components/scan-card-dialog";

export default function ClientPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");
  const [isBookDialogOpen, setIsBookDialogOpen] = useState(false);
  const scanCancelledRef = useRef(false);

  const fetchClient = useCallback(async () => {
    if (!id) return;

    setError("");
    setLoading(true);

    try {
      const res = await axios.get(`http://localhost:3000/clients/${id}`);
      console.log(res.data);
      setClient(res.data);
    } catch (e: any) {
      setError(e?.message ?? "Żądanie nie powiodło się");
      setClient(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchClient();
  }, [id]);

  const handleBack = () => {
    navigate("/clients");
  };

  const handleEditClient = () => {
    if (!id) return;
    navigate(`/clients/${id}/edit`);
  };

  const handleDeleteClient = async () => {
    if (!id) return;
    if (!window.confirm("Czy na pewno chcesz usunąć tego użytkownika?")) return;

    setActionLoading(true);
    setError("");

    try {
      await axios.delete(`http://localhost:3000/clients/${id}`);
      navigate("/clients");
    } catch (e: any) {
      setError(e?.message ?? "Nie udało się usunąć użytkownika");
      setActionLoading(false);
    }
  };

  const getBook = async () => {
    setIsBookDialogOpen(true);
    scanCancelledRef.current = false;

    try {
      const { data } = await axios.post(
        "http://localhost:3000/rfid/scan-book"
      );

      const status = data.status;

      if (!scanCancelledRef.current) {
        if (status == "timeout") {
          toast.error("Timeout: Nie zeskanowano karty");
        } else if (status == "rejected") {
          toast.error("Karta odrzucona");
        } else if (status == "ok") {
          return data.cardId;
        } else {
          toast.error("Nieznany status odpowiedzi");
        }
      }
    } catch (e: any) {
      toast.error(e?.message ?? "Żądanie nie powiodło się");
    } finally {
      setIsBookDialogOpen(false);
    }
  };

  const handleBorrow = async () => {
    const bookId = await getBook();

    try {
      await axios.post("http://localhost:3000/borrows", {
        bookCardId: bookId,
        clientCardId: id,
      });
    } catch (e: any) {
      toast.error(e?.response?.data?.message || e?.message || "Żądanie nie powiodło się");
      return;
    }

    await fetchClient();
  };

  const handleReturn = async (borrow: any) => {
    await axios.post(`http://localhost:3000/borrows/${borrow.id}/return`);
    fetchClient();
  };

  const handleCancelDialog = () => {
    setIsBookDialogOpen(false);
    axios.post("http://localhost:3000/rfid/cancel-scan");
    scanCancelledRef.current = true;
  };

  if (!id) {
    return (
      <div className="min-h-screen bg-white text-black">
        <div className="mx-auto max-w-5xl px-4 py-8">
          <p className="text-sm text-red-600">Nieprawidłowy identyfikator użytkownika.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return <Loading />;
  }

  if (error && !client) {
    return <ErrorInfo />;
  }

  if (!client) {
    return (
      <div className="min-h-[70vh] w-full bg-white text-black">
        <div className="flex min-h-[70vh] items-center justify-center px-4">
          <div className="text-center">
            <p className="text-sm text-neutral-600">Użytkownik nie znaleziony.</p>

            <div className="mt-4">
              <Button variant="primary" type="button" onClick={handleBack}>
                Powrót do użytkowników
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const activeBorrows = client.borrows.filter((b: any) => !b.returnedAt);
  const pastBorrows = client.borrows.filter((b: any) => !!b.returnedAt);

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 py-8">
      <div className="mx-auto max-w-4xl px-4">
        <article className="flex flex-col rounded-2xl border border-neutral-200 bg-white p-8 shadow-lg">
          <header className="flex flex-wrap items-start justify-between gap-4 mb-6 pb-6 border-b border-neutral-200">
            <div className="flex-1">
              <div className="flex items-start gap-4">
                <div className="flex flex-col items-center gap-2 flex-shrink-0">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                 
                </div>
                <div className="flex-1 min-w-0">
                  <h1 className="text-3xl font-bold leading-tight tracking-tight text-neutral-900">
                    {client.name}
                  </h1>
                  <p className="text-base text-neutral-600">{client.email}</p>
                </div>
                
              </div>
              <div className="flex w-33 mt-4 items-center gap-1.5 text-xs text-neutral-600 bg-neutral-100 px-2.5 py-1 rounded-full">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="font-semibold">
                      {client.borrows.length} {client.borrows.length === 1 ? "wypożyczenie" : client.borrows.length < 5 ? "wypożyczenia" : "wypożyczeń"}
                    </span>
                  </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button
                type="button"
                variant="secondary"
                onClick={handleBack}
                disabled={actionLoading}
              >
                ← Wstecz
              </Button>

              <Button
                type="button"
                variant="primary"
                onClick={handleEditClient}
                disabled={actionLoading}
              >
                Edytuj
              </Button>

              <Button
                type="button"
                variant="primary"
                onClick={handleDeleteClient}
                disabled={actionLoading}
                bgColor="bg-red-600 hover:bg-red-700"
              >
                {actionLoading ? "Usuwanie..." : "Usuń"}
              </Button>
            </div>
          </header>

          {error && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
              <p className="font-semibold">Wystąpił błąd</p>
              <p className="mt-1 text-xs text-red-700">{error}</p>
            </div>
          )}

          <div className="space-y-6">
            <section className="rounded-xl border border-neutral-200 bg-neutral-50 p-6">
              <h2 className="text-lg font-semibold tracking-tight text-neutral-900 mb-3 flex items-center gap-2">
                <svg className="w-5 h-5 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                </svg>
                Karta RFID
              </h2>
              <p className="text-sm text-neutral-600 font-mono bg-white px-4 py-2 rounded-lg border border-neutral-200 inline-block">
                {client.cardId ? client.cardId : "Brak przypisanej karty"}
              </p>
            </section>

            <section className="rounded-xl border border-neutral-200 bg-neutral-50 p-6">
              <div className="flex items-center justify-between gap-3 mb-4">
                <h2 className="text-lg font-semibold tracking-tight text-neutral-900 flex items-center gap-2">
                  <svg className="w-5 h-5 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  Aktywne wypożyczenia
                </h2>

                <Button
                  type="button"
                  variant="primary"
                  onClick={handleBorrow}
                  bgColor="bg-emerald-600 hover:bg-emerald-700"
                >
                  <MdPlaylistAdd />
                  <span>Wypożycz</span>
                </Button>
              </div>

              {activeBorrows.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-3">
                    <svg className="w-8 h-8 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <p className="text-sm text-neutral-500 mb-4">Brak aktywnych wypożyczeń</p>
                  <Button
                    type="button"
                    variant="primary"
                    onClick={handleBorrow}
                    bgColor="bg-emerald-600 hover:bg-emerald-700"
                  >
                    <MdPlaylistAdd />
                    <span>Wypożycz książkę</span>
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {activeBorrows.map((borrow: any) => (
                    <div
                      key={borrow.id}
                      className="flex flex-wrap items-start justify-between gap-4 rounded-xl border border-neutral-200 bg-white px-5 py-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex-1 min-w-0">
                        {borrow.book?.title && (
                          <h3 className="text-base font-semibold text-neutral-900 mb-1">
                            {borrow.book.title}
                          </h3>
                        )}
                        {borrow.book?.author && (
                          <p className="text-sm text-neutral-600 mb-3">
                            {borrow.book.author}
                          </p>
                        )}
                        <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-600 mb-3">
                          <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            Wypożyczono: {new Date(borrow.borrowedAt).toLocaleDateString("pl-PL")}
                          </span>
                          <span className="flex items-center gap-1 text-red-600 font-medium">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Termin: {new Date(borrow.dueDate).toLocaleDateString("pl-PL")}
                          </span>
                        </div>
                        <Button
                          type="button"
                          variant="primary"
                          onClick={() => handleReturn(borrow)}
                          bgColor="bg-blue-600 hover:bg-blue-700"
                        >
                          <IoMdReturnLeft />
                          <span>Zwróć</span>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="rounded-xl border border-neutral-200 bg-neutral-50 p-6">
              <h2 className="text-lg font-semibold tracking-tight text-neutral-900 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Historia wypożyczeń
              </h2>

              {pastBorrows.length === 0 ? (
                <p className="text-sm text-neutral-500 italic">Brak historii wypożyczeń</p>
              ) : (
                <div className="space-y-2">
                  {pastBorrows.map((borrow: any) => (
                    <div
                      key={borrow.id}
                      className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-neutral-200 bg-white px-4 py-3 hover:shadow-sm transition-shadow"
                    >
                      <div className="flex-1">
                        {borrow.book?.title && (
                          <p className="font-medium text-neutral-900 mb-1">{borrow.book.title}</p>
                        )}
                        <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-500">
                          <span>Wypożyczono: {new Date(borrow.borrowedAt).toLocaleDateString("pl-PL")}</span>
                          <span>•</span>
                          <span>
                            Zwrócono: {borrow.returnedAt
                              ? new Date(borrow.returnedAt).toLocaleDateString("pl-PL")
                              : "—"}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        </article>
      </div>

      {isBookDialogOpen && (
        <ScanCardDialog
          title="Wypożyczenie książki"
          subtitle="Proszę zeskanować kartę książki"
          onCancel={handleCancelDialog}
        />
      )}
    </div>
  );
}
