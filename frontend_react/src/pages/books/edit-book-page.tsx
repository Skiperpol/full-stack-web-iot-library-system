import axios from "axios";
import { useEffect, useState, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../../components/button";
import Loading from "../../components/loading";

export default function UpdateBookFormPage() {
  const navigate = useNavigate();
  const { cardUid } = useParams<{ cardUid: string }>();

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!cardUid) return;

    setLoading(true);
    setError("");

    axios
      .get<{ title: string; author: string }>(
        `http://localhost:3000/books/${cardUid}`
      )
      .then((res) => {
        setTitle(res.data?.title ?? "");
        setAuthor(res.data?.author ?? "");
      })
      .catch((e) => setError(e?.message ?? "Żądanie nie powiodło się"))
      .finally(() => setLoading(false));
  }, [cardUid]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!cardUid) return;

    setError("");
    setSubmitting(true);

    try {
      const payload = {
        title: title.trim(),
        author: author.trim(),
      };

      await axios.put(`http://localhost:3000/books/${cardUid}`, payload);
      navigate(`/books/${cardUid}`);
    } catch (err: any) {
      setError(err?.message ?? "Żądanie nie powiodło się");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (cardUid) navigate(`/books/${cardUid}`);
    else navigate("/books");
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 py-8">
      <div className="mx-auto max-w-2xl px-4">
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-md">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <div className="flex-1">
              <h1 className="text-4xl font-bold tracking-tight text-neutral-900">
                Edytuj książkę
              </h1>
              <p className="mt-1 text-base text-neutral-600">
                Edytuj szczegóły książki w katalogu biblioteki
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center rounded-full border border-neutral-200 bg-white px-4 py-1.5 text-xs font-medium text-neutral-700 shadow-sm">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
              </svg>
              UID: {cardUid ?? "-"}
            </span>
          </div>
        </header>

        <div className="w-full">
          {error && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
              <p className="font-semibold">Wystąpił błąd</p>
              <p className="mt-1 text-xs text-red-700">{error}</p>
            </div>
          )}

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
                className="w-full min-h-12 rounded-xl border border-neutral-300 bg-neutral-50 px-4 py-3 text-base outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 focus:bg-white disabled:opacity-70"
                placeholder="np. Clean Code"
                disabled={submitting}
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
                className="w-full min-h-12 rounded-xl border border-neutral-300 bg-neutral-50 px-4 py-3 text-base outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 focus:bg-white disabled:opacity-70"
                placeholder="np. Robert C. Martin"
                disabled={submitting}
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
                {submitting ? "Zapisywanie..." : "Zapisz zmiany"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
