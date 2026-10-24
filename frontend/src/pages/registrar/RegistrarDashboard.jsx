
import { useEffect, useMemo, useState } from "react";

import apiClient from "../../services/apiClient";
import Button from "../../components/ui/Button";

const statusStyles = {
  DRAFT: "bg-slate-100 text-slate-700 ring-slate-200",
  ISSUED: "bg-blue-50 text-blue-700 ring-blue-200",
  ACTIVE: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  REVOKED: "bg-red-50 text-red-700 ring-red-200",
};

const statusLabels = ["DRAFT", "ISSUED", "ACTIVE", "REVOKED"];

function formatDate(date) {
  if (!date) return "—";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return "—";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(parsedDate);
}

function RegistrarDashboard() {
  const [credentials, setCredentials] = useState([]);
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [credentialType, setCredentialType] = useState("DEGREE");

  async function loadCredentials() {
    setLoading(true);
    setError("");

    try {
      const response = await apiClient.get("/credentials");

      if (
        !response.data?.success ||
        !Array.isArray(response.data.data)
      ) {
        throw new Error("The server returned an unexpected response.");
      }

      setCredentials(response.data.data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to load credential records.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function loadStudents() {
    try {
      const response = await apiClient.get("/students");

      if (
        !response.data?.success ||
        !Array.isArray(response.data.data)
      ) {
        throw new Error("Unable to load student records.");
      }

      setStudents(response.data.data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to load student records.",
      );
    }
  }

  useEffect(() => {
    loadCredentials();
    loadStudents();
  }, []);

  const counts = useMemo(() => {
    const result = {
      TOTAL: credentials.length,
      DRAFT: 0,
      ISSUED: 0,
      ACTIVE: 0,
      REVOKED: 0,
    };

    credentials.forEach((credential) => {
      if (Object.hasOwn(result, credential.status) &&
          credential.status !== "TOTAL") {
        result[credential.status] += 1;
      }
    });

    return result;
  }, [credentials]);

  const filteredCredentials = useMemo(() => {
    const query = search.trim().toLowerCase();

    return credentials.filter((credential) => {
      const student = credential.studentId;
      const matchesStatus =
        statusFilter === "ALL" || credential.status === statusFilter;

      const matchesSearch =
        !query ||
        [
          credential.credentialId,
          credential.credentialType,
          student?.name,
          student?.studentId,
          student?.email,
        ].some((value) =>
          String(value || "").toLowerCase().includes(query),
        );

      return matchesStatus && matchesSearch;
    });
  }, [credentials, search, statusFilter]);

  async function handleCreateCredential(event) {
    event.preventDefault();
    setError("");
    setNotice("");

    if (!selectedStudentId || !credentialType) {
      setError("Select a student and credential type.");
      return;
    }

    setCreating(true);

    try {
      const response = await apiClient.post("/credentials", {
        studentId: selectedStudentId,
        credentialType,
      });

      if (!response.data?.success) {
        throw new Error("Credential creation failed.");
      }

      const createdId = response.data.data?.credentialId;

      setNotice(
        createdId
          ? `Credential ${createdId} created successfully as a draft.`
          : "Credential created successfully.",
      );

      setShowCreateForm(false);
      setSelectedStudentId("");
      setCredentialType("DEGREE");

      await loadCredentials();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to create the credential.",
      );
    } finally {
      setCreating(false);
    }
  }

  function toggleCreateForm() {
    setError("");
    setNotice("");
    setShowCreateForm((current) => !current);
  }
    async function handleIssueCredential(credential) {
    const credentialId = credential.credentialId;

    const confirmed = window.confirm(
      `Issue credential ${credentialId}? This will change its status from DRAFT to ISSUED.`,
    );

    if (!confirmed) return;

    setError("");
    setNotice("");

    try {
      const response = await apiClient.patch(
        `/credentials/${encodeURIComponent(credentialId)}/issue`,
      );

      if (!response.data?.success) {
        throw new Error("Credential issuance failed.");
      }

      setNotice(`Credential ${credentialId} issued successfully.`);
      await loadCredentials();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to issue credential.",
      );
    }
  }
  async function handleGenerateCertificate(credential) {
  const credentialId = credential.credentialId;

  const confirmed = window.confirm(
    `Generate the certificate PDF for ${credentialId}?`,
  );

  if (!confirmed) return;

  setError("");
  setNotice("");

  try {
    const response = await apiClient.post(
      `/credentials/${encodeURIComponent(credentialId)}/certificate`,
    );

    if (!response.data?.success) {
      throw new Error("Certificate generation failed.");
    }

    setNotice(`Certificate generated successfully for ${credentialId}.`);
    await loadCredentials();
  } catch (err) {
    setError(
      err.response?.data?.message ||
        err.message ||
        "Unable to generate certificate.",
    );
  }
}
async function handleActivateCredential(credential) {
  const credentialId = credential.credentialId;

  const confirmed = window.confirm(
    `Activate credential ${credentialId}? The certificate must exist and pass hash verification.`,
  );

  if (!confirmed) return;

  setError("");
  setNotice("");

  try {
    const response = await apiClient.patch(
      `/credentials/${encodeURIComponent(credentialId)}/activate`,
    );

    if (!response.data?.success) {
      throw new Error("Credential activation failed.");
    }

    setNotice(`Credential ${credentialId} activated successfully.`);
    await loadCredentials();
  } catch (err) {
    setError(
      err.response?.data?.message ||
        err.message ||
        "Unable to activate credential.",
    );
  }
}
async function handleDownloadCertificate(credential) {
  const filename = `${credential.credentialId}.pdf`;

  setError("");

  try {
    const response = await apiClient.get(
      `/certificates/${encodeURIComponent(filename)}`,
      {
        responseType: "blob",
      },
    );

    const pdfBlob = new Blob([response.data], {
      type: "application/pdf",
    });

    const downloadUrl = window.URL.createObjectURL(pdfBlob);

    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = filename;

    document.body.appendChild(link);
    link.click();
    link.remove();

    window.setTimeout(() => {
      window.URL.revokeObjectURL(downloadUrl);
    }, 1000);
  } catch (err) {
    setError(
      err.response?.data?.message ||
        "Unable to download certificate.",
    );
  }
}
async function handleRevokeCredential(credential) {
  const credentialId = credential.credentialId;

  const reason = window.prompt(
    `Enter the reason for revoking credential ${credentialId}:`,
  );

  if (reason === null) return;

  if (!reason.trim()) {
    setError("A revocation reason is required.");
    return;
  }

  const confirmed = window.confirm(
    `Are you sure you want to revoke ${credentialId}? This cannot be undone through the current workflow.`,
  );

  if (!confirmed) return;

  setError("");
  setNotice("");

  try {
    const response = await apiClient.patch(
      `/credentials/${encodeURIComponent(credentialId)}/revoke`,
      { reason: reason.trim() },
    );

    if (!response.data?.success) {
      throw new Error("Credential revocation failed.");
    }

    setNotice(`Credential ${credentialId} revoked successfully.`);
    await loadCredentials();
  } catch (err) {
    setError(
      err.response?.data?.message ||
        err.message ||
        "Unable to revoke credential.",
    );
  }
}

  return (
    <section className="space-y-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <p className="text-sm font-semibold text-brand-700">
            CREDENTIAL ADMINISTRATION
          </p>

          <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Registrar Dashboard
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            Manage academic credentials, monitor issuance status, and
            maintain reliable institutional records.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button
            variant="secondary"
            onClick={loadCredentials}
            disabled={loading}
          >
            {loading ? "Refreshing..." : "Refresh records"}
          </Button>

          <Button onClick={toggleCreateForm}>
            {showCreateForm ? "Cancel creation" : "Create credential"}
          </Button>
        </div>
      </div>

      {notice && (
        <div
          role="status"
          className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
        >
          {notice}
        </div>
      )}

      {error && (
        <div
          role="alert"
          className="flex flex-col justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-4 sm:flex-row sm:items-center"
        >
          <p className="text-sm text-red-800">{error}</p>

          <Button variant="secondary" onClick={loadCredentials}>
            Retry loading records
          </Button>
        </div>
      )}

      {showCreateForm && (
        <form
          onSubmit={handleCreateCredential}
          className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
        >
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-slate-900">
              Create a credential
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Create a draft from an existing institutional student record.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label
                htmlFor="credential-student"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Student
              </label>

              <select
                id="credential-student"
                required
                value={selectedStudentId}
                onChange={(event) =>
                  setSelectedStudentId(event.target.value)
                }
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
              >
                <option value="">Select a student</option>

                {students
                  .filter(
                    (student) => student.academicStatus !== "WITHDRAWN",
                  )
                  .map((student) => (
                    <option key={student._id} value={student.studentId}>
                      {student.name} — {student.studentId}
                    </option>
                  ))}
              </select>

              {students.length === 0 && (
                <p className="mt-2 text-xs text-amber-700">
                  No student records are available. Check the student API.
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="credential-type"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Credential type
              </label>

              <select
                id="credential-type"
                required
                value={credentialType}
                onChange={(event) => setCredentialType(event.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
              >
                <option value="DEGREE">Degree</option>
                <option value="DIPLOMA">Diploma</option>
                <option value="TRANSCRIPT">Transcript</option>
                <option value="MARKSHEET">Marksheet</option>
              </select>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap justify-end gap-3">
            <Button
              variant="secondary"
              onClick={toggleCreateForm}
              disabled={creating}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={creating || students.length === 0}
            >
              {creating ? "Creating..." : "Create draft"}
            </Button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <SummaryCard
          label="Total credentials"
          value={loading ? "—" : counts.TOTAL}
          description="Records retrieved from the server"
          accent="border-t-slate-500"
        />

        <SummaryCard
          label="Draft"
          value={loading ? "—" : counts.DRAFT}
          description="Awaiting issuance"
          accent="border-t-slate-400"
        />

        <SummaryCard
          label="Issued"
          value={loading ? "—" : counts.ISSUED}
          description="Issued credentials"
          accent="border-t-blue-600"
        />

        <SummaryCard
          label="Active"
          value={loading ? "—" : counts.ACTIVE}
          description="Currently active credentials"
          accent="border-t-emerald-600"
        />

        <SummaryCard
          label="Revoked"
          value={loading ? "—" : counts.REVOKED}
          description="Credentials no longer valid"
          accent="border-t-red-600"
        />
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-5 py-5 sm:px-6">
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Credential records
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Search and review credentials stored in EduVerify.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <label className="sr-only" htmlFor="credential-search">
                Search credentials
              </label>

              <input
                id="credential-search"
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search ID, student, email..."
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 sm:w-72"
              />

              <label className="sr-only" htmlFor="credential-status">
                Filter by status
              </label>

              <select
                id="credential-status"
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
              >
                <option value="ALL">All statuses</option>

                {statusLabels.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="px-6 py-16 text-center">
            <p className="text-sm font-medium text-slate-700">
              Loading credential records...
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Retrieving the latest data from the server.
            </p>
          </div>
        ) : filteredCredentials.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <h3 className="text-base font-semibold text-slate-900">
              No credentials found
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Try another search term or change the status filter.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left text-sm">
              <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <tr>
                  <th scope="col" className="px-6 py-3.5">Credential</th>
                  <th scope="col" className="px-6 py-3.5">Student</th>
                  <th scope="col" className="px-6 py-3.5">Type</th>
                  <th scope="col" className="px-6 py-3.5">Issue date</th>
                  <th scope="col" className="px-6 py-3.5">Status</th>
                  <th scope="col" className="px-6 py-3.5">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredCredentials.map((credential) => (
                  <tr
                    key={credential._id}
                    className="transition-colors hover:bg-slate-50"
                  >
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-900">
                        {credential.credentialId}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        Created {formatDate(credential.createdAt)}
                      </p>
                    </td>

                    <td className="px-6 py-4">
                      <p className="font-medium text-slate-800">
                        {credential.studentId?.name || "Student unavailable"}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {credential.studentId?.studentId || "—"}
                      </p>
                    </td>

                    <td className="px-6 py-4 text-slate-700">
                      {credential.credentialType || "—"}
                    </td>

                    <td className="px-6 py-4 text-slate-600">
                      {formatDate(credential.issueDate)}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${
                          statusStyles[credential.status] ||
                          "bg-slate-100 text-slate-700 ring-slate-200"
                        }`}
                      >
                        {credential.status || "UNKNOWN"}
                      </span>
                    </td>

                    {/* New Actions column */}
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-2">
                        {credential.status === "DRAFT" && (
                          <Button
                            variant="primary"
                            onClick={() => handleIssueCredential(credential)}
                          >
                            Issue credential
                          </Button>
                        )}

                        {credential.status === "ISSUED" && (
                          <>
                            <Button
                              variant="secondary"
                              onClick={() => handleGenerateCertificate(credential)}
                            >
                              Generate certificate
                            </Button>

                            <Button
                              variant="primary"
                              onClick={() => handleActivateCredential(credential)}
                            >
                              Activate
                            </Button>
                          </>
                        )}

                        {credential.documentUrl &&
                          ["ISSUED", "ACTIVE"].includes(credential.status) && (
                            <Button
                              variant="secondary"
                              onClick={() => handleDownloadCertificate(credential)}
                            >
                              Download PDF
                            </Button>
                          )}

                        {credential.status === "ACTIVE" && (
                          <Button
                            variant="danger"
                            onClick={() => handleRevokeCredential(credential)}
                          >
                            Revoke
                          </Button>
                        )}

                        {credential.status === "REVOKED" && (
                          <span className="text-xs text-slate-400">Revoked</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex flex-col justify-between gap-1 border-t border-slate-200 bg-slate-50 px-5 py-3 text-xs text-slate-500 sm:flex-row sm:items-center sm:px-6">
          <span>
            Showing {loading ? 0 : filteredCredentials.length} of{" "}
            {loading ? 0 : credentials.length} records
          </span>

          <span>Data sourced from EduVerify</span>
        </div>
      </div>
    </section>
  );
}

function SummaryCard({ label, value, description, accent }) {
  return (
    <article
      className={`rounded-xl border border-slate-200 border-t-2 ${accent} bg-white p-5 shadow-sm`}
    >
      <p className="text-sm font-medium text-slate-600">{label}</p>

      <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">
        {value}
      </p>

      <p className="mt-2 text-xs leading-5 text-slate-500">
        {description}
      </p>
    </article>
  );
}

export default RegistrarDashboard;
