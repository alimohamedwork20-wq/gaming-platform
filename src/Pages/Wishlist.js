import React, { useState, useEffect } from "react";
import "../Styles/Wishlist.css"; // استيراد ملف الستايل
import { FaTrashAlt, FaShoppingCart, FaGamepad } from "react-icons/fa";
import { Link } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

export default function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const [handelDelete, setHandelDelete] = useState(1);

  // 🔄 جلب البيانات من الباك إند
  useEffect(() => {
    async function GetWishlist() {
      try {
        setLoading(true); // تشغيل الـ Loading
        const token = Cookies.get("token");
        if (!token) {
          toast.error("Please login first");
          return;
        }

        const res = await axios.get(
          "https://gamingplatform.somee.com/api/Users/wishlist",
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        setWishlist(res.data); // وضع الألعاب في الـ State
      } catch (err) {
        console.error(err);
        toast.error("Failed to load wishlist");
      } finally {
        setLoading(false); // إيقاف الـ Loading
      }
    }
    GetWishlist();
  }, [handelDelete]);

  // 🗑️ ميثود الحذف بـ HttpDelete
  const RemoveWishlistItem = async (idGame) => {
    try {
      const token = Cookies.get("token");
      const res = await axios.delete(
        `https://gamingplatform.somee.com/api/Users/delete-wishlist/game/${idGame}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (res.status === 200) {
        toast.success("Game removed successfully");
        setHandelDelete((prev) => prev + 1); // عمل ريفريش تلقائي
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred during removal");
    }
  };

  // شاشة التحميل
  if (loading)
    return <div className="wishlist-loading">Loading your wishlist...</div>;

  return (
    <div className="wishlist-page-container">
      <div className="wishlist-header">
        <h1 className="wishlist-title">My Wishlist</h1>
        <span className="wishlist-count">
          {wishlist.length} Games Saved{" "}
          {/* ✅ الحساب من الـ wishlist الحقيقية */}
        </span>
      </div>

      <hr className="wishlist-divider" />

      {/* ✅ التشيك هنا بقا على الـ wishlist المباشرة عشان نضمن الداتا تظهر */}
      {wishlist.length > 0 ? (
        <div className="wishlist-list">
          {wishlist.map((game) => (
            <div key={game.id} className="wishlist-row-card">
              {/* 📸 صورة اللعبة */}
              <div className="wishlist-img-wrapper">
                <img src={game.backgroundImage} alt={game.name} />
              </div>

              {/* 📝 تفاصيل اللعبة */}
              <div className="wishlist-info-block">
                <Link
                  to={`/game/details/${game.slug}`}
                  className="wishlist-game-name"
                >
                  {game.name}
                </Link>
                <div className="wishlist-game-meta">
                  <span>⭐ {game.rating}</span>
                  <span className="stock-status">Available</span>
                </div>
              </div>

              {/* 💰 السعر */}
              <div className="wishlist-price-block">
                <span className="wishlist-price">${game.price}</span>
              </div>

              {/* 🛠️ أزرار التحكم */}
              <div className="wishlist-actions-block">
                <button
                  className="wishlist-btn-add-to-cart"
                  title="Add to Cart"
                >
                  <FaShoppingCart /> <span>Add to Cart</span>
                </button>
                <button
                  onClick={() => RemoveWishlistItem(game.id)}
                  className="wishlist-btn-remove"
                  title="Remove from Wishlist"
                >
                  <FaTrashAlt />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* 🌌 شكل احترافي لو القائمة فاضية فعلاً في الداتابيز */
        <div className="wishlist-empty-state">
          <FaGamepad className="empty-icon" />
          <h2>Your Wishlist is Empty</h2>
          <p>You haven't added any games to your wishlist yet.</p>
          <Link to="/games" className="back-to-shop-btn">
            Browse Games
          </Link>
        </div>
      )}
    </div>
  );
}
