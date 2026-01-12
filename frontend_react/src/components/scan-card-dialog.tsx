import { HashLoader } from "react-spinners";
import Button from "./button";

interface SubmitScanCardDialogProps {
  title: string;
  subtitle?: string;
  onCancel: () => void;
}

export default function ScanCardDialog({
  onCancel,
  title,
  subtitle = "Please scan a card",
}: SubmitScanCardDialogProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-2xl mx-4 rounded-2xl bg-white p-8 shadow-lg">
        <h2 className="text-xl font-semibold leading-tight">{title}</h2>
        <p className="mt-2 text-sm text-neutral-500">{subtitle}</p>

        <div className="mt-16 flex flex-col items-center gap-4">
          <HashLoader />
          <Button
            type="button"
            variant="primary"
            className="mt-12"
            onClick={onCancel}
          >
            Anuluj
          </Button>
        </div>
      </div>
    </div>
  );
}
