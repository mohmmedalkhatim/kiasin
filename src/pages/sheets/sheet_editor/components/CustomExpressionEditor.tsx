import { useState } from "react";
import { IconAlertTriangle, IconBookmark } from "@tabler/icons-react";
import Button from "../../../../components/Button";
import { SavedCustomFunction, validateExpression } from "../../../../contexts/sheets/column_functions";

function CustomExpressionEditor({
  expr,
  columns,
  savedFns,
  onSave,
  onSaveToLibrary,
}: {
  expr: string;
  columns: { name: string }[];
  savedFns: SavedCustomFunction[];
  onSave: (expr: string) => void;
  onSaveToLibrary: (fn: SavedCustomFunction) => void;
}) {
  const [draft, setDraft] = useState(expr);
  const [error, setError] = useState<string | null>(null);
  const [saveName, setSaveName] = useState("");
  const [showSaveForm, setShowSaveForm] = useState(false);

  const handleApply = () => {
    const err = validateExpression(draft, columns);
    if (err) {
      setError(err);
      return;
    }
    setError(null);
    onSave(draft);
  };

  const handleSaveToLibrary = () => {
    if (!saveName.trim() || !draft.trim()) return;
    onSaveToLibrary({ name: saveName.trim(), expr: draft.trim() });
    setSaveName("");
    setShowSaveForm(false);
  };

  return (
    <div className="flex flex-col gap-2 mt-1.5">
      <div className="relative">
        <input
          className={`w-full h-8 px-3 text-sm font-mono bg-dark-800 border rounded-md outline-none transition-colors ${error ? "border-danger-500" : "border-border-main focus:border-primary-600"
            }`}
          placeholder="e.g. sum(Price) * count(Qty)"
          value={draft}
          onChange={(e) => {
            setDraft(e.target.value);
            setError(null);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleApply();
          }}
        />
        {error && (
          <div className="flex items-center gap-1 mt-1 text-xs text-danger-400">
            <IconAlertTriangle size={12} />
            {error}
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-1">
        {columns.map((c) => (
          <button
            key={c.name}
            className="h-5 px-1.5 text-[10px] rounded border border-border-main text-support-400 hover:text-support-200 hover:border-support-500 transition-colors"
            onClick={() => setDraft((prev) => prev + c.name)}
          >
            {c.name}
          </button>
        ))}
      </div>

      {savedFns.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {savedFns.map((fn) => (
            <button
              key={fn.name}
              className="h-5 px-1.5 text-[10px] rounded border border-primary-600/30 text-primary-400 hover:bg-primary-600/10 transition-colors"
              onClick={() => setDraft(fn.expr)}
              title={fn.expr}
            >
              <IconBookmark size={10} className="inline mr-0.5" />
              {fn.name}
            </button>
          ))}
        </div>
      )}

      <div className="flex items-center gap-1.5">
        <Button size="xs" onClick={handleApply}>
          Apply
        </Button>
        <Button size="xs" variant="text" onClick={() => setShowSaveForm((p) => !p)}>
          <IconBookmark size={14} />
          Save formula
        </Button>
      </div>

      {showSaveForm && (
        <div className="flex items-center gap-1.5">
          <input
            className="flex-1 h-7 px-2 text-xs bg-dark-800 border border-border-main rounded-md outline-none focus:border-primary-600"
            placeholder="Formula name"
            value={saveName}
            onChange={(e) => setSaveName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSaveToLibrary();
            }}
          />
          <Button size="xs" onClick={handleSaveToLibrary} disabled={!saveName.trim()}>
            Save
          </Button>
        </div>
      )}

      <div className="text-[10px] text-support-600 leading-relaxed">
        <span className="font-medium text-support-500">Aggregates:</span> sum, avg, min, max, count,
        median, stdev
        <br />
        <span className="font-medium text-support-500">Math:</span> abs, round, floor, ceil, +, -,
        *, /
        <br />
        <span className="font-medium text-support-500">Example:</span>{" "}
        <span className="font-mono">avg(Price) * count(Qty)</span>
      </div>
    </div>
  );
}

export default CustomExpressionEditor;
