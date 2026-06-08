import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { UserRole } from "../src/generated/prisma/enums";
import { PrismaClient } from "../src/generated/prisma/client";
import bcrypt from "bcryptjs";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? "admin@pharmalink.ng";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? "AdminPass123!";

  const passwordHash = await bcrypt.hash(adminPassword, 10);

  await prisma.user.upsert({
    where: { email: adminEmail },
    create: {
      email: adminEmail,
      fullName: "Platform Admin",
      passwordHash,
      role: UserRole.ADMIN,
      phone: "+2340000000000",
    },
    update: {
      passwordHash,
    },
  });

  console.log(`Seeded admin account: ${adminEmail}`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
