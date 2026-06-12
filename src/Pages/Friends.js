import React, { useState, useEffect } from "react";
import Axios from "../Api/Axios";
import toast from "react-hot-toast"; // 👈 استيراد التوست
import {
  FaMagnifyingGlass,
  FaMessage,
  FaUser,
  FaUserXmark,
  FaCheck,
  FaXmark,
  FaUserPlus,
} from "react-icons/fa6";
import "../Styles/Friends.css";

// ستايل موحد مخصص للـ Toasts عشان يطابق ثيم الـ Gaming الغامق
const toastStyle = {
  style: {
    borderRadius: "8px",
    background: "#1e1b29",
    color: "#fff",
    border: "1px solid #ff007f", // حواف نيون خفيفة
  },
};

export default function Friends() {
  const [friends, setFriends] = useState([]);
  const [requests, setRequests] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [friendCode, setFriendCode] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔄 1. ميثود جلب قائمة الأصدقاء الفعليين من الباك إند
  const fetchFriends = async () => {
    try {
      setLoading(true);
      const res = await Axios.get("/Friends/all-friends"); 
      setFriends(res.data); 
    } catch (err) {
      console.error("Error fetching friends list", err);
      toast.error("Failed to load friends list 👾", toastStyle);
    } finally {
      setLoading(false);
    }
  };

  // 🔄 2. ميثود جلب طلبات الصداقة المعلقة
  const fetchPendingRequests = async () => {
    try {
      setLoading(true);
      const res = await Axios.get("/Friends/pending-requests");
      setRequests(res.data);
    } catch (err) {
      console.error("Error fetching requests", err);
      toast.error("Failed to load pending requests 🛡️", toastStyle);
    } finally {
      setLoading(false);
    }
  };

  // مراقبة التابات لتحديث الداتا أوتوماتيكياً أول ما اليوزر يتنقل بينهم
  useEffect(() => {
    if (activeTab === "all") {
      fetchFriends();
    } else if (activeTab === "pending") {
      fetchPendingRequests();
    }
  }, [activeTab]);

  // 🚀 3. ميثود إرسال طلب صداقة بكود (مبعوت كـ Object يطابق الـ DTO)
  const handleSendRequest = async (e) => {
    e.preventDefault();

    if (!friendCode.trim()) return;

    try {
      await Axios.post("/Friends/send-request-by-code", {
        friendCode: friendCode.trim() 
      });

      toast.success("تم إرسال طلب الصداقة بنجاح! 🎉", toastStyle);
      setFriendCode("");
      setActiveTab("pending"); // ينقله يشوف الطلب في تابة المعلقين
      
    } catch (err) {
      const errMsg = err.response?.data?.message || "Something went wrong! Check the code.";
      toast.error(errMsg, toastStyle);
    }
  };

  // 🛠️ 4. ميثود قبول أو رفض طلب الصداقة (إرسال الأكشن كـ Object يطابق الـ DTO الجديد)
  const handleRespondToRequest = async (requestId, action) => {
    try {
      await Axios.put(`/Friends/respond/${requestId}`, { action: action });

      // مسح الطلب فوراً من القائمة المعلقة بعد الرد عليه
      setRequests((prev) =>
        prev.filter((request) => request.requestId !== requestId)
      );

      const successMsg = action === "accept" ? "Friend request accepted! 🎮" : "Request rejected 🚫";
      toast.success(successMsg, toastStyle);

      if (action === "accept") {
        setActiveTab("all"); // لو وافق يتنقل لتابة الأصدقاء عشان يشوفه هناك
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || "Failed to respond to request.";
      toast.error(errMsg, toastStyle);
    }
  };

  // ❌ 5. ميثود حذف صديق
  const handleRemoveFriend = async (id, name) => {
    // سبت الـ confirm دي هنا عشان تأكيد الحذف الحرج، والنتيجة بتطلع توست شيك
    if (window.confirm(`Are you sure you want to remove ${name}?`)) {
      try {
        await Axios.delete(`/Friends/remove/${id}`); 
        setFriends(friends.filter((f) => f.id !== id));
        toast.success("Friend removed successfully 💔", toastStyle);
      } catch (err) {
        const errMsg = err.response?.data?.message || "Failed to remove friend.";
        toast.error(errMsg, toastStyle);
      }
    }
  };

  // الفلترة بالبحث لـ قائمة الأصدقاء
  const filteredFriends = friends.filter((friend) =>
    friend.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // الفلترة بالبحث لـ قائمة الطلبات
  const filteredRequests = requests.filter((req) =>
    req.senderName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="friends-page-container">
      {/* 🎛️ الهيدر الرئيسي مع تابات التنقل */}
      <div className="friends-page-header">
        <h2 className="friends-title">🗫 Community</h2>
        <div className="friends-tabs">
          <button
            className={`tab-btn ${activeTab === "all" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("all");
              setSearchTerm("");
            }}
          >
            All Friends{" "}
            <span style={{ background: "transparent" }} className="tab-count">
              {friends.length}
            </span>
          </button>
          <button
            className={`tab-btn ${activeTab === "pending" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("pending");
              setSearchTerm("");
            }}
          >
            Pending{" "}
            <span
              style={{ background: "transparent" }}
              className="tab-count pending-badge"
            >
              {requests.length}
            </span>
          </button>
          <button
            className={`tab-btn ${activeTab === "add" ? "active" : ""}`}
            onClick={() => setActiveTab("add")}
          >
            Add Friend
          </button>
          <button disabled style={{ cursor: "default" }} className="tab-btn">
            your Code: {localStorage.getItem("friendCode")}
          </button>
        </div>
      </div>

      {/* 🔍 شريط البحث الذكي */}
      {activeTab !== "add" && (
        <div className="friends-search-wrapper">
          <div className="search-bar-box">
            <FaMagnifyingGlass className="search-icon" />
            <input
              type="text"
              placeholder={
                activeTab === "all"
                  ? "Search friends..."
                  : "Search pending requests..."
              }
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      )}

      {/* 🎚️ عرض المحتوى ديناميكياً */}
      <div className="friends-content-section">
        {loading && <div className="loading-box">Loading... ⏳</div>}

        {/* === 1️⃣ تاب كل الأصدقاء === */}
        {!loading && activeTab === "all" && (
          <div className="friends-grid">
            {filteredFriends.length > 0 ? (
              filteredFriends.map((friend) => (
                <div key={friend.id} className={`friend-card ${friend.status}`}>
                  <div className="friend-avatar-wrapper">
                    <img
                      src={
                        friend.profileImageUrl || 
                        `https://api.dicebear.com/7.x/bottts/svg?seed=${friend.name}`
                      }
                      alt={friend.name}
                      className="friend-avatar"
                    />
                    <span className={`status-badge ${friend.status}`}></span>
                  </div>

                  <div className="friend-info">
                    <h3>{friend.name}</h3>
                    {friend.status === "in-game" ? (
                      <p className="friend-game-status">
                        Playing: <span>{friend.game}</span>
                      </p>
                    ) : (
                      <p className="friend-text-status">
                        {friend.status?.toUpperCase() || "ONLINE"}
                      </p>
                    )}
                  </div>

                  <div className="friend-actions">
                    <button className="action-btn chat" title="Send Message">
                      <FaMessage />
                    </button>
                    <button className="action-btn profile" title="View Profile">
                      <FaUser />
                    </button>
                    <button
                      className="action-btn remove"
                      title="Remove Friend"
                      onClick={() => handleRemoveFriend(friend.id, friend.name)}
                    >
                      <FaUserXmark />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-friends">No friends found 👾</div>
            )}
          </div>
        )}

        {/* === 2️⃣ تاب الطلبات المعلقة === */}
        {!loading && activeTab === "pending" && (
          <div className="friends-grid">
            {filteredRequests.length > 0 ? (
              filteredRequests.map((req) => (
                <div key={req.requestId} className="friend-card pending-card">
                  <div className="friend-avatar-wrapper">
                    <img
                      src={req.senderImageUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${req.senderName}`}
                      alt={req.senderName}
                      className="friend-avatar"
                    />
                  </div>

                  <div className="friend-info">
                    <h3>{req.senderName}</h3>
                    <p className="friend-text-status">
                      Code:{" "}
                      <span className="code-highlight">
                        #{req.senderFriendCode}
                      </span>
                    </p>
                  </div>

                  <div className="friend-actions">
                    <button
                      className="action-btn accept"
                      title="Accept Request"
                      onClick={() =>
                        handleRespondToRequest(req.requestId, "accept")
                      }
                    >
                      <FaCheck />
                    </button>
                    <button
                      className="action-btn reject"
                      title="Reject Request"
                      onClick={() =>
                        handleRespondToRequest(req.requestId, "reject")
                      }
                    >
                      <FaXmark />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-friends">No pending requests 🛡️</div>
            )}
          </div>
        )}

        {/* === 3️⃣ تاب إضافة صديق جديد === */}
        {activeTab === "add" && (
          <div className="add-friend-panel">
            <h3>ADD FRIEND VIA QUICK CODE</h3>
            <p>
              Enter the 8-digit unique code of your friend to add them
              instantly.
            </p>
            <form onSubmit={handleSendRequest} className="add-friend-form">
              <input
                type="text"
                placeholder="Enter Quick Code (e.g. 48593021)"
                value={friendCode}
                onChange={(e) => setFriendCode(e.target.value)}
                autoFocus
              />
              <button type="submit" className="send-request-btn">
                <FaUserPlus /> Send Request
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}