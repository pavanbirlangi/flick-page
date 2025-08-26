export default function TermsOfServicePage() {
  return (
    <main className="min-h-[50vh] bg-black text-white px-6 py-16">
      <div className="max-w-3xl mx-auto prose prose-invert prose-headings:mb-3 prose-p:mb-4">
        <h1 className="text-3xl font-bold">Terms of Service</h1>
        <p className="text-gray-400">Last Updated: July 17, 2025</p>

        <p>
          Welcome to PRFL! These Terms of Service ("Terms") govern your access to and use of the PRFL website (the
          "Site") and the services we provide, including the creation and hosting of digital portfolio websites
          ("Portfolios"). By creating an account, subscribing, or using PRFL, you agree to be bound by these Terms and
          our Privacy Policy.
        </p>

        <h2 className="text-2xl font-semibold">1. Definitions</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li><span className="font-medium">PRFL:</span> the service provider of prfl.live ("we," "us," or "our").</li>
          <li><span className="font-medium">User:</span> any individual or entity that accesses or uses PRFL ("you," "your").</li>
          <li><span className="font-medium">Portfolio:</span> a personalized website hosted on PRFL (e.g., username.prfl.live).</li>
        </ul>

        <h2 className="text-2xl font-semibold">2. License & Usage</h2>
        <p>
          Your subscription grants a limited, non-exclusive, revocable license to use PRFL subject to these Terms.
        </p>
        <h3 className="text-xl font-semibold mt-4">Permitted Usage</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li>Create and manage portfolios under your active subscription.</li>
          <li>Customize content, design, and settings provided by PRFL.</li>
          <li>Share your portfolio publicly via your unique subdomain.</li>
        </ul>
        <h3 className="text-xl font-semibold mt-4">Prohibited Usage</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li>Resell, redistribute, or replicate PRFL’s platform or services.</li>
          <li>Use PRFL for illegal, harmful, or infringing purposes.</li>
          <li>Bypass subscription payments or misuse the platform.</li>
          <li>Impersonate others or misrepresent your identity.</li>
        </ul>

        <h2 className="text-2xl font-semibold">3. User Content & Responsibility</h2>
        <p>
          You retain ownership of content you upload to your portfolio. By posting content, you grant PRFL a
          non-exclusive license to host, display, and deliver your portfolio online. You are responsible for the
          accuracy, legality, and appropriateness of your content. PRFL is not liable for third-party claims arising
          from your content.
        </p>

        <h2 className="text-2xl font-semibold">4. Payments, Subscriptions & Renewals</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Subscriptions renew automatically unless canceled before renewal.</li>
          <li>Payments are processed by third-party providers; PRFL does not store card details.</li>
          <li>Prices may change with prior notice; continued use constitutes acceptance.</li>
        </ul>

        <h2 className="text-2xl font-semibold">5. Refund Policy</h2>
        <p>All subscription fees are non-refundable except in limited cases (see Refund Policy).</p>

        <h2 className="text-2xl font-semibold">6. Service Availability & Support</h2>
        <p>
          PRFL is provided on an "as is" and "as available" basis. We aim for high uptime but do not guarantee
          uninterrupted access. Support covers use of PRFL features but excludes third-party integrations and extensive
          customizations.
        </p>

        <h2 className="text-2xl font-semibold">7. Intellectual Property</h2>
        <p>All platform code, features, designs, and branding remain PRFL’s exclusive property.</p>

        <h2 className="text-2xl font-semibold">8. Disclaimer of Warranties</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>The service may contain errors or bugs.</li>
          <li>Compatibility across all devices/browsers/third-party integrations is not guaranteed.</li>
          <li>PRFL may not meet every specific requirement.</li>
        </ul>

        <h2 className="text-2xl font-semibold">9. Limitation of Liability</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>PRFL is not liable for indirect, incidental, or consequential damages.</li>
          <li>Total liability is limited to the subscription fee paid in the last billing cycle.</li>
        </ul>

        <h2 className="text-2xl font-semibold">10. Termination</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>You may cancel your subscription at any time via account settings.</li>
          <li>We may suspend or terminate accounts that violate these Terms or laws.</li>
          <li>Termination does not entitle refunds for unused time.</li>
        </ul>

        <h2 className="text-2xl font-semibold">11. Changes to Terms</h2>
        <p>
          We may update these Terms at any time. Updates will reflect a revised "Last Updated" date. Continued use of
          PRFL after updates means you accept the revised Terms.
        </p>

        <h2 className="text-2xl font-semibold">12. Governing Law</h2>
        <p>
          These Terms are governed by the laws of India. Disputes will be resolved in the courts of Andhra Pradesh,
          India.
        </p>

        <h2 className="text-2xl font-semibold">13. Contact Us</h2>
        <p>
          Email: <a className="text-blue-400 underline" href="mailto:business.zint@gmail.com">business.zint@gmail.com</a>
        </p>
      </div>
    </main>
  )
}