const prisma = require("./prisma");
const bcrypt = require("bcryptjs");
const { hash } = require("../app/Helpers/Functions");

async function main() {
  await prisma.user.upsert({
    where: { email: "admin@gmail.com" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@gmail.com",
      type: "admin",
      password: hash("password"),
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
