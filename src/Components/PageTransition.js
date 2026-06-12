import React from "react";
import { motion } from "framer-motion";

// إعدادات الحركة: تأثير الـ Fade In والـ Slide الخفيف من تحت لفوق روقان
const pageVariants = {
  initial: {
    opacity: 0,
    y: 15, // بيبدأ نازل تحت شوية صغار
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.2, // وقت الأنميشن (أقل من نصف ثانية عشان ميبقاش ممل)
      ease: "easeInOut",
    },
  },
  exit: {
    opacity: 0,
    y: -15, // وهو ماشي بيطلع لفوق ويختفي
    transition: {
      duration: 0.2,
      ease: "easeInOut",
    },
  },
};

export default function PageTransition({ children }) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      style={{ width: "100%", height: "100%" }} // للحفاظ على أبعاد صفحتك الأصلية
    >
      {children}
    </motion.div>
  );
}