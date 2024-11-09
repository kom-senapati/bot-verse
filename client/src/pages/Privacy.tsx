import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import transition from "@/components/transition";

const Privacy = () => {
  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8 min-h-[85vh]">
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
        <p className="mb-4">
          This Privacy Policy explains how we collect, use, disclose, and
          protect your information when you use our services.
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            1. Information We Collect
          </h2>
          <p className="text-muted-foreground">
            We collect information you provide directly to us, such as your
            username, email address, and any other information you choose to
            submit.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            2. How We Use Your Information
          </h2>
          <p className="text-muted-foreground">
            We use your information to provide, operate, and maintain our
            services, and to improve, personalize, and expand our services.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            3. Sharing Your Information
          </h2>
          <p className="text-muted-foreground">
            We do not share your personal information with third parties except
            as described in this Privacy Policy or with your consent.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            4. Security of Your Information
          </h2>
          <p className="text-muted-foreground">
            We implement reasonable security measures to protect your
            information. However, no method of transmission over the Internet or
            method of electronic storage is 100% secure, and we cannot guarantee
            absolute security.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            5. Changes to This Policy
          </h2>
          <p className="text-muted-foreground">
            We may update our Privacy Policy from time to time. We will notify
            you of any changes by posting the new Privacy Policy on this page.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Contact Us</h2>
          <p className="text-muted-foreground">
            If you have any questions about this Privacy Policy, please contact
            us at support@example.com.
          </p>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default transition(Privacy);
