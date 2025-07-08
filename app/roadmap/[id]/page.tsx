'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import Groq from 'groq-sdk';
import { useParams } from 'next/navigation';
import Navbar from '@/components/navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Brain, Loader2, BookOpen, Award } from 'lucide-react';
import { motion } from 'framer-motion';
import PromiseThrottle from 'promise-throttle';

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

interface AIResponse {
  response: string;
}

const promiseThrottle = new PromiseThrottle({
  requestsPerSecond: 25,
  promiseImplementation: Promise,
});

export default function RoadmapPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const params = useParams();
  const roadmapId = params.id as string;
  const [query, setQuery] = useState('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [resources, setResources] = useState<string[]>([]);
  const [exams, setExams] = useState<string[]>([]);

  const { data: roadmap, isLoading: roadmapLoading, error } = useQuery({
    queryKey: ['roadmap', roadmapId],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');
      if (!roadmapId) throw new Error('No roadmap ID provided');
      const { data, error } = await supabase
        .from('roadmaps')
        .select('id, skill, level, goals, time_available, progress, created_at, user_id')
        .eq('id', roadmapId)
        .eq('user_id', user.id)
        .single();
      if (error) {
        console.error('Fetch roadmap error:', error);
        throw new Error(error.message);
      }
      return data as Roadmap;
    },
    enabled: !!user && isAuthenticated && !!roadmapId,
    retry: 1,
  });

  useEffect(() => {
    if (!roadmap) return;
    const fetchResourcesAndExams = async () => {
      try {
        const groq = new Groq({ apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY });
        const resourcePrompt = `Suggest 3 high-quality learning resources (e.g., books, online courses, websites) for learning ${roadmap.skill} at ${roadmap.level} level. Return as a JSON array of strings.`;
        const examPrompt = `Suggest 1-2 relevant exams or certifications for completing a ${roadmap.skill} roadmap at ${roadmap.level} level. Return as a JSON array of strings.`;

        const [resourceResponse, examResponse] = await Promise.all([
          promiseThrottle.add(() =>
            groq.chat.completions.create({
              messages: [{ role: 'user', content: resourcePrompt }],
              model: 'llama3-8b-8192',
              max_tokens: 200,
            })
          ),
          promiseThrottle.add(() =>
            groq.chat.completions.create({
              messages: [{ role: 'user', content: examPrompt }],
              model: 'llama3-8b-8192',
              max_tokens: 100,
            })
          ),
        ]);

        setResources(JSON.parse(resourceResponse.choices[0].message.content));
        setExams(JSON.parse(examResponse.choices[0].message.content));
      } catch (error: any) {
        console.error('Groq API error:', error);
        toast({ title: 'Error', description: 'Failed to fetch resources or exams.', variant: 'destructive' });
      }
    };
    fetchResourcesAndExams();
  }, [roadmap, toast]);

  const handleAIQuery = async () => {
    if (!query || !roadmap) return;
    setIsGenerating(true);
    try {
      const groq = new Groq({ apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY });
      const prompt = `You are an AI tutor acting as a coach for a learning platform. The user is working on a roadmap for ${roadmap.skill} (Level: ${roadmap.level}, Goals: ${roadmap.goals}, Time Available: ${roadmap.time_available}, Progress: ${roadmap.progress}%). Their question is: "${query}". Provide a concise, actionable response to help them progress in their learning journey.`;

      const response = await promiseThrottle.add(() =>
        groq.chat.completions.create({
          messages: [{ role: 'user', content: prompt }],
          model: 'llama3-8b-8192',
          max_tokens: 500,
        })
      );

      setAiResponse(response.choices[0].message.content);
      toast({ title: 'Success', description: 'AI Tutor response generated.' });
    } catch (error: any) {
      console.error('Groq API error:', error);
      toast({ title: 'Error', description: 'Failed to generate AI response.', variant: 'destructive' });
    } finally {
      setIsGenerating(false);
    }
  };

  if (authLoading || roadmapLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Redirect handled by useAuth
  }

  if (error || !roadmapId) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card>
            <CardHeader>
              <CardTitle>Error</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-red-600">{error?.message || 'No roadmap selected'}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
              <Brain className="h-8 w-8 text-primary" />
              <span>{roadmap.skill} Roadmap</span>
            </h1>
            <p className="text-gray-600 mt-2">Your personalized learning path</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{roadmap.skill}</span>
                <Badge variant="secondary">{roadmap.level}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Goals</h4>
                  <p className="text-gray-700">{roadmap.goals}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Time Commitment</h4>
                  <p className="text-gray-700">{roadmap.time_available}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Progress</h4>
                  <Progress value={roadmap.progress} className="w-1/2" />
                  <span className="text-sm font-medium text-gray-700">{roadmap.progress}%</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Created On</h4>
                  <p className="text-gray-700">{new Date(roadmap.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5 text-primary" />
                <span>Learning Resources</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {resources.length > 0 ? (
                <ul className="list-disc pl-5 space-y-2">
                  {resources.map((resource, index) => (
                    <li key={index} className="text-gray-700">{resource}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-600">Loading resources...</p>
              )}
            </CardContent>
          </Card>

          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Award className="h-5 w-5 text-accent" />
                <span>Recommended Exams</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {exams.length > 0 ? (
                <ul className="list-disc pl-5 space-y-2">
                  {exams.map((exam, index) => (
                    <li key={index} className="text-gray-700">{exam}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-600">Loading exam recommendations...</p>
              )}
            </CardContent>
          </Card>

          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Brain className="h-5 w-5 text-primary" />
                <span>Your AI Tutor</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Textarea
                  placeholder="Ask your AI tutor for guidance (e.g., 'Suggest milestones for learning Python')"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="h-24 resize-none"
                />
                <Button
                  onClick={handleAIQuery}
                  disabled={isGenerating || !query}
                  className="bg-gradient-primary hover:opacity-90"
                >
                  {isGenerating ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Brain className="h-4 w-4 mr-2" />
                  )}
                  {isGenerating ? 'Generating...' : 'Ask AI'}
                </Button>
                {aiResponse && (
                  <div className="mt-4 p-4 bg-gray-100 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">AI Tutor Response</h4>
                    <p className="text-gray-700">{aiResponse}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}