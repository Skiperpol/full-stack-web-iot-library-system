import axios from "axios";
import { useEffect, useState } from "react";
import type { Client } from "../../types/client";
import { HashLoader } from "react-spinners";
import Loading from "../../components/loading";
import ErrorInfo from "../../components/error-info";

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get<Client[]>("http://localhost:3000/clients")
      .then((res) => setClients(res.data))
      .catch((e) => setError(e?.message ?? "Request failed"))
      .finally(() => setLoading(false));
  }, []);

  const handleAddClient = () => {
    // hook this up later (modal, navigate, etc.)
    console.log("Add client clicked");
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorInfo />;
  }

  return (
    <div className="min-h-screen bg-white text-black">
      <div className="mx-auto max-w-5xl px-4 py-8">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Clients</h1>
            <p className="mt-1 text-sm text-neutral-500">
              RFID library members and their active borrows
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-xs font-medium text-neutral-700 sm:inline-flex">
              {clients.length} client{clients.length === 1 ? "" : "s"}
            </span>
            <button
              type="button"
              onClick={handleAddClient}
              className="inline-flex items-center gap-2 rounded-full bg-black px-4 py-1.5 text-xs font-medium text-white shadow-sm transition hover:bg-neutral-900 active:bg-black/90"
            >
              <span className="text-sm leading-none">+</span>
              <span>Add client</span>
            </button>
          </div>
        </header>

        {clients.length === 0 ? (
          <div className="rounded-xl border border-dashed border-neutral-200 bg-neutral-50 px-4 py-10 text-center text-sm text-neutral-500">
            No clients yet. Add someone in the admin panel and they&apos;ll show
            up here.
          </div>
        ) : (
          <div className="space-y-4">
            {clients.map((client) => (
              <article
                key={client.id}
                className="flex flex-col justify-between rounded-2xl border border-neutral-200 bg-neutral-50/80 p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h2 className="text-base font-semibold leading-tight">
                      {client.name}
                    </h2>
                    <p className="mt-0.5 text-xs text-neutral-500">
                      {client.email}
                    </p>
                  </div>

                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                      client.card
                        ? "border border-red-600 bg-red-50 text-red-700"
                        : "border border-neutral-300 bg-white text-neutral-600"
                    }`}
                  >
                    {client.card ? "Has card" : "No card"}
                  </span>
                </div>

                <div className="mt-3 space-y-2 text-xs text-neutral-600">
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate">
                      Card UID:{" "}
                      <span className="font-medium">
                        {client.card?.uid ?? "—"}
                      </span>
                    </span>
                    <span className="text-[11px] text-neutral-500">
                      {client.borrows.length} borrow
                      {client.borrows.length === 1 ? "" : "s"}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
