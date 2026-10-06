import { useState } from "react";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";

function VerifyCredential() {
  const [credentialId, setCredentialId] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    console.log("Credential ID:", credentialId);
  }

  return (
    <section className="mx-auto max-w-3xl px-6 py-20">
      <div className="text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-slate-500">
          Credential Verification
        </p>

        <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-950">
          Verify an academic credential
        </h1>

        <p className="mx-auto mt-4 max-w-xl text-slate-600">
          Enter the Credential ID shown on the digital certificate.
          The system will check it against the institution's official
          records.
        </p>
      </div>

      <Card className="mt-10 p-6 sm:p-8">
        <form onSubmit={handleSubmit}>
          <label
            htmlFor="credentialId"
            className="block text-sm font-semibold text-slate-800"
          >
            Credential ID
          </label>

          <input
            id="credentialId"
            type="text"
            value={credentialId}
            onChange={(event) =>
              setCredentialId(event.target.value)
            }
            placeholder="Example: EDU-2026-000123"
            className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
          />

          <Button
            type="submit"
            className="mt-4 w-full"
            disabled={!credentialId.trim()}
          >
            Verify Credential
          </Button>
        </form>

        <div className="mt-8 border-t border-slate-200 pt-6">
          <p className="text-sm font-semibold text-slate-800">
            QR verification
          </p>

          <p className="mt-2 text-sm leading-6 text-slate-600">
            If your certificate contains a QR code, scanning it can
            take you directly to the corresponding verification page.
          </p>
        </div>
      </Card>
    </section>
  );
}

export default VerifyCredential;