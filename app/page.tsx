import Activities from "./components/Activities";
import Branches from "./components/Branches";
import CampInfo from "./components/CampInfo";
import ContactSection from "./components/ContactSection";
import FAQ from "./components/FAQ";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import Navbar from "./components/Navbar";
import PracticalInfo from "./components/PracticalInfo";
import SiteEditor from "./components/SiteEditor";
import WhyJoin from "./components/WhyJoin";
import { getSiteContent } from "@/db/site-content";

export const dynamic = "force-dynamic";

export default async function Home() {
  const siteContent = await getSiteContent();

  return (
    <main className="min-h-screen bg-[#f7fbff] text-slate-950">
      <div className="relative bg-[#103001]">
        <Navbar
          content={siteContent}
          logoUrl={siteContent.siteLogoUrl}
          siteName={siteContent.siteName}
        />
        <Hero content={siteContent} />
      </div>
      <Branches content={siteContent} />
      <Activities content={siteContent} />
      <WhyJoin content={siteContent} />
      <PracticalInfo content={siteContent} />
      <CampInfo content={siteContent} />
      <FAQ content={siteContent} />
      <ContactSection content={siteContent} />
      <Footer content={siteContent} />
      <SiteEditor initialContent={siteContent} />
    </main>
  );
}
