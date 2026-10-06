import { Link } from "react-router";

import Card from "../../components/ui/Card";

function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:py-28">
          <div className="max-w-3xl">
            <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-slate-500">
              Academic Credential Verification
            </p>

            <h1 className="text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              Verify academic credentials with confidence.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              EduVerify provides a secure platform for issuing, managing,
              and verifying academic credentials against official
              institutional records.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                  to="/verify"
                  className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
                >
                  Verify a Credential
                </Link>

              <Link
                  to="/login"
                  className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                >
                  Institution Login
                </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Verification */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-slate-500">
            Quick Verification
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
            Check a credential
          </h2>

          <p className="mt-4 text-slate-600">
            Enter a Credential ID to check its current verification
            status.
          </p>
        </div>

        <Card className="mx-auto mt-8 max-w-2xl p-6">
          <form className="flex flex-col gap-3 sm:flex-row">
            <input
              type="text"
              placeholder="Enter Credential ID"
              className="min-w-0 flex-1 rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            />

            <Link
              to="/verify"
              className="inline-flex w-full items-center justify-center rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slate-800 sm:w-auto"
            >
              Verify
            </Link>
          </form>
        </Card>
      </section>

      {/* How it works */}
      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-slate-500">
              Process
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
              How EduVerify works
            </h2>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <Card className="p-6">
              <span className="text-sm font-bold text-slate-400">
                01
              </span>

              <h3 className="mt-4 text-lg font-semibold">
                Credential Issuance
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Authorized institutional staff issue digital credentials
                using official academic records.
              </p>
            </Card>

            <Card className="p-6">
              <span className="text-sm font-bold text-slate-400">
                02
              </span>

              <h3 className="mt-4 text-lg font-semibold">
                Credential Verification
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Employers and other authorized verifiers can use a
                Credential ID or QR code.
              </p>
            </Card>

            <Card className="p-6">
              <span className="text-sm font-bold text-slate-400">
                03
              </span>

              <h3 className="mt-4 text-lg font-semibold">
                Verification Result
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                The system checks the official record and displays the
                current credential status.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Trust */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="p-6">
            <h3 className="font-semibold">
              Institution-backed records
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              Verification is based on records maintained by the
              educational institution.
            </p>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold">
              QR-based verification
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              Digital credentials can contain a QR code that leads
              directly to their verification page.
            </p>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold">
              Traceable activity
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              Credential and verification activity can be recorded for
              institutional auditing.
            </p>
          </Card>
        </div>
      </section>
    </div>
  );
}

export default Home;