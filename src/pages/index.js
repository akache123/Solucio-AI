import { Navbar } from "../components/navbar";

export default function LandingPage() {
  return (
    <div className="w-full min-h-screen">
      <Navbar />
      <div className="p-6">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          Landing Page
        </h1>
      </div>
    </div>
  );
}
