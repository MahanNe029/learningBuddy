'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '@/lib/supabase';
import Navbar from '@/components/navbar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Brain, Target, Clock, CheckCircle, Calendar, Sparkles, ArrowRight, Trophy, Zap, BookOpen } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';

const roadmapSchema = z.object({
  skill: z.string().min(1, 'Skill is required').max(50, 'Skill name too long'),
  level: z.string().min(1, 'Level is required'),
  goals: z.string().min(10, 'Goals must be at least 10 characters').max(500, 'Keep goals under 500 characters'),
  time_available: z.string().min(1, 'Time commitment is required'),
});

interface Roadmap {
  id: string;
  skill: string;
  level: string;
  goals: string;
  time_available: string;
  progress: number;
  created_at: string;
  user_id: string;
}

const popularSkills = [
  "Python Programming",
  "Web Development",
  "Data Science",
  "Digital Marketing",
  "Graphic Design",
  "Public Speaking",
  "Machine Learning",
  "UX/UI Design"
];

export default function SkillMaster() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const router = useRouter();
  const [showPopularSkills, setShowPopularSkills] = useState(false);

  const form = useForm<z.infer<typeof roadmapSchema>>({
    resolver: zodResolver(roadmapSchema),
    defaultValues: {
      skill: '',
      level: '',
      goals: '',
      time_available: '',
    },
  });

  const { data: roadmaps, isLoading: queryLoading, error } = useQuery({
    queryKey: ['roadmaps'],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');
      
      // Check roadmap count for free tier
      if (user.subscriptionTier === 'free') {
        const { count } = await supabase
          .from('roadmaps')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .gte('created_at', new Date(new Date().setDate(1)).toISOString());
        
        if (count && count >= 3) {
          throw new Error('Free tier limit: 3 roadmaps per month. Upgrade for unlimited.');
        }
      }

      const { data, error } = await supabase
        .from('roadmaps')
        .select('id, skill, level, goals, time_available, progress, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Roadmap[];
    },
    enabled: !!user && isAuthenticated,
    retry: 1,
  });

  const createRoadmapMutation = useMutation({
    mutationFn: async (data: z.infer<typeof roadmapSchema>) => {
      if (!user) throw new Error('User not authenticated');
      
      const { data: roadmap, error } = await supabase
        .from('roadmaps')
        .insert({ 
          ...data, 
          user_id: user.id, 
          progress: 0 
        })
        .select('id')
        .single();
      
      if (error) throw error;
      return roadmap;
    },
    onSuccess: (data) => {
      toast({
        title: 'Roadmap Created!',
        description: 'Your personalized learning plan is ready.',
        action: (
          <Button variant="ghost" onClick={() => router.push(`/roadmap/${data.id}`)}>
            View <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        )
      });
      queryClient.invalidateQueries({ queryKey: ['roadmaps'] });
      form.reset();
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
      if (error.message.includes('not authenticated')) {
        router.push('/login');
      }
    },
  });

  const onSubmit = (data: z.infer<typeof roadmapSchema>) => {
    createRoadmapMutation.mutate(data);
  };

  if (authLoading || queryLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-8">
              <div className="h-10 w-64 bg-gray-200 rounded animate-pulse"></div>
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded animate-pulse"></div>
              ))}
              <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="space-y-6">
              <div className="h-10 w-64 bg-gray-200 rounded animate-pulse"></div>
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded animate-pulse"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    router.push('/login');
    return null;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="text-destructive flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Oops! Something went wrong
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>{error.message}</p>
              {error.message.includes('Free tier limit') && (
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-medium flex items-center gap-2 text-blue-800">
                    <Trophy className="h-4 w-4" />
                    Upgrade for unlimited roadmaps
                  </h4>
                  <p className="text-sm text-blue-700 mt-1">
                    Get premium features like unlimited roadmaps, AI mentor, and progress analytics.
                  </p>
                  <Button className="mt-3" onClick={() => router.push('/pricing')}>
                    View Plans
                  </Button>
                </div>
              )}
              <Button 
                onClick={() => queryClient.invalidateQueries({ queryKey: ['roadmaps'] })}
                variant="outline"
              >
                Try Again
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-12"
        >
          {/* Hero Section */}
          <div className="text-center max-w-3xl mx-auto">
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-primary/10 mb-4"
            >
              <Sparkles className="h-5 w-5 text-primary mr-2" />
              <span className="font-medium">Master any skill systematically</span>
            </motion.div>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl mb-4">
              Build Your <span className="text-primary">Personalized</span> Learning Path
            </h1>
            <p className="text-xl text-gray-600">
              From complete beginner to mastery - we'll create your optimal roadmap based on your goals and availability.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Create Roadmap Card */}
            <Card className="border-primary/20 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Sparkles className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h2>Create New Roadmap</h2>
                    <CardDescription className="mt-1">
                      Answer a few questions to generate your personalized plan
                    </CardDescription>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="skill"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>What skill do you want to master?</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                placeholder="e.g., Python, Digital Marketing, UX Design"
                                {...field}
                                onFocus={() => setShowPopularSkills(true)}
                                onBlur={() => setTimeout(() => setShowPopularSkills(false), 200)}
                              />
                              {showPopularSkills && (
                                <motion.div
                                  initial={{ opacity: 0, y: -10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border p-2"
                                >
                                  <h4 className="text-xs font-medium text-gray-500 mb-2 px-2">POPULAR SKILLS</h4>
                                  <div className="grid grid-cols-2 gap-2">
                                    {popularSkills.map(skill => (
                                      <Button
                                        key={skill}
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="justify-start text-sm h-8"
                                        onClick={() => {
                                          form.setValue('skill', skill);
                                          setShowPopularSkills(false);
                                        }}
                                      >
                                        {skill}
                                      </Button>
                                    ))}
                                  </div>
                                </motion.div>
                              )}
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="level"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Current skill level</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select your level" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Complete Beginner">
                                <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                  Complete Beginner
                                </div>
                              </SelectItem>
                              <SelectItem value="Some Experience">
                                <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                  Some Experience
                                </div>
                              </SelectItem>
                              <SelectItem value="Intermediate">
                                <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                                  Intermediate
                                </div>
                              </SelectItem>
                              <SelectItem value="Advanced">
                                <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                                  Advanced
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="goals"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>What are your specific goals?</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Examples:
- Build a portfolio with 3 projects
- Pass the AWS certification exam
- Land an entry-level frontend developer job"
                              className="min-h-[120px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="time_available"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Weekly time commitment</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select your availability" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="1-3 hours">1-3 hours (Casual)</SelectItem>
                              <SelectItem value="4-6 hours">4-6 hours (Part-time)</SelectItem>
                              <SelectItem value="7-10 hours">7-10 hours (Serious)</SelectItem>
                              <SelectItem value="10+ hours">10+ hours (Intensive)</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      className="w-full h-12"
                      disabled={createRoadmapMutation.isPending}
                    >
                      {createRoadmapMutation.isPending ? (
                        <span className="flex items-center gap-2">
                          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Generating Your Roadmap...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <Brain className="h-5 w-5" />
                          Generate My Personalized Roadmap
                        </span>
                      )}
                    </Button>
                  </form>
                </Form>

                {user?.subscriptionTier === 'free' && (
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-blue-100">
                        <BookOpen className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-blue-800">Free Plan Limit</h4>
                        <p className="text-sm text-blue-700">
                          3 roadmaps per month • Upgrade for unlimited access and premium features
                        </p>
                      </div>
                    </div>
                    <Button 
                      variant="link" 
                      className="mt-2 text-blue-600 pl-0"
                      onClick={() => router.push('/pricing')}
                    >
                      View Premium Features <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Your Roadmaps Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-accent/10">
                    <Target className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <h2>Your Learning Roadmaps</h2>
                    <CardDescription className="mt-1">
                      {roadmaps?.length ? `${roadmaps.length} active roadmap${roadmaps.length !== 1 ? 's' : ''}` : 'No roadmaps yet'}
                    </CardDescription>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {roadmaps && roadmaps.length > 0 ? (
                  <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                    {roadmaps.map((roadmap) => (
                      <motion.div
                        key={roadmap.id}
                        whileHover={{ scale: 1.01 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                      >
                        <Card 
                          className={`cursor-pointer transition-all hover:border-primary/30 ${
                            roadmap.progress === 100 ? 'border-green-200 bg-green-50' : 'border-gray-200'
                          }`}
                          onClick={() => router.push(`/roadmap/${roadmap.id}`)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <h3 className="font-semibold text-lg text-gray-900 line-clamp-1">
                                  {roadmap.skill}
                                </h3>
                                <Badge 
                                  variant="secondary" 
                                  className="mt-1"
                                >
                                  {roadmap.level}
                                </Badge>
                              </div>
                              <div className="text-right">
                                <p className="text-xs text-gray-500">
                                  Created on {new Date(roadmap.created_at).toLocaleDateString()}
                                </p>
                                <div className="flex items-center gap-1 mt-1">
                                  <Clock className="h-3 w-3 text-gray-400" />
                                  <span className="text-xs text-gray-500">
                                    {roadmap.time_available}/week
                                  </span>
                                </div>
                              </div>
                            </div>

                            <p className="text-sm text-gray-600 mt-3 line-clamp-2">
                              {roadmap.goals}
                            </p>

                            <div className="mt-4 space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-medium text-gray-500">
                                  Progress
                                </span>
                                <span className="text-xs font-medium text-gray-700">
                                  {roadmap.progress}%
                                </span>
                              </div>
                              <Progress 
                                value={roadmap.progress} 
                                className="h-2"
                                indicatorClassName={
                                  roadmap.progress === 100 ? 'bg-green-500' : 'bg-primary'
                                }
                              />
                            </div>

                            {roadmap.progress === 100 && (
                              <div className="flex items-center gap-2 mt-3 text-green-600">
                                <CheckCircle className="h-4 w-4" />
                                <span className="text-sm font-medium">Completed!</span>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-12 text-center"
                  >
                    <Target className="h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-1">
                      No Roadmaps Yet
                    </h3>
                    <p className="text-gray-500 max-w-md">
                      Create your first learning roadmap to get started on your skill mastery journey.
                    </p>
                    <Button 
                      variant="outline" 
                      className="mt-6"
                      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    >
                      Create Your First Roadmap
                    </Button>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  );
}