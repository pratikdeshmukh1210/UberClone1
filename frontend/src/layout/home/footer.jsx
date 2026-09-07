import { FaLinkedin, FaYoutube, FaInstagram, FaTwitter, FaGlobe, FaMapMarkerAlt } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-black text-white px-6 md:px-16 lg:px-35 py-16">

      {/* Top */}
      <div className="max-w-7xl mx-auto">

        <h1 className="text-2xl font-bold mb-6">Uber</h1>

        <p className="mb-12 text-sm hover:underline cursor-pointer">
          Visit Help Center
        </p>

        {/* Links */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-10 text-sm">

          <div>
            <h3 className="font-bold mb-5">Company</h3>
            <ul className="space-y-2 text-gray-200">
              <li className="hover:text-white">About us</li>
              <li className="hover:text-white">Our offerings</li>
              <li className="hover:text-white">Newsroom</li>
              <li className="hover:text-white">Investors</li>
              <li className="hover:text-white">Blog</li>
              <li className="hover:text-white">Careers</li>
              <li className="hover:text-white">Uber One</li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-5">Products</h3>
            <ul className="space-y-2 text-gray-200">
              <li className="hover:text-white">Ride</li>
              <li className="hover:text-white">Drive</li>
              <li className="hover:text-white">Eat</li>
              <li className="hover:text-white">Uber for Business</li>
              <li className="hover:text-white">Uber Freight</li>
              <li className="hover:text-white">Gift cards</li>
              <li className="hover:text-white">Uber Health</li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-5">Global citizenship</h3>
            <ul className="space-y-2 text-gray-200">
              <li className="hover:text-white">Safety</li>
              <li className="hover:text-white">Sustainability</li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-5">Travel</h3>
            <ul className="space-y-2 text-gray-200">
              <li className="hover:text-white">Reserve</li>
              <li className="hover:text-white">Airports</li>
              <li className="hover:text-white">Cities</li>
            </ul>
          </div>

        </div>

        {/* Social + Apps */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mt-14 gap-6">

          <div className="flex gap-6 text-xl">
            <FaLinkedin className="cursor-pointer hover:text-gray-300" />
            <FaYoutube className="cursor-pointer hover:text-gray-300" />
            <FaInstagram className="cursor-pointer hover:text-gray-300" />
            <FaTwitter className="cursor-pointer hover:text-gray-300" />
          </div>

          <div className="flex gap-4">
            <img
              src="/en_badge_web_generic.webp"
              alt="Google Play"
              className="h-14 cursor-pointer"
            />
            <img
              src="/unnamed.png"
              alt="App Store"
              className="h-11 cursor-pointer"
            />
          </div>

        </div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mt-12 text-gray-400 text-sm gap-4">

          {/* Language + City */}
          <div className="flex gap-6 items-center">
            <div className="flex items-center gap-2 cursor-pointer hover:text-white">
              <FaGlobe />
              <span>English</span>
            </div>

            <div className="flex items-center gap-2 cursor-pointer hover:text-white">
              <FaMapMarkerAlt />
              <span>Gwalior</span>
            </div>
          </div>

          {/* Copyright */}
          <p>© 2026 Uber Technologies Inc.</p>

          {/* Links */}
          <div className="flex gap-6">
            <p className="hover:text-white cursor-pointer">Privacy</p>
            <p className="hover:text-white cursor-pointer">Accessibility</p>
            <p className="hover:text-white cursor-pointer">Terms</p>
          </div>

        </div>

      </div>
    </footer>
  );
}