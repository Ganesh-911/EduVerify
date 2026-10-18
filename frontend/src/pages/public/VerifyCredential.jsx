
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import apiClient from "../../services/apiClient";

const STATUS_CONFIG = {
  VERIFIED: {
    title: "Credential Verified",
    description:
      "This credential is active and matches the institution's records.",
    badge: "success",
    icon: "✓",
    panel: "border-emerald-200 bg-emerald-50",
    iconStyle: "bg-emerald-100 text-emerald-700",
  },
  REVOKED: {
    title: "Credential Revoked",
    description:
      "This credential has been revoked by the institution and should not be treated as valid.",
    badge: "danger",
    icon: "!",
    panel: "border-red-200 bg-red-50",
    iconStyle: "bg-red-100 text-red-700",
  },
  NOT_ACTIVE: {
    title: "Credential Not Active",
    description:
      "This credential is not currently active. Contact the institution for clarification.",
    badge: "warning",
    icon: "!",
    panel: "border-amber-200 bg-amber-50",
    iconStyle: "bg-amber-100 text-amber-700",
  },
  NOT_FOUND: {
    title: "Credential Not Found",
    description:
      "No credential was found for the provided ID. Check the ID and try again.",
    badge: "default",
    icon: "?",
    panel: "border-slate-200 bg-slate-50",
    iconStyle: "bg-slate-200 text-slate-700",
  },
  REVIEW_REQUIRED: {
    title: "Manual Review Required",
    description:
      "The credential requires further review. Contact the institution for confirmation.",
    badge: "warning",
    icon: "!",
    panel: "border-amber-200 bg-amber-50",
    iconStyle: "bg-amber-100 text-amber-700",
  },
};

function VerifyCredential() {
  const { credentialId: urlCredentialId } = useParams();

  const [credentialId, setCredentialId] = useState(urlCredentialId || "");
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
  const status = STATUS_CONFIG[result?.result] || {
    title: "Verification Result",
    description: result?.message || "The verification result is available.",
    badge: "default",
    icon: "i",
    panel: "border-slate-200 bg-slate-50",
    iconStyle: "bg-slate-200 text-slate-700",
  };

  return (
    <main className="min-h-[70vh] bg-slate-50">
      <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-16">
        <header className="mx-auto max-w-2xl text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-700 text-xl font-bold text-white shadow-sm">
            EV
          </div>

          <p className="mt-5 text-xs font-bold uppercase tracking-[0.2em] text-brand-700">
            EduVerify · Public Verification
          </p>

          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            Verify an academic credential
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-slate-600 sm:text-base">
            Confirm credential details against the institution's official
            records using a Credential ID or the QR code on the certificate.
          </p>
        </header>

        <Card className="mx-auto mt-9 max-w-3xl p-5 sm:p-8">
          <form onSubmit={handleSubmit}>
            <label
              htmlFor="credentialId"
              className="block text-sm font-semibold text-slate-800"
            >
              Credential ID
            </label>

            <p className="mt-1 text-sm text-slate-500">
              Enter the ID printed on the academic certificate.
            </p>

            <div className="mt-3 flex flex-col gap-3 sm:flex-row">
              <input
                id="credentialId"
                type="text"
                value={credentialId}
                onChange={(event) => setCredentialId(event.target.value)}
                placeholder="e.g. EV-2026-A985397BC554"
                autoComplete="off"
                className="min-w-0 flex-1 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-brand-600 focus:ring-2 focus:ring-brand-100"
              />

              <Button
                type="submit"
                className="min-h-12 w-full sm:w-auto"
                disabled={!credentialId.trim() || loading}
              >
                {loading ? "Verifying..." : "Verify Credential"}
              </Button>
            </div>
          </form>

          {error && (
            <div
              role="alert"
              className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"
            >
              <p className="font-semibold">Verification unavailable</p>
              <p className="mt-1">{error}</p>
            </div>
          )}

          {loading && (
            <div
              role="status"
              className="mt-8 flex items-center justify-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-8 text-sm text-slate-600"
            >
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-brand-700" />
              Checking official institutional records...
            </div>
          )}

          {result && !loading && (
            <section
              aria-live="polite"
              className={`mt-8 rounded-2xl border p-5 sm:p-6 ${status.panel}`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-xl font-bold ${status.iconStyle}`}
                  aria-hidden="true"
                >
                  {status.icon}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-bold text-slate-950">
                      {status.title}
                    </h2>
                    <Badge variant={status.badge}>
                      {result.result.replaceAll("_", " ")}
                    </Badge>
                  </div>

                  <p className="mt-2 text-sm leading-6 text-slate-700">
                    {result.message || status.description}
                  </p>
                </div>
              </div>

              {credential && (
                <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white">
                  <div className="border-b border-slate-200 px-4 py-4 sm:px-5">
                    <h3 className="font-semibold text-slate-900">
                      Credential details
                    </h3>
                    <p className="mt-1 text-xs text-slate-500">
                      Information returned by the verification service
                    </p>
                  </div>

                  <dl className="grid grid-cols-1 gap-x-6 sm:grid-cols-2">
                    <Detail
                      label="Credential ID"
                      value={credential.credentialId}
                    />
                    <Detail
                      label="Credential type"
                      value={credential.credentialType}
                    />
                    <Detail label="Student name" value={credential.student?.name} />
                    <Detail
                      label="Student ID"
                      value={credential.student?.studentId}
                    />
                    <Detail label="Program" value={credential.student?.program} />
                    <Detail label="Batch" value={credential.student?.batch} />
                    <Detail
                      label="Graduation year"
                      value={credential.student?.graduationYear}
                    />
                    <Detail label="Current status" value={credential.status} />
                    <Detail
                      label="Issue date"
                      value={formatDate(credential.issueDate)}
                    />
                    <Detail
                      label="Revoked on"
                      value={formatDate(credential.revokedAt)}
                    />
                    {credential.revocationReason && (
                      <div className="border-t border-slate-100 px-4 py-3 sm:col-span-2 sm:px-5">
                        <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                          Revocation reason
                        </dt>
                        <dd className="mt-1 break-words text-sm font-medium text-red-700">
                          {credential.revocationReason}
                        </dd>
                      </div>
                    )}
                  </dl>
                </div>
              )}

              <p className="mt-5 text-xs leading-5 text-slate-600">
                EduVerify reports the result available in institutional
                records. If you have questions about a credential, contact the
                issuing institution.
              </p>
            </section>
          )}

          {!result && !loading && !error && (
            <div className="mt-7 rounded-xl border border-dashed border-slate-300 px-5 py-7 text-center">
              <p className="text-sm font-semibold text-slate-700">
                Ready to verify
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Your verification result will appear here.
              </p>
            </div>
          )}
        </Card>

        <footer className="mt-6 text-center text-xs leading-5 text-slate-500">
          <p>EduVerify · Secure Academic Credential Verification</p>
          <p className="mt-1">
            Only the information returned by the verification service is shown.
          </p>
        </footer>
      </section>
    </main>
  );
}

function Detail({ label, value }) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  return (
    <div className="border-t border-slate-100 px-4 py-3 sm:px-5">
      <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </dt>
      <dd className="mt-1 break-words text-sm font-semibold text-slate-800">
        {String(value)}
      </dd>
    </div>
  );
}

function formatDate(value) {
  if (!value) return null;

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toLocaleDateString();
}

export default VerifyCredential;
