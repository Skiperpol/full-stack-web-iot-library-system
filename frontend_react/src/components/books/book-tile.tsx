import type { Book } from "../../types/book";

type BookTileProps = {
  book: Book;
  onClick?: () => void;
};

export default function BookTile({ book, onClick }: BookTileProps) {
  const activeBorrow = book.borrows.find((b) => !b.returnedAt);
  const isBorrowed = Boolean(activeBorrow);

  return (
    <article
      key={book.cardId}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      className="group flex flex-col justify-between rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:border-emerald-300 cursor-pointer"
    >
      <div className="mb-4">
        <div className="flex items-start gap-3">
          <div className="flex flex-col items-center gap-2 flex-shrink-0">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center">
              <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
           
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-base font-bold leading-tight text-neutral-900 group-hover:text-emerald-700 transition-colors truncate">
              {book.title}
            </h2>
            <p className="mt-1 text-sm text-neutral-600 truncate">{book.author}</p>
          </div>
        </div>
        <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold whitespace-nowrap ${
                isBorrowed
                  ? "border border-red-200 bg-red-50 text-red-700"
                  : "border border-emerald-200 bg-emerald-50 text-emerald-700"
              }`}
            >
              {book.borrows.length} {book.borrows.length === 1 ? "wypożyczenie" : book.borrows.length < 5 ? "wypożyczenia" : "wypożyczeń"}
            </span>
      </div>
      
      <div className="space-y-2 pt-3 border-t border-neutral-100">
        <div className="flex items-center justify-between gap-2">
          <span className="truncate text-xs text-neutral-400 font-mono">{book.cardId}</span>
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded ${
              isBorrowed 
                ? "bg-red-100 text-red-700" 
                : "bg-emerald-100 text-emerald-700"
            }`}
          >
            {isBorrowed ? "Wypożyczona" : "Dostępna"}
          </span>
        </div>

        {isBorrowed && activeBorrow?.dueDate && (
          <div className="flex items-center gap-1.5 text-xs text-red-600 bg-red-50 px-2 py-1 rounded">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Termin: {new Date(activeBorrow.dueDate).toLocaleDateString("pl-PL")}</span>
          </div>
        )}
      </div>
    </article>
  );
}
