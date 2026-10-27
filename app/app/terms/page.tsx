import Legal from "@/components/Legal";
export const metadata = { title: "Terms of Service", alternates: { canonical: "/terms" } };
export default function Page() { return <Legal title="Terms of Service">
  <p>These terms are the deal between you and ReviewAsk. By using ReviewAsk, you agree to them.</p>
  <h2>What we do</h2><p>ReviewAsk sends review request messages to your customers on your behalf, linking to the review page you provide.</p>
  <h2>Your responsibilities</h2><p>Only message people who are your real customers and who expect to hear from you. Don&apos;t offer rewards for reviews, don&apos;t ask only happy customers while filtering others, and follow Google&apos;s review policies and anti-spam laws like CAN-SPAM and the TCPA.</p>
  <h2>Text messages</h2><p>Before you add a customer&apos;s mobile number, you must have their consent to receive a review-request text from your business (verbally or in writing). Customers can reply STOP to opt out and HELP for help; we honor opt-outs automatically. See <a href="/sms" className="underline">SMS messaging &amp; opt-in</a>.</p>
  <h2>Billing</h2><p>Plans renew automatically ($39/month or $390/year) after any free trial. You can cancel anytime from Settings; you keep access until the end of the paid period. Cancelling stops future renewals; we don&apos;t issue prorated refunds for the remainder of a period already paid.</p>
  <h2>Limits</h2><p>Starter includes 200 requests per month. We may suspend accounts that send spam or abuse the service.</p>
  <h2>No guarantees</h2><p>We can&apos;t promise a specific number of reviews. The service is provided &quot;as is&quot; and our liability is limited to what you paid us in the last 3 months.</p>
  <h2>Contact</h2><p>Questions? Email support@getreviewask.com.</p></Legal>; }
