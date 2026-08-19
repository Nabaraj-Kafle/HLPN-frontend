import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router';
import logo from '../../../public/logo.png';


export function Footer() {
  return (
    <footer className="bg-[#111827] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center mb-4">
              <img src={logo} alt="Logo" className="w-16 h-16 object-cover " />
              {/* <span className="text-xl font-bold">Himalayan Local Product Nepal</span> */}
            </div>
            <p className="text-white/70 mb-4 leading-relaxed">
              Your trusted marketplace for quality products, great deals, and exceptional service.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://www.facebook.com/share/1BU76Pn3vc/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 hover:bg-[#16A34A] rounded-full flex items-center justify-center transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://www.x.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 hover:bg-[#16A34A] rounded-full flex items-center justify-center transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 hover:bg-[#16A34A] rounded-full flex items-center justify-center transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://www.youtube.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 hover:bg-[#16A34A] rounded-full flex items-center justify-center transition-colors"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-white/70 hover:text-[#16A34A] transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-white/70 hover:text-[#16A34A] transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-white/70 hover:text-[#16A34A] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-white/70 hover:text-[#16A34A] transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/becomevendor" className="text-white/70 hover:text-[#16A34A] transition-colors">
                  Become a Vendor
                </Link>
              </li>
            </ul>
          </div>


          {/* Customer Service */}
          <div>
            <h3 className="font-semibold mb-4">Customer Service</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-white/70 hover:text-[#16A34A] transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-white/70 hover:text-[#16A34A] transition-colors">
                  Track Order
                </a>
              </li>
              <li>
                <a href="#" className="text-white/70 hover:text-[#16A34A] transition-colors">
                  Returns & Refunds
                </a>
              </li>
              <li>
                <a href="#" className="text-white/70 hover:text-[#16A34A] transition-colors">
                  Payment Methods
                </a>
              </li>
              <li>
                <a href="/contact#faq" className="text-white/70 hover:text-[#16A34A] transition-colors">
                  FAQs
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-white/70">
                <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>Naya Thimi, Bhaktapur, Nepal</span>
              </li>
              <li className="flex items-center gap-3 text-white/70">
                <Phone className="w-5 h-5 flex-shrink-0" />
                <a href="tel:984101016554" className="hover:text-[#16A34A] transition-colors">
                  9841010165
                </a>
              </li>
              <li className="flex items-center gap-3 text-white/70">
                <Mail className="w-5 h-5 flex-shrink-0" />
                <a href="mailto:buyourlocalnepal@gmail.com" className="hover:text-[#16A34A] transition-colors">
                  buyourlocalnepal@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-white/70 text-sm text-center md:text-left">
              © 2026 Himalayan Local Product Nepal. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link to="/privacy" className="text-white/70 hover:text-[#16A34A] text-sm transition-colors">
                Privacy
              </Link>
              <Link to="/terms" className="text-white/70 hover:text-[#16A34A] text-sm transition-colors">
                Terms
              </Link>
              <a href="#" className="text-white/70 hover:text-[#16A34A] text-sm transition-colors">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
