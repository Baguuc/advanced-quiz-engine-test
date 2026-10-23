import { CompanyLogo } from "@/components/legal/company-logo.tsx";
import { NavUser } from "@/components/navbar/nav-user.tsx";
import { FormCreator } from "@/components/form-creator.tsx";
import { ModeToggle } from "@/components/theme/mode-toggle.tsx";
import { Link } from "@tanstack/react-router";

export function NavMain() {
  return (
    <div className="p-2 flex flex-row justify-between items-center sticky top-0 z-50 bg-black/10 dark:bg-black">
      <Link to="/">
        <CompanyLogo large />
      </Link>
      <div className="flex items-center gap-2">
        <ModeToggle />
        <FormCreator />
        <NavUser />
      </div>
    </div>
  );
}
