import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { FabricTexture } from "../ui/FabricTexture";
import { ScrollToTop } from "./ScrollToTop";
import { usePublished } from "../../lib/cms/public";
import { ContentBoundary, ContentUnavailable } from "./ContentBoundary";

export function SiteLayout() {
  const content = usePublished((records) => records);
  if (content.isPending)
    return (
      <div
        className="min-h-screen grid place-items-center font-body text-trust-blue"
        role="status"
      >
        Loading COA…
      </div>
    );
  if (content.isError)
    return <ContentUnavailable retry={() => void content.refetch()} />;
  return (
    <ContentBoundary>
      <ScrollToTop />
      <FabricTexture />
      <Navbar />
      <main className="relative z-[2]">
        <Outlet />
      </main>
      <Footer />
    </ContentBoundary>
  );
}
