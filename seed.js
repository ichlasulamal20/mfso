import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient();

const chip_ids = ["7a2d1e6b-8c4f-4e1b-9d6a-3b2c7f9e4d1f", "fffffffff-aaaa-4c7e-9b35-7eab6c1d23f2"];

const timestamp = [
    {
        "createdAt": "2024-08-20T14:30:00Z",
        "updatedAt": "2024-08-20T14:30:00Z"
    },
    {
        "createdAt": "2024-07-22T14:30:00Z",
        "updatedAt": "2024-07-22T14:30:00Z"
    },
    {
        "createdAt": "2024-07-24T14:30:00Z",
        "updatedAt": "2024-07-24T14:30:00Z"
    },
    {
        "createdAt": "2024-07-26T14:30:00Z",
        "updatedAt": "2024-07-26T14:30:00Z"
    },
    {
        "createdAt": "2024-07-30T14:30:00Z",
        "updatedAt": "2024-07-30T14:30:00Z"
    }
];

const mpubody = {
    acc_x: 102.12,
    acc_y: 20.12,
    acc_z: 50.12,
    tinggi: 1.12,
    kondisi: true
};

const berat_pakan = [1500.00, 1250.00, 1200.00, 600.00, 200.00];
const suhu_data = [29.12, 28.12, 27.12, 29.12, 30.12];
const kelembapan_data = [60.12, 68.12, 67.12, 69.12, 70.12];
const berat_badan_data = [61.31, 61.60, 62.00, 62.20, 64.00];
const counter = [1, 2, 3, 4, 5];

const getRandomVariation = (base, range) => {
    return parseFloat((base + (Math.random() * range * 2 - range)).toFixed(2));
};

const generateData = (chip_id) => {
    const kameradata = timestamp.map(timestamp => ({
        panjang: getRandomVariation(100.2, 50),
        tinggi: getRandomVariation(75.12, 50),
        chip_id: chip_id,
        sensor_id: 1,
        createdAt: timestamp.createdAt,
        updatedAt: timestamp.updatedAt
    }));

    const loadcellbadandata = timestamp.map((timestamp, index) => ({
        berat: berat_badan_data[index],
        sensor_id: 2,
        chip_id: chip_id,
        createdAt: timestamp.createdAt,
        updatedAt: timestamp.updatedAt
    }));

    const loadcellpakandata = timestamp.map((timestamp, index) => ({
        berat_pakan: berat_pakan[index],
        sensor_id: 3,
        chip_id: chip_id,
        createdAt: timestamp.createdAt,
        updatedAt: timestamp.updatedAt
    }));

    const ahtdata = timestamp.map((timestamp, index) => ({
        suhu: suhu_data[index],
        kelembapan: kelembapan_data[index],
        sensor_id: 4,
        chip_id: chip_id,
        createdAt: timestamp.createdAt,
        updatedAt: timestamp.updatedAt
    }));

    const mpudata = timestamp.map(timestamp => ({
        acc_x: mpubody.acc_x,
        acc_y: mpubody.acc_y,
        acc_z: mpubody.acc_z,
        tinggi: mpubody.tinggi,
        kondisi: mpubody.kondisi,
        chip_id: chip_id,
        sensor_id: 5,
        createdAt: timestamp.createdAt,
        updatedAt: timestamp.updatedAt
    }));

    const datadombakontinudata = timestamp.map((timestamp, index) => ({
        mpu_id: counter[index],
        loadcell_pakan_id: counter[index],
        aht_id: counter[index],
        chip_id: 1,
        createdAt: timestamp.createdAt,
        updatedAt: timestamp.updatedAt
    }));

    const datadombaperiodedata = timestamp.map((timestamp, index) => ({
        chip_id: chip_id,
        kamera_id: counter[index],
        loadcell_badan_id: counter[index],
        createdAt: timestamp.createdAt,
        updatedAt: timestamp.updatedAt
    }));

    return {
        kameradata,
        loadcellbadandata,
        loadcellpakandata,
        ahtdata,
        mpudata,
        datadombakontinudata,
        datadombaperiodedata
    };
};

const seed = async () => {
    try {
        // Disable foreign key checks
        await prisma.$executeRaw`SET FOREIGN_KEY_CHECKS = 0`;

        // Truncate the table
        await prisma.$executeRaw`TRUNCATE TABLE Domba`;
        await prisma.$executeRaw`TRUNCATE TABLE Sensor`;
        await prisma.$executeRaw`TRUNCATE TABLE Kamera`;
        await prisma.$executeRaw`TRUNCATE TABLE LoadcellBadan`;
        await prisma.$executeRaw`TRUNCATE TABLE LoadcellPakan`;
        await prisma.$executeRaw`TRUNCATE TABLE Aht`;
        await prisma.$executeRaw`TRUNCATE TABLE Mpu`;
        await prisma.$executeRaw`TRUNCATE TABLE DataDombaKontinu`;

        // Insert seed data
        await prisma.sensor.createMany({
            data: [
                { "nama_sensor": 'kamera' },
                { "nama_sensor": "loadcell badan" },
                { "nama_sensor": "loadcell pakan" },
                { "nama_sensor": "aht" },
                { "nama_sensor": "mpu" },
                { "nama_sensor": "rfid" }
            ],
        });

        const chip_ids = [uuidv4(), uuidv4()];

        for (const chip_id of chip_ids) {
            const {
                kameradata,
                loadcellbadandata,
                loadcellpakandata,
                ahtdata,
                mpudata,
                datadombakontinudata,
                datadombaperiodedata
            } = generateData(chip_id);

            await prisma.domba.create({
                data: {
                    id: chip_id,
                    chip_id: chip_id, // Tambahkan chip_id di sini
                    nama_domba: chip_id === chip_ids[0] ? "John" : "Jane",
                    usia: "2020-08-28T14:30:00Z",
                    jenis_kelamin: chip_id === chip_ids[0] ? "Male" : "Female",
                    createdAt: "2024-08-28T14:30:00Z",
                    updatedAt: "2024-08-28T14:30:00Z"
                }
            });

            await prisma.kamera.createMany({
                data: kameradata
            });

            await prisma.loadcellBadan.createMany({
                data: loadcellbadandata
            });

            await prisma.loadcellPakan.createMany({
                data: loadcellpakandata
            });

            await prisma.aht.createMany({
                data: ahtdata
            });

            await prisma.mpu.createMany({
                data: mpudata
            });

            await prisma.dataDombaKontinu.createMany({
                data: datadombakontinudata
            });

            await prisma.dataDombaPeriode.createMany({
                data: datadombaperiodedata
            });
        }

        // Re-enable foreign key checks
        await prisma.$executeRaw`SET FOREIGN_KEY_CHECKS = 1`;

        console.log('Seed data inserted successfully');
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
};

seed().catch((e) => {
    console.error(e);
    process.exit(1);
});