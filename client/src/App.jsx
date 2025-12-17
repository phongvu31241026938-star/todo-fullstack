import React, { useEffect, useState } from "react";
import axios from "axios";

export default function App() {
  const [events, setEvents] = useState([]);
  const [editingId, setEditingId] = useState(null);
  
  // State cho form
  const [formData, setFormData] = useState({
    title: "",
    startTime: "",
    endTime: ""
  });

  // --- LOGIC GIỮ NGUYÊN ---
  const loadEvents = async () => {
    try {
      const result = await axios.get("https://todo-fullstack-ymvr.onrender.com/api/events");
      // Sắp xếp: Mới nhất lên đầu
      const sortedEvents = result.data.sort((a, b) => new Date(b.startTime) - new Date(a.startTime));
      setEvents(sortedEvents);
    } catch (error) {
      console.error("Lỗi tải dữ liệu:", error);
    }
  };

  useEffect(() => { loadEvents(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`https://todo-fullstack-ymvr.onrender.com/api/events/${editingId}`, formData);
        alert("Cập nhật thành công!");
        setEditingId(null);
      } else {
        await axios.post("https://todo-fullstack-ymvr.onrender.com/api/events", formData);
        alert("Thêm mới thành công!");
      }
      setFormData({ title: "", startTime: "", endTime: "" }); 
      loadEvents(); 
    } catch (error) {
      alert("Có lỗi xảy ra!");
    }
  };

  const deleteEvent = async (id) => {
    if (window.confirm("Bạn muốn xóa sự kiện này?")) {
      await axios.delete(`https://todo-fullstack-ymvr.onrender.com/api/events/${id}`);
      loadEvents();
    }
  };

  const startEdit = (ev) => {
    setEditingId(ev.id);
    setFormData({ title: ev.title, startTime: ev.startTime, endTime: ev.endTime });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({ title: "", startTime: "", endTime: "" });
  };

  // Hàm helper để format ngày tháng đẹp hơn
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', { 
      hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' 
    });
  };

  // --- PHẦN GIAO DIỆN (UI) ---
  return (
    <div style={styles.container}>
      {/* HEADER */}
      <div style={styles.header}>
        <h1 style={styles.appTitle}>🚀 Quản Lý Công Việc</h1>
        <div style={styles.statsBadge}>
          {events.length} Nhiệm vụ
        </div>
      </div>

      <div style={styles.mainLayout}>
        
        {/* CỘT TRÁI: FORM NHẬP LIỆU */}
        <div style={styles.formCard}>
          <h2 style={{...styles.cardTitle, color: editingId ? "#f59e0b" : "#3b82f6"}}>
            {editingId ? "✏️ Chỉnh Sửa" : "✨ Tạo Mới"}
          </h2>
          <form onSubmit={handleSubmit}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Tiêu đề công việc</label>
              <input 
                type="text" 
                style={styles.input}
                placeholder="Ví dụ: Họp team, Đi siêu thị..." 
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                required 
              />
            </div>

            <div style={styles.row}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Bắt đầu</label>
                <input 
                  type="datetime-local" 
                  style={styles.input}
                  value={formData.startTime}
                  onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                  required 
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Kết thúc</label>
                <input 
                  type="datetime-local" 
                  style={styles.input}
                  value={formData.endTime}
                  onChange={(e) => setFormData({...formData, endTime: e.target.value})}
                  required 
                />
              </div>
            </div>

            <div style={styles.buttonGroup}>
              <button type="submit" style={editingId ? styles.btnUpdate : styles.btnAdd}>
                {editingId ? "Lưu Thay Đổi" : "Thêm Nhiệm Vụ"}
              </button>
              {editingId && (
                <button type="button" onClick={cancelEdit} style={styles.btnCancel}>
                  Hủy Bỏ
                </button>
              )}
            </div>
          </form>
        </div>

        {/* CỘT PHẢI: DANH SÁCH */}
        <div style={styles.listSection}>
          <h3 style={styles.sectionTitle}>Danh sách công việc</h3>
          
          <div style={styles.listContainer}>
            {events.length === 0 ? (
              <div style={styles.emptyState}>Chưa có công việc nào. Hãy thêm mới! 👇</div>
            ) : (
              events.map((ev) => (
                <div key={ev.id} style={styles.eventCard}>
                  {/* Dải màu trang trí bên trái */}
                  <div style={styles.cardStrip}></div>
                  
                  <div style={styles.cardContent}>
                    <h4 style={styles.eventTitle}>{ev.title}</h4>
                    <div style={styles.metaInfo}>
                      <span style={styles.timeTag}>🕒 {formatDate(ev.startTime)}</span>
                      <span style={styles.arrowIcon}>➝</span>
                      <span style={styles.timeTag}>🏁 {formatDate(ev.endTime)}</span>
                    </div>
                  </div>

                  <div style={styles.cardActions}>
                    <button onClick={() => startEdit(ev)} style={styles.iconBtnEdit} title="Sửa">✏️</button>
                    <button onClick={() => deleteEvent(ev.id)} style={styles.iconBtnDelete} title="Xóa">🗑️</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

// --- OBJECT CHỨA STYLE (CSS-in-JS) ---
const styles = {
  container: {
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
    backgroundColor: "#f3f4f6",
    minHeight: "100vh",
    padding: "40px 20px",
    color: "#1f2937",
  },
  header: {
    maxWidth: "1000px",
    margin: "0 auto 30px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  appTitle: {
    fontSize: "28px",
    fontWeight: "800",
    color: "#111827",
    margin: 0,
    letterSpacing: "-0.5px",
  },
  statsBadge: {
    backgroundColor: "#3b82f6",
    color: "white",
    padding: "6px 15px",
    borderRadius: "20px",
    fontSize: "14px",
    fontWeight: "600",
    boxShadow: "0 4px 6px -1px rgba(59, 130, 246, 0.5)"
  },
  mainLayout: {
    display: "grid",
    gridTemplateColumns: "1fr", // Mobile mặc định 1 cột
    gap: "30px",
    maxWidth: "1000px",
    margin: "0 auto",
  },
  // Responsive: Trên màn hình lớn sẽ chia 2 cột (cần CSS media query thực tế, nhưng ở đây giả lập bố cục dọc cho dễ nhìn trên mobile)
  
  formCard: {
    backgroundColor: "white",
    padding: "30px",
    borderRadius: "16px",
    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.025)",
    border: "1px solid #e5e7eb",
  },
  cardTitle: {
    marginTop: 0,
    marginBottom: "20px",
    fontSize: "20px",
    fontWeight: "700",
  },
  inputGroup: {
    marginBottom: "15px",
  },
  row: {
    display: "flex",
    gap: "15px",
  },
  label: {
    display: "block",
    marginBottom: "6px",
    fontSize: "13px",
    fontWeight: "600",
    color: "#4b5563",
    textTransform: "uppercase",
  },
  input: {
    width: "100%",
    padding: "12px",
    border: "2px solid #e5e7eb",
    borderRadius: "8px",
    fontSize: "15px",
    outline: "none",
    transition: "border-color 0.2s",
    boxSizing: "border-box", // Quan trọng để không bị vỡ khung
  },
  buttonGroup: {
    display: "flex",
    gap: "10px",
    marginTop: "10px",
  },
  btnAdd: {
    flex: 1,
    padding: "12px",
    backgroundColor: "#10b981", // Màu xanh lá hiện đại
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontWeight: "600",
    cursor: "pointer",
    boxShadow: "0 4px 6px -1px rgba(16, 185, 129, 0.4)",
    transition: "transform 0.1s",
  },
  btnUpdate: {
    flex: 1,
    padding: "12px",
    backgroundColor: "#f59e0b",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontWeight: "600",
    cursor: "pointer",
    boxShadow: "0 4px 6px -1px rgba(245, 158, 11, 0.4)",
  },
  btnCancel: {
    padding: "12px 20px",
    backgroundColor: "#9ca3af",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontWeight: "600",
    cursor: "pointer",
  },
  
  // STYLE DANH SÁCH
  listSection: {
    marginTop: "10px",
  },
  sectionTitle: {
    fontSize: "18px",
    color: "#6b7280",
    marginBottom: "15px",
    fontWeight: "600",
  },
  listContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  eventCard: {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
    border: "1px solid #f3f4f6",
    position: "relative",
    overflow: "hidden", // Để dải màu không lòi ra
    transition: "transform 0.2s",
  },
  cardStrip: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: "6px",
    backgroundColor: "#3b82f6", // Màu xanh dương chủ đạo
  },
  cardContent: {
    paddingLeft: "15px",
  },
  eventTitle: {
    margin: "0 0 5px 0",
    fontSize: "16px",
    color: "#1f2937",
    fontWeight: "700",
  },
  metaInfo: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "13px",
    color: "#6b7280",
  },
  timeTag: {
    backgroundColor: "#f3f4f6",
    padding: "4px 8px",
    borderRadius: "4px",
    fontWeight: "500",
  },
  arrowIcon: {
    color: "#9ca3af",
  },
  cardActions: {
    display: "flex",
    gap: "8px",
  },
  iconBtnEdit: {
    width: "35px",
    height: "35px",
    borderRadius: "50%",
    border: "none",
    backgroundColor: "#eff6ff",
    color: "#3b82f6",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "14px",
  },
  iconBtnDelete: {
    width: "35px",
    height: "35px",
    borderRadius: "50%",
    border: "none",
    backgroundColor: "#fef2f2",
    color: "#ef4444",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "14px",
  },
  emptyState: {
    textAlign: "center",
    color: "#9ca3af",
    padding: "40px",
    border: "2px dashed #e5e7eb",
    borderRadius: "12px",
  },
};