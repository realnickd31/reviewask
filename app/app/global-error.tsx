"use client";
// Last-resort boundary (errors in the root layout). Must render its own <html>/<body>.
export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <html lang="en"><body style={{ fontFamily: "system-ui, sans-serif", textAlign: "center", padding: "96px 24px", color: "#0a1224" }}>
    <h1 style={{ fontSize: 24, fontWeight: 600 }}>ReviewAsk: something didn&apos;t load right</h1>
    <p style={{ color: "#475569", marginTop: 12 }}>Please refresh the page. Need help? Email support@getreviewask.com.</p>
    <p style={{ marginTop: 24 }}><button onClick={() => reset()} style={{ padding: "8px 16px" }}>Try again</button> <a href="/" style={{ marginLeft: 12 }}>Homepage</a></p>
  </body></html>;
}
