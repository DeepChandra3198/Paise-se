const prisma = require("../../../prisma/prisma");
const path = "/uploads/";
const fs = require("fs");

async function index(req, res) {
  const testimonials = await prisma.testimonials.findMany({
    orderBy: [
      {
        id: "desc",
      },
    ],
  });
  return res.render("admin/cms/testimonial", {
    testimonials,
  });
}

async function store(req, res) {
  try {
    const testimonial = await prisma.testimonials.create({
      data: {
        ...req.body,
        icon: req.file?.filename,
      },
    });

    return res.status(200).json({
      status: "success",
      message: "Testimonial created successfully!",
      data: testimonial,
    });
  } catch (error) {
    return res.status(422).json({
      status: "error",
      message: error.message,
      data: {},
    });
  }
}

async function toggleStatus(req, res) {
  try {
    await prisma.testimonials.update({
      where: {
        id: +req.params.id,
      },
      data: {
        status: Boolean(+req.params.status),
      },
    });
    return res.redirect("/admin/testimonial");
  } catch (error) {
    return res.status(422).json({
      status: "error",
      message: error.message,
      data: {},
    });
  }
}

async function update(req, res) {
  try {
    const currentTestimonial = await prisma.testimonials.findUnique({
      where: {
        id: +req.params.id,
      },
    });

    const testimonial = await prisma.testimonials.update({
      where: {
        id: +req.params.id,
      },
      data: {
        ...req.body,
        icon:
          req.file === undefined ? currentTestimonial.icon : req.file.filename,
      },
    });

    if (req.file !== undefined && currentTestimonial.icon) {
      fs.unlinkSync(
        `${process.cwd()}/public/${path}${currentTestimonial.icon}`
      );
    }

    return res.status(200).json({
      message: "Testimonial updated successfully!",
      data: testimonial,
    });
  } catch (error) {
    return res.status(422).json({
      status: "error",
      message: error.message,
      data: {},
    });
  }
}

async function destroy(req, res) {
  try {
    const testimonial = await prisma.testimonials.findUnique({
      where: {
        id: +req.params.id,
      },
    });

    if (testimonial.icon) {
      fs.unlinkSync(`${process.cwd()}/public/${path}${testimonial.icon}`);
    }

    await prisma.testimonials.delete({
      where: {
        id: +req.params.id,
      },
    });

    return res
      .status(200)
      .json({ message: "Testimonial deleted successfully!", data: {} });
  } catch (error) {
    return res.status(422).json({
      status: "error",
      message: error.message,
      data: {},
    });
  }
}

module.exports = {
  index,
  store,
  toggleStatus,
  update,
  destroy,
};
