export default function ContactInformationPage() {
  return (
    <main className="min-h-[50vh] bg-black text-white px-6 py-16">
      <div className="max-w-3xl mx-auto prose prose-invert prose-headings:mb-3 prose-p:mb-4">
        <h1 className="text-3xl font-bold">Contact Information</h1>

        <h2 className="text-2xl font-semibold">Email Support</h2>
        <p>
          For detailed technical questions, billing issues, or any other inquiries, please email us. We aim to respond
          within 24 business hours.
        </p>
        <p>
          Email: <a className="text-blue-400 underline" href="mailto:business.zint@gmail.com">business.zint@gmail.com</a>
        </p>

        <h2 className="text-2xl font-semibold">Phone Support</h2>
        <p>
          You can reach us by phone during business hours. For technical support, email is preferred so we can better
          track and resolve your issue.
        </p>
        <p>
          Phone: <a className="text-blue-400 underline" href="tel:+917337423483">+91 7337423483</a><br />
          Hours: Monday - Friday, 10:00 AM to 6:00 PM (IST)
        </p>

        <h2 className="text-2xl font-semibold">Mailing Address</h2>
        <p>
          PRFL c/o Zint Labs,<br />
          Sector 9, MVP Colony,<br />
          Visakhapatnam, Andhra Pradesh,<br />
          India - 530017
        </p>
      </div>
    </main>
  )
}
