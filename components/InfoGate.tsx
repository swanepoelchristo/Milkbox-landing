"use client";

import { useEffect, useState } from "react";

type FormData = {
  name: string;
  email: string;
  age: string;
  demographic: string;
  job: string;
  hobbies: string;
  dateOfBirth: string;
  goals12m: string;
  referralEmail: string;
  consent: boolean;
};

const initial: FormData = {
  name: "", email: "", age: "", demographic: "", job: "",
  hobbies: "", dateOfBirth: "", goals12m: "", referralEmail: "", consent: false
};

export default function InfoGate({ onUnlocked }: { onUnlocked?: () => void }) {
  const [open, setOpen] = useState(true);
  const [data, setData] = useState<FormData>(initial);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const ok = localStorage.getItem("mbx_info_ok") === "1";
    if (ok) { setOpen(false); onUnlocked?.(); }
  }, [onUnlocked]);

  async function submit() {
    setErr(null);
    if (!data.name || !data.email || !data.consent) {
      setErr("Name, email and consent are required.");
      return;
    }
    try {
      setBusy(true);
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, type: "info-gate" })
      });
      const j = await res.json();
      if (!res.ok || !j.ok) throw new Error(j.error || "Submit failed");
      localStorage.setItem("mbx_info_ok", "1");
      setOpen(false);
      onUnlocked?.();
    } catch (e: any) {
      setErr(e.message || "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  if (!open) return null;

  const input = (label: string, props: any) => (
    <div>
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <input {...props} className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" />
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="mb-1 text-2xl font-bold">Quick info before you enter</h2>
        <p className="mb-4 text-sm text-gray-600">
          This helps us understand who we’re building for. By continuing, you consent to be contacted about MilkBox AI.
        </p>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {input("Name*", { value: data.name, onChange: (e:any)=>setData({...data, name:e.target.value}) })}
          {input("Email*", { type:"email", value: data.email, onChange:(e:any)=>setData({...data, email:e.target.value}) })}
          {input("Age", { type:"number", value: data.age, onChange:(e:any)=>setData({...data, age:e.target.value}) })}
          {input("Demographic / Region", { placeholder:"Pretoria, SA", value: data.demographic, onChange:(e:any)=>setData({...data, demographic:e.target.value}) })}
          {input("Job / Role", { value: data.job, onChange:(e:any)=>setData({...data, job:e.target.value}) })}
          {input("Hobbies", { value: data.hobbies, onChange:(e:any)=>setData({...data, hobbies:e.target.value}) })}
          {input("Date of Birth", { type:"date", value: data.dateOfBirth, onChange:(e:any)=>setData({...data, dateOfBirth:e.target.value}) })}
          <div className="sm:col-span-2">
            <label className="text-sm font-medium text-gray-700">Goals (next 12 months)</label>
            <textarea className="h-24 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                      value={data.goals12m} onChange={(e)=>setData({...data, goals12m: e.target.value})}/>
          </div>
          {input("Referral friend’s email", { type:"email", value: data.referralEmail, onChange:(e:any)=>setData({...data, referralEmail:e.target.value}) })}
        </div>

        <label className="mt-3 flex items-center gap-2 text-sm">
          <input type="checkbox" checked={data.consent}
                 onChange={(e)=>setData({...data, consent:e.target.checked})}/>
          I agree to the Privacy Notice and to be contacted about MilkBox AI.
        </label>

        {err && <p className="mt-2 text-sm text-red-600">{err}</p>}

        <div className="mt-4 flex gap-3">
          <button onClick={submit} disabled={busy}
                  className="inline-block rounded-lg bg-green-600 px-6 py-3 text-white shadow hover:bg-green-700">
            {busy ? "Submitting..." : "Continue"}
          </button>
        </div>
      </div>
    </div>
  );
}
