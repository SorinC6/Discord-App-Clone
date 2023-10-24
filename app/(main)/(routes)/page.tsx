import { Button } from "../../../components/ui/button";
import { cn } from "../../../lib/utils";

export default function Home() {
  return (
    <div>
      <p className="text-3xl font-bold text-indigo-500">Hello</p>

      <Button
        variant="ghost"
        className={cn("bg-red-400", false && "bg-slate-600")}
      >
        Press me
      </Button>
    </div>
  );
}
