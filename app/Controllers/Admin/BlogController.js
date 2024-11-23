const prisma = require('../../../prisma/prisma');
const path = '/uploads/';
const fs = require('fs');
const { WebPaginate } = require('../../Helpers/WebPaginate');

async function index(req, res) {
  const teamMembers = await WebPaginate(req, res, 'Blogs', {
    orderBy: [
      {
        id: 'desc',
      },
    ],
  });


  return res.render('admin/setup/blogs', {
    teamMembers
  });
}

async function store(req, res) {
  try {
    const blogs = await prisma.Blogs.create({
      data: {
        ...req.body,
        icon: !req.files?.icon ? null : req.files.icon[0].filename,
        cover: !req.files?.cover ? null : req.files.cover[0].filename,
      },
    });

    return res.status(200).json({
      status: 'success',
      message: 'Blog created successfully!',
      data: blogs,
    });
  } catch (error) {
    return res.status(422).json({
      status: 'error',
      message: error.message,
      data: {},
    });
  }
}

async function toggleStatus(req, res) {
  try {
    await prisma.blogs.update({
      where: {
        id: +req.params.id,
      },
      data: {
        status: Boolean(+req.params.status),
      },
    });
    return res.redirect('/admin/blogs');
  } catch (error) {
    return res.status(422).json({
      status: 'error',
      message: error.message,
      data: {},
    });
  }
}

async function edit(req, res) {
  try {
    const teamMember = await prisma.blogs.findFirst({
      where: {
        id: +req.params.id,
      },
    });

    return res.status(200).json({ message: 'Blog fetched successfully!', data: teamMember });
  } catch (error) {
    return res.status(422).json({
      status: 'error',
      message: error.message,
      data: {},
    });
  }
}

async function update(req, res) {
  try {
    const currentTeam = await prisma.blogs.findUnique({
      where: {
        id: +req.params.id,
      },
    });

    console.log(currentTeam)

    const team = await prisma.blogs.update({
      where: {
        id: +req.params.id,
      },
      data: {
        ...req.body,
        icon: !req.files?.icon ? currentTeam.icon : req.files?.icon[0]?.filename,
        cover: !req.files?.cover ? currentTeam.cover : req.files?.cover[0]?.filename,
      },
    });

    if(req.files?.icon){
      if (req.files?.icon[0]?.filename !== undefined && currentTeam.icon) {
        fs.unlinkSync(`${process.cwd()}/public/${path}${currentTeam.icon}`);
      }
    }
    if(req.files?.cover){
      if (req.files?.cover[0]?.filename !== undefined && currentTeam.cover) {
        fs.unlinkSync(`${process.cwd()}/public/${path}${currentTeam.cover}`);
      }
    }

    return res.status(200).json({ message: 'Blog updated successfully!', data: team });
  } catch (error) {
    return res.status(422).json({
      status: 'error',
      message: error.message,
      data: {},
    });
  }
}

async function destroy(req, res) {
  try {
    const teamMember = await prisma.blogs.findUnique({
      where: {
        id: +req.params.id,
      },
    });

    if (teamMember.icon) {
      fs.unlinkSync(`${process.cwd()}/public/${path}${teamMember.icon}`);
    }
    if (teamMember.cover) {
      fs.unlinkSync(`${process.cwd()}/public/${path}${teamMember.cover}`);
    }

    await prisma.blogs.delete({
      where: {
        id: +req.params.id,
      },
    });

    return res.status(200).json({ message: 'Blog deleted successfully!', data: {} });
  } catch (error) {
    return res.status(422).json({
      status: 'error',
      message: error.message,
      data: {},
    });
  }
}

module.exports = {
  index,
  store,
  toggleStatus,
  edit,
  update,
  destroy,
};
