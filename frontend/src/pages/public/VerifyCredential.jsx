
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import apiClient from "../../services/apiClient";

const STATUS_STYLES = {
  VERIFIED: "bg-emerald-50 border-emerald-200 text-emerald-800",
  REVOKED: "bg-red-50 border-red-200 text-red-800",
  NOT_ACTIVE: "bg-amber-50 border-amber-200 text-amber-800",
  NOT_FOUND: "bg-slate-100 border-slate-200 text-slate-800",
  REVIEW_REQUIRED: "bg-amber-50 border-amber-200 text-amber-800",
};

function VerifyCredential() {
  const { credentialId: urlCredentialId } = useParams();
  const [credentialId, setCredentialId] = useState(
    urlCredentialId || ""
  );
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function verify(id) {
    const normalizedId = id.trim();

    if (!normalizedId) {
      setError("Please enter a Credential ID.");
      setResult(null);
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await apiClient.get(
        `/verify/${encodeURIComponent(normalizedId)}`
      );
      setResult(response.data.data);
    } catch (err) {
      const apiResult = err.response?.data?.data;

      if (apiResult) {
        setResult(apiResult);
      } else if (err.response?.status === 404) {
        setResult({
          result: "NOT_FOUND",
          message: "No credential was found for the provided ID.",
          credential: null,
        });
      } else {
        setError(
          err.response?.data?.message ||
            "Unable to contact the verification service. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (urlCredentialId) {
      setCredentialId(urlCredentialId);
      verify(urlCredentialId);
    }
  }, [urlCredentialId]);

  function handleSubmit(event) {
    event.preventDefault();
    verify(credentialId);
  }

  const credential = result?.credential;
  const statusStyle =
    STATUS_STYLES[result?.result] ||
    "bg-slate-100 border-slate-200 text-slate-800";

  return (
    <section className="mx-auto max-w-3xl px-6 py-16">
      <div className="text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-slate-500">
          Credential Verification
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
          Verify an academic credential
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-slate-600">
          Check a credential against the institution's official records.
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
            onChange={(event) => setCredentialId(event.target.value)}
            placeholder="EV-2026-A985397BC554"
            className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
          />

          <Button
            type="submit"
            className="mt-4 w-full"
            disabled={!credentialId.trim() || loading}
          >
            {loading ? "Verifying..." : "Verify Credential"}
          </Button>
        </form>

        {error && (
          <p role="alert" className="mt-5 rounded-lg bg-red-50 p-4 text-sm text-red-800">
            {error}
          </p>
        )}

        {loading && (
          <p role="status" className="mt-5 text-sm text-slate-600">
            Checking official institutional records...
          </p>
        )}

        {result && !loading && (
          <div
            aria-live="polite"
            className={`mt-8 rounded-xl border p-5 ${statusStyle}`}
          >
            <p className="text-sm font-semibold uppercase tracking-wide">
              {result.result.replaceAll("_", " ")}
            </p>
            <p className="mt-2 text-sm">{result.message}</p>

            {credential && (
              <div className="mt-5 space-y-3 border-t border-current/20 pt-4 text-sm">
                <Detail label="Credential ID" value={credential.credentialId} />
                <Detail label="Credential type" value={credential.credentialType} />
                <Detail label="Status" value={credential.status} />

                {credential.student && (
                  <>
                    <Detail label="Student name" value={credential.student.name} />
                    <Detail label="Student ID" value={credential.student.studentId} />
                    <Detail label="Program" value={credential.student.program} />
                    <Detail label="Batch" value={credential.student.batch} />
                    <Detail
                      label="Graduation year"
                      value={credential.student.graduationYear}
                    />
                  </>
                )}

                {credential.issueDate && (
                  <Detail
                    label="Issue date"
                    value={new Date(credential.issueDate).toLocaleDateString()}
                  />
                )}

                {credential.revokedAt && (
                  <Detail
                    label="Revoked on"
                    value={new Date(credential.revokedAt).toLocaleDateString()}
                  />
                )}

                {credential.revocationReason && (
                  <Detail
                    label="Revocation reason"
                    value={credential.revocationReason}
                  />
                )}
              </div>
            )}
          </div>
        )}
      </Card>
    </section>
  );
}

function Detail({ label, value }) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:justify-between">
      <span className="font-medium opacity-80">{label}</span>
      <span className="break-words sm:text-right">{String(value)}</span>
    </div>
  );
}

export default VerifyCredential;
