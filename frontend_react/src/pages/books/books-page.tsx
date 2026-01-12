import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "../../components/loading";
import ErrorInfo from "../../components/error-info";
import BookTile from "../../components/books/book-tile";
import type { Book } from "../../types/book";
import Button from "../../components/button";
import { MdPlaylistAdd } from "react-icons/md";
import { FaRegAddressCard } from "react-icons/fa";
import { toast } from "react-toastify";
import ScanCardDialog from "../../components/scan-card-dialog";

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isCardScanning, setIsCardScanning] = useState(false);
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
                Katalog książek
              </h1>
              <p className="text-lg text-neutral-600">
                Przeglądaj wszystkie książki w bibliotece i sprawdź ich dostępność
              </p>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <span className="inline-flex h-10 items-center rounded-full border border-neutral-200 bg-white px-6 text-sm font-semibold text-neutral-700 shadow-sm">
                {books.length} {books.length === 1 ? "książka" : books.length < 5 ? "książki" : "książek"}
              </span>

              <Button type="button" variant="primary" onClick={handleAddBook}>
                <MdPlaylistAdd />
                <span>Dodaj książkę</span>
              </Button>

              <Button
                type="button"
                variant="primary"
                onClick={handleScanBookCard}
                bgColor="bg-emerald-600 hover:bg-emerald-700"
              >
                <FaRegAddressCard />
                <span>Skanuj kartę</span>
              </Button>
            </div>
          </div>
        </header>

        {books.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-neutral-300 bg-white px-8 py-16 text-center shadow-sm">
            <div className="mx-auto w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mb-4">
              <MdPlaylistAdd className="text-3xl text-neutral-400" />
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">
              Brak książek w katalogu
            </h3>
            <p className="text-sm text-neutral-500 mb-6 max-w-md mx-auto">
              Dodaj nową książkę, aby rozpocząć zarządzanie biblioteką
            </p>
            <Button type="button" variant="primary" onClick={handleAddBook}>
              <MdPlaylistAdd />
              <span>Dodaj pierwszą książkę</span>
            </Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {books.map((book) => (
              <BookTile
                key={book.cardId}
                book={book}
                onClick={() => handleOpenBook(book.cardId)}
              />
            ))}
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
