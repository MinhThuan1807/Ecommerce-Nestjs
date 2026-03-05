import { PrismaService } from "src/shared/services/prisma.service";
import { ROLE } from "src/shared/constants/role.constant";
import { HashingService } from "src/shared/services/hashing.service";
import envConfig from "src/shared/config";
const prisma = new PrismaService()
const hashing = new HashingService()

const main = async () => {
  const roleCount = await prisma.role.count()
  if (roleCount > 0) {
    console.log('Roles already exist, skipping seeding.')
    throw new Error('Roles already exist, skipping seeding.')
  }
  // Seed roles
  const roles = await prisma.role.createMany({
    data: [
      {
        name: ROLE.ADMIN,
        description: 'Admin role with full permissions',
      },
      {
        name: ROLE.CLIENT,
        description: 'Client role with limited permissions',
      },
      {
        name: ROLE.SELLER,
        description: 'Seller role with permissions to manage products and orders',
      },
    ],
  })
  // Seed permissions
  const adminRole = await prisma.role.findFirstOrThrow({
    where: { 
      name: ROLE.ADMIN,
    },

  })
  const hashedPassword = await hashing.hash(envConfig.ADMIN_PASSWORD)
  const adminUser = await prisma.user.create({
    data: {
      email: envConfig.ADMIN_EMAIL,
      password: hashedPassword,
      name: envConfig.ADMIN_NAME,
      phoneNumber: envConfig.ADMIN_PHONE,
      roleId: adminRole.id,
    }
  })
  return {
    createdRoleCount: roles.count,
    adminUser,
  }
}

main().then(({adminUser, createdRoleCount}) => {
  console.log(`Seeded ${createdRoleCount} roles successfully.`)
  console.log(`Admin user created with email: ${adminUser.email}`)
}).catch((error) => {
  console.error('Error seeding data:', error)
})