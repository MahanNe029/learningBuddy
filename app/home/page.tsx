'use client';

import { useQuery } from '@tanstack/react-query';
import { useAuth, authFetch } from '@/hooks/useAuth';
import Navbar from '@/components/navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Trophy, Target, BookOpen, Code, Brain, Calendar, Flame, Star, TrendingUp } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();

  const { data: analytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ['analytics/dashboard'],
    queryFn: async () => {
      const response = await authFetch('/api/analytics/dashboard', {}, router);
      return response.json();
    },
  });

  const { data: roadmaps, isLoading: roadmapsLoading } = useQuery({
    queryKey: ['skillmaster/roadmaps'],
    queryFn: async () => {
      const response = await authFetch('/api/skillmaster/roadmaps', {}, router);
      return response.json();
    },
  });

  const { data: studyPlans, isLoading: studyPlansLoading } = useQuery({
    queryKey: ['study-planner'],
    queryFn: async () => {
      const response = await authFetch('/api/study-planner', {}, router);
      return response.json();
    },
  });

  if (analyticsLoading || roadmapsLoading || studyPlansLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="skeleton h-32"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.firstName || 'Learner'}! 👋
          </h1>
          <p className="text-gray-600">Ready to continue your learning journey?</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Current Level</p>
                  <p className="text-2xl font-bold text-primary">{analytics?.user?.level || 1}</p>
                </div>
                <div className="bg-primary/10 p-3 rounded-full">
                  <Star className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Learning Streak</p>
                  <p className="text-2xl font-bold text-warning">{analytics?.user?.streak || 0}</p>
                </div>
                <div className="bg-warning/10 p-3 rounded-full">
                  <Flame className="h-6 w-6 text-warning" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total XP</p>
                  <p className="text-2xl font-bold text-accent">{analytics?.user?.xp || 0}</p>
                </div>
                <div className="bg-accent/10 p-3 rounded-full">
                  <TrendingUp className="h-6 w-6 text-accent" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Achievements</p>
                  <p className="text-2xl font-bold text-secondary">{analytics?.achievements?.length || 0}</p>
                </div>
                <div className="bg-secondary/10 p-3 rounded-full">
                  <Trophy className="h-6 w-6 text-secondary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5 text-primary" />
                  <span>Active Learning Roadmaps</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {roadmaps && roadmaps.length > 0 ? (
                  <div className="space-y-4">
                    {roadmaps.slice(0, 3).map((roadmap: any) => (
                      <div key={roadmap.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-gray-900">{roadmap.skill}</h4>
                          <Badge variant="outline">{roadmap.level}</Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{roadmap.goals}</p>
                        <div className="flex items-center justify-between">
                          <Progress value={roadmap.progress} className="flex-1 mr-4" />
                          <span className="text-sm font-medium text-gray-700">{roadmap.progress}%</span>
                        </div>
                      </div>
                    ))}
                    {roadmaps.length > 3 && (
                      <Link href="/skillmaster">
                        <Button variant="outline" className="w-full">
                          View All Roadmaps ({roadmaps.length})
                        </Button>
                      </Link>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">No active roadmaps yet</p>
                    <Link href="/skillmaster">
                      <Button>Create Your First Roadmap</Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-secondary" />
                  <span>Study Plans</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {studyPlans && studyPlans.length > 0 ? (
                  <div className="space-y-4">
                    {studyPlans.slice(0, 2).map((plan: any) => (
                      <div key={plan.id} className="border border-gray-200 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-2">{plan.title}</h4>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {plan.skills.map((skill: string, index: number) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                        <p className="text-sm text-gray-600">
                          Created {new Date(plan.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                    <Link href="/study-planner">
                      <Button variant="outline" className="w-full">
                        View All Study Plans
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">No study plans created yet</p>
                    <Link href="/study-planner">
                      <Button>Create Study Plan</Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/skillmaster" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <Brain className="h-4 w-4 mr-2" />
                    Create Roadmap
                  </Button>
                </Link>
                <Link href="/ai-tutor" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Ask AI Tutor
                  </Button>
                </Link>
                <Link href="/coding-arena" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <Code className="h-4 w-4 mr-2" />
                    Practice Coding
                  </Button>
                </Link>
                <Link href="/assessment" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <Target className="h-4 w-4 mr-2" />
                    Take Assessment
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Trophy className="h-5 w-5 text-warning" />
                  <span>Recent Achievements</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {analytics?.achievements && analytics.achievements.length > 0 ? (
                  <div className="space-y-3">
                    {analytics.achievements.map((achievement: any) => (
                      <div key={achievement.id} className="flex items-center space-x-3 p-3 bg-gradient-to-r from-warning/5 to-warning/10 rounded-lg border border-warning/20">
                        <div className="bg-warning/20 rounded-full w-10 h-10 flex items-center justify-center">
                          <Trophy className="h-5 w-5 text-warning" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{achievement.title}</p>
                          <p className="text-sm text-gray-600">{achievement.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <Trophy className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600">No achievements yet</p>
                    <p className="text-sm text-gray-500">Complete activities to earn badges!</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Learning Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Roadmaps Completed</span>
                    <span className="font-medium">{analytics?.completedRoadmaps || 0}/{analytics?.totalRoadmaps || 0}</span>
                  </div>
                  <Progress value={analytics?.totalRoadmaps > 0 ? (analytics.completedRoadmaps / analytics.totalRoadmaps) * 100 : 0} />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Average Progress</span>
                    <span className="font-medium">{Math.round(analytics?.averageProgress || 0)}%</span>
                  </div>
                  <Progress value={analytics?.averageProgress || 0} />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}