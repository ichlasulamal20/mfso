import { PrismaClient } from "@prisma/client";

// const orm = new PrismaClient();
const paginate = async (req, orm) => {
    try {
        const offset = 5;
        const page = Number(req.query.page) || 1;
        const skip = (page * offset) - 1;
        const queriedData = await orm.findMany({
            skip: skip,
            take: 5,
            orderBy: { createdAt: 'asc' }
        })

        return queriedData;
    } catch (e) {
        return e;
    }
}

const getAge = (birthDate) => {
    const currentDate = new Date();
    const birthDateObj = new Date(birthDate);

    let yearsDifference = currentDate.getFullYear() - birthDateObj.getFullYear();
    let monthsDifference = currentDate.getMonth() - birthDateObj.getMonth();

    // If the current month is before the birth month, adjust the year and month difference
    if (monthsDifference < 0) {
        yearsDifference--;
        monthsDifference += 12;
    }

    const totalMonths = yearsDifference * 12 + monthsDifference;

    return totalMonths;
}

export default {
    paginate,
    getAge
}
