import { createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";

const dashboardUser = {
  nickname: "Spermon",
  role: "Administrator ankiet",
  avatarUrl: "https://i.pravatar.cc/160?img=12",
};

const surveys = [
  { title: "Ankieta 1" },
  { title: "Ankieta 2" },
  { title: "Ankieta 3" },
];

export const Route = createFileRoute("/dashboard")({
  component: Dashboard,
});

function Dashboard() {
  return (
    <main className="min-h-[calc(100vh-65px)] bg-white px-5 py-6 text-slate-950 sm:px-8 lg:px-14 lg:py-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 lg:flex-row lg:gap-14">
        <aside className="w-full shrink-0 rounded-[2.5rem] border-2 border-slate-900 p-6 sm:p-8 lg:min-h-[calc(100vh-145px)] lg:w-64">
          <h1 className="mb-6 text-center text-lg font-medium">Ankiety</h1>
          <nav aria-label="Lista ankiet" className="space-y-4">
            {surveys.map((survey) => (
              <button
                className="w-full rounded-2xl border-2 border-slate-900 px-4 py-3 text-left text-sm transition hover:bg-slate-900 hover:text-white"
                key={survey.title}
                type="button"
              >
                {survey.title}
              </button>
            ))}
          </nav>
        </aside>

        <section className="relative flex min-h-[calc(100vh-145px)] flex-1 flex-col items-center justify-center px-2 pb-12 pt-4 text-center">
          <div className="absolute right-0 top-0 flex items-center gap-3 text-sm text-slate-900">
            <span>Utwórz ankietę</span>
            <button
              aria-label="Utwórz nową ankietę"
              className="flex size-10 items-center justify-center rounded-full border-2 border-slate-900 transition hover:bg-slate-900 hover:text-white"
              type="button"
            >
              <Plus size={20} strokeWidth={1.8} />
            </button>
          </div>

          <img
            alt={`Zdjęcie profilowe użytkownika ${dashboardUser.nickname}`}
            className="size-48 rounded-full object-cover sm:size-56"
            src={dashboardUser.avatarUrl}
          />
          <p className="mt-8 text-4xl font-medium tracking-tight sm:text-6xl">Witaj, {dashboardUser.nickname}</p>
          <p className="mt-8 text-base text-slate-600">Masz obecnie: {surveys.length} ankiety</p>
        </section>
      </div>
    </main>
  );
}
