import React, { useState, useRef, useEffect } from "react";
import "../Styles/Games.css";
import axios from "axios";
import {
  FaWindows,
  FaPlaystation,
  FaXbox,
  FaApple,
  FaLinux,
  FaGamepad,
  FaSearch,
  FaCheck, // استيراد أيقونة الصح للـ View
} from "react-icons/fa";
import { MdOutlineComputer } from "react-icons/md";
import {
  Pagination,
  Typography,
  ThemeProvider,
  createTheme,
  Skeleton,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

const platformIcons = {
  pc: <FaWindows title="PC" />,
  playstation: <FaPlaystation title="PlayStation" />,
  xbox: <FaXbox title="Xbox" />,
  nintendo: <FaGamepad title="Nintendo" />,
  mac: <FaApple title="Mac" />,
  linux: <FaLinux title="Linux" />,
};

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#ff4500",
    },
  },
});

export default function Games() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [favGameIds, setFavGameIds] = useState([]); // 🌟 لستة الـ IDs الحقيقية من الباك إند

  const pageSize = 21;
  const token = Cookies.get("token");

  // 🔄 جلب الألعاب ومزامنة الـ Wishlist
  useEffect(() => {
    const getAllGames = async () => {
      try {
        setLoading(true);

        // أ. جلب الألعاب بناءً على الصفحة والبحث
        const res = await axios.get(
          `https://gamingplatform.somee.com/apiGames/all?page=${page}&pageSize=${pageSize}&search=${searchTerm}`,
        );

        if (res.data?.results) {
          setGames(res.data.results);
          if (res.data.count) {
            setTotalPages(Math.ceil(res.data.count / pageSize));
          }
        } else {
          setGames(res.data);
        }

        // ب. جلب الـ Wishlist عشان نعرف إيه اللي مضاف وإيه لأ
        if (token) {
          const resWishlist = await axios.get(
            "https://gamingplatform.somee.com/api/Users/wishlist",
            {
              headers: { Authorization: `Bearer ${token}` },
            },
          );
          const ids = resWishlist.data.map((game) => game.id);
          setFavGameIds(ids);
        }
      } catch (error) {
        console.error("خطأ أثناء جلب البيانات:", error);
      } finally {
        setLoading(false);
      }
    };

    getAllGames();

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [page, searchTerm, token]);

  const handlePageChange = (_, value) => {
    setPage(value);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };

  // ➕ دالة الإضافة لايف من برة الكارت عشان نحدث الـ State العامة للصفحة
  const onAddGameSuccess = (gameId) => {
    setFavGameIds((prev) => [...prev, gameId]);
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <div className="games-page-container">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h1 className="games-page-title">Trending Games</h1>
          <div className="search">
            <input
              value={searchTerm}
              onChange={handleSearchChange}
              type="text"
              placeholder="Search games..."
            />
            <FaSearch className="icons" />
          </div>
        </div>

        <div className="games-grid">
          {loading ? (
            Array.from({ length: pageSize }).map((_, index) => (
              <div key={index} className="game-preview-card">
                <Skeleton
                  variant="rounded"
                  width="100%"
                  height={220}
                  sx={{ borderRadius: "12px" }}
                />
                <div style={{ padding: "12px" }}>
                  <Skeleton width="80%" height={30} />
                  <Skeleton width="50%" height={20} />
                  <Skeleton width="70%" height={20} />
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginTop: "15px",
                    }}
                  >
                    <Skeleton width={80} height={25} />
                    <Skeleton width={100} height={35} />
                  </div>
                </div>
              </div>
            ))
          ) : games.length > 0 ? (
            games.map((item) => (
              <GameCardKeyed
                key={item.id}
                game={item}
                isAdded={favGameIds.includes(item.id)} // 👈 بنشيك لو مضاف فعلاً
                onAddSuccess={onAddGameSuccess} // 👈 بنباصي دالة التحديث
              />
            ))
          ) : (
            <div
              className="text-slate-400 p-6"
              style={{
                gridColumn: "1 / -1",
                textAlign: "center",
                color: "#aaa",
              }}
            >
              ❌ No games found matching your search.
            </div>
          )}
        </div>

        <div
          className="pagination-wrapper"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginTop: "40px",
            gap: "10px",
          }}
        >
          <Typography sx={{ color: "#aaa" }}>Page: {page}</Typography>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            size="large"
          />
        </div>
      </div>
    </ThemeProvider>
  );
}

