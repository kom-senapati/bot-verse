import { Link } from "react-router-dom";
import { Github, Twitter, Linkedin } from "lucide-react"; // Import icons from lucide-react

export default function Footer() {
  return (
    <footer className="text-center p-6 flex justify-between items-center">
      <p className="text-muted-foreground">
        Made by{" "}
        <Link to="/about" className="text-muted-foreground hover:underline">
          kom-senapati and Team
        </Link>
      </p>
      <div className="flex items-center space-x-4">
        <Link to="/terms" className="text-muted-foreground hover:underline">
          Terms of Service
        </Link>
        <Link to="/privacy" className="text-muted-foreground hover:underline">
          Privacy Policy
        </Link>
      </div>
      <div className="flex space-x-4">
        <a
          href="https://github.com/kom-senapati"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
          className="text-muted-foreground hover:text-gray-600"
        >
          <Github size={20} />
        </a>
        <a
          href="https://x.com/kom_senapati"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Twitter"
          className="text-muted-foreground hover:text-blue-500"
        >
          <Twitter size={20} />
        </a>
        <a
          href="https://linkedin.com/in/kom-senapati"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
          className="text-muted-foreground hover:text-blue-600"
        >
          <Linkedin size={20} />
        </a>
      </div>
    </footer>
  );
}
