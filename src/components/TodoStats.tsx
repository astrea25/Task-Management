
import React from "react";
import { Todo } from "@/services/todoService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Circle, AlertCircle } from "lucide-react";

interface TodoStatsProps {
  todos: Todo[];
}

const TodoStats: React.FC<TodoStatsProps> = ({ todos }) => {
  const totalTodos = todos.length;
  const completedTodos = todos.filter((todo) => todo.completed).length;
  const completionRate = totalTodos > 0 ? Math.round((completedTodos / totalTodos) * 100) : 0;
  
  const lowPriority = todos.filter((todo) => todo.priority === "low").length;
  const mediumPriority = todos.filter((todo) => todo.priority === "medium").length;
  const highPriority = todos.filter((todo) => todo.priority === "high").length;

  return (
    <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Completion Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span className="font-medium">{completionRate}%</span>
            </div>
            <Progress value={completionRate} className="h-2" />
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="flex items-center gap-2">
                <Circle className="h-4 w-4 text-todo-blue" />
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {totalTodos - completedTodos}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Active
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {completedTodos}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Completed
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Priority Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col items-center gap-1">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-100">
                <Circle className="h-5 w-5 text-green-700" />
              </div>
              <div className="space-y-1 text-center">
                <p className="text-sm font-medium leading-none">
                  {lowPriority}
                </p>
                <p className="text-xs text-muted-foreground">
                  Low
                </p>
              </div>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-yellow-100">
                <Circle className="h-5 w-5 text-yellow-700" />
              </div>
              <div className="space-y-1 text-center">
                <p className="text-sm font-medium leading-none">
                  {mediumPriority}
                </p>
                <p className="text-xs text-muted-foreground">
                  Medium
                </p>
              </div>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-red-100">
                <AlertCircle className="h-5 w-5 text-red-700" />
              </div>
              <div className="space-y-1 text-center">
                <p className="text-sm font-medium leading-none">
                  {highPriority}
                </p>
                <p className="text-xs text-muted-foreground">
                  High
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TodoStats;
