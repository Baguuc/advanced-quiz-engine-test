import { ModeToggle } from "@/components/theme/mode-toggle.tsx";
import { Link } from "@tanstack/react-router";
import { CompanyLogo } from "%/legal/components/company-logo.tsx";
import { NavUser } from "%/home/components/nav-user.tsx";
import { FormCreator } from "%/form-creator/components/form-creator.tsx";

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
