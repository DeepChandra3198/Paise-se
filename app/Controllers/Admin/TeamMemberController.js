const prisma = require('../../../prisma/prisma');
const path = '/uploads/';
const fs = require('fs');
const { WebPaginate } = require('../../Helpers/WebPaginate');
const { master } = require('../../Helpers/Functions');

async function index(req, res) {
  const teamMembers = await WebPaginate(req, res, 'TeamMembers', {
    orderBy: [
      {
        id: 'desc',
      },
    ],
  });

  const teamMemberDesignations = await master('Team Member Designations');

  return res.render('admin/setup/team-members', {
    teamMembers,
    teamMemberDesignations,
  });
}

async function store(req, res) {
  try {
    const teamMember = await prisma.TeamMembers.create({
      data: {
        ...req.body,
        photo: req.file?.filename,
      },
    });

    return res.status(200).json({
      status: 'success',
      message: 'Team member created successfully!',
      data: teamMember,
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
    await prisma.TeamMembers.update({
      where: {
        id: +req.params.id,
      },
      data: {
        status: Boolean(+req.params.status),
      },
    });
    return res.redirect('/admin/setup/team-members');
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
    const teamMember = await prisma.TeamMembers.findFirst({
      where: {
        id: +req.params.id,
      },
    });

    return res.status(200).json({ message: 'Team member fetched successfully!', data: teamMember });
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
    const currentTeam = await prisma.TeamMembers.findUnique({
      where: {
        id: +req.params.id,
      },
    });

    const team = await prisma.TeamMembers.update({
      where: {
        id: +req.params.id,
      },
      data: {
        ...req.body,
        photo: req.file === undefined ? currentTeam.photo : req.file.filename,
      },
    });

    if (req.file !== undefined && currentTeam.photo) {
      fs.unlinkSync(`${process.cwd()}/public/${path}${currentTeam.photo}`);
    }

    return res.status(200).json({ message: 'Team member updated successfully!', data: team });
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
    const teamMember = await prisma.TeamMembers.findUnique({
      where: {
        id: +req.params.id,
      },
    });

    if (teamMember.photo) {
      fs.unlinkSync(`${process.cwd()}/public/${path}${teamMember.photo}`);
    }

    await prisma.TeamMembers.delete({
      where: {
        id: +req.params.id,
      },
    });

    return res.status(200).json({ message: 'Team member deleted successfully!', data: {} });
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
