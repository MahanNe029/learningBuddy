'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '@/lib/supabase';
import Navbar from '@/components/navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Code, Target, CheckCircle, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';

const submissionSchema = z.object({
  challengeId: z.string().min(1, 'Challenge is required'),
  code: z.string().min(1, 'Code is required'),
  language: z.string().min(1, 'Language is required'),
});

interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  language: 'JavaScript' | 'Python' | 'TypeScript';
  skill_tags: string[];
  test_cases: { input: string; output: string }[];
}

export default function CodingArena() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const router = useRouter();
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);

  const form = useForm<z.infer<typeof submissionSchema>>({
    resolver: zodResolver(submissionSchema),
    defaultValues: { challengeId: '', code: '', language: '' },
  });

  const { data: challenges, isLoading } = useQuery({
    queryKey: ['challenges'],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');
      const { data, error } = await supabase.from('challenges').select('*');
      if (error) throw new Error(error.message);
      return data as Challenge[];
    },
    enabled: !!user,
  });

  const submitMutation = useMutation({
    mutationFn: async (data: z.infer<typeof submissionSchema>) => {
      if (!user) throw new Error('User not authenticated');
      // Mock test case evaluation (replace with Edge Function for real logic)
      const challenge = challenges?.find(c => c.id === data.challengeId);
      const status = 'passed'; // Replace with actual evaluation logic
      const { error } = await supabase.from('submissions').insert({
        user_id: user.id,
        challenge_id: data.challengeId,
        code: data.code,
        language: data.language,
        status,
      });
      if (error) throw new Error(error.message);
      if (status === 'passed') {
        const { error: statsError } = await supabase
          .from('user_stats')
          .upsert({
            user_id: user.id,
            xp: { increment: 50 },
            skill_progress: { [challenge?.skill_tags[0] || 'General']: { increment: 10 } },
          }, { onConflict: 'user_id' });
        if (statsError) throw new Error(statsError.message);
      }
      return { status, message: status === 'passed' ? 'Challenge completed!' : 'Try again' };
    },
    onSuccess: (result) => {
      toast({ title: result.status === 'passed' ? 'Success!' : 'Try Again', description: result.message });
      queryClient.invalidateQueries({ queryKey: ['challenges'] });
      form.reset();
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      if (error.message.includes('not authenticated')) router.push('/login');
    },
  });

  const aiFeedbackMutation = useMutation({
    mutationFn: async ({ challengeId, code }: { challengeId: string; code: string }) => {
      if (!user) throw new Error('User not authenticated');
      const response = await fetch('/api/ai-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ challengeId, code }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Feedback failed');
      return result.feedback;
    },
    onSuccess: (feedback) => {
      toast({ title: 'AI Feedback', description: feedback });
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      if (error.message.includes('not authenticated')) router.push('/login');
    },
  });

  const onSubmit = (data: z.infer<typeof submissionSchema>) => {
    submitMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="skeleton h-96"></div>
            <div className="skeleton h-96"></div>
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
          <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
            <Code className="h-8 w-8 text-primary" />
            <span>Coding Arena</span>
          </h1>
          <p className="text-gray-600 mt-2">Practice coding with AI assistance</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5 text-primary" />
                <span>Available Challenges</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {challenges && challenges.length > 0 ? (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {challenges.map((challenge) => (
                    <div
                      key={challenge.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                        selectedChallenge?.id === challenge.id ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedChallenge(challenge)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-900">{challenge.title}</h4>
                        <Badge variant="outline">{challenge.difficulty}</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{challenge.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {challenge.skill_tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No challenges available yet</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Code className="h-5 w-5 text-primary" />
                <span>Code Your Solution</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedChallenge ? (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="challengeId"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input type="hidden" {...field} value={selectedChallenge.id} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="language"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Language</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={selectedChallenge.language}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select language" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="JavaScript">JavaScript</SelectItem>
                              <SelectItem value="Python">Python</SelectItem>
                              <SelectItem value="TypeScript">TypeScript</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="code"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Write Your Code</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Enter your solution here"
                              className="h-64 font-mono text-sm"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex space-x-4">
                      <Button type="submit" disabled={submitMutation.isPending}>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        {submitMutation.isPending ? 'Submitting...' : 'Submit Solution'}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => aiFeedbackMutation.mutate({ challengeId: selectedChallenge.id, code: form.getValues('code') })}
                        disabled={aiFeedbackMutation.isPending}
                      >
                        <Sparkles className="h-4 w-4 mr-2" />
                        Get AI Feedback
                      </Button>
                    </div>
                  </form>
                </Form>
              ) : (
                <div className="text-center py-8">
                  <Code className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Select a challenge to start coding</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {selectedChallenge && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{selectedChallenge.title}</span>
                <Badge variant="secondary">{selectedChallenge.difficulty}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
                  <p className="text-gray-700">{selectedChallenge.description}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Test Cases</h4>
                  <div className="space-y-2">
                    {selectedChallenge.test_cases.map((test, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-3">
                        <p className="text-sm text-gray-600">Input: {test.input}</p>
                        <p className="text-sm text-gray-600">Output: {test.output}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}