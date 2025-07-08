import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trophy, Flame, Star, Crown } from "lucide-react";

const achievements = [
  {
    title: "Python Master",
    description: "Completed all Python modules",
    icon: Trophy,
    color: "text-warning",
    bgColor: "bg-gradient-to-r from-yellow-50 to-orange-50",
    borderColor: "border-yellow-200"
  },
  {
    title: "Week Warrior", 
    description: "7-day learning streak",
    icon: Flame,
    color: "text-accent",
    bgColor: "bg-gradient-to-r from-green-50 to-emerald-50",
    borderColor: "border-green-200"
  },
  {
    title: "Quiz Champion",
    description: "Scored 100% on 5 quizzes", 
    icon: Star,
    color: "text-secondary",
    bgColor: "bg-gradient-to-r from-purple-50 to-pink-50",
    borderColor: "border-purple-200"
  }
];

const leaderboard = [
  {
    rank: 1,
    name: "Alex Chen",
    xp: 2840,
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=32&h=32",
    crown: true
  },
  {
    rank: 2,
    name: "Sarah Kim", 
    xp: 2650,
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=32&h=32"
  },
  {
    rank: 3,
    name: "Mike Johnson",
    xp: 2400,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=32&h=32"
  },
  {
    rank: 4,
    name: "Emma Davis",
    xp: 2280,
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=32&h=32"
  }
];

export default function GamificationShowcase() {
  return (
    <section className="py-20 bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Level Up Your Learning</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Earn badges, complete challenges, and climb leaderboards as you master new skills.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* User Progress Card */}
          <Card className="shadow-xl border border-gray-200">
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <div className="relative inline-block">
                  <Avatar className="w-20 h-20 mx-auto mb-4">
                    <AvatarImage 
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=80&h=80" 
                      alt="Alex Chen" 
                    />
                    <AvatarFallback>AC</AvatarFallback>
                  </Avatar>
                  <div className="absolute -top-2 -right-2 bg-warning text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                    12
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Alex Chen</h3>
                <p className="text-gray-500">Full Stack Developer</p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">XP Progress</span>
                    <span className="text-sm text-gray-500">2,840 / 3,000</span>
                  </div>
                  <Progress value={95} className="bg-gray-200" />
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">23</div>
                    <div className="text-sm text-gray-500">Day Streak</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-secondary">8</div>
                    <div className="text-sm text-gray-500">Badges</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Achievements */}
          <Card className="shadow-xl border border-gray-200">
            <CardContent className="p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Achievements</h3>
              
              <div className="space-y-4">
                {achievements.map((achievement, index) => {
                  const IconComponent = achievement.icon;
                  return (
                    <div 
                      key={index}
                      className={`flex items-center space-x-4 p-3 ${achievement.bgColor} rounded-lg border ${achievement.borderColor}`}
                    >
                      <div className={`bg-${achievement.color.split('-')[1]}-100 rounded-full w-12 h-12 flex items-center justify-center`}>
                        <IconComponent className={`${achievement.color} h-6 w-6`} />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{achievement.title}</div>
                        <div className="text-sm text-gray-600">{achievement.description}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
          
          {/* Leaderboard */}
          <Card className="shadow-xl border border-gray-200">
            <CardContent className="p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Weekly Leaderboard</h3>
              
              <div className="space-y-4">
                {leaderboard.map((user) => (
                  <div 
                    key={user.rank}
                    className={`flex items-center space-x-4 p-3 rounded-lg ${
                      user.rank === 1 
                        ? 'bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20' 
                        : 'bg-gray-50'
                    }`}
                  >
                    <div className={`rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold ${
                      user.rank === 1 ? 'bg-primary text-white' : 'bg-gray-300 text-gray-700'
                    }`}>
                      {user.rank}
                    </div>
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-600">{user.xp.toLocaleString()} XP</div>
                    </div>
                    {user.crown && <Crown className="h-5 w-5 text-warning" />}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
