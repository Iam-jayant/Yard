-- Enable Row Level Security on all Yard tables
-- Prisma connects via direct connection (bypasses RLS)
-- Supabase service_role key also bypasses RLS
-- This clears the Supabase dashboard warnings

ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "District" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Idea" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Plot" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "HealthScore" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "XPTransaction" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "BuildingCustomization" ENABLE ROW LEVEL SECURITY;
