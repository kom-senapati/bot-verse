export default function Footer() {
  return (
    <footer className="text-center p-6 flex justify-between dark:text-gray-300">
      <p className="text-gray-600">
        Made by{" "}
        <a
          href="https://github.com/kom-senapati"
          className="text-gray-400 hover:underline"
        >
          kom-senapati
        </a>
      </p>
      <p className="text-gray-600">
        <span className="text-yellow-600">MIT</span> License
      </p>
    </footer>
  );
}
