const prisma = require('../../../prisma/prisma');
const { master } = require('../../Helpers/Functions');
const { logger } = require('../../Middleware/ErrorLogger');

async function Dashboard(req, res) {
  try {
    const type =
      req.query.type === undefined
        ? 'credit-card'
        : req.query.type.length === 0
          ? 'credit-card'
          : req.query.type;

    const maritalStatuses = await master('Marital Status');
    const userInformation = await prisma.userInformation.findMany({
      where: {
        userId: +req.cookies.userId,
      },
      select: {
        id: true,
      },
    });

    const cards = await prisma.cards.findMany({
      include: {
        UserCardClicks: {
          where: {
            id: {
              in: userInformation.map((user) => user.id),
            },
          },
        },
      },
    });

    let queries = [];

    if (type === 'credit-card') {
      queries = await prisma.UserCardClicks.findMany({
        where: {
          UserInformation: {
            userId: +req.cookies.userId,
          },
        },
        orderBy: [
          {
            id: 'desc',
          },
        ],
        include: {
          UserInformation: {
            include: {
              User: true,
            },
          },
          Card: true,
          Product: true,
        },
        orderBy: {
          id: 'desc',
        },
      });
    } else if (type === 'home-loan') {
      queries = await prisma.homeLoanEnquiries.findMany({
        where: {
          userId: +req.cookies.userId,
        },
        orderBy: [
          {
            id: 'desc',
          },
        ],
        include: {
          User: true,
          Product: true,
        },
        orderBy: {
          id: 'desc',
        },
      });
    } else if (type === 'business-loan') {
      queries = await prisma.businessLoanEnquiries.findMany({
        where: {
          userId: +req.cookies.userId,
        },
        orderBy: [
          {
            id: 'desc',
          },
        ],
        include: {
          User: true,
          Product: true,
        },
        orderBy: {
          id: 'desc',
        },
      });
    } else if (type === 'two-wheeler') {
      queries = await prisma.twoWheelerLoanEnquiries.findMany({
        where: {
          userId: +req.cookies.userId,
        },
        orderBy: [
          {
            id: 'desc',
          },
        ],
        include: {
          User: true,
          Product: true,
        },
        orderBy: {
          id: 'desc',
        },
      });
    } else if (type === 'car-loan') {
      queries = await prisma.carLoanEnquiries.findMany({
        where: {
          userId: +req.cookies.userId,
        },
        orderBy: [
          {
            id: 'desc',
          },
        ],
        include: {
          User: true,
          Product: true,
        },
        orderBy: {
          id: 'desc',
        },
      });
    } else if (type === 'family-doctor') {
      queries = await prisma.familyDoctorEnquiries.findMany({
        where: {
          userId: +req.cookies.userId,
        },
        orderBy: [
          {
            id: 'desc',
          },
        ],
        include: {
          User: true,
          Product: true,
        },
        orderBy: {
          id: 'desc',
        },
      });
    } else if (type === 'personal-loan') {
      queries = await prisma.personalLoanEnquiries.findMany({
        where: {
          userId: +req.cookies.userId,
        },
        orderBy: [
          {
            id: 'desc',
          },
        ],
        include: {
          User: true,
          Product: true,
        },
        orderBy: {
          id: 'desc',
        },
      });
    }

    console.log(req.query, 'req.query ,')
    const { tab, leadCustomerName, leadCompanyName, leadPhone, leadId } = req.query
    const filterByObj = {
      userId: +req.cookies.userId
    }
    if (leadId) {
      filterByObj.id = +leadId
    }
    if (leadCustomerName) {
      filterByObj.customerName = leadCustomerName
    }
    if (leadCompanyName) {
      filterByObj.companyName = leadCompanyName
    }
    if (leadPhone) {
      filterByObj.phone = leadPhone
    }

    const leads = await prisma.lead.findMany({
      where: filterByObj,
      orderBy: {
        id: 'desc'
      }
    })

    const offers = await prisma.offers.findMany({
      where: {
        status: true
      },
      orderBy: {
        id: 'desc'
      }
    })

    const today = new Date()
    const month = today.getMonth()
    const year = today.getFullYear()
    const day = today.getDate()

    const previousMonthDisbursedSum = await prisma.lead.aggregate({
      where: {
        userId: +req.cookies.userId,
        status: 'Disbursed',
        disbursedAt: {
          gte: new Date(year, month - 1, 1).toISOString(),
          lte: new Date(year, month - 1, 31).toISOString(),
        },
      },
      _sum: {
        payoutAmount: true,
      },
    });

    const previousMonthDisbursedSumByDate = await prisma.lead.aggregate({
      where: {
        userId: +req.cookies.userId,
        status: 'Disbursed',
        disbursedAt: {
          gte: new Date(year, month - 1, 1).toISOString(),
          lte: new Date(year, month - 1, day).toISOString(),
        },
      },
      _sum: {
        payoutAmount: true,
      },
    });

    const earlierMonthDisbursedSum = await prisma.lead.aggregate({
      where: {
        userId: +req.cookies.userId,
        status: 'Disbursed',
        disbursedAt: {
          gte: new Date(year, month - 2, 1).toISOString(),
          lte: new Date(year, month - 2, 31).toISOString(),
        },
      },
      _sum: {
        payoutAmount: true,
      },
    });

    const previousQuarterDisbursedSum = await prisma.lead.aggregate({
      where: {
        userId: +req.cookies.userId,
        status: 'Disbursed',
        disbursedAt: {
          gte: new Date(year, month - 3, 1).toISOString(),
          lte: new Date(year, month - 1, 31).toISOString(),
        },
      },
      _sum: {
        payoutAmount: true,
      },
    });

    const earlierQuarterDisbursedSum = await prisma.lead.aggregate({
      where: {
        userId: +req.cookies.userId,
        status: 'Disbursed',
        disbursedAt: {
          gte: new Date(year, month - 6, 1).toISOString(),
          lte: new Date(year, month - 4, 31).toISOString(),
        },
      },
      _sum: {
        payoutAmount: true,
      },
    });

    const currentYearDisbursedSum = await prisma.lead.aggregate({
      where: {
        userId: +req.cookies.userId,
        status: 'Disbursed',
        disbursedAt: {
          gte: new Date(year, 0, 1).toISOString(),
          lte: new Date().toISOString(),
        },
      },
      _sum: {
        payoutAmount: true,
      },
    });

    const earlierYearDisbursedSum = await prisma.lead.aggregate({
      where: {
        userId: +req.cookies.userId,
        status: 'Disbursed',
        disbursedAt: {
          gte: new Date(year - 1, 0, 1).toISOString(),
          lte: new Date(year - 1, 11, 31).toISOString(),
        },
      },
      _sum: {
        payoutAmount: true,
      },
    });

    const currentMonthDisbursedSum = await prisma.lead.aggregate({
      where: {
        userId: +req.cookies.userId,
        status: 'Disbursed',
        disbursedAt: {
          gte: new Date(year, month, 1).toISOString(),
          lte: new Date().toISOString(),
        },
      },
      _sum: {
        payoutAmount: true,
      },
    });

    const lifeTimeDisbursedSum = await prisma.lead.aggregate({
      where: {
        userId: +req.cookies.userId,
        status: 'Disbursed'
      },
      _sum: {
        payoutAmount: true,
      },
    });

    const totalDisbursedAmount = {}
    totalDisbursedAmount.previousMonth = previousMonthDisbursedSum._sum.payoutAmount || 0;
    totalDisbursedAmount.previousQuarter = previousQuarterDisbursedSum._sum.payoutAmount || 0;
    totalDisbursedAmount.currentYear = currentYearDisbursedSum._sum.payoutAmount || 0;
    totalDisbursedAmount.currentMonth = currentMonthDisbursedSum._sum.payoutAmount || 0;
    totalDisbursedAmount.lifeTime = lifeTimeDisbursedSum._sum.payoutAmount || 0;
    totalDisbursedAmount.currentMonthPercent = 0;
    totalDisbursedAmount.previousMonthPercent = 0;
    totalDisbursedAmount.currentYearPercent = 0;
    totalDisbursedAmount.previousQuarterPercent = 0;

    if (currentMonthDisbursedSum._sum.payoutAmount && previousMonthDisbursedSumByDate._sum.payoutAmount) {
      totalDisbursedAmount.currentMonthPercent = parseFloat((((currentMonthDisbursedSum._sum.payoutAmount / previousMonthDisbursedSumByDate._sum.payoutAmount) * 100) - 100).toFixed(2))
    }

    if (earlierMonthDisbursedSum._sum.payoutAmount && previousMonthDisbursedSum._sum.payoutAmount) {
      totalDisbursedAmount.previousMonthPercent = parseFloat(((previousMonthDisbursedSum._sum.payoutAmount / earlierMonthDisbursedSum._sum.payoutAmount) * 100).toFixed(2))
    }
    if (earlierYearDisbursedSum._sum.payoutAmount && currentYearDisbursedSum._sum.payoutAmount) {
      totalDisbursedAmount.currentYearPercent = parseFloat(((currentYearDisbursedSum._sum.payoutAmount / earlierYearDisbursedSum._sum.payoutAmount) * 100).toFixed(2))
    }
    if (previousQuarterDisbursedSum._sum.payoutAmount && earlierQuarterDisbursedSum._sum.payoutAmount) {
      totalDisbursedAmount.previousQuarterPercent = parseFloat(((previousQuarterDisbursedSum._sum.payoutAmount / earlierQuarterDisbursedSum._sum.payoutAmount) * 100).toFixed(2))
    }

    console.log('Total disbursed amount for this User:', totalDisbursedAmount);


    const statusCountsByLoanType = await prisma.lead.groupBy({
      where: {
        userId: +req.cookies.userId
      },
      by: ['loanType', 'status'],
      _count: true,
    });

    let statusCounts = []
    statusCountsByLoanType.forEach((data) => {
      statusCounts.push({
        'loanType': data.loanType,
        [data.status]: data._count
      })
    })

    const resultObject = {};

    statusCounts.forEach((item) => {
      const { loanType, ...rest } = item;
      if (!resultObject[loanType]) {
        resultObject[loanType] = rest;
      } else {
        Object.assign(resultObject[loanType], rest);
      }
    });

    const statusCountArr = Object.entries(resultObject).map(([loanType, statuses]) => ({
      loanType,
      ...statuses,
    }));


    const state = await prisma.cities.groupBy({
      by: ['state'],
      orderBy: {
        state: 'asc'
      }
    })

    const bankName = await prisma.bankifsc.groupBy({
      by: ['bank'],
      orderBy: {
        bank: 'asc'
      }
    })

    return res.render('customer/profile/dashboard', {
      maritalStatuses,
      cards,
      queries,
      type,
      leads,
      statusCountArr,
      totalDisbursedAmount,
      offers,
      tab,
      state,
      bankName
    });
  } catch (error) {
    logger.error(error.message);
  }
}

module.exports = {
  Dashboard,
};
