import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import NavBar from "@/components/NavBar";
import AITutorChat from "@/components/AITutorChat";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Bot, 
  MessageCircle, 
  Clock, 
  Zap, 
  Brain, 
  Lightbulb,
  Plus,
  History,
  TrendingUp
} from "lucide-react";

export default function AITutor() {
  const [selectedConversation, setSelectedConversation] = useState<number | undefined>();

  const { data: conversations, isLoading } = useQuery({
    queryKey: ["/api/ai-tutor/conversations"],
  });

  const { data: apiUsage } = useQuery({
    queryKey: ["/api/user/usage"],
  });

  const getRemainingQuestions = () => {
    const tutorUsage = apiUsage?.find((usage: any) => usage.endpoint === 'tutor');
    const dailyLimit = 10; // Free tier limit
    return Math.max(0, dailyLimit - (tutorUsage?.requestCount || 0));
  };

  const getUsagePercentage = () => {
    const remaining = getRemainingQuestions();
    return ((10 - remaining) / 10) * 100;
  };

  const features = [
    {
      icon: <Clock className="text-accent" size={24} />,
      title: "Available 24/7",
      description: "Get instant help whenever you need it, no waiting for office hours"
    },
    {
      icon: <Brain className="text-primary" size={24} />,
      title: "Context-Aware",
      description: "Remembers your conversation and adapts to your learning style"
    },
    {
      icon: <Lightbulb className="text-warning" size={24} />,
      title: "Detailed Explanations",
      description: "Provides step-by-step explanations with examples and analogies"
    },
    {
      icon: <Zap className="text-secondary" size={24} />,
      title: "Instant Responses",
      description: "Get immediate answers powered by advanced AI language models"
    }
  ];

  const exampleQuestions = [
    "Explain Python functions with examples",
    "How does machine learning work?",
    "What's the difference between React and Vue?",
    "Can you help me debug this JavaScript code?",
    "Explain object-oriented programming concepts",
    "How do I optimize SQL queries?",
    "What are the best practices for API design?",
    "How does blockchain technology work?"
  ];

  const recentConversations = conversations?.slice(0, 5) || [];

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Bot className="text-accent" size={32} />
            <h1 className="text-4xl font-bold text-foreground">AI Tutor</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl">
            Your personal AI tutor is here to help 24/7. Ask questions, get explanations, and receive personalized guidance on any topic.
          </p>
        </div>

        {/* Usage Stats */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-accent mb-2">{getRemainingQuestions()}</div>
                <div className="text-sm text-muted-foreground">Questions remaining today</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">{conversations?.length || 0}</div>
                <div className="text-sm text-muted-foreground">Total conversations</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-secondary mb-2">{getUsagePercentage().toFixed(0)}%</div>
                <div className="text-sm text-muted-foreground">Daily usage</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="chat" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3 max-w-md">
            <TabsTrigger value="chat">New Chat</TabsTrigger>
            <TabsTrigger value="conversations">History ({conversations?.length || 0})</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
          </TabsList>

          <TabsContent value="chat" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Chat Interface */}
              <div className="lg:col-span-2">
                <AITutorChat conversationId={selectedConversation} />
              </div>
              
              {/* Example Questions */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lightbulb className="text-warning" size={20} />
                      Example Questions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {exampleQuestions.slice(0, 6).map((question, index) => (
                        <div
                          key={index}
                          className="p-3 bg-muted/50 rounded-lg cursor-pointer hover:bg-muted transition-colors text-sm"
                          onClick={() => {
                            // This would populate the chat input
                            const chatInput = document.querySelector('input[placeholder*="Ask your AI tutor"]') as HTMLInputElement;
                            if (chatInput) {
                              chatInput.value = question;
                              chatInput.focus();
                            }
                          }}
                        >
                          {question}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Tips */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Tips for Better Responses</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="text-sm">
                      <div className="font-medium text-foreground mb-1">Be specific</div>
                      <div className="text-muted-foreground">Include context and what you're trying to achieve</div>
                    </div>
                    <div className="text-sm">
                      <div className="font-medium text-foreground mb-1">Ask for examples</div>
                      <div className="text-muted-foreground">Request code examples or practical demonstrations</div>
                    </div>
                    <div className="text-sm">
                      <div className="font-medium text-foreground mb-1">Break down complex topics</div>
                      <div className="text-muted-foreground">Ask follow-up questions to dive deeper</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="conversations" className="space-y-6">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <Card key={i}>
                    <CardContent className="p-6">
                      <div className="animate-pulse space-y-4">
                        <div className="h-4 bg-muted rounded w-3/4"></div>
                        <div className="h-3 bg-muted rounded w-1/2"></div>
                        <div className="h-8 bg-muted rounded"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : recentConversations.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recentConversations.map((conversation: any) => (
                  <Card key={conversation.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <MessageCircle className="text-accent" size={16} />
                            <h3 className="font-semibold text-foreground">
                              {conversation.subject || "General Discussion"}
                            </h3>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {conversation.messages && conversation.messages.length > 0 
                              ? conversation.messages[0].content 
                              : "No messages yet"}
                          </p>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Badge variant="secondary">
                            {conversation.messages?.length || 0} messages
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {new Date(conversation.updatedAt).toLocaleDateString()}
                          </span>
                        </div>
                        
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full"
                          onClick={() => {
                            setSelectedConversation(conversation.id);
                            document.querySelector('[value="chat"]')?.click();
                          }}
                        >
                          Continue Chat
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <History className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">No conversations yet</h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    Start your first conversation with the AI tutor to get personalized help with your learning questions.
                  </p>
                  <Button onClick={() => document.querySelector('[value="chat"]')?.click()}>
                    <Plus size={16} className="mr-2" />
                    Start New Chat
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="features" className="space-y-6">
            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {features.map((feature, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="bg-muted/50 rounded-lg p-3">
                        {feature.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                        <p className="text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Subscription Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="text-primary" size={20} />
                  Upgrade for More
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-6 border border-border rounded-lg">
                    <h4 className="text-lg font-semibold text-foreground mb-2">Free</h4>
                    <div className="text-2xl font-bold text-primary mb-2">10</div>
                    <div className="text-sm text-muted-foreground mb-4">Questions per day</div>
                    <Badge variant="secondary">Current Plan</Badge>
                  </div>
                  
                  <div className="text-center p-6 border border-primary rounded-lg bg-primary/5">
                    <h4 className="text-lg font-semibold text-foreground mb-2">Pro</h4>
                    <div className="text-2xl font-bold text-primary mb-2">Unlimited</div>
                    <div className="text-sm text-muted-foreground mb-4">Questions per day</div>
                    <Button className="w-full">Upgrade to Pro</Button>
                  </div>
                  
                  <div className="text-center p-6 border border-secondary rounded-lg bg-secondary/5">
                    <h4 className="text-lg font-semibold text-foreground mb-2">Elite</h4>
                    <div className="text-2xl font-bold text-secondary mb-2">Priority</div>
                    <div className="text-sm text-muted-foreground mb-4">Faster responses</div>
                    <Button variant="secondary" className="w-full">Upgrade to Elite</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
