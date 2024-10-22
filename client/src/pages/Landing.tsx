import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Separator from "../components/Separator";
import Footer from "@/components/Footer";

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <section className="text-center p-16 rounded-lg mt-8 dark:text-white">
        <h1 className="text-5xl lg:text-7xl font-extrabold mb-4">
          Welcome to Bot Verse
        </h1>
        <p className="text-lg mb-8">
          Your hub for AI chatbots to solve queries effortlessly.
        </p>

        <Link
          to="/login"
          className="inline-block bg-blue-600 text-white rounded-full px-4 py-2 transition hover:bg-blue-500 dark:bg-blue-500 dark:hover:bg-blue-400"
        >
          Get Started
        </Link>
      </section>
      <Separator />
      <section className="relative text-gray-800 text-center p-16 mt-8 dark:text-gray-300">
        <h2 className="text-3xl font-bold mb-4">About Bot Verse</h2>
        <p className="text-lg">
          A platform for creating, sharing, and interacting with AI chatbots to
          enhance your productivity.
        </p>
      </section>
      <Separator />

      <section className="text-gray-800 text-center p-16 mt-8 dark:text-gray-300">
        <h2 className="text-3xl font-bold mb-6">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="p-6 border border-lighter rounded-lg shadow transition dark:border-darker hover:bg-lighter dark:hover:bg-darker">
            <i className="fas fa-tachometer-alt text-3xl mb-4"></i>
            <h3 className="text-xl font-semibold mb-2">Manage Your Chatbots</h3>
            <p>
              Effortlessly create, update, or delete your chatbots all in one
              place.
            </p>
          </div>

          <div className="p-6 border border-lighter rounded-lg shadow transition dark:border-darker hover:bg-lighter dark:hover:bg-darker">
            <i className="fas fa-share-alt text-3xl mb-4"></i>
            <h3 className="text-xl font-semibold mb-2">Share and Discover</h3>
            <p>
              Show off your chatbots and explore others’ creations for
              inspiration.
            </p>
          </div>
          <div className="p-6 border border-lighter rounded-lg shadow transition dark:border-darker hover:bg-lighter dark:hover:bg-darker">
            <i className="fas fa-comments text-3xl mb-4"></i>
            <h3 className="text-xl font-semibold mb-2">Chatbot Hub</h3>
            <p>Interact with multiple chatbots in one convenient location.</p>
          </div>
          <div className="p-6 border border-lighter rounded-lg shadow transition dark:border-darker hover:bg-lighter dark:hover:bg-darker">
            <i className="fas fa-cogs text-3xl mb-4"></i>
            <h3 className="text-xl font-semibold mb-2">Helpful Chatbots</h3>
            <p>
              Utilize our pre-made chatbots for quick solutions to common tasks.
            </p>
          </div>
        </div>
      </section>

      <Separator />

      <section className="relative text-center p-16 mt-8">
        <h2 className="text-3xl font-bold mb-4 dark:text-white">Open Source</h2>
        <p className="text-lg mb-6 dark:text-white">
          Bot Verse is an open-source project.
          <br />
          Contribute to our development and join our growing community of
          contributors!
        </p>
        <a
          href="https://github.com/kom-senapati/bot-verse"
          target="_blank"
          className="inline-block bg-gray-600 text-white rounded-full px-4 py-2 transition hover:bg-gray-500 dark:bg-gray-500 dark:hover:bg-gray-400"
        >
          Contribute
        </a>
      </section>

      <Separator />

      <Footer />
    </>
  );
}
