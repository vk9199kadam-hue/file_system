export default function Reports() {
  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold text-slate-800 mb-4">Reports</h1>
      <div className="bg-white border border-slate-200 rounded-xl p-6 text-sm text-slate-500">
        Storage &amp; backup performance reports will pull from
        <code className="mx-1 bg-slate-100 px-1 rounded">GET /api/v1/ui/reports/storage</code>
        once Team C's reporting endpoint is ready.
      </div>
    </div>
  );
}
