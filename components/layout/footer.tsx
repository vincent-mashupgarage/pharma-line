/**
 * Footer Component
 * Site footer with links and copyright
 * Server component - static content
 */

import Link from 'next/link';
import { Separator } from '@/components/ui/separator';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { label: 'About Us', href: '/coming-soon?page=about-us' },
      { label: 'Contact', href: '/coming-soon?page=contact' },
      { label: 'Careers', href: '/coming-soon?page=careers' },
    ],
    support: [
      { label: 'Help Center', href: '/coming-soon?page=help-center' },
      { label: 'Track Order', href: '/coming-soon?page=track-order' },
      { label: 'Returns', href: '/coming-soon?page=returns' },
    ],
    legal: [
      { label: 'Privacy Policy', href: '/coming-soon?page=privacy-policy' },
      { label: 'Terms of Service', href: '/coming-soon?page=terms-of-service' },
      { label: 'Cookies Policy', href: '/coming-soon?page=cookies-policy' },
    ],
  };

  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <span className="text-lg font-bold">P</span>
              </div>
              <span className="text-xl font-bold text-primary">PharmaLine</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Your trusted online pharmacy for quality medicines and health products.
            </p>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="mb-3 text-sm font-semibold">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="mb-3 text-sm font-semibold">Support</h3>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="mb-3 text-sm font-semibold">Legal</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
          <p className="text-sm text-muted-foreground">
            © {currentYear} PharmaLine. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Made with ❤️ in the Philippines
          </p>
        </div>
      </div>
    </footer>
  );
}
