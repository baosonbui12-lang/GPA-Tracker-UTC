import { useState, useEffect } from "react";
import axios from "axios";
// 1. IMPORT THƯ VIỆN BIỂU ĐỒ
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "./App.css";

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [authUsername, setAuthUsername] = useState("");
  const [authPassword, setAuthPassword] = useState("");

  const [courses, setCourses] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [courseName, setCourseName] = useState("");
  const [credits, setCredits] = useState(3);
  const [grade10, setGrade10] = useState("");
  const [semesterId, setSemesterId] = useState(1);

  // --- LOGIC TÀI KHOẢN ---
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8080/api/users/login",
        { username: authUsername, password: authPassword },
      );
      setCurrentUser(response.data);
    } catch (error) {
      alert("Sai tài khoản hoặc mật khẩu!");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8080/api/users/register", {
        username: authUsername,
        password: authPassword,
      });
      alert("Tạo tài khoản thành công! Bây giờ bạn có thể đăng nhập.");
      setIsRegistering(false);
      setAuthPassword("");
    } catch (error) {
      alert("Tên đăng nhập đã tồn tại!");
    }
  };

  const handleGuestLogin = () => {
    setCurrentUser({ id: 0, username: "Khách Ẩn Danh" });
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setAuthUsername("");
    setAuthPassword("");
    setCourses([]);
    setAllCourses([]);
  };

  // --- LOGIC DỮ LIỆU MÔN HỌC ---
  const fetchCourses = async () => {
    if (!currentUser) return;
    try {
      const resSemester = await axios.get(
        `http://localhost:8080/api/courses?semesterId=${semesterId}&userId=${currentUser.id}`,
      );
      setCourses(resSemester.data);
      const resAll = await axios.get(
        `http://localhost:8080/api/courses/all?userId=${currentUser.id}`,
      );
      setAllCourses(resAll.data);
    } catch (error) {
      console.error("Lỗi:", error);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [semesterId, currentUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8080/api/courses", {
        semesterId: parseInt(semesterId),
        userId: currentUser.id,
        courseName,
        credits: parseInt(credits),
        grade10: parseFloat(grade10),
      });
      setCourseName("");
      setGrade10("");
      fetchCourses();
    } catch (error) {
      alert("Có lỗi xảy ra khi lưu!");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn chắc chắn muốn xóa môn này?")) {
      try {
        await axios.delete(`http://localhost:8080/api/courses/${id}`);
        fetchCourses();
      } catch (error) {
        alert("Lỗi khi xóa!");
      }
    }
  };

  // --- TOÁN HỌC GPA ---
  let semCredits = 0;
  let semPoints = 0;
  courses.forEach((c) => {
    semCredits += c.credits;
    semPoints += c.credits * c.grade4;
  });
  const gpaSemester =
    semCredits > 0 ? (semPoints / semCredits).toFixed(2) : "0.00";

  let totalAccCredits = 0;
  let totalAccPoints = 0;
  allCourses.forEach((c) => {
    if (c.grade4 > 0) {
      totalAccCredits += c.credits;
      totalAccPoints += c.credits * c.grade4;
    }
  });
  const gpaGlobal =
    totalAccCredits > 0
      ? (totalAccPoints / totalAccCredits).toFixed(2)
      : "0.00";

  // 2. XỬ LÝ DỮ LIỆU ĐỂ VẼ BIỂU ĐỒ
  const chartData = [];
  // Duyệt qua 8 học kỳ để tính điểm trung bình từng kỳ
  for (let i = 1; i <= 8; i++) {
    const semesterCourses = allCourses.filter((c) => c.semesterId === i);
    if (semesterCourses.length > 0) {
      let tCredits = 0;
      let tPoints = 0;
      semesterCourses.forEach((c) => {
        tCredits += c.credits;
        tPoints += c.credits * c.grade4;
      });
      const gpa = tCredits > 0 ? (tPoints / tCredits).toFixed(2) : 0;

      // Tạo tên kỳ học cho biểu đồ (Kỳ 1, Kỳ 2, ...)
      let termName = `Kỳ ${i}`;
      if (i === 1) termName = "K1-N1";
      else if (i === 2) termName = "K2-N1";
      else if (i === 3) termName = "K1-N2";
      else if (i === 4) termName = "K2-N2";
      else if (i === 5) termName = "K1-N3";
      else if (i === 6) termName = "K2-N3";
      else if (i === 7) termName = "K1-N4";
      else if (i === 8) termName = "K2-N4";

      chartData.push({ name: termName, GPA: parseFloat(gpa) });
    }
  }

  // ==========================================
  // GIAO DIỆN HIỂN THỊ
  // ==========================================

  if (!currentUser) {
    return (
      <div
        className="container"
        style={{ maxWidth: "420px", marginTop: "8vh" }}
      >
        <div className="card" style={{ textAlign: "center" }}>
          <h2>{isRegistering ? "Tạo Tài Khoản" : "Đăng Nhập"}</h2>
          <p style={{ color: "var(--text-muted)", marginBottom: "24px" }}>
            Hệ thống Quản lý GPA
          </p>

          <form
            onSubmit={isRegistering ? handleRegister : handleLogin}
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            <input
              type="text"
              placeholder="Tên đăng nhập"
              value={authUsername}
              onChange={(e) => setAuthUsername(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Mật khẩu"
              value={authPassword}
              onChange={(e) => setAuthPassword(e.target.value)}
              required
            />
            <button
              type="submit"
              className="btn-primary"
              style={{ marginTop: "8px", padding: "12px" }}
            >
              {isRegistering ? "Đăng Ký Ngay" : "Vào Bảng Điểm"}
            </button>
          </form>

          <div style={{ marginTop: "24px" }}>
            <button
              onClick={() => setIsRegistering(!isRegistering)}
              className="btn-outline"
              style={{ width: "100%", marginBottom: "16px", border: "none" }}
            >
              {isRegistering
                ? "← Trở lại Đăng nhập"
                : "Chưa có tài khoản? Đăng ký mới"}
            </button>
            <hr
              style={{
                borderColor: "var(--border-color)",
                marginBottom: "16px",
              }}
            />
            <button
              onClick={handleGuestLogin}
              className="btn-outline"
              style={{
                width: "100%",
                color: "var(--text-muted)",
                borderColor: "var(--text-muted)",
              }}
            >
              👀 Trải nghiệm với tư cách Khách
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "32px",
        }}
      >
        <h1 style={{ margin: 0, fontSize: "1.8rem" }}>🎓 GPA Tracker</h1>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <span style={{ color: "var(--primary)", fontWeight: "bold" }}>
            👤 {currentUser.username}
          </span>
          <button onClick={handleLogout} className="btn-danger">
            Đăng xuất
          </button>
        </div>
      </div>

      {/* CHỌN HỌC KỲ */}
      <div
        className="card"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "16px",
        }}
      >
        <h3 style={{ margin: 0 }}>Học kỳ hiện tại:</h3>
        <select
          value={semesterId}
          onChange={(e) => setSemesterId(e.target.value)}
          style={{ minWidth: "200px", cursor: "pointer" }}
        >
          <option value="1">Học kỳ 1 - Năm 1</option>
          <option value="2">Học kỳ 2 - Năm 1</option>
          <option value="3">Học kỳ 1 - Năm 2</option>
          <option value="4">Học kỳ 2 - Năm 2</option>
          <option value="5">Học kỳ 1 - Năm 3</option>
          <option value="6">Học kỳ 2 - Năm 3</option>
          <option value="7">Học kỳ 1 - Năm 4</option>
          <option value="8">Học kỳ 2 - Năm 4</option>
        </select>
      </div>

      {/* FORM NHẬP ĐIỂM */}
      <div className="card">
        <h3 style={{ marginTop: 0, marginBottom: "16px" }}>Thêm môn học mới</h3>
        <form onSubmit={handleSubmit} className="form-group">
          <input
            type="text"
            placeholder="Tên môn học..."
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
            required
            style={{ flex: 2 }}
          />
          <input
            type="number"
            placeholder="Số TC"
            value={credits}
            onChange={(e) => setCredits(e.target.value)}
            min="1"
            max="10"
            required
            style={{ width: "80px", flex: "unset" }}
          />
          <input
            type="number"
            step="0.1"
            placeholder="Điểm hệ 10"
            value={grade10}
            onChange={(e) => setGrade10(e.target.value)}
            min="0"
            max="10"
            required
            style={{ width: "120px", flex: "unset" }}
          />
          <button type="submit" className="btn-primary">
            ➕ Thêm Môn
          </button>
        </form>
      </div>

      {/* THỐNG KÊ */}
      <div className="card stats-grid">
        <div className="stat-item">
          <p>Tín chỉ kỳ này</p>
          <h2 style={{ color: "var(--text-main)" }}>{semCredits}</h2>
        </div>
        <div className="stat-item">
          <p>GPA Kỳ này</p>
          <h2 style={{ color: "var(--primary)" }}>{gpaSemester}</h2>
        </div>
        <div className="stat-item">
          <p>Tín chỉ Tích lũy</p>
          <h2 style={{ color: "var(--text-main)" }}>{totalAccCredits}</h2>
        </div>
        <div className="stat-item">
          <p>GPA Tích lũy</p>
          <h2 style={{ color: "var(--success)" }}>{gpaGlobal}</h2>
        </div>
      </div>

      {/* 3. KHU VỰC VẼ BIỂU ĐỒ */}
      {chartData.length > 0 && (
        <div
          className="card"
          style={{ height: "350px", paddingBottom: "40px" }}
        >
          <h3
            style={{
              marginTop: 0,
              marginBottom: "20px",
              textAlign: "center",
              color: "var(--text-muted)",
            }}
          >
            📈 Biểu đồ Điểm số qua các kỳ
          </h3>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#333"
                vertical={false}
              />
              <XAxis
                dataKey="name"
                stroke="#adb5bd"
                tick={{ fill: "#adb5bd" }}
              />
              <YAxis
                domain={[0, 4]}
                stroke="#adb5bd"
                tick={{ fill: "#adb5bd" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e1e24",
                  borderColor: "#333",
                  borderRadius: "8px",
                  color: "#fff",
                }}
                itemStyle={{ color: "#00e676", fontWeight: "bold" }}
              />
              <Legend verticalAlign="top" height={36} />
              <Line
                type="monotone"
                dataKey="GPA"
                name="GPA Hệ 4"
                stroke="#00e676"
                strokeWidth={3}
                activeDot={{ r: 8, fill: "#00e676", stroke: "#fff" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* BẢNG ĐIỂM */}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Tên Môn Học</th>
              <th>Tín Chỉ</th>
              <th>Hệ 10</th>
              <th>Hệ 4</th>
              <th>Điểm Chữ</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {courses.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  style={{
                    padding: "30px",
                    color: "var(--text-muted)",
                    textAlign: "center",
                  }}
                >
                  Chưa có dữ liệu cho học kỳ này.
                </td>
              </tr>
            ) : (
              courses.map((course) => (
                <tr key={course.id}>
                  <td style={{ fontWeight: "500" }}>{course.courseName}</td>
                  <td>{course.credits}</td>
                  <td>{course.grade10}</td>
                  <td style={{ color: "var(--danger)", fontWeight: "bold" }}>
                    {course.grade4}
                  </td>
                  <td style={{ color: "var(--primary)", fontWeight: "bold" }}>
                    {course.gradeLetter}
                  </td>
                  <td>
                    <button
                      onClick={() => handleDelete(course.id)}
                      className="btn-danger"
                      style={{ padding: "6px 12px", fontSize: "0.85rem" }}
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
