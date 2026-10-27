import Link from "next/link";
import Legal from "@/components/Legal";
const title = "Guides and free tools for getting more Google reviews | ReviewAsk";
const description = "Free review tools, trade-by-trade review guides, and honest comparisons for Jobber, Housecall Pro and any field-service business.";
export const metadata = { title: { absolute: title }, description, alternates: { canonical: "/guides" }, openGraph: { title, description, url: "/guides" }, twitter: { title, description } };
export default function Page() { return <Legal title="Guides and free tools">
  <p>Everything here is free to read and use. The trade guides use one trade as an example, but the routine works for any Jobber, Housecall Pro or field-service business.</p>
  <h2>Free tools</h2>
  <ul className="list-disc space-y-1 pl-5"><li><Link href="/tools/review-gap">Review gap calculator</Link></li><li><Link href="/tools/review-link">Google review link generator</Link></li><li><Link href="/templates/review-request">Review request templates</Link></li></ul>
  <h2>Review guides by trade</h2>
  <ul className="list-disc space-y-1 pl-5"><li><Link href="/reviews-for-lawn-care">Lawn care</Link></li><li><Link href="/reviews-for-cleaning">Cleaning</Link></li><li><Link href="/reviews-for-pressure-washing">Pressure washing</Link></li><li><Link href="/reviews-for-hvac">HVAC</Link></li><li><Link href="/reviews-for-pool-service">Pool service</Link></li><li><Link href="/reviews-for-pest-control">Pest control</Link></li></ul>
  <h2>For your job software</h2>
  <ul className="list-disc space-y-1 pl-5"><li><Link href="/for-jobber">ReviewAsk for Jobber</Link></li><li><Link href="/jobber-google-reviews">Jobber Google reviews</Link></li><li><Link href="/for-housecall-pro">ReviewAsk for Housecall Pro</Link></li><li><Link href="/housecall-pro-google-reviews">Housecall Pro Google reviews</Link></li></ul>
  <h2>Comparisons</h2>
  <ul className="list-disc space-y-1 pl-5"><li><Link href="/google-review-software-home-services">Google review software for home services</Link></li><li><Link href="/compare/jobber-marketing-suite">vs. Jobber Marketing Suite</Link></li><li><Link href="/nicejob-alternative">NiceJob alternative</Link></li><li><Link href="/podium-alternative">Podium alternative</Link></li><li><Link href="/birdeye-alternative">Birdeye alternative</Link></li></ul>
  <p className="pt-2"><Link href="/signup" className="btn-navy px-5 py-3 !text-white no-underline">Start your 7-day free trial</Link></p>
</Legal>; }
