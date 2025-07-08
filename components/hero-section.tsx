
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Sparkles, 
  TrendingUp, 
  Users, 
  Clock,
  ArrowRight,
  Star,
  Zap,
  Target,
  BookOpen
} from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -right-4 w-24 h-24 bg-blue-200/30 rounded-full blur-xl"></div>
        <div className="absolute top-1/2 -left-8 w-32 h-32 bg-purple-200/20 rounded-full blur-2xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-16 h-16 bg-indigo-200/40 rounded-full blur-lg"></div>
      </div>

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-12 sm:py-16 lg:py-20">
          {/* Announcement Badge */}
          <div className="flex justify-center mb-6 sm:mb-8">
            <Badge 
              variant="secondary" 
              className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 dark:from-blue-900/30 dark:to-purple-900/30 dark:text-blue-200 px-4 py-2 text-sm sm:text-base font-medium border-0 shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              🎉 Join 1M+ learners mastering skills with AI
            </Badge>
          </div>

          {/* Main Content */}
          <div className="text-center max-w-5xl mx-auto">
            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 tracking-tight">
              <span className="block">Master Any Skill</span>
              <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                With AI-Powered Learning
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg sm:text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 sm:mb-10 max-w-3xl mx-auto leading-relaxed px-4">
              Personalized roadmaps, adaptive assessments, and AI tutoring that evolve with your learning style. 
              Transform your future at <span className="font-semibold text-blue-600 dark:text-blue-400">MatrixProg.com</span>
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 sm:mb-16 px-4">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-base sm:text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 min-h-[52px]"
              >
                <Target className="w-5 h-5 mr-2" />
                Create Your Roadmap
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              
              <Button 
                variant="outline" 
                size="lg" 
                className="border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 px-8 py-4 text-base sm:text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 min-h-[52px]"
              >
                <BookOpen className="w-5 h-5 mr-2" />
                Explore Features
              </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-12 sm:mb-16">
              <Card className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1">
                <CardContent className="p-4 sm:p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">1M+</div>
                  <div className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Active Learners</div>
                </CardContent>
              </Card>

              <Card className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1">
                <CardContent className="p-4 sm:p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">500+</div>
                  <div className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Skill Paths</div>
                </CardContent>
              </Card>

              <Card className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1">
                <CardContent className="p-4 sm:p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">95%</div>
                  <div className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Success Rate</div>
                </CardContent>
              </Card>

              <Card className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1">
                <CardContent className="p-4 sm:p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">24/7</div>
                  <div className="text-sm sm:text-base text-gray-600 dark:text-gray-400">AI Support</div>
                </CardContent>
              </Card>
            </div>

            {/* Social Proof */}
            <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-lg">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 mb-6">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full border-2 border-white dark:border-gray-800"></div>
                    ))}
                  </div>
                  <span className="text-sm sm:text-base text-gray-600 dark:text-gray-400">+12,000 more</span>
                </div>
                
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                  <span className="ml-2 text-sm sm:text-base font-medium text-gray-900 dark:text-white">4.9/5</span>
                </div>
              </div>

              <blockquote className="text-base sm:text-lg text-gray-700 dark:text-gray-300 italic mb-4">
                "MatrixProg transformed my career. The AI-powered learning paths are incredibly personalized and effective. I went from beginner to landing my dream job in just 6 months!"
              </blockquote>
              
              <div className="text-sm sm:text-base font-medium text-gray-900 dark:text-white">
                — Sarah Chen, Software Engineer at Google
              </div>
            </div>

            {/* Limited Time Offer */}
            <div className="mt-8 sm:mt-12">
              <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl p-4 sm:p-6 shadow-lg">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-center sm:text-left">
                    <div className="text-lg sm:text-xl font-bold">Limited Time: 20% OFF Pro Plan!</div>
                    <div className="text-sm sm:text-base opacity-90">Join thousands of learners advancing their careers</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="text-2xl sm:text-3xl font-bold">29</div>
                      <div className="text-xs sm:text-sm">Days Left</div>
                    </div>
                    <Button 
                      variant="secondary" 
                      className="bg-white text-orange-600 hover:bg-gray-100 font-semibold px-6 py-2 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
                    >
                      Claim Offer
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
