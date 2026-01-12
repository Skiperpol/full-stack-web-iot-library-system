export default function ErrorInfo() {
  return (
    <div className="bg-white text-black">
      <div className="flex min-h-[70vh] w-full items-center mx-auto max-w-5xl px-4 py-10">
        <div className="rounded-xl border w-full border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          <p className="font-medium">Coś poszło nie tak</p>
        </div>
      </div>
    </div>
  );
}
