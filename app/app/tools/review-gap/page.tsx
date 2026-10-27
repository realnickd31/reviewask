import Link from "next/link";
import Legal from "@/components/Legal";
import ReviewGapCalc from "@/components/ReviewGapCalc";
export const metadata = {
  title: { absolute: "Google review gap calculator for home-service businesses — ReviewAsk" },
  description: "Compare your Google review count with your top three local competitors and see how many review requests a month it takes to close the gap.",
  alternates: { canonical: "/tools/review-gap" },
};
export default function Page() { return <Legal title="Google review gap calculator">
  <p>Search your trade and town on Google Maps, then enter your review count and the top three results&apos; counts. The calculator shows how far behind you are and roughly how many review requests a month it takes to catch up. It runs in your browser, and nothing you type is saved or sent.</p>
  <ReviewGapCalc />
  <h2>Why volume wins</h2><p>Most strong local shops already have great ratings. The difference between them and the local leader is usually how many customers were actually asked. ReviewAsk asks every customer after each finished Jobber or Housecall Pro job, plus one follow-up on day 3, for $39/month. Email requests work today, and SMS is rolling out.</p>
  <p className="text-sm text-slate-500">Also see <Link href="/for-jobber">ReviewAsk for Jobber</Link> and <Link href="/for-housecall-pro">ReviewAsk for Housecall Pro</Link>.</p>
</Legal>; }
