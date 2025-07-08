'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Brain, BookOpen, Code, User, Trophy } from 'lucide-react';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';

export default function Home() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [recommendation, setRecommendation] = useState<string>('');

  useEffect(() => {
    if (isAuthenticated && user?.level && user.level % 5 === 0) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }

    const fetchRecommendation = async () => {
      try {
        if (!user?.id) return;
        const { data, error } = await supabase
          .from('user_stats')
          .select('skill_progress')
          .eq('user_id', user.id)
          .single();
        if (error) throw error;
        const skills = data?.skill_progress || {};
        const recommended = Object.keys(skills).length
          ? `Continue your ${Object.keys(skills)[0]} roadmap`
          : 'Start a new learning roadmap in SkillMaster!';
        setRecommendation(recommended);
      } catch (error) {
        console.error('Recommendation error:', error);
        setRecommendation('Explore SkillMaster to start learning!');
      }
    };
    if (isAuthenticated && user) fetchRecommendation();
  }, [isAuthenticated, user]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-200">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-200">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-4xl font-bold text-gray-900">Welcome to MatrixProg</h1>
            <p className="mt-4 text-lg text-gray-600">
              Master skills with AI-powered learning roadmaps, study plans, and coding challenges.
            </p>
            <div className="mt-6 flex justify-center space-x-4">
              <Button asChild className="bg-gradient-primary hover:opacity-90">
                <Link href="/register">Get Started</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/login">Sign In</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  const features = [
    { name: 'SkillMaster', href: '/skillmaster', icon: Brain, description: 'Create personalized learning roadmaps.', progress: 60 },
    { name: 'Study Planner', href: '/study-planner', icon: BookOpen, description: 'Plan your studies with AI schedules.', progress: 40 },
    { name: 'Coding Arena', href: '/coding-arena', icon: Code, description: 'Practice coding with AI feedback.', progress: 75 },
    { name: 'AI Tutor', href: '/ai-tutor', icon: User, description: 'Get answers from your personal AI tutor.', progress: 20 },
    { name: 'Assessment', href: '/assessment', icon: User, description: 'Test your skills with assessments.', progress: 50 },
    { name: 'Quests', href: '/quests', icon: Trophy, description: 'Embark on learning quests.', progress: 30 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-200">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900">Welcome to Your Learning Hub, {user?.firstName || 'User'}</h1>
          <p className="text-gray-600 mt-2">Level {user?.level || 1} • {user?.xp || 0} XP • {user?.streak || 0} Day Streak</p>
          <div className="mt-4">
            <Progress value={(user?.xp % 1000) / 10} className="w-full" />
            <p className="text-sm text-gray-500 mt-1">{1000 - (user?.xp % 1000)} XP to next level</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
          <Card>
            <CardHeader>
              <CardTitle>AI Recommendation</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">{recommendation}</p>
              <Button className="mt-4 bg-gradient-primary hover:opacity-90" asChild>
                <Link href="/skillmaster">Take Action</Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <motion.div
              key={feature.name}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <feature.icon className="h-5 w-5 text-primary" />
                    <span>{feature.name}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{feature.description}</p>
                  <Progress value={feature.progress} className="mb-4" />
                  <Button asChild className="bg-gradient-primary hover:opacity-90">
                    <Link href={feature.href}>Get Started</Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}