const prisma = require("../../../prisma/prisma");
const { logger } = require('../../Middleware/ErrorLogger');
// const { slugify } = require('../../Helpers/Functions')

async function bankIFSC(req, res) {
  try {

    const bankName = await prisma.bankifsc.groupBy({
        by: ['bank'],
        orderBy: {
          bank: 'asc'
        }
    })

    return res.render('customer/ifsc-check' , {bankName});
  } catch (error) {
    logger.error(error.message);
  }
}

async function stateIFSC(req, res) {
    try {

      const bankName = await prisma.bankifsc.groupBy({
        by: ['bank'],
        orderBy: {
          bank: 'asc'
        }
      })
  
      const bank = await prisma.bankifsc.findFirst({
          where : {
            bankSlug : req.params.bank
          }
      })

      const stateName = await prisma.bankifsc.groupBy({
        by: ['state'],
        where : {
            bankSlug : req.params.bank
        }
    })
  
      return res.render('customer/ifsc-check' , {
          bank : bank ,
          stateName : stateName ,
          bankName : bankName
        });
    } catch (error) {
      logger.error(error.message);
    }
  }

  async function cityIFSC(req, res) {
    try {

      const bankName = await prisma.bankifsc.groupBy({
        by: ['bank'],
        orderBy: {
          bank: 'asc'
        }
        })

     const stateName = await prisma.bankifsc.groupBy({
          by: ['state'],
          where : {
              bankSlug : req.params.bank
          }
        })
  
      const bank = await prisma.bankifsc.findFirst({
          where : {
            bankSlug : req.params.bank
          }
      })

      const state = await prisma.bankifsc.findFirst({
        where : {
            bankSlug : req.params.bank,
            stateSlug : req.params.state
        }
    })

      const cityName = await prisma.bankifsc.groupBy({
        by: ['city1'],
        where : {
            bankSlug : req.params.bank,
            stateSlug : req.params.state
        }
    })
  
      return res.render('customer/ifsc-check' , {bank , state , cityName , bankName , stateName});
    } catch (error) {
      logger.error(error.message);
    }
  }


  async function branchIFSC(req, res) {
    try {

      const bankName = await prisma.bankifsc.groupBy({
        by: ['bank'],
        orderBy: {
          bank: 'asc'
        }
      })

      const stateName = await prisma.bankifsc.groupBy({
          by: ['state'],
          where : {
              bankSlug : req.params.bank
          }
      })
  

      const cityName = await prisma.bankifsc.groupBy({
          by: ['city1'],
          where : {
              bankSlug : req.params.bank,
              stateSlug : req.params.state
          }
      })


      const bank = await prisma.bankifsc.findFirst({
          where : {
            bankSlug : req.params.bank
          }
      })

      const state = await prisma.bankifsc.findFirst({
        where : {
            bankSlug : req.params.bank,
            stateSlug : req.params.state
        }
    })

    const city = await prisma.bankifsc.findFirst({
        where : {
            bankSlug : req.params.bank,
            stateSlug : req.params.state,
            citySlug : req.params.city
        }
    })

      const branchName = await prisma.bankifsc.groupBy({
        by: ['branch'],
        where : {
            bankSlug : req.params.bank,
            stateSlug : req.params.state,
            citySlug : req.params.city
        }
    })
  
      return res.render('customer/ifsc-check' , {bank , state , city , branchName , bankName , stateName , cityName});
    } catch (error) {
      logger.error(error.message);
    }
  }

  async function detailIFSC(req, res) {
    try {

      const bankName = await prisma.bankifsc.groupBy({
        by: ['bank'],
        orderBy: {
          bank: 'asc'
        }
      })

      const stateName = await prisma.bankifsc.groupBy({
          by: ['state'],
          where : {
              bankSlug : req.params.bank
          }
      })  

      const cityName = await prisma.bankifsc.groupBy({
          by: ['city1'],
          where : {
              bankSlug : req.params.bank,
              stateSlug : req.params.state
          }
     })  
  
      const bank = await prisma.bankifsc.findFirst({
          where : {
            bankSlug : req.params.bank
          }
      })

      const state = await prisma.bankifsc.findFirst({
        where : {
            bankSlug : req.params.bank,
            stateSlug : req.params.state
        }
    })

    const city = await prisma.bankifsc.findFirst({
        where : {
            bankSlug : req.params.bank,
            stateSlug : req.params.state,
            citySlug : req.params.city
        }
    })

    const branch = await prisma.bankifsc.findFirst({
      where : {
          bankSlug : req.params.bank,
          stateSlug : req.params.state,
          citySlug : req.params.city,
          branchSlug : req.params.branch
      }
  })

  const branchName = await prisma.bankifsc.groupBy({
    by: ['branch'],
    where : {
        bankSlug : req.params.bank,
        stateSlug : req.params.state,
        citySlug : req.params.city
    }
  })
  
      return res.render('customer/ifsc-check' , {bank , state , city , branch , bankName , stateName , cityName , branchName});
    } catch (error) {
      logger.error(error.message);
    }
  }

// const updateSlug = async (req , res) => {
//   console.log('working')
//     const bankIfsc = await prisma.bankifsc.findMany();
//     for(i in bankIfsc){
//         await prisma.bankifsc.update({
//             where : {
//                 id : bankIfsc[i].id
//             },
//             data: {             
//                bankSlug   : slugify(bankIfsc[i].bank),
//                stateSlug  : slugify(bankIfsc[i].state),
//                citySlug   : slugify(bankIfsc[i].city1),
//                branchSlug : slugify(bankIfsc[i].branch)
//             }
//         })
//     }
//     res.send('hello')
// }



module.exports = {
    bankIFSC,
    stateIFSC,
    cityIFSC,
    branchIFSC,
    detailIFSC
};
