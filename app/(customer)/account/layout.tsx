/**
 * Account Layout
 * Wraps account pages with sidebar navigation
 */

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User, Package, Settings, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

const accountLinks = [
  {
    href: '/account/profile',
    label: 'Profile Settings',
    icon: User,
    description: 'Manage your personal information',
  },
  {
    href: '/orders',
    label: 'My Orders',
    icon: Package,
    description: 'View and track your orders',
  },
  {
    href: '/account/security',
    label: 'Security',
    icon: Shield,
    description: 'Password and security settings',
  },
];

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Settings className="h-8 w-8" />
          Account Settings
        </h1>
        <p className="text-muted-foreground mt-2">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
        {/* Sidebar Navigation */}
        <aside className="space-y-2">
          <nav className="flex flex-col gap-1">
            {accountLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'flex items-start gap-3 rounded-lg px-4 py-3 transition-colors',
                    'hover:bg-accent hover:text-accent-foreground',
                    isActive && 'bg-primary text-primary-foreground hover:bg-primary/90'
                  )}
                >
                  <Icon className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{link.label}</p>
                    <p
                      className={cn(
                        'text-xs mt-0.5',
                        isActive
                          ? 'text-primary-foreground/80'
                          : 'text-muted-foreground'
                      )}
                    >
                      {link.description}
                    </p>
                  </div>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main>{children}</main>
      </div>
    </div>
  );
}
