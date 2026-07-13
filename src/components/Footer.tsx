import Link from "next/link";
import Image from "next/image";
import { FaFacebookF, FaYoutube, FaTiktok, FaInstagram } from "react-icons/fa";
import { MdLocationOn, MdEmail, MdSchedule } from "react-icons/md";
import { getImageAlt, getImageTitle } from "@/lib/image-utils";
import { resolveArticleImageSrc } from "@/lib/asset-paths";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#1A1A1A] text-white pt-20 pb-10">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          {/* Column 1: Logo & Info */}
          <div className="space-y-6">
            <Image
              src={resolveArticleImageSrc("/assets/images/LOGO-DREAMLAB-1-white.webp")}
              alt="Dreamlab Logo"
              title={getImageTitle("/assets/images/LOGO-DREAMLAB-1-white.webp")}
              width={220}
              height={70}
              className="h-16 w-auto"
              unoptimized
            />
            <p className="text-gray-400 text-sm leading-relaxed">
              Dreamlab Cosmetics adalah manufaktur kosmetik berkualitas tinggi yang menggabungkan tren kecantikan Eropa dan Korea melalui konsep Natural Mix
            </p>
            <div className="flex space-x-3">
              {[
                { icon: <FaFacebookF />, link: "#" },
                { icon: <FaYoutube />, link: "#" },
                { icon: <FaTiktok />, link: "#" },
                { icon: <FaInstagram />, link: "#" },
              ].map((social, i) => (
                <Link 
                  key={i} 
                  href={social.link} 
                  className="w-9 h-9 rounded-md bg-white/10 flex items-center justify-center hover:bg-brand-orange hover:text-white transition-all text-white/80"
                >
                  {social.icon}
                </Link>
              ))}
            </div>
          </div>

          {/* Column 2: Cosmetics We Can Make */}
          <div>
            <h3 className="text-lg font-bold mb-8 text-brand-orange">Cosmetics We Can Make</h3>
            <ul className="space-y-3 text-sm text-gray-300">
              {[
                { name: "Maklon Skincare", link: "/pabrik-kosmetik" },
                { name: "Maklon Baby Care", link: "/maklon-baby-care" },
                { name: "Maklon Body Care", link: "/maklon-body-care" },
                { name: "Maklon Hair Care", link: "/produk/haircare" },
                { name: "Maklon Parfum", link: "/pabrik-parfum" },
                { name: "Maklon Decorative", link: "/maklon-decorative" },
                { name: "Maklon Foot Care", link: "/maklon-foot-care" }
              ].map((item, i) => (
                <li key={i} className="flex items-center space-x-2 group">
                  <span className="text-gray-500 group-hover:text-brand-orange transition-colors">›</span>
                  <Link href={item.link} className="hover:text-brand-orange transition-colors">{item.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Marketing Office */}
          <div>
            <h3 className="text-lg font-bold mb-8 text-brand-orange">Marketing Office</h3>
            <ul className="space-y-5 text-sm text-gray-300">
              <li className="flex items-start space-x-3">
                <span className="text-gray-500 mt-1">›</span>
                <span className="leading-relaxed">Jl. Dukuh Kupang Timur XX. No. 77B, Kec Sawahan, Kota Surabaya.</span>
              </li>
              <li className="flex items-center space-x-3">
                <span className="text-gray-500">›</span>
                <span className="lowercase">Official@dreamlab.id</span>
              </li>
              <li className="flex items-center space-x-3">
                <span className="text-gray-500">›</span>
                <Link href="#" className="hover:text-brand-orange transition-colors">Jadwalkan Pertemuan</Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Interesting Link */}
          <div>
            <h3 className="text-lg font-bold mb-8 text-brand-orange">Interesting Link</h3>
            <ul className="space-y-3 text-sm text-gray-300">
              {[
                { name: "Pabrik Kosmetik", link: "/pabrik-kosmetik" },
                { name: "Pabrik Parfum", link: "/pabrik-parfum" },
                { name: "Jasa Maklon Kosmetik", link: "/jasa-maklon-kosmetik" },
                { name: "Private Label", link: "/private-label-kosmetik" },
                { name: "Estimasi Biaya Maklon", link: "/estimasi-biaya-maklon-kosmetik" },
                { name: "About Dreamlab", link: "/about-us" },
                { name: "Services", link: "/services" },
                { name: "Panduan", link: "/panduan" },
                { name: "News & Blog", link: "/news-blog" },
                { name: "Contact Us", link: "/contact-us" },
              ].map((link, i) => (
                <li key={i} className="flex items-center space-x-2 group">
                  <span className="text-gray-500 group-hover:text-brand-orange transition-colors">›</span>
                  <Link href={link.link} className="hover:text-brand-orange transition-colors">{link.name}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="pt-10 border-t border-white/5 text-center">
          <p className="text-[11px] font-medium text-gray-500 tracking-wide uppercase">
            © PT Karya Impian Laboratoris (2021 - {currentYear}) @All Right Reserved
          </p>
        </div>
      </div>
    </footer>
  );
}
