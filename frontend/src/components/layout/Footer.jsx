import React from "react";

const Footer = () => {
  return (
    <footer className="w-full h-[10%] bg-[#4caf50] text-white py-4">
      <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center">
        <p className="text-sm mb-2 sm:mb-0">
          © {new Date().getFullYear()} Bhaskar’s Finance Tracker — Made with ❤️
        </p>
        <div className="flex gap-4 text-sm">
          <a
            href="/about"
            className="hover:underline transition duration-150 ease-in-out"
          >
            About
          </a>
          <a
            href="https://github.com/bhaskar-sisodiya/finance-tracker/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline transition duration-150 ease-in-out"
          >
            GitHub
          </a>
          <a
            href="https://mail.google.com/mail/?view=cm&to=sisodiyabhaskar@gmail.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline transition duration-150 ease-in-out"
          >
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
