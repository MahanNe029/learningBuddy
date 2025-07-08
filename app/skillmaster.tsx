import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Brain, Target, Clock, CheckCircle, Calendar, Sparkles } from "lucide-react";

const roadmapSchema = z.object({
  skill: z.string().min(1, "Skill is required"),
  level: z.string().min(1, "Level is required"),
  goals: z.string().min(10, "Goals must be at least 10 characters"),
  timeAvailable: z.string().min(1, "Time commitment is required"),
});

export default function SkillMaster() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedRoadmap, setSelectedRoadmap] = useState<any>(null);

  const form = useForm<z.infer<typeof roadmapSchema>>({
    resolver: zodResolver(roadmapSchema),
    defaultValues: {
      skill: "",
      level: "",
      goals: "",
      timeAvailable: "",
    },
  });

  const { data: roadmaps, isLoading } = useQuery({
    queryKey: ["/api/skillmaster/roadmaps"],
  });

  const createRoadmapMutation = useMutation({
    mutationFn: async (data: z.infer<typeof roadmapSchema>) => {
      await apiRequest("POST", "/api/skillmaster/roadmap", data);
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Your personalized roadmap has been created.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/skillmaster/roadmaps"] });
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateProgressMutation = useMutation({
    mutationFn: async ({ id, progress }: { id: number; progress: number }) => {
      await apiRequest("PATCH", `/api/skillmaster/roadmap/${id}/progress`, { progress });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/skillmaster/roadmaps"] });
      toast({
        title: "Progress Updated!",
        description: "Your learning progress has been saved.",
      });
    },
  });

  const onSubmit = (data: z.infer<typeof roadmapSchema>) => {
    createRoadmapMutation.mutate(data);
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
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
            <Brain className="h-8 w-8 text-primary" />
            <span>SkillMaster AI</span>
          </h1>
          <p className="text-gray-600 mt-2">Create personalized learning roadmaps powered by AI</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Roadmap Creation Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <span>Create Your Roadmap</span>
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
                          <Input
                            placeholder="e.g., Python Programming, Data Science, Web Development"
                            {...field}
                          />
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
                            <SelectItem value="Complete Beginner">Complete Beginner</SelectItem>
                            <SelectItem value="Some Experience">Some Experience</SelectItem>
                            <SelectItem value="Intermediate">Intermediate</SelectItem>
                            <SelectItem value="Advanced">Advanced</SelectItem>
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
                        <FormLabel>Learning goal</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="e.g., Build web applications, Get a job in tech, Pass certification exam"
                            className="h-24 resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="timeAvailable"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Available time per week</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select time commitment" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="1-3 hours">1-3 hours</SelectItem>
                            <SelectItem value="4-6 hours">4-6 hours</SelectItem>
                            <SelectItem value="7-10 hours">7-10 hours</SelectItem>
                            <SelectItem value="10+ hours">10+ hours</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-primary hover:opacity-90"
                    disabled={createRoadmapMutation.isPending}
                  >
                    <Brain className="h-4 w-4 mr-2" />
                    {createRoadmapMutation.isPending ? "Generating..." : "Generate My Roadmap"}
                  </Button>
                </form>
              </Form>

              {/* Usage Limits */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center space-x-2 text-blue-800">
                  <Target className="h-4 w-4" />
                  <span className="font-medium">
                    {user?.subscriptionTier === 'free' ? 'Free Tier' : `${user?.subscriptionTier?.toUpperCase()} Tier`}
                  </span>
                </div>
                <p className="text-sm text-blue-700 mt-1">
                  {user?.subscriptionTier === 'free' 
                    ? "3 roadmaps per month • Upgrade for unlimited access"
                    : "Unlimited roadmaps • Premium AI insights"
                  }
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Existing Roadmaps */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5 text-accent" />
                <span>Your Learning Roadmaps</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {roadmaps && roadmaps.length > 0 ? (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {roadmaps.map((roadmap: any) => (
                    <div 
                      key={roadmap.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                        selectedRoadmap?.id === roadmap.id 
                          ? 'border-primary bg-primary/5' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedRoadmap(selectedRoadmap?.id === roadmap.id ? null : roadmap)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-900">{roadmap.skill}</h4>
                        <Badge variant="outline">{roadmap.level}</Badge>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{roadmap.goals}</p>
                      
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <Clock className="h-4 w-4" />
                          <span>{roadmap.timeAvailable}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(roadmap.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <Progress value={roadmap.progress} className="flex-1 mr-4" />
                        <span className="text-sm font-medium text-gray-700">{roadmap.progress}%</span>
                      </div>

                      {roadmap.progress === 100 && (
                        <div className="flex items-center space-x-2 mt-2 text-accent">
                          <CheckCircle className="h-4 w-4" />
                          <span className="text-sm font-medium">Completed!</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">No roadmaps created yet</p>
                  <p className="text-sm text-gray-500">Create your first roadmap to get started!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Selected Roadmap Details */}
        {selectedRoadmap && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{selectedRoadmap.skill} - Learning Path</span>
                <div className="flex items-center space-x-4">
                  <Badge variant="secondary">{selectedRoadmap.level}</Badge>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">Progress:</span>
                    <Progress value={selectedRoadmap.progress} className="w-24" />
                    <span className="text-sm font-medium">{selectedRoadmap.progress}%</span>
                  </div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Learning Goals</h4>
                  <p className="text-gray-700">{selectedRoadmap.goals}</p>
                </div>

                {selectedRoadmap.content && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-4">Learning Modules</h4>
                    <div className="space-y-4">
                      {selectedRoadmap.content.modules?.map((module: any, index: number) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-medium text-gray-900">{module.name}</h5>
                            <Badge variant="outline">{module.duration}</Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{module.description}</p>
                          {module.topics && (
                            <div className="flex flex-wrap gap-2">
                              {module.topics.map((topic: string, topicIndex: number) => (
                                <Badge key={topicIndex} variant="secondary" className="text-xs">
                                  {topic}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      )) || (
                        <p className="text-gray-600">Roadmap content is being generated...</p>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex space-x-4">
                  <Button
                    onClick={() => updateProgressMutation.mutate({
                      id: selectedRoadmap.id,
                      progress: Math.min(selectedRoadmap.progress + 10, 100)
                    })}
                    disabled={selectedRoadmap.progress >= 100 || updateProgressMutation.isPending}
                  >
                    Mark Progress (+10%)
                  </Button>
                  {selectedRoadmap.progress < 100 && (
                    <Button
                      variant="outline"
                      onClick={() => updateProgressMutation.mutate({
                        id: selectedRoadmap.id,
                        progress: 100
                      })}
                      disabled={updateProgressMutation.isPending}
                    >
                      Mark as Complete
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
