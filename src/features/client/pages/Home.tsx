import BottomNav from "../../../shared/components/NavigationBar";

export default function Home() {
  return (
    <div className="min-h-screen bg-background-base pb-24">
      <div className="p-6">
        <h1 className="text-h1 font-bold text-text-primary">Home</h1>
      </div>

      <BottomNav role="client" />
    </div>
  );
}
