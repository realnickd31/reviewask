import Legal from "@/components/Legal";
export const metadata = { title: "Privacy Policy", alternates: { canonical: "/privacy" } };
export default function Page() { return <Legal title="Privacy Policy">
  <p>We collect as little as we need to run the service, and we never sell your data.</p>
  <h2>What we store</h2><p>Your email, a hashed password, your business name and review link, and the names, emails, and phone numbers of customers you send requests to.</p>
  <h2>Why</h2><p>To send your review requests, show your history, and bill you. That&apos;s it.</p>
  <h2>Who we share with</h2><p>Stripe (payments), our email provider (to deliver messages), and our SMS provider (Twilio) to deliver text messages. They only get what they need to do their job.</p>
  <h2>Your customers</h2><p>Every email includes an unsubscribe link, and customers can reply STOP to any text to opt out (HELP for help). We honor opt-outs across all of that business&apos;s requests.</p>
  <h2>Mobile numbers &amp; SMS</h2><p>Mobile numbers and SMS opt-in information are used only to send review requests and are never sold or shared with third parties for their marketing. See <a href="/sms" className="underline">SMS messaging &amp; opt-in</a>.</p>
  <h2>Deleting data</h2><p>Email support@getreviewask.com and we&apos;ll delete your account and customer data within 30 days.</p></Legal>; }
