import { motion } from "framer-motion";
import { C, display, body } from "../theme";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.75,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      delay: i * 0.12,
    },
  }),
};

export default function SOPPage() {
  return (
    <div style={{ ...body, backgroundColor: C.paper50, color: C.ink900 }} className="min-h-screen flex flex-col">
      <Navbar activeSection="sop" />
      <main className="flex-1 max-w-4xl mx-auto px-5 sm:px-8 py-16 sm:py-20 w-full">
        <motion.h1
          className="text-3xl sm:text-4xl font-semibold mb-4"
          style={{ ...display, color: C.navy900 }}
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-8%" }}
          custom={0}
        >
          SOP
        </motion.h1>
        <motion.p
          className="text-base leading-relaxed"
          style={{ color: C.ink500 }}
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-8%" }}
          custom={1}
        >
          Halaman SOP — konten akan ditambahkan di sini.
        </motion.p>
      </main>
      <Footer />
    </div>
  );
}
