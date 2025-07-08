'use client';

import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Code, Flame, User, Settings, LogOut, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function Navbar() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'SkillMaster', href: '/skillmaster' },
    { name: 'Study Planner', href: '/study-planner' },
    { name: 'AI Tutor', href: '/ai-tutor' },
    { name: 'Assessment', href: '/assessment' },
    { name: 'Coding Arena', href: '/coding-arena' },
    { name: 'Quests', href: '/quests' },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <Link href="/" className="flex items-center">
              <Code className="h-8 w-8 text-primary mr-2" />
              <span className="text-xl font-bold text-gray-900">MatrixProg</span>
            </Link>
          </motion.div>

          {isLoading ? (
            <div className="animate-pulse h-8 w-24 bg-gray-200 rounded"></div>
          ) : (
            <>
              {isAuthenticated && (
                <div className="hidden md:block ml-10">
                  <div className="flex items-baseline space-x-8">
                    {navigation.map((item) => (
                      <motion.div key={item.name} whileHover={{ scale: 1.1 }} transition={{ duration: 0.2 }}>
                        <Link href={item.href}>
                          <span
                            className={`text-sm font-medium transition-colors ${
                              isActive(item.href) ? 'text-primary' : 'text-gray-500 hover:text-gray-900'
                            }`}
                          >
                            {item.name}
                          </span>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-4">
                {isAuthenticated ? (
                  <>
                    <div className="hidden md:flex items-center space-x-2">
                      <Flame className="h-4 w-4 text-warning" />
                      <span className="text-sm font-medium text-gray-700">{user?.streak || 0} day streak</span>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <motion.div whileHover={{ scale: 1.1 }} transition={{ duration: 0.2 }}>
                          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={user?.profileImageUrl || ''} alt={user?.firstName || 'User'} />
                              <AvatarFallback>{(user?.firstName?.[0] || 'U').toUpperCase()}</AvatarFallback>
                            </Avatar>
                          </Button>
                        </motion.div>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-56" align="end">
                        <div className="flex items-center justify-start gap-2 p-2">
                          <div className="flex flex-col space-y-1 leading-none">
                            <p className="font-medium text-sm">{user?.firstName || ''} {user?.lastName || ''}</p>
                            <p className="w-[200px] truncate text-xs text-muted-foreground">{user?.email || ''}</p>
                            <Badge variant="outline" className="w-fit text-xs">
                              Level {user?.level || 1} • {user?.xp || 0} XP
                            </Badge>
                          </div>
                        </div>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link href="/profile">
                            <User className="mr-2 h-4 w-4" />
                            Profile
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/settings">
                            <Settings className="mr-2 h-4 w-4" />
                            Settings
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={logout}>
                          <LogOut className="mr-2 h-4 w-4" />
                          Log out
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="md:hidden"
                      onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                      {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </Button>
                  </>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" asChild>
                      <Link href="/login">Sign In</Link>
                    </Button>
                    <Button asChild className="bg-gradient-primary hover:opacity-90">
                      <Link href="/register">Get Started</Link>
                    </Button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {isAuthenticated && isMobileMenuOpen && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            transition={{ duration: 0.3 }}
            className="md:hidden border-t border-gray-200 pb-3 pt-4"
          >
            <div className="flex flex-col space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span
                    className={`block px-3 py-2 text-base font-medium rounded-md transition-colors ${
                      isActive(item.href) ? 'text-primary bg-primary/10' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    {item.name}
                  </span>
                </Link>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center space-x-2 px-3">
                <Flame className="h-4 w-4 text-warning" />
                <span className="text-sm font-medium text-gray-700">{user?.streak || 0} day streak</span>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  );
}