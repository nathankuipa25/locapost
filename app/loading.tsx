import { Spinner } from "@/app/components/spinner";

export default function RootLoading() {
  return (
    <main className="flex flex-1 items-center justify-center bg-[#FCFCFE]">
      <Spinner className="h-6 w-6 text-[#6D3FEA]" />
    </main>
  );
}
