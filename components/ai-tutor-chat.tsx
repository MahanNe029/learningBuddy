import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Bot, User, Send, Clock, GraduationCap, Lightbulb, Infinity } from "lucide-react";

const initialMessages = [
  {
    role: 'assistant',
    content: "Hi! I'm your AI tutor. What would you like to learn about today?",
    timestamp: new Date(Date.now() - 300000)
  },
  {
    role: 'user', 
    content: "Can you explain how Python functions work?",
    timestamp: new Date(Date.now() - 240000)
  },
  {
    role: 'assistant',
    content: "Great question! Python functions are reusable blocks of code that perform specific tasks. Here's a simple example:",
    timestamp: new Date(Date.now() - 180000),
    code: `def greet(name):
    return f"Hello, {name}!"`
  },
  {
    role: 'user',
    content: "That's helpful! Can you show me more examples?", 
    timestamp: new Date(Date.now() - 120000)
  }
];

const features = [
  {
    icon: Clock,
    title: "Available 24/7 for instant support",
    color: "text-accent"
  },
  {
    icon: GraduationCap,
    title: "Adapts to your learning style",
    color: "text-accent"
  },
  {
    icon: Lightbulb,
    title: "Provides examples and explanations",
    color: "text-accent"
  },
  {
    icon: Infinity,
    title: "Unlimited questions for premium users",
    color: "text-accent"
  }
];

export default function AITutorChat() {
  const [currentMessage, setCurrentMessage] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    // Demo functionality - in real app this would send to AI
    setCurrentMessage("");
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Your Personal AI Tutor
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Get instant help with any learning question. Our AI tutor is available 24/7 to provide 
              explanations, examples, and guidance tailored to your learning style.
            </p>
            
            <div className="space-y-4">
              {features.map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <div key={index} className="flex items-center space-x-3">
                    <IconComponent className={`h-5 w-5 ${feature.color}`} />
                    <span className="text-gray-700">{feature.title}</span>
                  </div>
                );
              })}
            </div>
          </div>
          
          <Card className="shadow-xl border border-gray-200 overflow-hidden">
            <CardHeader className="bg-gradient-accent text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-white/20 rounded-full p-2">
                    <Bot className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle className="text-white">AI Tutor</CardTitle>
                    <p className="text-sm text-green-100">Online • Ready to help</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Clock className="h-4 w-4" />
                  <span>24/7 Available</span>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-0">
              {/* Messages */}
              <ScrollArea className="h-96 p-4 bg-gradient-to-b from-gray-50 to-white">
                <div className="space-y-4">
                  {initialMessages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex space-x-3 ${
                        message.role === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      {message.role === 'assistant' && (
                        <div className="bg-accent/10 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                          <Bot className="h-4 w-4 text-accent" />
                        </div>
                      )}
                      
                      <div
                        className={`max-w-xs rounded-lg p-3 ${
                          message.role === 'user'
                            ? 'bg-primary text-white'
                            : 'bg-white shadow-sm border border-gray-200'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        {message.code && (
                          <div className="bg-gray-100 rounded p-2 mt-2 font-mono text-xs">
                            <code>{message.code}</code>
                          </div>
                        )}
                        <p className={`text-xs mt-1 ${
                          message.role === 'user' ? 'text-primary-foreground/70' : 'text-gray-500'
                        }`}>
                          {message.timestamp.toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </p>
                      </div>

                      {message.role === 'user' && (
                        <div className="bg-primary/10 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                          <User className="h-4 w-4 text-primary" />
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {isTyping && (
                    <div className="flex space-x-3">
                      <div className="bg-accent/10 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                        <Bot className="h-4 w-4 text-accent" />
                      </div>
                      <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-3 max-w-xs">
                        <div className="flex items-center space-x-2 text-gray-500">
                          <div className="animate-pulse">●</div>
                          <div className="animate-pulse" style={{ animationDelay: '0.2s' }}>●</div>
                          <div className="animate-pulse" style={{ animationDelay: '0.4s' }}>●</div>
                          <span className="text-xs ml-2">AI is typing...</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              {/* Message Input */}
              <div className="border-t border-gray-200 p-4">
                <form onSubmit={handleSendMessage} className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3">
                  <Input
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    placeholder="Ask your AI tutor anything..."
                    className="flex-1 min-h-[48px] text-base sm:text-sm sm:min-h-[44px] touch-improvement"
                  />
                  <Button 
                    type="submit" 
                    className="bg-accent hover:bg-accent/90 min-h-[48px] sm:min-h-[44px] sm:min-w-[44px] font-medium touch-improvement"
                    disabled={!currentMessage.trim()}
                  >
                    <Send className="h-4 w-4 sm:mr-0 mr-2" />
                    <span className="sm:hidden">Send Message</span>
                  </Button>
                </form>
                
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-3 space-y-2 sm:space-y-0 text-xs text-gray-500">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-1 sm:space-y-0">
                    <span>7 questions remaining today</span>
                    <span className="hidden sm:block">•</span>
                    <a href="#" className="text-primary hover:underline">
                      Upgrade for unlimited
                    </a>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Bot className="h-3 w-3" />
                    <span>Powered by Groq AI</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
