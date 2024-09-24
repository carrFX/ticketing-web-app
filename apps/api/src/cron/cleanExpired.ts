import prisma from '@/prisma';
import cron from 'node-cron';

cron.schedule('*/1 * * * *', async () => {
    const expirePoints = await prisma.point.deleteMany({
        where: {
            expiresAt: {
                lt: new Date()
            }
        }
    })
    const expireCoupons = await prisma.coupon.deleteMany({
        where: {
            expiresAt: {
                lt: new Date()
            }
        }
    })
    const expireEvents = await prisma.event.deleteMany({
        where: {
            expiresAt: {
                lt: new Date()
            }
        }
    })
})