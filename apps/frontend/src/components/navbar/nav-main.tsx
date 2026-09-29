import { CompanyLogo } from "@/components/legal/company-logo.tsx";
import { NavUser } from "@/components/navbar/nav-user.tsx";

export function NavMain() {
  return (
    <div className="p-2 flex flex-row justify-between items-center">
      <CompanyLogo large />
      <NavUser />
    </div>
  );
}
