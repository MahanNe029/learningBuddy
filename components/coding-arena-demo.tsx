import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Lightbulb, CheckCircle } from "lucide-react";

const codeLines = [
  { number: 1, code: 'def fibonacci(n):', color: 'text-purple-400' },
  { number: 2, code: '    if n <= 1:', color: 'text-purple-400' },
  { number: 3, code: '        return n', color: 'text-purple-400' },
  { number: 4, code: '    return fibonacci(n-1) + fibonacci(n-2)', color: 'text-white' },
  { number: 5, code: '', color: 'text-white' },
  { number: 6, code: '# Test the function', color: 'text-gray-500' },
  { number: 7, code: 'print(fibonacci(10))', color: 'text-blue-400' },
  { number: 8, code: '|', color: 'text-white animate-pulse' }
];

const hints = [
  {
    type: "Performance Tip",
    message: "Your recursive Fibonacci implementation works but can be optimized. Consider using memoization or dynamic programming for better performance with larger numbers.",
    icon: Lightbulb,
    color: "text-primary",
    bgColor: "bg-primary/10 border-primary/20"
  },
  {
    type: "Code Quality",
    message: "Great job on the clean implementation! Your code is readable and follows Python conventions.",
    icon: CheckCircle,
    color: "text-accent",
    bgColor: "bg-accent/10 border-accent/20"
  }
];

export default function CodingArenaDemo() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Practice Coding with AI Assistance
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Write, test, and improve your code with our integrated development environment 
            powered by AI hints and suggestions.
          </p>
        </div>
        
        <Card className="bg-gray-900 shadow-2xl overflow-hidden">
          <CardHeader className="bg-gray-800 border-b border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <span className="text-gray-300 text-sm font-medium">main.py</span>
              </div>
              <div className="flex items-center space-x-4">
                <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                  <Play className="h-4 w-4 mr-1" />
                  Run
                </Button>
                <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                  <Lightbulb className="h-4 w-4 mr-1" />
                  AI Hint
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-0">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Code Editor */}
              <div className="p-6 bg-gray-900">
                <div className="font-mono text-sm leading-relaxed">
                  {codeLines.map((line) => (
                    <div key={line.number} className="flex">
                      <span className="text-gray-500 select-none w-8 mr-4 text-right">
                        {line.number}
                      </span>
                      <span className={line.color}>
                        {line.code}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Output & AI Assistant */}
              <div className="border-l border-gray-700 bg-gray-800">
                <div className="p-6">
                  <div className="mb-6">
                    <h4 className="text-white font-semibold mb-3">Output</h4>
                    <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm">
                      <div className="text-green-400">55</div>
                      <div className="text-gray-500">Process finished with exit code 0</div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-white font-semibold mb-3">AI Assistant</h4>
                    <div className="space-y-3">
                      {hints.map((hint, index) => {
                        const IconComponent = hint.icon;
                        return (
                          <div 
                            key={index}
                            className={`${hint.bgColor} border rounded-lg p-3`}
                          >
                            <div className="flex items-start space-x-2">
                              <IconComponent className={`${hint.color} h-4 w-4 mt-1 flex-shrink-0`} />
                              <div className="text-sm text-gray-300">
                                <p className={`font-medium ${hint.color} mb-1`}>{hint.type}</p>
                                <p>{hint.message}</p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
