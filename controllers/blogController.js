const Blog = require("../models/blogModel");
const moment = require("moment-timezone");

// Dapatkan semua blog
exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Dapatkan blog berdasarkan ID
exports.getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findOne({ _id: req.params.id });
    if (!blog) {
      return res.status(404).json({ message: "Blog tidak ditemukan" });
    }
    res.json(blog);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Buat blog baru
exports.createBlog = async (req, res) => {
  try {
    const { title, content, creator } = req.body;

    const newBlog = new Blog({
      title,
      content,
      creator,
    });
    const savedBlog = await newBlog.save();
    res.status(201).json(savedBlog);
  } catch (err) {
    console.error(err); // Cetak pesan kesalahan untuk debugging
    res.status(400).json({ message: err.message });
  }
};

// Perbarui blog berdasarkan ID
exports.updateBlog = async (req, res) => {
  try {
    const { title, content } = req.body;

    // Dapatkan data blog sebelum diperbarui
    const oldBlog = await Blog.findById(req.params.id);

    const updateFields = {};

    // Cek dan tambahkan properti yang akan diperbarui
    if (title) {
      updateFields.title = title;
    }
    if (content) {
      updateFields.content = content;
    }

    // Tambahkan waktu terakhir diedit
    const jakartaTimezone = moment.tz("Asia/Jakarta");
    updateFields.lastEditedDate = jakartaTimezone.format("DD/MM/YYYY");
    updateFields.lastEditedTime = jakartaTimezone.format("HH:mm");

    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true }
    );

    if (!updatedBlog) {
      return res.status(404).json({ message: "Blog tidak ditemukan" });
    }

    res.json(updatedBlog);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Hapus blog berdasarkan ID
exports.deleteBlog = async (req, res) => {
  try {
    const deletedBlog = await Blog.findOneAndDelete({ _id: req.params.id });

    if (!deletedBlog) {
      return res.status(404).json({ message: "Blog tidak ditemukan" });
    }

    res.json({ message: "Blog dihapus dengan sukses" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Hapus semua blog
exports.deleteAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find();

    if (blogs.length === 0) {
      return res.status(404).json({ message: "Tidak ada blog untuk dihapus" });
    }

    const deletedBlogs = await Promise.all(
      blogs.map(async (blog) => {
        const deletedBlog = await Blog.findOneAndDelete({
          blogId: blog.blogId,
        });

        return deletedBlog;
      })
    );

    res.json({
      message: `Semua blog telah dihapus, ${deletedBlogs.length} blog dihapus dengan sukses`,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Cari blog berdasarkan judul
exports.searchBlogs = async (req, res) => {
  try {
    const { title } = req.query;

    if (!title) {
      return res
        .status(400)
        .json({ message: "Parameter judul diperlukan untuk pencarian" });
    }

    const regex = new RegExp(title, "i"); // Pencarian tanpa memperhatikan huruf besar kecil
    const blogs = await Blog.find({ title: regex });

    if (blogs.length === 0) {
      return res.status(404).json({ message: "Blog tidak ditemukan" });
    }

    res.json(blogs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
