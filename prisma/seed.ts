import { PrismaClient } from '@prisma/client'
import { hashPassword } from '../src/shared/security/password'

const prisma = new PrismaClient()

async function main() {
  // Create default user from environment variables
  const defaultPassword = await hashPassword(process.env.DEFAULT_PASSWORD || 'password')
  
  await prisma.user.upsert({
    where: { email: process.env.DEFAULT_EMAIL || 'admin@example.com' },
    update: {},
    create: {
      email: process.env.DEFAULT_EMAIL || 'admin@example.com',
      username: process.env.DEFAULT_USERNAME || 'admin',
      passwordHash: defaultPassword,
      tokens: 100,
      preferences: {
        theme: 'dark',
        notifications: true,
        language: 'en'
      }
    },
  })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  }) 