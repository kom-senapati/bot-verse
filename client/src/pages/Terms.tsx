import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import transition from "@/components/transition";

const Terms = () => {
  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8 min-h-[85vh]">
        <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
        <p className="mb-4">
          By using this service, you agree to the following terms and
          conditions. Please read them carefully.
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            1. Acceptance of Terms
          </h2>
          <p className="text-muted-foreground">
            Your access to and use of our services is conditional on your
            acceptance of and compliance with these Terms. These Terms apply to
            all visitors, users, and others who access or use our services.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Use of the Service</h2>
          <p className="text-muted-foreground">
            You agree not to misuse the service in any way. Any form of
            unauthorized access, data scraping, or unauthorized reproduction of
            data is strictly prohibited.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. Termination</h2>
          <p className="text-muted-foreground">
            We may terminate or suspend access to our service immediately,
            without prior notice or liability, for any reason, including without
            limitation if you breach the Terms.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Changes to Terms</h2>
          <p className="text-muted-foreground">
            We reserve the right to modify or replace these Terms at any time.
            It is your responsibility to check for updates periodically. Your
            continued use of the service following any changes signifies your
            acceptance of the updated terms.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            5. Contact Information
          </h2>
          <p className="text-muted-foreground">
            If you have any questions about these Terms, please contact us at
            support@example.com.
          </p>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default transition(Terms);
