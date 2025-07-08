import { useState, useRef, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import Navbar from "@/components/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, Send, Bot, User, Clock, HelpCircle } from "lucide-react";

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: Date;
}

export default function AITutor() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [currentMessage, setCurrentMessage] = useState("");
  const [currentConversationId, setCurrentConversationId] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hi! I'm your AI tutor. What would you like to learn about today?",
      timestamp: new Date(),
    }
  ]);
  const [remainingQuestions, setRemainingQuestions] = useState<number>(-1);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: conversations } = useQuery({
    queryKey: ["/api/ai-tutor/conversations"],
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await apiRequest("POST", "/api/ai-tutor/chat", {
        message,
        conversationId: currentConversationId,
      });
      return response.json();
    },
    onSuccess: (data) => {
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: data.message, timestamp: new Date() }
      ]);
      setCurrentConversationId(data.conversationId);
      setRemainingQuestions(data.remainingQuestions);
      queryClient.invalidateQueries({ queryKey: ["/api/ai-tutor/conversations"] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentMessage.trim()) return;
    
    if (user?.subscriptionTier === 'free' && remainingQuestions === 0) {
      toast({
        title: "Daily limit reached",
        description: "Upgrade to Pro for unlimited questions!",
        variant: "destructive",
      });
      return;
    }

    // Add user message immediately
    const userMessage: Message = {
      role: 'user',
      content: currentMessage,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    sendMessageMutation.mutate(currentMessage);
    setCurrentMessage("");
  };

  const loadConversation = (conversation: any) => {
    setMessages(conversation.messages.map((msg: any) => ({
      ...msg,
      timestamp: new Date(msg.timestamp || Date.now()),
    })));
    setCurrentConversationId(conversation.id);
  };

  const startNewConversation = () => {
    setMessages([
      {
        role: 'assistant',
        content: "Hi! I'm your AI tutor. What would you like to learn about today?",
        timestamp: new Date(),
      }
    ]);
    setCurrentConversationId(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
            <Bot className="h-8 w-8 text-accent" />
            <span>AI Tutor</span>
          </h1>
          <p className="text-gray-600 mt-2">Get instant help with your learning questions 24/7</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Conversation History */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="text-lg">Conversations</span>
                <Button size="sm" onClick={startNewConversation}>
                  New Chat
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {conversations && conversations.length > 0 ? (
                  conversations.slice(0, 10).map((conversation: any) => (
                    <div
                      key={conversation.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        currentConversationId === conversation.id
                          ? 'border-accent bg-accent/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => loadConversation(conversation)}
                    >
                      <div className="text-sm font-medium text-gray-900 line-clamp-2">
                        {conversation.messages[conversation.messages.length - 1]?.content.substring(0, 50) || 'New conversation'}...
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {new Date(conversation.updatedAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4">
                    <MessageCircle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">No conversations yet</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Main Chat Interface */}
          <Card className="lg:col-span-3">
            <CardHeader className="bg-gradient-accent text-white rounded-t-lg">
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
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm">24/7 Available</span>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-0">
              {/* Messages */}
              <ScrollArea className="h-96 p-4">
                <div className="space-y-4">
                  {messages.map((message, index) => (
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
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.role === 'user'
                            ? 'bg-primary text-white'
                            : 'bg-white border border-gray-200'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        {message.timestamp && (
                          <p className={`text-xs mt-1 ${
                            message.role === 'user' ? 'text-primary-foreground/70' : 'text-gray-500'
                          }`}>
                            {message.timestamp.toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </p>
                        )}
                      </div>

                      {message.role === 'user' && (
                        <div className="bg-primary/10 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                          <User className="h-4 w-4 text-primary" />
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {sendMessageMutation.isPending && (
                    <div className="flex space-x-3">
                      <div className="bg-accent/10 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                        <Bot className="h-4 w-4 text-accent" />
                      </div>
                      <div className="bg-white border border-gray-200 rounded-lg p-3 max-w-xs">
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
                <div ref={messagesEndRef} />
              </ScrollArea>

              {/* Message Input */}
              <div className="border-t border-gray-200 p-4">
                <form onSubmit={handleSendMessage} className="flex space-x-3">
                  <Input
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    placeholder="Ask your AI tutor anything..."
                    className="flex-1"
                    disabled={sendMessageMutation.isPending}
                  />
                  <Button 
                    type="submit" 
                    disabled={!currentMessage.trim() || sendMessageMutation.isPending}
                    className="bg-accent hover:bg-accent/90"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
                
                <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
                  <div className="flex items-center space-x-4">
                    <span>
                      {remainingQuestions === -1 
                        ? 'Unlimited questions' 
                        : `${remainingQuestions} questions remaining today`
                      }
                    </span>
                    {user?.subscriptionTier === 'free' && (
                      <>
                        <span>•</span>
                        <a href="#" className="text-primary hover:underline">
                          Upgrade for unlimited
                        </a>
                      </>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <HelpCircle className="h-3 w-3" />
                    <span>Powered by Groq AI</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Question Templates */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <HelpCircle className="h-5 w-5 text-primary" />
              <span>Quick Questions</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                "Explain how Python functions work",
                "What is machine learning?",
                "How do I debug JavaScript code?",
                "Explain REST API principles",
                "What are data structures?",
                "How does Git branching work?",
              ].map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="justify-start h-auto p-4 text-left whitespace-normal"
                  onClick={() => {
                    setCurrentMessage(question);
                    // Auto-focus the input after setting the message
                    setTimeout(() => {
                      const input = document.querySelector('input[placeholder="Ask your AI tutor anything..."]') as HTMLInputElement;
                      input?.focus();
                    }, 100);
                  }}
                >
                  <div>
                    <div className="font-medium text-gray-900">{question}</div>
                    <div className="text-xs text-gray-500 mt-1">Click to ask</div>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
