'use client';

import { Calendar, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';

interface StudyPlannerCalendarProps {
  studyPlan: {
    id: string;
    title: string;
    skills: string[];
    schedule?: Array<{
      date: string;
      tasks: Array<{
        id: string;
        skill: string;
        task: string;
        duration: number;
        completed: boolean;
      }>;
    }>;
  };
}

export default function StudyPlannerCalendar({ studyPlan }: StudyPlannerCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // Generate dates for the next 7 days
  const getWeekDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push({
        date: date.toISOString().split('T')[0],
        formatted: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
      });
    }
    return dates;
  };

  const weekDates = getWeekDates();

  // Find tasks for the selected date
  const getTasksForDate = (date: string) => {
    if (!studyPlan.schedule) return [];
    return studyPlan.schedule.find((day) => day.date === date)?.tasks || [];
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-accent" />
          <span>{studyPlan.title} - Calendar View</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-7 gap-2 mb-6">
          {weekDates.map((day) => (
            <Button
              key={day.date}
              variant={selectedDate === day.date ? 'default' : 'outline'}
              className="flex flex-col h-auto py-2"
              onClick={() => setSelectedDate(day.date)}
            >
              <span className="text-xs">{day.formatted.split(' ')[0]}</span>
              <span className="text-sm font-semibold">{day.formatted.split(' ')[2]}</span>
              <span className="text-xs">{day.formatted.split(' ')[1]}</span>
            </Button>
          ))}
        </div>

        {selectedDate && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">
              Tasks for {weekDates.find((d) => d.date === selectedDate)?.formatted}
            </h3>
            {getTasksForDate(selectedDate).length > 0 ? (
              <div className="space-y-3">
                {getTasksForDate(selectedDate).map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex-1">
                      <div className={`text-sm ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                        {task.task}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                        <Clock className="h-3 w-3" />
                        <span>{task.duration} min</span>
                        <Badge variant="secondary" className="text-xs">
                          {task.skill}
                        </Badge>
                      </div>
                    </div>
                    <Badge variant={task.completed ? 'default' : 'outline'}>
                      {task.completed ? 'Completed' : 'Pending'}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No tasks scheduled for this day.</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}