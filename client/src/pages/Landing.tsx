import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Separator from "../components/Separator";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/auth-context";
import { useTranslation } from "react-i18next";
import transition from "@/components/transition";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { faqs } from "@/lib/utils";

function LandingPage() {
  const { user } = useAuth();
  const { t } = useTranslation();
  return (
    <>
      <Navbar />
      <section className="text-center p-16 rounded-lg mt-8 dark:text-white">
        <h1 className="text-5xl lg:text-7xl font-extrabold mb-4">
          {t("landing.top_heading")}
        </h1>
        <p className="text-lg mb-8">{t("landing.top_subheading")}</p>

        <Link
          to={user == null ? "/login" : "/dashboard"}
          className="inline-block bg-blue-600 text-white rounded-full px-4 py-2 transition hover:bg-blue-500 dark:bg-blue-500 dark:hover:bg-blue-400"
        >
          {t("landing.get_started")}
        </Link>
      </section>
      <Separator />
      <section className="relative text-gray-800 text-center p-16 mt-8 dark:text-gray-300">
        <h2 className="text-3xl font-bold mb-4">
          {t("landing.about_heading")}
        </h2>
        <p className="text-lg">{t("landing.about_subheading")}</p>
      </section>
      <Separator />

      <section className="text-gray-800 text-center p-16 mt-8 dark:text-gray-300">
        <h2 className="text-3xl font-bold mb-6">
          {t("landing.feature_heading")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="p-6 border border-lighter rounded-lg shadow transition dark:border-darker hover:bg-lighter dark:hover:bg-darker">
            <i className="fas fa-tachometer-alt text-3xl mb-4"></i>
            <h3 className="text-xl font-semibold mb-2">
              {t("landing.f1_heading")}
            </h3>
            <p>{t("landing.f1_subheading")}</p>
          </div>

          <div className="p-6 border border-lighter rounded-lg shadow transition dark:border-darker hover:bg-lighter dark:hover:bg-darker">
            <i className="fas fa-share-alt text-3xl mb-4"></i>
            <h3 className="text-xl font-semibold mb-2">
              {t("landing.f2_heading")}
            </h3>
            <p>{t("landing.f2_subheading")}</p>
          </div>
          <div className="p-6 border border-lighter rounded-lg shadow transition dark:border-darker hover:bg-lighter dark:hover:bg-darker">
            <i className="fas fa-comments text-3xl mb-4"></i>
            <h3 className="text-xl font-semibold mb-2">
              {t("landing.f3_heading")}
            </h3>
            <p>{t("landing.f3_subheading")}</p>{" "}
          </div>
          <div className="p-6 border border-lighter rounded-lg shadow transition dark:border-darker hover:bg-lighter dark:hover:bg-darker">
            <i className="fas fa-cogs text-3xl mb-4"></i>
            <h3 className="text-xl font-semibold mb-2">
              {t("landing.f4_heading")}
            </h3>
            <p>{t("landing.f4_subheading")}</p>
          </div>
        </div>
      </section>

      <Separator />

      <section className="relative text-center p-16 mt-8">
        <h2 className="text-3xl font-bold mb-4 dark:text-white">
          {t("landing.contribute_heading")}
        </h2>
        <p className="text-lg mb-6 dark:text-white">
          {t("landing.contribute_subheading1")}
          <br />
          {t("landing.contribute_subheading2")}
        </p>
        <a
          href="https://github.com/kom-senapati/bot-verse"
          target="_blank"
          className="inline-block bg-gray-600 text-white rounded-full px-4 py-2 transition hover:bg-gray-500 dark:bg-gray-500 dark:hover:bg-gray-400"
        >
          {t("landing.contribute")}
        </a>
      </section>

      <Separator />
      <section className="text-gray-800 text-center p-16 mt-8 dark:text-gray-300">
        <h2 className="text-3xl font-bold mb-6">FAQs</h2>
        <Accordion type="single" collapsible>
          {faqs.map((faq) => (
            <AccordionItem value={faq.id}>
              <AccordionTrigger>{faq.question}</AccordionTrigger>
              <AccordionContent>{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
      <Separator />

      <Footer />
    </>
  );
}

export default transition(LandingPage);
