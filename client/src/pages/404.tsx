import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export default function NotFound() {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center justify-center h-full w-full">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">
        {t("notfound.heading")}
      </h1>
      <Link to="/" className="text-lg text-blue-500 hover:underline">
        {t("notfound.click")}
      </Link>
      <p className="text-lg text-gray-600">{t("notfound.goto")}</p>
    </div>
  );
}
