import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar, Clock } from "lucide-react";

const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const calendarDays = [
  { date: 23, tasks: [{ name: 'Python', color: 'bg-primary/10 text-primary' }, { name: 'ML', color: 'bg-secondary/10 text-secondary' }] },
  { date: 24, tasks: [{ name: 'React', color: 'bg-accent/10 text-accent' }] },
  { date: 25, tasks: [{ name: 'Study', color: 'bg-primary text-white' }], isToday: true },
  { date: 26, tasks: [] },
  { date: 27, tasks: [{ name: 'Quiz', color: 'bg-warning/10 text-warning' }] },
  { date: 28, tasks: [] },
  { date: 29, tasks: [{ name: 'Project', color: 'bg-secondary/10 text-secondary' }] }
];

const todaysTasks = [
  {
    id: 1,
    title: "Complete Python Functions Module",
    duration: "45 minutes",
    subject: "Python",
    completed: false,
    color: "bg-primary/10 text-primary"
  },
  {
    id: 2,
    title: "Review Linear Algebra Flashcards",
    duration: "20 minutes", 
    subject: "Mathematics",
    completed: false,
    color: "bg-secondary/10 text-secondary"
  },
  {
    id: 3,
    title: "Practice React Hooks",
    duration: "30 minutes",
    subject: "React",
    completed: true,
    color: "bg-accent/10 text-accent"
  }
];

export default function StudyPlannerInterface() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Smart Study Planning</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Organize your learning across multiple skills with AI-generated study materials and calendar integration.
          </p>
        </div>
        
        <Card className="shadow-xl border border-gray-200 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-secondary to-primary text-white">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold">My Study Plan</CardTitle>
                <p className="text-indigo-100">Week of December 25, 2024</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold">12.5</div>
                <div className="text-sm text-indigo-100">Hours this week</div>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-6">
            {/* Calendar View */}
            <div className="grid grid-cols-7 gap-2 mb-8">
              {weekDays.map((day) => (
                <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                  {day}
                </div>
              ))}
              
              {calendarDays.map((day, index) => (
                <div 
                  key={index}
                  className={`aspect-square border rounded-lg p-2 hover:bg-gray-50 cursor-pointer ${
                    day.isToday ? 'border-2 border-primary bg-primary/5' : 'border-gray-200'
                  }`}
                >
                  <div className={`text-sm font-medium mb-1 ${
                    day.isToday ? 'text-primary font-bold' : 'text-gray-900'
                  }`}>
                    {day.date}
                  </div>
                  <div className="space-y-1">
                    {day.tasks.map((task, taskIndex) => (
                      <div 
                        key={taskIndex}
                        className={`text-xs px-1 py-0.5 rounded ${task.color}`}
                      >
                        {task.name}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Today's Tasks */}
            <div className="border-t border-gray-200 pt-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-secondary" />
                <span>Today's Learning Tasks</span>
              </h4>
              <div className="space-y-4">
                {todaysTasks.map((task) => (
                  <div 
                    key={task.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow"
                  >
                    <div className="flex items-center space-x-3">
                      <Checkbox 
                        checked={task.completed}
                        className="w-5 h-5"
                      />
                      <div>
                        <div className={`font-medium ${
                          task.completed ? 'text-gray-500 line-through' : 'text-gray-900'
                        }`}>
                          {task.title}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center space-x-2">
                          <Clock className="h-4 w-4" />
                          <span>{task.completed ? 'Completed • ' : 'Estimated time: '}{task.duration}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={task.color} variant="secondary">
                        {task.subject}
                      </Badge>
                      {task.completed ? (
                        <div className="text-accent">✓</div>
                      ) : (
                        <div className="text-gray-400">→</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
