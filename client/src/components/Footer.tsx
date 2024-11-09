import { Link } from "react-router-dom";

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
      <p className="text-muted-foreground">
        <span className="text-yellow-600">MIT</span> License
      </p>
    </footer>
  );
}
