import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom"; // 🌟 ضفنا useNavigate للتوجيه
import axiosInstance from "axios"; // استخدام الـ Instance الأساسي بتاعك لتجنب لغبطة الـ Imports
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import { Skeleton } from "@mui/material";
import { MdOutlineComputer } from "react-icons/md";
import { FaCheck } from "react-icons/fa"; // 🌟 استيراد أيقونة الصح للـ View
import Cookies from "js-cookie"; // 🌟 استيراد الكوكيز لقراءة التوكن
import toast from "react-hot-toast"; // 🌟 استيراد التوست للإشعارات
import "../Styles/GameDetails.css";

// استيراد ستايلات Swiper الأساسية
import "swiper/css";
import "swiper/css/pagination";

export default function GameDetails() {
  const { slug } = useParams();
  const navigate = useNavigate(); // 🌟 هاندلر التوجيه لصفحة الـ Wishlist
  const [game, setGame] = useState(null);
  const [moviesList, setMoviesList] = useState([]);
  const [activeVideoUrl, setActiveVideoUrl] = useState("");
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [mainImageUrl, setMainImageUrl] = useState("");
  const [isAdded, setIsAdded] = useState(false); // 🌟 State لمعرفة هل اللعبة في الـ Wishlist أم لا

  const swiperRef = useRef(null);
  const videoSwiperRef = useRef(null);
  const token = Cookies.get("token"); // 🌟 جلب التوكن الحقيقي للمستخدم

  useEffect(() => {
    if (!slug) return;
    let isMounted = true;

    async function fetchGameDetails() {
      try {
        setLoading(true);
        const cleanSlug = slug.trim().toLowerCase();

        // 1️⃣ جلب تفاصيل اللعبة من قاعدة البيانات الخاصة بك
        const response = await axiosInstance.get(
          `https://gamingplatform.somee.com/apiGames/game/details`,
          { params: { slug: cleanSlug } },
        );

        if (!isMounted) return;

        const gameData = response.data;
        setGame(gameData);
        if (gameData) {
          setMainImageUrl(gameData.backgroundImage);
        }

        // 2️⃣ 🌟 تشيك ومزامنة حالة الـ Wishlist للعبة دي بالذات
        if (token && gameData) {
          try {
            const resWishlist = await axiosInstance.get(
              "https://gamingplatform.somee.com/api/Users/wishlist",
              { headers: { Authorization: `Bearer ${token}` } },
            );
            // لو الـ ID بتاع اللعبة الحالية موجود في لستة اليوزر اقلب الـ State لـ true
            const exists = resWishlist.data.some(
              (item) => item.id === gameData.id,
            );
            setIsAdded(exists);
          } catch (wishError) {
            console.error("Error syncing wishlist state:", wishError);
          }
        }

        let rawgSlug = cleanSlug;
        if (rawgSlug === "the-witcher-3-wild-hunt") {
          rawgSlug = "the-witcher-3";
        }

        // 3️⃣ جلب التريلرات من API الخاص بـ RAWG
        const res = await axiosInstance.get(
          `https://api.rawg.io/api/games/${rawgSlug}/movies?key=098175706f194ba087d587d3e6b9303d`,
        );

        if (!isMounted) return;

        if (res.data?.results && res.data.results.length > 0) {
          setMoviesList(res.data.results);
          setActiveVideoUrl(res.data.results[0].data.max);
          setCurrentVideoIndex(0);
        } else {
          setMoviesList([]);
          setActiveVideoUrl("");
        }
      } catch (error) {
        console.error("Error fetching game details:", error.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchGameDetails();

    return () => {
      isMounted = false;
    };
  }, [slug, token]);

  // 🔥 🌟 دالة هاندلر الأكشن الموحدة للـ Wishlist داخل صفحة التفاصيل
  const handleWishlistAction = async () => {
    // 1. لو مضافة بالفعل -> حوله لصفحة الـ Wishlist علطول يشوفها هناك
    if (isAdded) {
      navigate("/wishlist");
      return;
    }

    // 2. لو مش مضافة -> تأكد من التوكن أولاً ثم اضرب API الإضافة
    if (!token) {
      toast.error("Please login first to add games to wishlist!");
      return;
    }

    try {
      const res = await axiosInstance.post(
        `https://gamingplatform.somee.com/api/Users/add-wishlist/game/${game.id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (res.status === 200 || res.status === 201) {
        toast.success(`Added ${game.name} to Wishlist!`);
        setIsAdded(true); // اقلب الزرار لـ View فوراً بشكل ديناميكي ديركت
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to add game to wishlist");
    }
  };

  const handleSlideChange = (swiper) => {
    if (!game || !game.screenshots || game.screenshots.length === 0) return;
    const activeIndex = swiper.realIndex;
    setCurrentImgIndex(activeIndex);
    if (game.screenshots[activeIndex]) {
      setMainImageUrl(game.screenshots[activeIndex].imageUrl);
    }
  };

  const handleVideoSlideChange = (swiper) => {
    if (moviesList.length === 0) return;
    const activeIndex = swiper.realIndex;
    setCurrentVideoIndex(activeIndex);
    if (moviesList[activeIndex]) {
      setActiveVideoUrl(moviesList[activeIndex].data.max);
    }
  };

  if (loading) {
    return (
      <div className="game-details-container loading-state">
        <Skeleton
          variant="rectangular"
          width="100%"
          height={400}
          sx={{ borderRadius: "15px", bgcolor: "#23052d" }}
        />
        <Skeleton
          variant="text"
          width="60%"
          height={60}
          sx={{ mt: 3, bgcolor: "#23052d" }}
        />
      </div>
    );
  }

  if (!game) return <div className="error-message">❌ Game not found!</div>;

  return (
    <div className="game-details-container">
      {/* الهيدر */}
      <div className="game-details-header">
        <h1>{game.name}</h1>
        <span className="game-genre-badge">{game.genre?.name || "Action"}</span>
      </div>

      {/* الجريد الرئيسي العلوي */}
      <div className="game-details-main">
        {/* الطرف الشمال: الميديا والصور */}
        <div className="game-media-section">
          <div className="game-gallery-wrapper">
            <div className="main-image-panel">
              <img
                src={mainImageUrl}
                alt={game.name}
                className="main-detail-img"
              />
            </div>

            <div className="swiper-slider-holder">
              <Swiper
                onSwiper={(swiper) => (swiperRef.current = swiper)}
                spaceBetween={10}
                loop={game.screenshots?.length > 1}
                grabCursor={true}
                autoplay={{ delay: 2000, disableOnInteraction: false }}
                speed={600}
                pagination={{ type: "fraction" }}
                modules={[Pagination, Autoplay]}
                className="mySwiper"
                onSlideChange={handleSlideChange}
                breakpoints={{
                  0: { slidesPerView: 2 },
                  480: { slidesPerView: 3 },
                  768: { slidesPerView: 4 },
                  1024: { slidesPerView: 5 },
                }}
              >
                {game.screenshots &&
                  game.screenshots.map((item, index) => (
                    <SwiperSlide key={index}>
                      <img
                        className={`thumb-nail-img ${currentImgIndex === index ? "active-glow" : ""}`}
                        src={item.imageUrl}
                        alt={`Screenshot ${index + 1}`}
                        onClick={() => {
                          setCurrentImgIndex(index);
                          setMainImageUrl(item.imageUrl);
                          if (swiperRef.current)
                            swiperRef.current.slideToLoop(index);
                        }}
                      />
                    </SwiperSlide>
                  ))}
              </Swiper>
            </div>
          </div>
        </div>

        {/* الطرف اليمين الرئيسي: كارت البيانات والشراء */}
        <div style={{ overflow: "hidden" }} className="game-info-sidebar">
          <div className="info-card-panel">
            <div className="price-tag">${game.price || "29.99"}</div>
            <button className="buy-now-btn">Buy Now</button>

            {/* 🌟 الزرار الذكي والديناميكي بناءً على حالة الـ Wishlist الحالية للعبة */}
            <button
              className={`add-to-wishlist-btn ${isAdded ? "already-added" : ""}`}
              onClick={handleWishlistAction}
            >
              {isAdded ? (
                <>
                  <FaCheck
                    style={{
                      marginRight: "6px",
                      display: "inline-block",
                      verticalAlign: "middle",
                    }}
                  />{" "}
                  View Wishlist
                </>
              ) : (
                "+ Add to Wishlist"
              )}
            </button>

            <div className="quick-meta-data">
              <div className="meta-item">
                <span className="meta-label">Released:</span>
                <span className="meta-value">
                  {game.released ? game.released.split("T")[0] : "N/A"}
                </span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Rating:</span>
                <span className="meta-value rating-star">
                  ⭐ {game.rating || "0"}
                </span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Reviews:</span>
                <span className="meta-value">
                  ({game.reviewsCount || "0"} votes)
                </span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Playtime:</span>
                <span className="meta-value">{game.playtime || "0"} hours</span>
              </div>
            </div>

            <div className="platforms-box">
              <p>Available on:</p>
              <div className="platform-icons">
                {game.parentPlatforms
                  ?.split(", ")
                  .filter(
                    (plat) =>
                      !plat.toLowerCase().includes("apple") &&
                      !plat.toLowerCase().includes("ios"),
                  )
                  .map((plat, idx) => (
                    <span
                      style={{
                        height: "fit-content",
                        textWrap: "nowrap",
                      }}
                      key={idx}
                      className="plat-badge"
                      title={plat}
                    >
                      {plat.trim() === "PC" ? <MdOutlineComputer /> : plat}
                    </span>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 🎬 سكشن التريلرات */}
      {moviesList.length > 0 && (
        <div className="game-trailers-section" style={{ marginTop: "40px" }}>
          <h2 className="section-title-text">
            Game Trailers ({moviesList.length})
          </h2>
          <hr
            className="section-divider"
            style={{ borderColor: "#441256", marginBottom: "20px" }}
          />

          <div className="main-video-player-box">
            <video
              key={activeVideoUrl}
              controls
              autoPlay
              muted
              loop
              width="100%"
              height="100%"
              style={{
                display: "block",
                objectFit: "cover",
                borderRadius: "12px",
              }}
            >
              <source src={activeVideoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>

          <div className="swiper-slider-holder" style={{ marginTop: "15px" }}>
            <Swiper
              onSwiper={(swiper) => (videoSwiperRef.current = swiper)}
              spaceBetween={10}
              loop={moviesList.length > 1}
              grabCursor={true}
              autoplay={{ delay: 3500, disableOnInteraction: false }}
              speed={600}
              className="myVideoSwiper"
              onSlideChange={handleVideoSlideChange}
              breakpoints={{
                0: { slidesPerView: 2 },
                480: { slidesPerView: 3 },
                768: { slidesPerView: 4 },
              }}
            >
              {moviesList.map((movie, index) => (
                <SwiperSlide key={movie.id || index}>
                  <div
                    className="video-thumb-container"
                    onClick={() => {
                      setCurrentVideoIndex(index);
                      setActiveVideoUrl(movie.data.max);
                      if (videoSwiperRef.current)
                        videoSwiperRef.current.slideToLoop(index);
                    }}
                  >
                    <img
                      src={movie.preview}
                      alt={movie.name}
                      className={`thumb-nail-img ${currentVideoIndex === index ? "active-glow" : ""}`}
                    />
                    <div className="video-thumb-overlay">
                      ▶{" "}
                      {movie.name.length > 15
                        ? movie.name.substring(0, 15) + "..."
                        : movie.name}
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      )}

      {/* 📝 سكشن الوصف */}
      <div className="game-description-section" style={{ marginTop: "40px" }}>
        <h2>About the Game</h2>
        <hr
          className="section-divider"
          style={{ borderColor: "#441256", marginBottom: "20px" }}
        />
        <p className="game-full-description" style={{ whiteSpace: "pre-line" }}>
          {game.description}
        </p>
      </div>

      {/* 🖥️ سكشن مواصفات التشغيل */}
      <div className="game-specs-section" style={{ marginTop: "40px" }}>
        <h2>System Requirements</h2>
        <hr
          className="section-divider"
          style={{ borderColor: "#441256", marginBottom: "20px" }}
        />

        {(() => {
          const hasMinSpecs =
            game.systemRequirements &&
            game.systemRequirements.minimumCPU &&
            game.systemRequirements.minimumCPU !== "N/A";

          const hasRecSpecs =
            game.systemRequirements &&
            game.systemRequirements.recommendedCPU &&
            game.systemRequirements.recommendedCPU !== "N/A";

          const defaultMinimum = `OS: Windows 10 (64-bit)\nProcessor: Intel Core i5-6600K / AMD FX-6300\nMemory: 8 GB RAM\nGraphics: NVIDIA GeForce GTX 760 / AMD Radeon R9 280\nDirectX: Version 11\nStorage: 50 GB available space\nSound Card: DirectX compatible`;
          const defaultRecommended = `OS: Windows 10 / 11 (64-bit)\nProcessor: Intel Core i7-8700K / AMD Ryzen 5 3600\nMemory: 16 GB RAM\nGraphics: NVIDIA GeForce GTX 1060 6GB / AMD Radeon RX 580\nDirectX: Version 12\nStorage: 50 GB SSD available space\nSound Card: DirectX 12 compatible`;

          const finalMinText = hasMinSpecs
            ? game.systemRequirements.minimumCPU
            : defaultMinimum;
          const finalRecText = hasRecSpecs
            ? game.systemRequirements.recommendedCPU
            : defaultRecommended;

          const cleanMin = finalMinText
            .split(/Additional Notes:|Other requirements:/i)[0]
            .replace("Minimum:\n", "");
          const cleanRec = finalRecText
            .split(/Additional Notes:|Other requirements:/i)[0]
            .replace("Recommended:\n", "");

          return (
            <div
              className="specs-display-box"
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "30px",
              }}
            >
              <div className="min-specs-block">
                <h3 style={{ color: "#ff007f", marginBottom: "15px" }}>
                  Minimum Requirements:{" "}
                  {!hasMinSpecs && (
                    <span
                      style={{
                        fontSize: "12px",
                        color: "#bbb",
                        fontWeight: "normal",
                      }}
                    >
                      (Estimated)
                    </span>
                  )}
                </h3>
                <div
                  style={{
                    color: "#e0e0e0",
                    lineHeight: "1.8",
                    background: "#23052d",
                    padding: "25px",
                    borderRadius: "12px",
                    fontSize: "15px",
                    border: "1px solid #441256",
                  }}
                >
                  {cleanMin
                    .split(
                      /(?=OS:|Processor:|Memory:|Graphics:|DirectX®:|DirectX:|Hard Drive:|Storage:|Sound Card:)/g,
                    )
                    .map((line, index) => (
                      <div
                        key={index}
                        style={{
                          marginBottom: "8px",
                          borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
                          paddingBottom: "4px",
                        }}
                      >
                        {line}
                      </div>
                    ))}
                </div>
              </div>

              <div className="rec-specs-block">
                <h3 style={{ color: "#00f0ff", marginBottom: "15px" }}>
                  Recommended Requirements:{" "}
                  {!hasRecSpecs && (
                    <span
                      style={{
                        fontSize: "12px",
                        color: "#bbb",
                        fontWeight: "normal",
                      }}
                    >
                      (Estimated)
                    </span>
                  )}
                </h3>
                <div
                  style={{
                    color: "#e0e0e0",
                    lineHeight: "1.8",
                    background: "#23052d",
                    padding: "25px",
                    borderRadius: "12px",
                    fontSize: "15px",
                    border: "1px solid #441256",
                  }}
                >
                  {cleanRec
                    .split(
                      /(?=OS:|Processor:|Memory:|Graphics:|DirectX®:|DirectX:|Hard Drive:|Storage:|Sound Card:)/g,
                    )
                    .map((line, index) => (
                      <div
                        key={index}
                        style={{
                          marginBottom: "8px",
                          borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
                          paddingBottom: "4px",
                        }}
                      >
                        {line}
                      </div>
                    ))}
                </div>
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
}
