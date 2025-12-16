/**
 * Header Component
 * Main site header with logo, navigation, search, and cart
 * Client component - contains interactive elements
 */

'use client';

import Link from 'next/link';
import { Search, User, LogIn, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CartIcon } from './cart-icon';
import { MobileNav } from './mobile-nav';
import { UserMenu } from './user-menu';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Mobile Menu */}
        <div className="flex items-center gap-2 md:hidden">
          <MobileNav />
        </div>

        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <span className="text-lg font-bold">P</span>
          </div>
          <span className="hidden text-xl font-bold text-primary sm:inline-block">
            PharmaLine
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex md:items-center md:space-x-6">
          <Link
            href="/"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Home
          </Link>
          <Link
            href="/products"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Products
          </Link>
        </nav>

        {/* Search Bar (Desktop) */}
        <div className="hidden flex-1 md:mx-8 md:flex md:max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search medicines..."
              className="w-full pl-10"
            />
          </div>
        </div>

        {/* Auth & Cart */}
        <div className="flex items-center gap-2">
          {/* User Menu - Shows different UI based on auth state */}
          <UserMenu />

          {/* Cart Icon */}
          <CartIcon />
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="border-t md:hidden">
        <div className="container mx-auto px-4 py-2">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search medicines..."
              className="w-full pl-10"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
