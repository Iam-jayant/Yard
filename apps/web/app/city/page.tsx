import { prisma } from "@yard/db";
import CityWrapper from "@/components/city/CityWrapper";

export const dynamic = "force-dynamic"; // Ensure fresh data

export default async function CityPage() {
  // Fetch districts
  const districts = await prisma.district.findMany();
  
  // Fetch all plots with their health score and builder info
  const plots = await prisma.plot.findMany({
    include: {
      healthScore: true,
      builder: true,
      idea: true,
      district: true,
    },
  });

  return (
    <main className="relative w-full h-screen overflow-hidden bg-[#0d0d0d]">
      <CityWrapper districts={districts} plots={plots} />
    </main>
  );
}
