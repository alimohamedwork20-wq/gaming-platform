import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { IoIosAddCircle, IoIosRemoveCircle } from "react-icons/io";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "../Styles/slider.css";
import axios from "axios";
import { Skeleton } from "@mui/material";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import Cookies from "js-cookie";

export default function Slider1(props) {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]); // بديل الـ LocalStorage القديم
  const API_BASE_URL = process.env.REACT_APP_API_URL;
  // 🔄 1. جلب بيانات السلايدر والـ Wishlists معاً عند تحميل المكون
  useEffect(() => {
    async function InitSliderData() {
      try {
        setLoading(true);
        const token = Cookies.get("token");

        // أ. جلب الألعاب الخاصة بالسلايدر من الـ API
        const resGames = await axios.get(
          `${API_BASE_URL}Games/all?${props.url}`,
        );
        if (resGames.data && resGames.data.results) {
          setGames(resGames.data.results);
        } else {
          setGames(resGames.data);
        }

        // ب. مزامنة الـ Wishlist الحقيقية من الداتابيز لتفتيح الأزرار (+ أو -) صح
        if (token) {
          const resWishlist = await axios.get(
            `${API_BASE_URL}/Users/wishlist`,
            {
              headers: { Authorization: `Bearer ${token}` },
            },
          );

          // استخراج الـ IDs فقط من كائنات الألعاب الراجعة لتخزينها في الـ favorites
          const favIds = resWishlist.data.map((game) => game.id);
          setFavorites(favIds);
        }
      } catch (error) {
        console.error("Error initializing slider data:", error);
      } finally {
        setLoading(false);
      }
    }

    InitSliderData();
  }, [props.url, props.platform]);

  // دالة لتظبيط حجم وأبعاد الصور الراجعة
  const getOptimizedImage = (url) => {
    if (!url) return "https://via.placeholder.com/600/400";
    return url.replace("/media/games/", "/media/crop/600/400/games/");
  };

  // ➕ 2. ميثود إضافة اللعبة للـ Wishlist (تتعامل مع الـ SQL Server)
  const handleAddGame = async (gameId) => {
    const token = Cookies.get("token");
    if (!token) {
      toast.error("Please login first to add games to wishlist!");
      return;
    }
    try {
      await axios.post(
        `${API_BASE_URL}/Users/add-wishlist/game/${gameId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );

      // تحديث الـ state فوراً في الفرونت لينور الزرار باللون الأحمر
      setFavorites((prev) => [...prev, gameId]);
      toast.success("Added to wishlist!");
    } catch (err) {
      console.error("Error adding game:", err);
      toast.error("Failed to add game");
    }
  };

  // 🗑️ 3. ميثود حذف اللعبة بـ HttpDelete (تتعامل مع الـ SQL Server وتمنع الـ 400)
  const handleRemoveGame = async (gameId) => {
    const token = Cookies.get("token");
    if (!token) return;

    try {
      await axios.delete(
        `${API_BASE_URL}/Users/delete-wishlist/game/${gameId}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      // حذف الـ ID من الـ state فوراً ليتحول الزرار لعلامة (+) الخضراء بدون ريفريش
      setFavorites((prev) => prev.filter((id) => id !== gameId));
      toast.success("Removed from wishlist!");
    } catch (err) {
      console.error("Error removing game:", err);
      toast.error("Failed to remove game");
    }
  };

  return (
    <div className="slider1">
      <h1 className="text-xl font-bold mb-4 text-white">{props.title}</h1>

      <Swiper
        spaceBetween={20}
        loop={true}
        grabCursor={true}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        speed={900}
        pagination={{ type: "fraction" }}
        modules={[Pagination, Autoplay]}
        className="mySwiper"
        breakpoints={{
          0: { slidesPerView: 1 },
          640: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 4 },
          1440: { slidesPerView: 5 },
        }}
      >
        {loading
          ? Array.from({ length: 8 }).map((_, index) => (
              <SwiperSlide key={index}>
                <div className="card">
                  <Skeleton
                    variant="rounded"
                    width="100%"
                    height={250}
                    sx={{ borderRadius: "12px" }}
                  />
                  <Skeleton
                    variant="text"
                    width="80%"
                    height={35}
                    sx={{ mt: 1 }}
                  />
                </div>
              </SwiperSlide>
            ))
          : games.map((item, index) => {
              // التحقق الدقيق من وجود معرف اللعبة داخل مصفوفة المفضلات النظيفة
              const isFav = favorites.includes(item.id);

              return (
                <SwiperSlide key={item.id || index}>
                  <div className="card">
                    <div className="cover-img">
                      {isFav ? (
                        <IoIosRemoveCircle
                          className="icon-add active"
                          onClick={() => handleRemoveGame(item.id)} // حذف مباشر لايف من الداتابيز
                        />
                      ) : (
                        <IoIosAddCircle
                          className="icon-add"
                          onClick={() => handleAddGame(item.id)} // إضافة مباشرة لايف للداتابيز
                        />
                      )}

                      <img
                        src={getOptimizedImage(item.backgroundImage)}
                        alt={item.name}
                        className="img-game"
                        loading="lazy"
                      />

                      <div className="overlay-img"></div>
                    </div>

                    <Link
                      style={{ color: "white", textDecoration: "none" }}
                      to={`/game/details/${item.slug}`}
                    >
                      <p className="name-game">{item.name}</p>
                    </Link>
                  </div>
                </SwiperSlide>
              );
            })}
      </Swiper>
    </div>
  );
}
