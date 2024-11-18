"use client";
import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import Image from "next/image";
import Link from 'next/link';
import { LayoutGrid, PiggyBank, ReceiptText, ShieldCheck } from 'lucide-react';
import { UserButton } from '@clerk/nextjs';

export default function SideNav() {
  const menuList = [
    { id: 1, name: 'Dashboard', icon: LayoutGrid, path: '/dashboard' },
    { id: 2, name: 'Budgets', icon: PiggyBank, path: '/dashboard/budgets' },
    { id: 3, name: 'Expenses', icon: ReceiptText, path: '/dashboard/expenses' },
    { id: 4, name: 'Help', icon: ShieldCheck, path: '/dashboard/Help' },
  ];

  const path = usePathname();
  const [hoveredId, setHoveredId] = useState();

  useEffect(() => {
    console.log(path);
  }, [path]);

  return (
    <div className="h-screen bg-gradient-to-b from-black via-gray-900 to-gray-950 flex flex-col justify-between p-5">
      {/* Logo */}
      <div className="flex justify-center items-center mb-5">
        <Link href="/" className="items-center">
          <Image src={'/logo.png'} alt="logo" width={80} height={80} className="cursor-pointer" />
        </Link>
      </div>

      {/* Sidebar Menu */}
      <div className="flex-grow mt-10 space-y-2">
        {menuList.map((menu) => (
          <Link key={menu.id} href={menu.path}>
            <h2
              className={`flex gap-2 items-center font-medium p-5 cursor-pointer rounded-md transition duration-200 
                ${
                  path === menu.path
                    ? 'bg-blue-500 text-white' // Active tab: blue background and white text
                    : 'text-blue-500 hover:text-white hover:bg-blue-500' // Inactive tab: blue text, white text on hover
                }`}
              onMouseEnter={() => setHoveredId(menu.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <menu.icon />
              {menu.name}
            </h2>
          </Link>
        ))}
      </div>

      {/* Bottom Section */}
      <div className="mt-auto">
        <UserButton afterSignOutUrl="/" />
      </div>
    </div>
  );
}
