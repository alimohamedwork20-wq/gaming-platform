import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../Styles/Category.css"; 
import { Skeleton } from "@mui/material";
export default function CategoryPage() {
  const navigate = useNavigate();

  // مصفوفة الكاتيجوري بالصور الجيمينج الحقيقية والـ Classes الخاصة بالـ CSS
  const categories = [
    {
      id: 1,
      name: "Action",
      slug: "action",
      games_count: 45230,
      image:
        "https://upload.wikimedia.org/wikipedia/en/e/ee/God_of_War_Ragnar%C3%B6k_cover.jpg", // كراتوس / أكشن سينمائي
      styleClass: "card-action",
    },
    {
      id: 2,
      name: "RPG",
      slug: "role-playing-games-rpg",
      games_count: 21115,
      image:
        "https://www.svg.com/img/gallery/we-finally-understand-the-entire-story-for-the-witcher-games/intro-1570837857.jpg", // ألعاب تقمص أدوار / عالم مفتوح
      styleClass: "card-rpg",
    },
    {
      id: 3,
      name: "Adventure",
      slug: "adventure",
      games_count: 32450,
      image:
        "https://store-images.s-microsoft.com/image/apps.46694.68182501197884443.ac728a87-7bc1-4a0d-8bc6-0712072da93c.f150105c-bb41-4bc6-bd72-2a7c63df9f90?q=90&w=177&h=177", // مغامرات واستكشاف
      styleClass: "card-adventure",
    },
    {
      id: 5,
      name: "Racing",
      slug: "racing",
      games_count: 8530,
      image:
        "https://gaming-cdn.com/images/products/1129/616x353/need-for-speed-xbox-one-game-microsoft-store-europe-cover.jpg?v=1730907470", // سيارات رياضية سريعة
      styleClass: "card-racing",
    },
    {
      id: 6,
      name: "Sports",
      slug: "sports",
      games_count: 15420,
      image:
        "https://m.media-amazon.com/images/M/MV5BZWVjODJiMGQtZGViYS00ZDc0LWIxNDctYTc1NWJjYzA1M2EzXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", // كرة قدم ورياضة حماسية
      styleClass: "card-sports",
    },
    {
      id: 7,
      name: "Simulation",
      slug: "simulation",
      games_count: 19600,
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjkPWgcgh3GJEtGndseQj620cD_ZlAykjrHQ&s", // محاكاة و تكنولوجيا شاشات
      styleClass: "card-simulation",
    },
    {
      id: 8,
      name: "Puzzle",
      slug: "puzzle",
      games_count: 5410,
      image:
        "https://upload.wikimedia.org/wikipedia/en/thumb/f/f9/Portal2cover.jpg/250px-Portal2cover.jpg", // ألعاب ذكاء وتفكير
      styleClass: "card-puzzle",
    },
    {
      id: 9,
      name: "Fighting",
      slug: "fighting",
      games_count: 8410,
      image:
        "https://upload.wikimedia.org/wikipedia/en/1/1f/Mortal_Kombat_box_art.png", // ألعاب ذكاء وتفكير
      styleClass: "card-action",
    },
    {
      id: 10,
      name: "Arcade",
      slug: "arcade",
      games_count: 12150,
      image:
        "https://upload.wikimedia.org/wikipedia/en/c/cc/Hades_cover_art.jpg", // ألعاب ذكاء وتفكير
      styleClass: "card-rpg",
    },
    {
      id: 11,
      name: "Shooter",
      slug: "shooter",
      games_count: 9570,
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZyCIMCh0WP5WxW-9rpj762fPu-HJuCM-XiQ&s", // ألعاب ذكاء وتفكير
      styleClass: "card-horror",
    },
    {
      id: 12,
      name: "Strategy",
      slug: "strategy",
      games_count: 5470,
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSdOMwS9hbuFMdryDqaPhRkZ8YOCuWMY-edRQ&s", // ألعاب ذكاء وتفكير
      styleClass: "card-racing",
    },
  ];

  return (
    <div className="category-container">
      <div className="mb-10">
        <h1 className="category-title">Game Categories</h1>
      </div>

      <div className="category-grid">
        {categories.map((cat) => (
          <div
            key={cat.id}
            onClick={() => navigate(`/games/${cat.slug}`)}
            className={`category-card ${cat.styleClass}`}
          >
            {/* الصورة الجيمينج السينمائية */}
            <img src={cat.image} alt={cat.name} loading="lazy" />

            {/* الداتا المكتوبة فوق الكارت */}
            <Link to={cat.slug}>
              <div className="category-card-overlay">
                <h2>{cat.name}</h2>
                <p>{cat.games_count.toLocaleString()} Games</p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>

  );
}
