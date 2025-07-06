const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../index");
const UserModel = require("../models/user.model"); // افترض أن لديك نموذج المستخدم
const CourseModel = require("../models/course.model");

let mongoServer, teacherToken, studentToken, adminToken;

async function loginAndGetToken(email, password) {
  // دالة وهمية، استبدلها بالفعلية
  const res = await request(app)
    .post("/api/users/login")
    .send({ email, password });
  return res.body.token;
}

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());

  await UserModel.create([
    {
      email: "teacher@example.com",
      password: "pass",
      role: "teacher",
      firstName: "أحمد",
      lastName: "محمد",
    },
    { email: "student@example.com", password: "pass", role: "student" },
    { email: "admin@example.com", password: "pass", role: "admin" },
  ]);

  teacherToken = await loginAndGetToken("teacher@example.com", "pass");
  studentToken = await loginAndGetToken("student@example.com", "pass");
  adminToken = await loginAndGetToken("admin@example.com", "pass");
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await CourseModel.deleteMany({});
});

describe("Courses API", () => {
  let courseId;

  beforeEach(async () => {
    const course = await CourseModel.create({
      name: "Test Course",
      category: "Test",
      price: 10,
      isPublished: true,
      teacher: (await UserModel.findOne({ email: "teacher@example.com" }))._id,
    });
    courseId = course._id;
  });

  describe("GET /api/courses", () => {
    it("should list courses", async () => {
      const res = await request(app)
        .get("/api/courses")
        .set("Authorization", `Bearer ${studentToken}`);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("data.courses");
    });
  });

  describe("POST /api/courses", () => {
    it("teacher can create course", async () => {
      const res = await request(app)
        .post("/api/courses")
        .set("Authorization", `Bearer ${teacherToken}`)
        .send({ name: "Test", category: "X", price: 10, isPublished: true });
      expect(res.status).toBe(201);
      expect(res.body.data.name).toBe("Test");
    });

    it("student cannot create course", async () => {
      const res = await request(app)
        .post("/api/courses")
        .set("Authorization", `Bearer ${studentToken}`)
        .send({ name: "Test2", category: "X", price: 10, isPublished: false });
      expect(res.status).toBe(403);
    });

    it("teacher cannot create course with invalid data", async () => {
      const res = await request(app)
        .post("/api/courses")
        .set("Authorization", `Bearer ${teacherToken}`)
        .send({ name: "", category: "X", price: -10 });
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("status", "FAIL");
    });
  });

  describe("GET /api/courses/:courseId", () => {
    it("should get course details with teacher info", async () => {
      const res = await request(app)
        .get(`/api/courses/${courseId}`)
        .set("Authorization", `Bearer ${studentToken}`);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("data");
      expect(res.body.data).toHaveProperty("name", "Test Course");
      expect(res.body.data).toHaveProperty("teacher");
      expect(res.body.data.teacher).toHaveProperty("firstName", "أحمد");
      expect(res.body.data.teacher).toHaveProperty("lastName", "محمد");
      expect(res.body.data.teacher).toHaveProperty(
        "email",
        "teacher@example.com"
      );
    });

    it("should return 404 for non-existent course", async () => {
      const nonExistentId = "507f1f77bcf86cd799439011";
      const res = await request(app)
        .get(`/api/courses/${nonExistentId}`)
        .set("Authorization", `Bearer ${studentToken}`);
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty("status", "FAIL");
    });
  });
});
