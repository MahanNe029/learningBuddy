import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Brain, 
  BookOpen, 
  Target, 
  Users, 
  Trophy, 
  Code, 
  Gamepad2,
  Zap,
  Clock,
  Star,
  ArrowRight,
  Play,
  Sparkles,
  Rocket,
  Shield,
  Globe
} from "lucide-react";

export default function FeaturesGrid() {
  const features = [
    {
      icon: Brain,
      title: "SkillMaster AI",
      description: "Personalized learning roadmaps powered by advanced AI",
      badge: "AI-Powered",
      gradient: "from-blue-500 to-purple-600",
      link: "/skillmaster"
    },
    {
      icon: BookOpen,
      title: "Study Planner",
      description: "Smart scheduling with adaptive learning paths",
      badge: "Smart Planning",
      gradient: "from-green-500 to-teal-600",
      link: "/study-planner"
    },
    {
      icon: Target,
      title: "Assessment Hub",
      description: "Real-time skill evaluation and progress tracking",
      badge: "Instant Feedback",
      gradient: "from-orange-500 to-red-600",
      link: "/assessment"
    },
    {
      icon: Users,
      title: "Mentorship Network",
      description: "Connect with expert mentors in your field",
      badge: "1-on-1 Support",
      gradient: "from-pink-500 to-purple-600",
      link: "/mentorship"
    },
    {
      icon: Trophy,
      title: "Quest System",
      description: "Gamified learning with rewards and achievements",
      badge: "Gamified",
      gradient: "from-yellow-500 to-orange-600",
      link: "/quests"
    },
    {
      icon: Code,
      title: "Coding Arena",
      description: "Interactive coding challenges with AI assistance",
      badge: "Interactive",
      gradient: "from-indigo-500 to-blue-600",
      link: "/coding-arena"
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Powerful Learning Features
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Experience the future of education with our comprehensive suite of AI-powered tools
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-0 bg-white dark:bg-gray-800">
                <CardContent className="p-8">
                  <div className="text-center space-y-4">
                    <div className={`inline-flex p-4 rounded-full bg-gradient-to-r ${feature.gradient} text-white shadow-lg`}>
                      <IconComponent size={32} />
                    </div>

                    <div className="space-y-2">
                      <Badge variant="secondary" className="mb-2">
                        {feature.badge}
                      </Badge>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        {feature.description}
                      </p>
                    </div>

                    <Button 
                      className="w-full mt-4 group-hover:shadow-lg transition-all duration-200"
                      asChild
                    >
                      <a href={feature.link}>
                        Explore Feature
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4">
            <Sparkles className="mr-2 h-5 w-5" />
            Start Your Learning Journey
          </Button>
        </div>
      </div>
    </section>
  );
}