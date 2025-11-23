// src/components/LoginPage.tsx
import React, { type FormEvent, useState } from "react";

interface LoginPageProps {
  onLogin: (email: string, password: string) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onLogin(email, password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-sky-50">
      <div className="max-w-6xl w-full px-6 py-12 md:px-10 lg:px-16">
        {/* Badge */}
        <div className="mb-10">
          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            MedSight AI · For Nigerian clinicians
          </span>
        </div>

        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          {/* Left: value prop */}
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight">
              Log into your{" "}
              <span className="text-sky-600">hospital EMR assistant</span>
            </h1>

            <p className="mt-4 text-slate-600 text-base md:text-lg max-w-xl">
              Use your official hospital email to access{" "}
              <span className="font-semibold">AI summaries</span> of patient
              records, medication safety checks, and a cleaner EMR view powered
              by Dorra.
            </p>

            <ul className="mt-6 space-y-3 text-sm text-slate-700">
              <li className="flex items-start gap-3">
                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-emerald-500" />
                <span>Secure sign-in for verified hospital staff only.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-sky-500" />
                <span>
                  Instant AI summary of the patient&apos;s full EMR from Dorra.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-amber-400" />
                <span>
                  Medication interaction and dosage safety alerts before
                  prescriptions are finalised.
                </span>
              </li>
            </ul>

            <p className="mt-6 text-xs text-slate-500 max-w-md">
              Demo note: MedSight AI does not store raw EMR data. All records
              are fetched in real time from your hospital&apos;s Dorra
              integration.
            </p>
          </div>

          {/* Right: login card */}
          <div className="bg-white rounded-2xl shadow-xl shadow-sky-100/80 border border-slate-100 p-8 md:p-10">
            <h2 className="text-xs font-semibold tracking-wide text-sky-700 uppercase">
              Hospital access
            </h2>
            <h3 className="mt-2 text-2xl font-semibold text-slate-900">
              Sign in as Doctor
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Use the email provided by your hospital administrator.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              <div className="space-y-1.5">
                <label
                  htmlFor="email"
                  className="text-xs font-medium text-slate-600 uppercase tracking-wide"
                >
                  Official email address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  placeholder="firstname.lastname@hospital.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none ring-2 ring-transparent transition focus:bg-white focus:ring-sky-200 focus:border-sky-400"
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="password"
                  className="text-xs font-medium text-slate-600 uppercase tracking-wide"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none ring-2 ring-transparent transition focus:bg-white focus:ring-sky-200 focus:border-sky-400"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-sky-300/60 transition hover:bg-sky-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50"
              >
                Continue to EMR dashboard
              </button>

              <p className="text-[11px] text-slate-500 leading-relaxed">
                By signing in, you confirm that you are an authorised member of
                this hospital and agree to your hospital&apos;s data policies.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