// 🃏 كامبوننت الكارت المنفصل
function GameCardKeyed({ game, isAdded, onAddSuccess }) {
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const intervalRef = useRef(null);
  const navigate = useNavigate(); // 🌟 للتوجيه لصفحة الـ wishlist

  const gameScreenshots =
    game.screenshots?.length > 0
      ? game.screenshots.map((s) => s.imageUrl)
      : [game.backgroundImage || "https://via.placeholder.com/600/400"];

  const handleMouseEnter = () => {
    if (gameScreenshots.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentImgIndex(
          (prevIndex) => (prevIndex + 1) % gameScreenshots.length,
        );
      }, 1300);
    }
  };

  const handleMouseLeave = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setCurrentImgIndex(0);
  };

  // 🔥 دالة التعامل مع ضغطة الزرار
  const handleWishlistAction = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    // 1. لو اللعبة مضافة بالفعل -> واديه لصفحة الـ Wishlist علطول
    if (isAdded) {
      navigate("/wishlist"); // تأكد إن ده نفس الـ Route عندك في App.js
      return;
    }

    // 2. لو مش مضافة -> اطلب توكن واعمل نداء الـ Post للباك إند
    const token = Cookies.get("token");
    if (!token) {
      toast.error("Please login first to add games to wishlist!");
      return;
    }

    try {
      const res = await axios.post(
        `https://gamingplatform.somee.com/api/Users/add-wishlist/game/${game.id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (res.status === 200 || res.status === 201) {
        toast.success(`Added ${game.name} to Wishlist!`);
        onAddSuccess(game.id); // تحديث الـ State فوراً عشان الزرار يقلب "View"
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to add game to wishlist");
    }
  };

  return (
    <Link
      style={{ color: "white", textDecoration: "none" }}
      to={`/game/details/${game.slug}`}
    >
      <div
        className="game-preview-card"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="game-card-img-wrapper">
          <img src={gameScreenshots[currentImgIndex]} alt={game.name} />
        </div>

        <div className="game-card-content">
          <div className="game-card-header">
            <h3 title={game.name}>{game.name}</h3>
            <div className="game-hover-details">
              <span>
                📅 {game.released ? game.released.split("T")[0] : "N/A"}
              </span>
              <span style={{ color: "#f59e0b", fontWeight: "bold" }}>
                ⭐ {game.rating || "0"}
              </span>
            </div>
          </div>

          <div className="game-card-footer">
            <div className="platform-icons-container">
              {game.parentPlatforms ? (
                game.parentPlatforms
                  .split(", ")
                  .filter((p) => p.trim() !== "Apple Macintosh")
                  .map((platformName, index) => {
                    const slug = platformName.trim().toLowerCase();
                    return (
                      <span
                        key={index}
                        className="platform-icon-item"
                        title={platformName}
                      >
                        {platformIcons[slug] || platformIcons[platformName] || (
                          <MdOutlineComputer />
                        )}
                      </span>
                    );
                  })
              ) : (
                <span className="platform-icon-item">
                  <MdOutlineComputer />
                </span>
              )}
            </div>

            {/* 🌟 الزرار الديناميكي الذكي هنا */}
            <button
              className={`wishlist-add-btn ${isAdded ? "already-added" : ""}`}
              onClick={handleWishlistAction}
            >
              {isAdded ? (
                <>
                  <FaCheck style={{ marginRight: "4px" }} /> View Wishlist
                </>
              ) : (
                "+ Wishlist"
              )}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
