import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function getRandomDate(start, end) {
    const startTime = start.getTime();
    const endTime = end.getTime();
    const randomTime = startTime + Math.random() * (endTime - startTime);
    return new Date(randomTime);
}

const seedMpu = async () => {
    try {
        // Fetch existing chip IDs from the database
        const chips = await prisma.domba.findMany({
            select: {
                id: true
            }
        });

        const chipIds = chips.map(chip => chip.id);

        // Generate MPU data for each chip ID
        const mpuData = chipIds.map(chip_id => {
            const randomDate = getRandomDate(new Date(2024, 0, 1), new Date(2024, 11, 31)); // Random date in 2024
            return {
                acc_x: (Math.random() * 40) - 20, // Random value between -20 and 20
                acc_y: (Math.random() * 40) - 20, // Random value between -20 and 20
                acc_z: (Math.random() * 40) - 20, // Random value between -20 and 20
                tinggi: Math.random() * 100, // Example height value
                kondisi: Math.random() > 0.5, // Randomly true or false 
                chip_id: chip_id,
                sensor_id: 5, // Assuming sensor_id 5 corresponds to MPU
                createdAt: randomDate,
                updatedAt: randomDate
            };
        });

        // Insert MPU data into the database
        await prisma.mpu.createMany({
            data: mpuData
        });

        console.log('MPU data inserted successfully');
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
};

const seedMpuWeekly = async () => {
    try {
        // Fetch existing chip IDs from the database
        const chips = await prisma.domba.findMany({
            select: {
                id: true
            }
        });

        const chipIds = chips.map(chip => chip.id);

        // Generate MPU data for each chip ID at hourly intervals within a month
        const mpuData = [];
        chipIds.forEach(chip_id => {
            const startDate = new Date(2024, 11, 16); // October 2024
            const endDate = new Date(2024, 11, 31); // End of October 2024

            for (let d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
                for (let h = 0; h < 24; h++) {
                    const sampleDate = new Date(d);
                    sampleDate.setHours(h, 0, 0, 0); // Set to each hour of the day
                    mpuData.push({
                        acc_x: (Math.random() * 40) - 20, // Random value between -20 and 20
                        acc_y: (Math.random() * 40) - 20, // Random value between -20 and 20
                        acc_z: (Math.random() * 40) - 20, // Random value between -20 and 20
                        tinggi: Math.random() * 100, // Example height value
                        kondisi: Math.random() > 0.5, // Randomly true or false 
                        chip_id: chip_id,
                        sensor_id: 5, // Assuming sensor_id 5 corresponds to MPU
                        createdAt: sampleDate,
                        updatedAt: sampleDate
                    });
                }
            }
        });

        // Insert MPU data into the database
        await prisma.mpu.createMany({
            data: mpuData
        });

        console.log('MPU hourly data inserted successfully');
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
};

seedMpu().catch(e => {
    console.error(e);
    process.exit(1);
});

seedMpuWeekly().catch(e => {
    console.error(e);
    process.exit(1);
});