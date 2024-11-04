import { useAuth } from "@/contexts/auth-context";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSettingsModal } from "@/stores/modal-store";
import { useTranslation } from "react-i18next";

const languages = [
  { label: "English", code: "en" },
  { label: "हिन्दी", code: "hi" },
  { label: "Español", code: "es" },
  { label: "Français", code: "fr" },
  { label: "日本語", code: "ja" },
];

export default function Navbar() {
  const { user, loading, logout } = useAuth();
  const settingsModal = useSettingsModal();
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <nav className="flex justify-between items-center px-6 py-4 rounded-md border-b-2 dark:border-darker border-lighter">
      <Link to="/dashboard" className="text-5xl brand font-extrabold">
        Bot Verse
      </Link>
      {loading ? (
        <></>
      ) : (
        <>
          <div className="flex space-x-6">
            <ul className="flex space-x-6 items-center">
              <li>
                <Link to="/leaderboard" className="py-2">
                  {t("navbar.leaderboard")}
                </Link>
              </li>
              <li>
                <Link to="/hub" className="py-2">
                  {t("navbar.hub")}
                </Link>
              </li>

              {user == null ? (
                <>
                  <li className="w-full">
                    <Link to="/signup" className="py-2">
                      {t("navbar.sign_up")}
                    </Link>
                  </li>
                  <li className="w-full ">
                    <Link to="/login" className="py-2">
                      {t("navbar.login")}
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <img
                          src={user.avatar}
                          alt="User Avatar"
                          className="w-6 h-6 rounded-full"
                        />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <Link to={`/profile/${user.username}`}>
                          <DropdownMenuItem>
                            {t("navbar.profile")}
                          </DropdownMenuItem>
                        </Link>

                        <Link to={`/images`}>
                          <DropdownMenuItem>
                            {t("navbar.my_images")}
                          </DropdownMenuItem>
                        </Link>
                        <Link to={`/chatbots`}>
                          <DropdownMenuItem>
                            {t("navbar.my_chatbots")}
                          </DropdownMenuItem>
                        </Link>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => settingsModal.onOpen()}
                        >
                          {t("navbar.settings")}
                        </DropdownMenuItem>
                        <DropdownMenuSub>
                          <DropdownMenuSubTrigger>
                            {t("navbar.language")}
                          </DropdownMenuSubTrigger>
                          <DropdownMenuPortal>
                            <DropdownMenuSubContent>
                              {languages.map((lang) => (
                                <DropdownMenuItem
                                  onClick={() => changeLanguage(lang.code)}
                                >
                                  {lang.label}
                                </DropdownMenuItem>
                              ))}
                            </DropdownMenuSubContent>
                          </DropdownMenuPortal>
                        </DropdownMenuSub>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => logout()}
                          className="text-destructive hover:text-destructive/10 focus:text-destructive/90 focus:bg-destructive/10"
                        >
                          {t("navbar.logout")}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </li>
                </>
              )}
            </ul>
          </div>
        </>
      )}
    </nav>
  );
}
