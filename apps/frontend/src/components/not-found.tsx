import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty";
import { Button } from "@/components/ui/button.tsx";
import { Link } from "@tanstack/react-router";

export function NotFound() {
  return (
    <div className="h-screen flex justify-center items-center">
      <Empty>
        <EmptyHeader>
          <EmptyTitle>404 - Nie znaleziono</EmptyTitle>
          <EmptyDescription>Strona nie została znaleziona.</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Link to="/">
            <Button>Wróć do strony głównej</Button>
          </Link>
        </EmptyContent>
      </Empty>
    </div>
  );
}
