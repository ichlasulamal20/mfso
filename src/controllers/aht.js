import { PrismaClient } from "@prisma/client";

const orm = new PrismaClient();

// index / menampilkan semua data
const index = async (req, res, next) => {
    try {
        const page = Number(req.query.page) ? Number(req.query.page) - 1 : 0;
        const row_count = await orm.aht.count();
        const offset = page * 5;

        // const data = await orm.aht.findMany({skip: offset, take: 5});
        const rec = await orm.aht.findMany({
            orderBy: { id: "desc" },
            skip: offset, take: 5,
            select: {
                id: true,
                suhu: true,
                kelembapan: true,
                createdAt: true,
                updatedAt: true,
                chip: {
                    select: {
                        id: true,
                        nama_domba: true,
                        jenis_kelamin: true
                    }
                }
            }
        });

        const formattedData = rec.map(data => {
            return {
                id: data.id,
                suhu: parseFloat(data.suhu),
                kelembaban: parseFloat(data.kelembapan),
                createdAt: data.createdAt,
                updatedAt: data.updatedAt,
                chip_id: data.chip.id,
                nama_domba: data.chip.nama_domba,
                jenis_kelamin: data.chip.jenis_kelamin
            }
        });

        return res.status(200).json({
            message: "success",
            pagination: {
                totalPages: Math.ceil(Number(row_count) / 5),
                currentPage: page + 1
            },
            data: {
                count: row_count,
                rows: formattedData
            }
        });

    } catch (e) {
        res.status(500).json({ error: e.message });
    }
}

