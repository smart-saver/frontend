import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="h-screen flex flex-col justify-center items-center gap-6">
        <h1 className="font-bold text-2xl">
            SmartSaver
        </h1>
        <Button asChild>
            <Link href={'/dashboard'}>
            Enter to Dashboard
            </Link>
        </Button>
    </div>
  );
}
