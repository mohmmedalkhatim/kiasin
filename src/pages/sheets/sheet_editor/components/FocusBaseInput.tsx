import { useCallback, useEffect, useRef, useState } from "react";
import Input from "../../../../components/input";
import NumberInput from "../../../../components/number-input";
import DatePicker from "../../../../components/datepicker";
import { ColumnType } from "../types";

const FocusBaseInput = ({
  col,
  index,
  setRowErrors,
  setTempRow,
  rowErrors,
  tempRow,
  colType,
}: {
  col: { name: string };
  index: number;
  setRowErrors: React.Dispatch<React.SetStateAction<(string | null)[]>>;
  setTempRow: React.Dispatch<React.SetStateAction<string[]>>;
  rowErrors: (string | null)[];
  tempRow: string[];
  colType: ColumnType;
}) => {
  const ref = useRef<HTMLInputElement>(null);
  const [input, setInput] = useState(tempRow[index] ?? "");
  const inputRef = useRef(input);
  inputRef.current = input;

  const sync = useCallback(() => {
    setTempRow((prev) => {
      const next = [...prev];
      next[index] = inputRef.current;
      return next;
    });
    setRowErrors((prev) => {
      const next = [...prev];
      next[index] = null;
      return next;
    });
  }, [index, setTempRow, setRowErrors]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.addEventListener("focusout", sync);
    return () => el.removeEventListener("focusout", sync);
  }, [sync]);

  if (colType === "number") {
    return (
      <NumberInput
        label={col.name}
        value={input === "" ? "" : Number(input)}
        onChange={(val) => {
          const str = val === "" ? "" : String(val);
          setInput(str);
          inputRef.current = str;
          sync();
        }}
        placeholder="0"
        error={rowErrors[index] ?? undefined}
        allowNegative
      />
    );
  }

  if (colType === "date") {
    return (
      <DatePicker
        label={col.name}
        value={input}
        onChange={(val) => {
          setInput(val);
          inputRef.current = val;
          sync();
        }}
        placeholder="Select date"
        error={rowErrors[index] ?? undefined}
        clearable
      />
    );
  }

  return (
    <Input
      ref={ref}
      label={col.name}
      onChange={(e) => setInput(e.target.value)}
      placeholder={colType !== "string" ? colType : undefined}
      error={rowErrors[index] ?? undefined}
      value={input}
    />
  );
};

export default FocusBaseInput;
