"use client";

export default function DashboardError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="section-heading section-block">
      <span className="eyebrow">Error</span>
      <h1>Dashboard could not be loaded</h1>
      <p>Please try again. If the problem continues, check the API connection.</p>
      <button className="btn-primary" type="button" onClick={reset}>Try again</button>
    </div>
  );
}
