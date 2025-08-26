export default function ShippingPolicyPage() {
  return (
    <main className="min-h-[50vh] bg-black text-white px-6 py-16">
      <div className="max-w-3xl mx-auto prose prose-invert prose-headings:mb-3 prose-p:mb-4">
        <h1 className="text-3xl font-bold">Shipping Policy</h1>
        <p className="text-gray-400">Effective Date: July 17, 2025</p>

        <p>
          Thank you for choosing PRFL! This policy explains how your portfolio site is created and made accessible once
          you sign up and customize it on our platform.
        </p>

        <h2 className="text-2xl font-semibold">1. General Information</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>PRFL provides digital portfolio websites only.</li>
          <li>There are no physical shipments, shipping costs, or customs fees.</li>
          <li>Your portfolio is delivered online via a public URL (subdomain of prfl.live).</li>
        </ul>

        <h2 className="text-2xl font-semibold">2. Portfolio Delivery Process</h2>
        <p>After setup and payment (if applicable), your portfolio is published instantly.</p>
        <ul className="list-disc pl-6 space-y-2">
          <li><span className="font-medium">Instant Portfolio Link:</span> a unique subdomain (e.g., yourname.prfl.live) is generated.</li>
          <li><span className="font-medium">Email Notification:</span> we email your live portfolio URL.</li>
          <li><span className="font-medium">Dashboard Access:</span> manage your portfolio anytime from your PRFL dashboard.</li>
        </ul>

        <h2 className="text-2xl font-semibold">3. Delivery Timeline</h2>
        <p>Delivery is instantaneous. Your portfolio will be live within minutes of completing setup.</p>

        <h2 className="text-2xl font-semibold">4. Haven’t Received Your Portfolio Link?</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Check your email and spam/junk folders.</li>
          <li>Log in to your PRFL dashboard to view your portfolio link.</li>
          <li>Verify that all required setup steps are complete (name, theme, payment if applicable).</li>
          <li>Contact support if you still cannot access your link.</li>
        </ul>

        <h2 className="text-2xl font-semibold">5. Contact Information</h2>
        <p>
          Email: <a className="text-blue-400 underline" href="mailto:business.zint@gmail.com">business.zint@gmail.com</a>
        </p>

        <p>By creating a portfolio with PRFL, you agree to this Digital Delivery Policy.</p>
      </div>
    </main>
  )
}
