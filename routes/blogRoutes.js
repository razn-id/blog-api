const express = require("express");
const router = express.Router();
const blogController = require("../controllers/blogController");

/**
 * @swagger
 * components:
 *   schemas:
 *     Blog:
 *       type: object
 *       required:
 *         - title
 *         - content
 *         - creator
 *       properties:
 *         _id:
 *           type: string
 *           description: ID otomatis dari MongoDB
 *           example: "64a7f2c3e4b0a1234567890a"
 *         title:
 *           type: string
 *           description: Judul blog
 *           example: "Cara Belajar Express.js"
 *         content:
 *           type: string
 *           maxLength: 1000
 *           description: Isi konten blog
 *           example: "Express.js adalah framework Node.js yang minimalis..."
 *         creator:
 *           type: string
 *           maxLength: 60
 *           description: Nama pembuat blog
 *           example: "Razan"
 *         createdDate:
 *           type: string
 *           description: Tanggal dibuat (DD/MM/YYYY)
 *           example: "14/06/2025"
 *         createdTime:
 *           type: string
 *           description: Waktu dibuat (HH:mm)
 *           example: "09:30"
 *         lastEditedDate:
 *           type: string
 *           description: Tanggal terakhir diedit (DD/MM/YYYY)
 *           example: "15/06/2025"
 *         lastEditedTime:
 *           type: string
 *           description: Waktu terakhir diedit (HH:mm)
 *           example: "14:20"
 *     BlogInput:
 *       type: object
 *       required:
 *         - title
 *         - content
 *         - creator
 *       properties:
 *         title:
 *           type: string
 *           example: "Cara Belajar Express.js"
 *         content:
 *           type: string
 *           maxLength: 1000
 *           example: "Express.js adalah framework Node.js yang minimalis..."
 *         creator:
 *           type: string
 *           maxLength: 60
 *           example: "Razan"
 */

module.exports = () => {
  /**
   * @swagger
   * /api/blogs/dell-all:
   *   delete:
   *     summary: Hapus semua blog
   *     tags: [Blogs]
   *     responses:
   *       200:
   *         description: Semua blog berhasil dihapus
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "Semua blog berhasil dihapus"
   *       500:
   *         description: Internal Server Error
   */
  router.delete("/dell-all", blogController.deleteAllBlogs);

  /**
   * @swagger
   * /api/blogs:
   *   get:
   *     summary: Ambil semua blog
   *     tags: [Blogs]
   *     responses:
   *       200:
   *         description: List semua blog
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Blog'
   *       500:
   *         description: Internal Server Error
   */
  router.get("/", blogController.getAllBlogs);

  /**
   * @swagger
   * /api/blogs/search:
   *   get:
   *     summary: Cari blog berdasarkan judul
   *     tags: [Blogs]
   *     parameters:
   *       - in: query
   *         name: title
   *         required: true
   *         schema:
   *           type: string
   *         description: Kata kunci judul blog
   *         example: "Express"
   *     responses:
   *       200:
   *         description: Hasil pencarian blog
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Blog'
   *       404:
   *         description: Blog tidak ditemukan
   *       500:
   *         description: Internal Server Error
   */
  router.get("/search", blogController.searchBlogs);

  /**
   * @swagger
   * /api/blogs/{id}:
   *   get:
   *     summary: Ambil blog berdasarkan ID
   *     tags: [Blogs]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: MongoDB ID dari blog
   *         example: "64a7f2c3e4b0a1234567890a"
   *     responses:
   *       200:
   *         description: Blog ditemukan
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Blog'
   *       404:
   *         description: Blog tidak ditemukan
   *       500:
   *         description: Internal Server Error
   */
  router.get("/:id", blogController.getBlogById);

  /**
   * @swagger
   * /api/blogs:
   *   post:
   *     summary: Buat blog baru
   *     tags: [Blogs]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/BlogInput'
   *     responses:
   *       201:
   *         description: Blog berhasil dibuat
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Blog'
   *       400:
   *         description: Request tidak valid
   *       500:
   *         description: Internal Server Error
   */
  router.post("/", blogController.createBlog);

  /**
   * @swagger
   * /api/blogs/{id}:
   *   put:
   *     summary: Update blog berdasarkan ID
   *     tags: [Blogs]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         example: "64a7f2c3e4b0a1234567890a"
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/BlogInput'
   *     responses:
   *       200:
   *         description: Blog berhasil diupdate
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Blog'
   *       404:
   *         description: Blog tidak ditemukan
   *       500:
   *         description: Internal Server Error
   */
  router.put("/:id", blogController.updateBlog);

  /**
   * @swagger
   * /api/blogs/{id}:
   *   delete:
   *     summary: Hapus blog berdasarkan ID
   *     tags: [Blogs]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         example: "64a7f2c3e4b0a1234567890a"
   *     responses:
   *       200:
   *         description: Blog berhasil dihapus
   *       404:
   *         description: Blog tidak ditemukan
   *       500:
   *         description: Internal Server Error
   */
  router.delete("/:id", blogController.deleteBlog);

  return router;
};
