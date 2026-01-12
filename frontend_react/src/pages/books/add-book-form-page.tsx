import axios from "axios";
import { useRef, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/button";
import { toast } from "react-toastify";
import ScanCardDialog from "../../components/scan-card-dialog";

export default function AddBookFormPage() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const scanCancelledRef = useRef(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    scanCancelledRef.current = false;

    const payload = {
      title: title.trim(),
      author: author.trim(),
    };

    try {
      const result = await axios.post(
        "http://localhost:3000/rfid/register-book",
        payload
      );

      if (!scanCancelledRef.current) {
        if (result.data.status == "timeout") {
          toast.error("Timeout: No card scanned");
        } else if (result.data.status == "rejected") {
          toast.error("Card rejected");
        } else if (result.data.status == "ok") {
          toast.success("Book added successfully");
          navigate("/books");
        } else {
          toast.error("Unknown response status");
        }
      }
    } catch (err: any) {
      if (!scanCancelledRef.current) {
        toast.error(err?.message ?? "Request failed");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/books");
  };

  const handleDialogCancel = () => {
    setSubmitting(false);
    axios.post("http://localhost:3000/rfid/cancel-scan");
    scanCancelledRef.current = true;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 py-8">
      <div className="mx-auto max-w-2xl px-4">
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-md">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-neutral-900">
                Dodaj nową książkę
              </h1>
              <p className="mt-1 text-base text-neutral-600">
                Dodaj nową książkę do katalogu biblioteki
              </p>
            </div>
          </div>
        </header>

        <div className="w-full">
          <form
            onSubmit={handleSubmit}
            className="space-y-6 w-full rounded-2xl border border-neutral-200 bg-white p-8 shadow-lg"
          >
            <div className="space-y-2">
              <label
                htmlFor="title"
                className="block text-sm font-semibold text-neutral-900"
              >
                Tytuł książki
              </label>
              <input
                id="title"
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full min-h-12 rounded-xl border border-neutral-300 bg-neutral-50 px-4 py-3 text-base outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 focus:bg-white"
                placeholder="np. Clean Code"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="author"
                className="block text-sm font-semibold text-neutral-900"
              >
                Autor
              </label>
              <input
                id="author"
                type="text"
                required
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full min-h-12 rounded-xl border border-neutral-300 bg-neutral-50 px-4 py-3 text-base outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 focus:bg-white"
                placeholder="np. Robert C. Martin"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-200">
              <Button
                type="button"
                variant="secondary"
                onClick={handleCancel}
                disabled={submitting}
              >
                Anuluj
              </Button>
              <Button 
                type="submit" 
                variant="primary" 
                disabled={submitting}
                bgColor="bg-emerald-600 hover:bg-emerald-700"
              >
                {submitting ? "Zapisywanie..." : "Zapisz książkę"}
              </Button>
            </div>
          </form>
        </div>
      </div>

      {submitting && (
        <ScanCardDialog
          title="Registering book"
          subtitle="Please scan the new book's card"
          onCancel={handleDialogCancel}
        />
      )}
    </div>
  );
}
