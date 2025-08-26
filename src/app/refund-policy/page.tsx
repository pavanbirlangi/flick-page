export default function RefundPolicyPage() {
  return (
    <main className="min-h-[50vh] bg-black text-white px-6 py-16">
      <div className="max-w-3xl mx-auto prose prose-invert prose-headings:mb-3 prose-p:mb-4">
        <h1 className="text-3xl font-bold">Refund Policy</h1>
        <p className="text-gray-400">Effective Date: July 17, 2025</p>

        <p>
          Thank you for subscribing to PRFL (prfl.live). We appreciate your trust in our platform and are
          committed to providing you with a smooth and valuable experience. Please review our refund policy
          carefully before subscribing.
        </p>

        <h2 className="text-2xl font-semibold">1. All Sales Are Final</h2>
        <p>
          Due to the nature of our service being a subscription-based digital platform, all payments made for PRFL
          subscriptions are non-refundable. Once a subscription is activated, you gain immediate access to premium
          features, services, and resources, which cannot be reversed or returned. Therefore, we are unable to provide
          refunds for any subscription fees, whether in part or in full.
        </p>

        <h2 className="text-2xl font-semibold">2. Subscription Renewals</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>PRFL subscriptions renew automatically at the end of each billing cycle (monthly or annually).</li>
          <li>By subscribing, you authorize recurring payments until you cancel your subscription.</li>
          <li>To avoid future charges, cancel before the renewal date.</li>
        </ul>

        <h2 className="text-2xl font-semibold">3. Why We Cannot Offer Refunds</h2>
        <p>
          Digital subscriptions differ from physical products—once access is granted, it cannot be revoked. Since users
          can fully utilize the platform immediately upon payment, we cannot guarantee non-usage after a refund. This
          policy helps us maintain fairness and protect our intellectual property.
        </p>

        <h2 className="text-2xl font-semibold">4. Exceptions to the No-Refund Policy</h2>
        <p>We will consider refunds only in the following limited circumstances:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <span className="font-medium">Non-Delivery of Service:</span> If you are charged but do not gain access due to an issue on our side and the
            problem cannot be resolved promptly.
          </li>
          <li>
            <span className="font-medium">Accidental Duplicate Payment:</span> We will refund any duplicate charges.
          </li>
          <li>
            <span className="font-medium">Major Service Failure:</span> If PRFL fails to provide core services as advertised and our support team cannot
            resolve the issue within a reasonable timeframe.
          </li>
        </ul>

        <h2 className="text-2xl font-semibold">5. Free Trials & Cancellations</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>If a free trial is offered, you may cancel during the trial to avoid charges.</li>
          <li>After conversion to a paid plan, charges are non-refundable.</li>
          <li>Cancellation stops future billing only; past payments are not refunded.</li>
        </ul>

        <h2 className="text-2xl font-semibold">6. Contact Us</h2>
        <p>
          If you have questions about this Refund Policy or believe you are eligible for an exception, please contact
          us at <a className="text-blue-400 underline" href="mailto:business.zint@gmail.com">business.zint@gmail.com</a>.
        </p>

        <p>
          By subscribing to PRFL, you acknowledge that you have read, understood, and agree to this Refund Policy.
        </p>
      </div>
    </main>
  )
}