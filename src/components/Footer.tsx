export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-red-500 font-bold text-xl mb-4">VIRAL RAJA</h3>
            <p className="text-sm">
              The ultimate destination for premium video content.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-red-400 transition">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-red-400 transition">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-red-400 transition">
                  DMCA Policy
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-red-400 transition">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-red-400 transition">
                  Contact
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-red-400 transition">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Disclaimer</h4>
            <p className="text-sm">
              This site is intended for adults only. By using this site, you confirm that you are 18 years or older.
            </p>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-sm">
          <p>&copy; 2026 Viral Raja. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
