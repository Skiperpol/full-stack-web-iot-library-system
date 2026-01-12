import type { Client } from "../../types/client";

type ClientTileProps = {
  client: Client;
  onClick?: () => void;
};

export default function ClientTile({ client, onClick }: ClientTileProps) {
  const activeBorrows = client.borrows.filter((b: any) => !b.returnedAt);

  return (
    <article
      key={client.cardId}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      className="group flex flex-col justify-between rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:border-blue-300 cursor-pointer"
    >
      <div className="mb-4">
        <div className="flex items-start gap-3">
          <div className="flex flex-col items-center gap-2 flex-shrink-0">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-base font-bold leading-tight text-neutral-900 group-hover:text-blue-700 transition-colors truncate">
              {client.name}
            </h2>
            <p className="mt-1 text-sm text-neutral-600 truncate">{client.email}</p>
          </div>
        </div>
        <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold whitespace-nowrap border border-blue-200 bg-blue-50 text-blue-700">
              {client.borrows.length} {client.borrows.length === 1 ? "wypożyczenie" : client.borrows.length < 5 ? "wypożyczenia" : "wypożyczeń"}
            </span>
      </div>

      <div className="space-y-2 pt-3 border-t border-neutral-100">
        <div className="flex items-center justify-between gap-2">
          <span className="truncate text-xs text-neutral-400 font-mono">{client.cardId}</span>
          {activeBorrows.length > 0 && (
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-100 text-amber-700">
              {activeBorrows.length} aktywn{activeBorrows.length === 1 ? "e" : "ych"}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