// graph / menampilkan data terbaru untuk grafik
const graph = async (req, res, next) => {
    try {
        const { chip_id } = req.query;
        const page = Number(req.query.page) ? Number(req.query.page) - 1 : 0;
        const row_count = await orm.aht.count({ where: { chip_id: chip_id } });
        const offset = page * 5;


        const rec = await orm.domba.findMany({
            where: { id: chip_id },
            select: {
                id: true,
                aht: {
                    orderBy: { id: "desc" },
                    skip: offset, take: 5,
                    select: {
                        id: true,
                        suhu: true,
                        kelembapan: true,
                        createdAt: true,
                        updatedAt: true
                    }
                }
            }
        });

        const formattedData = rec.flatMap(data =>
            data.aht.map((aht => ({
                id: aht.id,
                suhu: parseFloat(aht.suhu),
                kelembaban: parseFloat(aht.kelembapan),
                createdAt: aht.createdAt,
                updatedAt: aht.updatedAt,
                chip_id: data.id
            })))
        );

        return res.status(200).json({
            message: "success",
            pagination: {
                totalPages: Math.ceil(Number(row_count) / 5),
                currentPage: page + 1
            },
            data: {
                count: row_count,
                rows: formattedData
            }
        });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
}

// show / menampilkan data berdasarkna id
const show = async (req, res, next) => {
    try {
        const { id } = req.params;
        const rec = await orm.aht.findFirst({ where: { id: Number(id) }, include: { chip: true } });

        const data = {
            id: rec.id,
            suhu: parseFloat(rec.suhu),
            kelembaban: parseFloat(rec.kelembapan),
            createdAt: rec.createdAt,
            updatedAt: rec.updatedAt,
            chip_id: rec.chip_id,
            nama_domba: rec.chip.nama_domba,
            jenis_kelamin: rec.chip.jenis_kelamin
        };

        return res.status(200).json({
            message: "success",
            data
        });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
}


// membuat data suhu badan baru
const create = async (req, res, next) => {
    try {
        const payload = req.body;
        const time = Date.now();
        const currentDate = new Date(time).toISOString();

        const aht = await orm.sensor.findFirst({ where: { nama_sensor: "aht" }, select: { id: true } });

        const newBody = {
            suhu: payload.suhu,
            kelembapan: payload.kelembapan,
            chip_id: payload.chip_id,
            sensor_id: aht.id,
            createdAt: currentDate,
            updatedAt: currentDate,
        }
        const data = await orm.aht.create({ data: newBody });
        return res.status(200).json({
            message: "success",
            data
        });

    } catch (e) {
        res.status(500).json({ error: e.message });
    }
}




// membuat data suhu badan baru
const update = async (req, res, next) => {
    try {
        const { id } = req.params;
        const payload = req.body;
        const time = Date.now();
        const currentDate = new Date(time).toISOString();
        const aht = await orm.sensor.findFirst({ where: { nama_sensor: "aht" }, select: { id: true } });

        const updatedBody = {
            suhu: payload.suhu,
            kelembapan: payload.kelembapan,
            chip_id: payload.chip_id,
            sensor_id: aht.id,
            updatedAt: currentDate,
        }
        const data = await orm.aht.update({
            where: { id: Number(id) },
            data: updatedBody
        });
        return res.status(200).json({
            message: "success",
            data
        });

    } catch (e) {
        res.status(500).json({ error: e.message });
    }
}

// destroy / menghapus data berdasarkan id
const destroy = async (req, res, next) => {
    try {

        const { id } = req.params;
        const response = await orm.aht.delete({ where: { id: Number(id) } });

        return res.status(200).json({
            message: "success",
        });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
}

const getDailyData = async (req, res, next) => {
    try {
        const { date, chip_id } = req.params;
        const targetDate = new Date(date);

        // Define the start and end times for the selected date
        const startDate = new Date(targetDate);
        startDate.setUTCHours(0, 0, 0, 0); // Set time to 00:00:00
        const endDate = new Date(targetDate);
        endDate.setUTCHours(23, 59, 59, 999); // Set time to 23:59:59

        const response = await orm.aht.findMany({
            where: {
                chip_id: chip_id,
                createdAt: {
                    gte: startDate,
                    lte: endDate,
                },
            },
            orderBy: { createdAt: 'desc' }, // Order by createdAt in descending order
            take: 5, // Take the last 5 data points
        });

        if (response.length === 0) {
            console.log('No data found');
            return res.status(404).json({ error: 'No data found' });
        }

        const formattedData = response.map(record => ({
            id: record.id,
            suhu: parseFloat(record.suhu),
            kelembapan: parseFloat(record.kelembapan),
            createdAt: record.createdAt,
            updatedAt: record.updatedAt,
            chip_id: record.chip_id,
        }));

        console.log('Daily Data suhu dan kelembapan:', formattedData);
        res.status(200).json({ data: formattedData });
    } catch (e) {
        console.error('Error fetching daily data:', e);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
const getWeeklyData = async (req, res, next) => {
    try {
        const { date, chip_id } = req.params;
        const targetDate = new Date(date);

        // Define the start and end dates for the week centered around the selected date
        const startDate = new Date(targetDate);
        startDate.setUTCDate(startDate.getUTCDate() - 3); // 3 days before the selected date
        startDate.setUTCHours(0, 0, 0, 0); // Set time to 00:00:00

        const endDate = new Date(targetDate);
        endDate.setUTCDate(endDate.getUTCDate() + 3); // 3 days after the selected date
        endDate.setUTCHours(23, 59, 59, 999); // Set time to 23:59:59

        const response = await orm.aht.findMany({
            where: {
                chip_id: chip_id,
                createdAt: {
                    gte: startDate,
                    lte: endDate,
                },
            },
            orderBy: { createdAt: 'asc' }, // Order by createdAt in ascending order
        });

        // Calculate the average values for each day
        const dailyData = {};
        response.forEach(record => {
            const date = record.createdAt.toISOString().split('T')[0];
            if (!dailyData[date]) {
                dailyData[date] = { suhuSum: 0, kelembapanSum: 0, count: 0 };
            }
            dailyData[date].suhuSum += parseFloat(record.suhu);
            dailyData[date].kelembapanSum += parseFloat(record.kelembapan);
            dailyData[date].count += 1;
        });

        const formattedData = [];
        for (let i = -3; i <= 3; i++) {
            const date = new Date(targetDate);
            date.setUTCDate(date.getUTCDate() + i);
            const dateString = date.toISOString().split('T')[0];
            if (dailyData[dateString]) {
                formattedData.push({
                    date: dateString,
                    averageSuhu: (dailyData[dateString].suhuSum / dailyData[dateString].count).toFixed(2),
                    averageKelembapan: (dailyData[dateString].kelembapanSum / dailyData[dateString].count).toFixed(2),
                });
            } else {
                formattedData.push({
                    date: dateString,
                    averageSuhu: '0.00',
                    averageKelembapan: '0.00',
                });
            }
        }

        console.log('Weekly Data:', formattedData);
        res.status(200).json({ data: formattedData });
    } catch (e) {
        console.error('Error fetching weekly data:', e);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const getMonthlyData = async (req, res, next) => {
    try {
        const { date, chip_id } = req.params;
        const target_time = new Date(date);

        // Define the start and end dates for each week of the month
        const endDate = new Date(target_time.getFullYear(), target_time.getMonth() + 1, 0).getDate(); // Last day of the month
        const weeks = [
            { start: new Date(target_time.getFullYear(), target_time.getMonth(), 1, 0, 0, 0), end: new Date(target_time.getFullYear(), target_time.getMonth(), 7, 23, 59, 59) },
            { start: new Date(target_time.getFullYear(), target_time.getMonth(), 8, 0, 0, 0), end: new Date(target_time.getFullYear(), target_time.getMonth(), 15, 23, 59, 59) },
            { start: new Date(target_time.getFullYear(), target_time.getMonth(), 16, 0, 0, 0), end: new Date(target_time.getFullYear(), target_time.getMonth(), 22, 23, 59, 59) },
            { start: new Date(target_time.getFullYear(), target_time.getMonth(), 23, 0, 0, 0), end: new Date(target_time.getFullYear(), target_time.getMonth(), endDate, 23, 59, 59) },
        ];

        const averages = await Promise.all(weeks.map(async (week, index) => {
            console.log(`Querying records for week ${index + 1}: From ${week.start} to ${week.end}`);

            const records = await orm.aht.findMany({
                where: {
                    chip_id: chip_id,
                    createdAt: {        
                        gte: week.start,
                        lte: week.end,
                    }
                }
            });

            console.log(`Week ${index + 1}: Records found - ${records.length}`); // Log number of records
            console.log(`Records data:`, records); // Log actual records for debugging

            if (records.length === 0) {
                return { week: index + 1, avgSuhu: 0, avgKelembapan: 0 }; // No data for this week, set avgSuhu and avgKelembapan to 0
            }

            const totalSuhu = records.reduce((sum, record) => {
                const suhuValue = parseFloat(record.suhu); // Convert to float
                if (!isNaN(suhuValue)) {
                    return sum + suhuValue; // Only add if valid number
                }
                return sum; // Ignore invalid entries
            }, 0);

            const totalKelembapan = records.reduce((sum, record) => {
                const kelembapanValue = parseFloat(record.kelembapan); // Convert to float
                console.log(`Processing kelembapan value: ${kelembapanValue}`); // Log each kelembapan value
                if (!isNaN(kelembapanValue)) {
                    return sum + kelembapanValue; // Only add if valid number
                }
                return sum; // Ignore invalid entries
            }, 0);

            const avgSuhu = records.length > 0 ? totalSuhu / records.length : 0; // Calculate average
            const avgKelembapan = records.length > 0 ? totalKelembapan / records.length : 0; // Calculate average

            console.log(`Week ${index + 1}: Total Suhu = ${totalSuhu}, Average Suhu = ${avgSuhu.toFixed(2)}, Total Kelembapan = ${totalKelembapan}, Average Kelembapan = ${avgKelembapan.toFixed(2)}`); // Log total and average values

            return { week: index + 1, avgSuhu, avgKelembapan }; // Return week number and averages
        }));

        // Prepare the final response with the averages
        const response = averages.map(avg => ({
            week: avg.week,
            avgSuhu: avg.avgSuhu.toFixed(3),
            avgKelembapan: avg.avgKelembapan.toFixed(3) // Include avgKelembapan in the response
        }));
        
        // Log the final average response
        console.log('Final average values:', response);

        res.status(200).json({ averageValues: response });
    } catch (e) {
        console.error('Error fetching monthly data:', e); // Log error for debugging
        res.status(500).json({ error: e.message });
    }
};
export default {
    index,
    show,
    graph,
    create,
    update,
    destroy,
    getDailyData,
    getWeeklyData,
    getMonthlyData
}