'use client';

import { Code, Twitter, Linkedin, Github, MessageSquare } from 'lucide-react';
import Link from 'next/link';

const footerLinks = {
  platform: [
    { name: 'SkillMaster AI', href: '/skillmaster' },
    { name: 'Study Planner', href: '/study-planner' },
    { name: 'AI Tutor', href: '/ai-tutor' },
    { name: 'Coding Arena', href: '/coding-arena' },
    { name: 'Assessment', href: '/assessment' },
    { name: 'Quests', href: '/quests' },
  ],
  company: [
    { name: 'About Us', href: '/about' },
    { name: 'Careers', href: '/careers' },
    { name: 'Blog', href: '/blog' },
    { name: 'Help Center', href: '/help' },
    { name: 'Contact', href: '/contact' },
    { name: 'API', href: '/api-docs' },
  ],
  social: [
    { name: 'Twitter', href: 'https://twitter.com/matrixprog', icon: Twitter },
    { name: 'LinkedIn', href: 'https://linkedin.com/company/matrixprog', icon: Linkedin },
    { name: 'GitHub', href: 'https://github.com/matrixprog', icon: Github },
    { name: 'Discord', href: 'https://discord.gg/matrixprog', icon: MessageSquare },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-6">
              <Code className="h-8 w-8 text-primary mr-2" />
              <span className="text-2xl font-bold">MatrixProg</span>
            </div>
            <p className="text-gray-400 mb-6 max-w-md">
              Empower your future with AI-driven learning. Master any skill with
              personalized roadmaps, gamified challenges, and AI-powered mentorship.
            </p>
            <div className="flex space-x-4">
              {footerLinks.social.map((item) => {
                const IconComponent = item.icon;
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    className="text-gray-400 hover:text-white transition-colors"
                    aria-label={item.name}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <IconComponent className="h-6 w-6" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="font-semibold mb-4">Platform</h4>
            <ul className="space-y-2">
              {footerLinks.platform.map((link) => (
                <li key={link.name}>
                  <Link href={link.href}>
                    <span className="text-gray-400 hover:text-white transition-colors">
                      {link.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-gray-400">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link href={link.href}>
                    <span className="hover:text-white transition-colors">
                      {link.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-400 text-sm">
            © 2025 MatrixProg.com. All rights reserved.
          </div>
          <div className="flex space-x-6 text-sm text-gray-400 mt-4 md:mt-0">
            <Link href="/privacy">
              <span className="hover:text-white transition-colors">Privacy Policy</span>
            </Link>
            <Link href="/terms">
              <span className="hover:text-white transition-colors">Terms of Service</span>
            </Link>
            <Link href="/cookies">
              <span className="hover:text-white transition-colors">Cookie Policy</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}