// Nav.tsx
import React from "react";
import Link from "next/link";

const links = [
  { href: "/", title: "Home" },
  { href: "/leaderboard", title: "Leaderboard" },
  { href: "/us", title: "Us" },
];

export default function Nav() {
  return (
    <nav className="bg-white shadow-md fixed z-10 w-full h-16 flex items-center justify-between border-b border-border dark:border-dark-secondary">
      <h1 className="text-black ml-4 text-2xl font-semibold tracking-wide dark:text-foreground">
        Leetcode Among us
      </h1>
      <div className="mr-4">
        <ul className="flex items-center space-x-4">
          {links.map((link, index) => (
            <li key={index}>
              <Link
                href={link.href}
                className="text-black font-medium hover:text-gray-700 transition duration-300 dark:text-foreground dark:hover:text-gray-300"
              >
                {link.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
