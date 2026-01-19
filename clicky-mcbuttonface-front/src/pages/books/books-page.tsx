import axios from "axios";
import { useEffect, useRef, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "../../components/loading";
import ErrorInfo from "../../components/error-info";
import type { Book } from "../../types/book";
import Button from "../../components/button";
import { MdPlaylistAdd } from "react-icons/md";
import { FaRegAddressCard } from "react-icons/fa";
import { toast } from "react-toastify";
import ScanCardDialog from "../../components/scan-card-dialog";
import { FaSearch } from "react-icons/fa";

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isCardScanning, setIsCardScanning] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const scanCancelledRef = useRef(false);

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get<Book[]>("http://localhost:3000/books")
      .then((res) => setBooks(res.data))
      .catch((e) => setError(e?.message ?? "Request failed"))
      .finally(() => setLoading(false));
  }, []);

  const handleAddBook = () => {
    navigate("/books/add-form");
  };

  const handleScanBookCard = async () => {
    setIsCardScanning(true);
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
      setIsCardScanning(false);
    }
  };

  const handleOpenBook = (id: string) => {
    navigate(`/books/${id}`);
  };

  const handleCancelDialog = () => {
    setIsCardScanning(false);
    axios.post("http://localhost:3000/rfid/cancel-scan");
    scanCancelledRef.current = true;
  };

  const filteredBooks = useMemo(() => {
    if (!searchQuery.trim()) return books;
    
    const query = searchQuery.toLowerCase().trim();
    return books.filter((book) => {
      const titleMatch = book.title.toLowerCase().includes(query);
      const authorMatch = book.author.toLowerCase().includes(query);
      const cardIdMatch = book.cardId.toLowerCase().includes(query);
      return titleMatch || authorMatch || cardIdMatch;
    });
  }, [books, searchQuery]);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorInfo />;
  }

  return (
<<<<<<< Updated upstream:clicky-mcbuttonface-front/src/pages/books/books-page.tsx
    <div className="min-h-screen bg-white text-black">
      <div className="mx-auto max-w-5xl px-4 py-8">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Books</h1>
            <p className="mt-1 text-sm text-neutral-500">
              Library catalogue and current availability
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex h-8 items-center rounded-full border border-neutral-200 bg-neutral-50 px-6 text-xs font-medium text-neutral-700">
              {books.length} book{books.length === 1 ? "" : "s"}
            </span>
=======
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100">
      <div className="mx-auto max-w-9xl px-4 py-8">
        <header className="mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-neutral-900 mb-2">
                Katalog książek
              </h1>
              <p className="text-lg text-neutral-600">
                Przeglądaj wszystkie książki w bibliotece i sprawdź ich dostępność
              </p>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <span className="inline-flex h-10 items-center rounded-full border border-neutral-200 bg-white px-6 text-sm font-semibold text-neutral-700 shadow-sm">
                {filteredBooks.length} {filteredBooks.length === 1 ? "książka" : filteredBooks.length < 5 ? "książki" : "książek"}
              </span>
>>>>>>> Stashed changes:frontend_react/src/pages/books/books-page.tsx

            <Button type="button" variant="primary" onClick={handleAddBook}>
              <MdPlaylistAdd />
              <span>Add book</span>
            </Button>

            <Button
              type="button"
              variant="primary"
              onClick={handleScanBookCard}
            >
              <FaRegAddressCard />
              <span>Scan book card</span>
            </Button>
          </div>

          <div className="mb-6">
            <div className="relative max-w-md">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="Szukaj po tytule, autorze lub ID karty..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
          </div>
        </header>

        {books.length === 0 ? (
          <div className="rounded-xl border border-dashed border-neutral-200 bg-neutral-50 px-4 py-10 text-center text-sm text-neutral-500">
            No books in the catalogue yet. Add a new book in the admin panel and
            it&apos;ll show up here.
          </div>
        ) : filteredBooks.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-neutral-300 bg-white px-8 py-16 text-center shadow-sm">
            <div className="mx-auto w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mb-4">
              <FaSearch className="text-3xl text-neutral-400" />
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">
              Nie znaleziono książek
            </h3>
            <p className="text-sm text-neutral-500 mb-6 max-w-md mx-auto">
              Spróbuj zmienić kryteria wyszukiwania
            </p>
          </div>
        ) : (
<<<<<<< Updated upstream:clicky-mcbuttonface-front/src/pages/books/books-page.tsx
          <div className="space-y-4">
            {books.map((book) => (
              <BookTile
                key={book.cardId}
                book={book}
                onClick={() => handleOpenBook(book.cardId)}
              />
            ))}
=======
          <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-neutral-50 border-b border-neutral-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                      ID Karty
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                      Tytuł
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                      Autor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                      Wypożyczenia
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                      Akcje
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-neutral-200">
                  {filteredBooks.map((book) => {
                    const activeBorrow = book.borrows.find((b) => !b.returnedAt);
                    const isBorrowed = Boolean(activeBorrow);
                    
                    return (
                      <tr
                        key={book.cardId}
                        onClick={() => handleOpenBook(book.cardId)}
                        className="hover:bg-neutral-50 cursor-pointer transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-mono text-neutral-600">
                            {book.cardId}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-semibold text-neutral-900">
                            {book.title}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-neutral-600">
                            {book.author}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                              isBorrowed
                                ? "bg-red-100 text-red-800 border border-red-200"
                                : "bg-emerald-100 text-emerald-800 border border-emerald-200"
                            }`}
                          >
                            {isBorrowed ? "Wypożyczona" : "Dostępna"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-neutral-600">
                            {book.borrows.length} {book.borrows.length === 1 ? "wypożyczenie" : book.borrows.length < 5 ? "wypożyczenia" : "wypożyczeń"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenBook(book.cardId);
                            }}
                            className="text-emerald-600 hover:text-emerald-900 font-semibold"
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
>>>>>>> Stashed changes:frontend_react/src/pages/books/books-page.tsx
          </div>
        )}
      </div>

      {isCardScanning && (
        <ScanCardDialog
          title="Book page"
          subtitle="Please scan the book's card"
          onCancel={handleCancelDialog}
        />
      )}
    </div>
  );
}
