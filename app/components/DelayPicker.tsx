"use client";
import { DELAY_OPTIONS, delayShort } from "@/lib/delay";
/** Segmented "when to send" control. 0 = send now. */
export default function DelayPicker({ value, onChange, accountDefault, disabled, label = "When to send", name }: { value: number; onChange: (h: number) => void; accountDefault?: number; disabled?: boolean; label?: string; name?: string }) {
  const opts = [...DELAY_OPTIONS] as number[];
  if (accountDefault !== undefined && !opts.includes(accountDefault)) opts.push(accountDefault);
  opts.sort((a, b) => a - b);
  return <fieldset disabled={disabled}>
    <legend className="label text-base">{label}</legend>
    {name && <input type="hidden" name={name} value={value} />}
    <div role="radiogroup" className="mt-1 grid gap-1 rounded-xl bg-slate-100 p-1" style={{ gridTemplateColumns: `repeat(${opts.length}, minmax(0, 1fr))` }}>
      {opts.map((h) => { const on = h === value; return <button key={h} type="button" role="radio" aria-checked={on} onClick={() => onChange(h)}
        className={`relative min-h-[44px] rounded-lg px-2 text-sm font-semibold transition ${on ? "bg-white text-navy-900 shadow-sm ring-1 ring-slate-200" : "text-slate-500 hover:text-navy-900"}`}>
        {delayShort(h)}{accountDefault === h && <span className="absolute right-1.5 top-1 h-1.5 w-1.5 rounded-full bg-lime-500" title="Your default" />}</button>; })}
    </div>
  </fieldset>;
}
