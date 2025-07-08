"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Flame, Target, Brain, Code, Trophy, Star, TrendingUp, Calendar, Plus } from "lucide-react";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, RadialLinearScale, BarElement } from "chart.js";
import { Line, Radar, Bar } from "react-chartjs-2";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
  BarElement
);

// Type definitions for API responses
interface DashboardStats {
  level: number;
  xp: number;
  streak: number;
  achievements: Achievement[];
  skillProgress: Record<string, number>;
  timeSpent: {
    studyPlans: number;
    roadmaps: number;
  };
}

interface Achievement {
  id: string;
  title: string;
  description: string;
}

interface Recommendation {
  studyPlans: StudyPlan[];
  roadmaps: Roadmap[];
}

interface StudyPlan {
  id: string;
  title: string;
  skills: string[];
  progress?: number;
}

interface Roadmap {
  id: string;
  skill: string;
  progress: number;
  level?: string;
}

const DashboardPage = () => {
  const router = useRouter();
  const { authFetch } = useAuth();
  const [activeTab, setActiveTab] = useState<"overview" | "skills" | "activity">("overview");

  // Fetch dashboard stats
  const { data: stats, isLoading: statsLoading, error: statsError } = useQuery<DashboardStats>({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const response = await authFetch("/api/analytics/dashboard");
      if (!response.ok) {
        console.error("Failed to fetch dashboard stats");
        throw new Error("Failed to fetch dashboard stats");
      }
      return response.json();
    },
  });

  // Fetch recommendations
  const { data: recommendations, isLoading: recLoading, error: recError } = useQuery<Recommendation>({
    queryKey: ["recommendations"],
    queryFn: async () => {
      const response = await authFetch("/api/recommendations");
      if (!response.ok) {
        console.error("Failed to fetch recommendations");
        throw new Error("Failed to fetch recommendations");
      }
      return response.json();
    },
  });

  // Handle errors by logging to console
  if (statsError || recError) {
    console.error("Dashboard error:", statsError || recError);
  }

  // Chart data for XP progress (line chart)
  const xpChartData = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4", "This Week"],
    datasets: [
      {
        label: "XP Earned",
        data: [120, 190, 300, 250, 180],
        borderColor: "hsl(221.2 83.2% 53.3%)",
        backgroundColor: "hsl(221.2 83.2% 53.3%)",
        tension: 0.3,
      },
    ],
  };

  // Chart data for skill progress (radar chart)
  const skillChartData = {
    labels: stats ? Object.keys(stats.skillProgress) : [],
    datasets: [
      {
        label: "Skill Proficiency",
        data: stats ? Object.values(stats.skillProgress) : [],
        backgroundColor: "rgba(99, 102, 241, 0.2)",
        borderColor: "rgba(99, 102, 241, 1)",
        pointBackgroundColor: "rgba(99, 102, 241, 1)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgba(99, 102, 241, 1)",
      },
    ],
  };

  // Chart data for time spent (bar chart)
  const timeChartData = stats ? {
    labels: ["Study Plans", "Roadmaps"],
    datasets: [
      {
        label: "Hours Spent",
        data: [stats.timeSpent.studyPlans, stats.timeSpent.roadmaps],
        backgroundColor: [
          "rgba(59, 130, 246, 0.7)",
          "rgba(139, 92, 246, 0.7)",
        ],
        borderColor: [
          "rgba(59, 130, 246, 1)",
          "rgba(139, 92, 246, 1)",
        ],
        borderWidth: 1,
      },
    ],
  } : null;

  // Get top 3 skills by progress
  const topSkills = stats
    ? Object.entries(stats.skillProgress)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
    : [];

  // Get motivational message based on streak
  const getMotivationalMessage = () => {
    if (!stats) return "Welcome back! Ready to learn today?";
    if (stats.streak === 0) return "Start a learning streak today!";
    if (stats.streak < 3) return `Keep going! You're on a ${stats.streak}-day streak!`;
    if (stats.streak < 7) return `Great job! ${stats.streak} days in a row!`;
    return `Amazing! ${stats.streak}-day streak! Keep it up!`;
  };

  return (
    <div className="container py-6 space-y-6">
      {/* Header with quick actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Your skill mastery mission control
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => router.push("/study-planner")} variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            New Study Plan
          </Button>
          <Button onClick={() => router.push("/skillmaster")} variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            New Roadmap
          </Button>
          <Button onClick={() => router.push("/ai-tutor")}>
            <Brain className="w-4 h-4 mr-2" />
            AI Tutor
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Level Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Level</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Skeleton className="h-8 w-1/2" />
            ) : (
              <div className="text-2xl font-bold">{stats?.level || 1}</div>
            )}
            <p className="text-xs text-muted-foreground">
              {stats?.xp || 0} XP earned
            </p>
          </CardContent>
        </Card>

        {/* Streak Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Learning Streak</CardTitle>
            <Flame
              className="h-4 w-4 text-muted-foreground"
              style={{
                transform: stats ? `scale(${1 + Math.min(stats.streak / 20, 0.5)})` : "scale(1)",
                color: stats
                  ? stats.streak > 7
                    ? "#f59e0b"
                    : stats.streak > 3
                      ? "#f97316"
                      : "#9ca3af"
                  : "#9ca3af",
              }}
            />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Skeleton className="h-8 w-1/2" />
            ) : (
              <div className="text-2xl font-bold">{stats?.streak || 0} days</div>
            )}
            <p className="text-xs text-muted-foreground">
              {getMotivationalMessage()}
            </p>
          </CardContent>
        </Card>

        {/* Achievements Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Achievements</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Skeleton className="h-8 w-1/2" />
            ) : (
              <div className="text-2xl font-bold">{stats?.achievements.length || 0}</div>
            )}
            <p className="text-xs text-muted-foreground">
              {stats?.achievements.length
                ? `Recently earned: ${stats.achievements[0].title}`
                : "Earn your first achievement today!"}
            </p>
          </CardContent>
        </Card>

        {/* Top Skill Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Skill</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Skeleton className="h-8 w-1/2" />
            ) : topSkills.length > 0 ? (
              <>
                <div className="text-2xl font-bold">{topSkills[0][0]}</div>
                <div className="flex items-center gap-2 mt-1">
                  <Progress value={topSkills[0][1]} className="h-2" />
                  <span className="text-xs text-muted-foreground">
                    {topSkills[0][1]}%
                  </span>
                </div>
              </>
            ) : (
              <div className="text-2xl font-bold">-</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Left Column */}
        <div className="space-y-4 lg:col-span-2">
          {/* Charts Section */}
          <Card>
            <CardHeader>
              <CardTitle>Progress Analytics</CardTitle>
              <CardDescription>
                Track your learning journey and skill development
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Button
                  variant={activeTab === "overview" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveTab("overview")}
                >
                  Overview
                </Button>
                <Button
                  variant={activeTab === "skills" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveTab("skills")}
                >
                  Skills
                </Button>
                <Button
                  variant={activeTab === "activity" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveTab("activity")}
                >
                  Activity
                </Button>
              </div>

              {activeTab === "overview" && (
                <div className="h-64">
                  <Line
                    data={xpChartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: "top",
                        },
                        tooltip: {
                          callbacks: {
                            label: (context) => `${context.dataset.label}: ${context.raw} XP`,
                          },
                        },
                      },
                    }}
                  />
                </div>
              )}

              {activeTab === "skills" && (
                <div className="h-64">
                  <Radar
                    data={skillChartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        r: {
                          angleLines: {
                            display: true,
                          },
                          suggestedMin: 0,
                          suggestedMax: 100,
                        },
                      },
                    }}
                  />
                </div>
              )}

              {activeTab === "activity" && timeChartData && (
                <div className="h-64">
                  <Bar
                    data={timeChartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        y: {
                          beginAtZero: true,
                          title: {
                            display: true,
                            text: "Hours",
                          },
                        },
                      },
                    }}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Study Plans Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Study Plans</CardTitle>
                  <CardDescription>
                    Your active learning schedules and progress
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push("/study-planner")}
                >
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {recLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                </div>
              ) : recommendations?.studyPlans.length ? (
                <div className="space-y-4">
                  {recommendations.studyPlans.slice(0, 2).map((plan) => (
                    <div
                      key={plan.id}
                      className="p-4 border rounded-lg hover:bg-accent transition-colors cursor-pointer"
                      onClick={() => router.push(`/study-planner/${plan.id}`)}
                    >
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium">{plan.title}</h3>
                        <Badge variant="outline">
                          {plan.skills.slice(0, 2).join(", ")}
                          {plan.skills.length > 2 ? "..." : ""}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <Progress
                          value={plan.progress || 0}
                          className="h-2 flex-1"
                        />
                        <span className="text-sm text-muted-foreground">
                          {plan.progress || 0}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    You don't have any active study plans
                  </p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => router.push("/study-planner")}
                  >
                    Create a Study Plan
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {/* Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle>Next Steps</CardTitle>
              <CardDescription>
                Personalized recommendations based on your progress
              </CardDescription>
            </CardHeader>
            <CardContent>
              {recLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                </div>
              ) : (
                <div className="space-y-4">
                  {recommendations?.roadmaps.slice(0, 1).map((roadmap) => (
                    <div
                      key={roadmap.id}
                      className="p-4 border rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors cursor-pointer"
                      onClick={() => router.push(`/skillmaster/${roadmap.id}`)}
                    >
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium">{roadmap.skill} Roadmap</h3>
                        <Badge variant="secondary">
                          Lvl {roadmap.level || Math.floor(roadmap.progress / 25) + 1}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <Progress
                          value={roadmap.progress}
                          className="h-2 flex-1"
                        />
                        <span className="text-sm text-muted-foreground">
                          {roadmap.progress}%
                        </span>
                      </div>
                      <p className="text-sm mt-2 text-muted-foreground">
                        {roadmap.progress < 30
                          ? "Just starting out! Keep going!"
                          : roadmap.progress < 70
                            ? "Making great progress!"
                            : "Almost there! Finish strong!"}
                      </p>
                    </div>
                  ))}

                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium">Practice Coding</h3>
                    <p className="text-sm mt-1 text-muted-foreground">
                      Sharpen your skills with interactive challenges
                    </p>
                    <Button
                      variant="outline"
                      className="mt-3 w-full"
                      disabled
                    >
                      <Code className="w-4 h-4 mr-2" />
                      Coding Arena (Coming Soon)
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Roadmaps */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Learning Roadmaps</CardTitle>
                  <CardDescription>
                    Your active skill development paths
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push("/skillmaster")}
                >
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {recLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                </div>
              ) : recommendations?.roadmaps.length ? (
                <div className="space-y-4">
                  {recommendations.roadmaps.slice(0, 2).map((roadmap) => (
                    <div
                      key={roadmap.id}
                      className="p-4 border rounded-lg hover:bg-accent transition-colors cursor-pointer"
                      onClick={() => router.push(`/skillmaster/${roadmap.id}`)}
                    >
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium">{roadmap.skill}</h3>
                        <Badge variant="outline">
                          Lvl {roadmap.level || Math.floor(roadmap.progress / 25) + 1}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <Progress
                          value={roadmap.progress}
                          className="h-2 flex-1"
                        />
                        <span className="text-sm text-muted-foreground">
                          {roadmap.progress}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    You don't have any active roadmaps
                  </p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => router.push("/skillmaster")}
                  >
                    Create a Roadmap
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Achievements */}
          {stats?.achievements.length ? (
            <Card>
              <CardHeader>
                <CardTitle>Recent Achievements</CardTitle>
                <CardDescription>
                  Celebrate your learning milestones
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {stats.achievements.slice(0, 3).map((achievement) => (
                  <div
                    key={achievement.id}
                    className="p-3 border rounded-lg flex items-center gap-3 animate-fade-in"
                  >
                    <div className="p-2 rounded-full bg-primary/10">
                      <Trophy className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">{achievement.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {achievement.description}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;