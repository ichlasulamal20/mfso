import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function getRandomDate(start, end) {
    const startTime = start.getTime();
    const endTime = end.getTime();
    const randomTime = startTime + Math.random() * (endTime - startTime);
    return new Date(randomTime);
}

const seedAht = async () => {
    try {
        // Fetch existing chip IDs from the database
        const chips = await prisma.domba.findMany({
            select: {
                id: true
            }
        });

        const chipIds = chips.map(chip => chip.id);

        // Generate Aht data for each chip ID
        const ahtData = chipIds.map(chip_id => {
            const randomDate = getRandomDate(new Date(2024, 0, 1), new Date(2024, 11, 31)); // Random date in 2024
            return {
                suhu: Math.random() * 100, // Example temperature value
                kelembapan: Math.random() * 100, // Example humidity value
                chip_id: chip_id,
                sensor_id: 4, // Assuming sensor_id 4 corresponds to Aht
                createdAt: randomDate,
                updatedAt: randomDate
            };
        });

        // Insert Aht data into the database
        await prisma.aht.createMany({
            data: ahtData
        });

        console.log('Aht data inserted successfully');
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
};

const seedAhtWeekly = async () => {
    try {
        // Fetch existing chip IDs from the database
        const chips = await prisma.domba.findMany({
            select: {
                id: true
            }
        });

        const chipIds = chips.map(chip => chip.id);

        // Generate Aht data for each chip ID at hourly intervals within a month
        const ahtData = [];
        chipIds.forEach(chip_id => {
            const startDate = new Date(2025, 0, 14); // January 1, 2025
            const endDate = new Date(2025, 0, 15); // January 31, 2025

            for (let d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
                for (let h = 0; h < 24; h++) {
                    const sampleDate = new Date(d);
                    sampleDate.setHours(h, 0, 0, 0); // Set to each hour of the day
                    ahtData.push({
                        suhu: Math.random() * 100, // Example temperature value
                        kelembapan: Math.random() * 100, // Example humidity value
                        chip_id: chip_id,
                        sensor_id: 4, // Assuming sensor_id 4 corresponds to Aht
                        createdAt: sampleDate,
                        updatedAt: sampleDate
                    });
                }
            }
        });

        // Insert Aht data into the database
        await prisma.aht.createMany({
            data: ahtData
        });

        console.log('Aht hourly data inserted successfully');
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
};

seedAht().catch(e => {
    console.error(e);
    process.exit(1);
});

seedAhtWeekly().catch(e => {
    console.error(e);
    process.exit(1);
});