import { ImageComponent } from "./components/imageComponent";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="container h-screen flex">
      <div className="w-2/5 flex items-center">{children}</div>
      <ImageComponent />
    </main>
  );
}
