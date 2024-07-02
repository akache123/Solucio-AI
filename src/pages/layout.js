import { Navbar } from "../components/navbar";

export default function Layout({ children }) {
  return (
    <div className="w-full min-h-screen">
      <Navbar />
      <div className="p-6">{children}</div>
    </div>
  );
}
