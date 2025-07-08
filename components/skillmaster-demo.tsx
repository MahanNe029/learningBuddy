import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Brain, Sparkles } from "lucide-react";

export default function SkillMasterDemo() {
  const [formData, setFormData] = useState({
    skill: "",
    level: "",
    goals: "",
    timeAvailable: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const steps = [
    {
      number: 1,
      title: "Choose Your Skill",
      description: "Select from hundreds of skills across technology, business, arts, and more."
    },
    {
      number: 2,
      title: "Set Your Goals", 
      description: "Define what you want to achieve and how much time you can dedicate."
    },
    {
      number: 3,
      title: "Get Your Roadmap",
      description: "Receive a personalized, step-by-step learning plan powered by AI."
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Create Your Personalized Learning Roadmap
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Our AI analyzes your goals, current skill level, and available time to create 
              a custom learning path that adapts as you progress.
            </p>
            
            <div className="space-y-6">
              {steps.map((step) => (
                <div key={step.number} className="flex items-start space-x-4">
                  <div className="bg-primary/10 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-primary font-bold text-sm">{step.number}</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">{step.title}</h4>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <Card className="shadow-xl border border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Brain className="h-6 w-6 text-primary" />
                <span>SkillMaster AI</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">
                  What skill do you want to master?
                </Label>
                <Input
                  placeholder="e.g., Python Programming, Data Science, Web Development"
                  value={formData.skill}
                  onChange={(e) => handleInputChange('skill', e.target.value)}
                  className="w-full"
                />
              </div>
              
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">
                  Current skill level
                </Label>
                <Select onValueChange={(value) => handleInputChange('level', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Complete Beginner">Complete Beginner</SelectItem>
                    <SelectItem value="Some Experience">Some Experience</SelectItem>
                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                    <SelectItem value="Advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">
                  Learning goal
                </Label>
                <Textarea
                  placeholder="e.g., Build web applications, Get a job in tech, Pass certification exam"
                  value={formData.goals}
                  onChange={(e) => handleInputChange('goals', e.target.value)}
                  className="h-24 resize-none"
                />
              </div>
              
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">
                  Available time per week
                </Label>
                <Select onValueChange={(value) => handleInputChange('timeAvailable', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select time commitment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-3 hours">1-3 hours</SelectItem>
                    <SelectItem value="4-6 hours">4-6 hours</SelectItem>
                    <SelectItem value="7-10 hours">7-10 hours</SelectItem>
                    <SelectItem value="10+ hours">10+ hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button className="w-full bg-primary hover:bg-primary/90 font-semibold">
                <Sparkles className="h-4 w-4 mr-2" />
                Generate My Roadmap
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
