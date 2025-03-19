import React, { useState } from "react";
import { Todo, updateTodoStatus, updateTodoText, updateTodoPriority, updateTodoDueDate, deleteTodo } from "@/services/todoService";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pen, Trash2, Check, X, Calendar, Clock, AlertTriangle } from "lucide-react";
import { format } from "date-fns";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

interface TodoItemProps {
  todo: Todo;
  onUpdate: () => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, onUpdate }) => {
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const priorityColors = {
    low: "bg-green-100 text-green-800",
    medium: "bg-yellow-100 text-yellow-800",
    high: "bg-red-100 text-red-800"
  };
  
  const dueDateToJsDate = todo.dueDate ? todo.dueDate.toDate() : null;
  
  const isPastDue = () => {
    if (!todo.dueDate || todo.completed) return false;
    const now = new Date();
    return todo.dueDate.toDate() < now;
  };

  const formatDueDate = () => {
    if (!dueDateToJsDate) return null;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const dueDate = new Date(dueDateToJsDate);
    dueDate.setHours(0, 0, 0, 0);
    
    if (dueDate.getTime() === today.getTime()) {
      return "Today";
    } else if (dueDate.getTime() === tomorrow.getTime()) {
      return "Tomorrow";
    } else {
      return format(dueDateToJsDate, "MMM d, yyyy");
    }
  };

  const handleStatusChange = async () => {
    try {
      await updateTodoStatus(todo.id, !todo.completed);
      onUpdate();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update todo status",
        variant: "destructive",
      });
    }
  };

  const handleEdit = () => {
    setEditText(todo.text);
    setEditing(true);
  };

  const handleSaveEdit = async () => {
    if (editText.trim() === "") return;
    
    try {
      await updateTodoText(todo.id, editText);
      setEditing(false);
      onUpdate();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update todo",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteTodo(todo.id);
      toast({
        title: "Success",
        description: "Todo deleted successfully",
      });
      onUpdate();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete todo",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handlePriorityChange = async (priority: "low" | "medium" | "high") => {
    try {
      console.log("Raw dueDate from Firestore:", todo.dueDate);
      console.log("Type of dueDate:", typeof todo.dueDate);
      await updateTodoPriority(todo.id, priority);
      onUpdate();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update priority",
        variant: "destructive",
      });
    }
  };
  
  const handleDueDateChange = async (date: Date | null) => {
    try {
      await updateTodoDueDate(todo.id, date);
      onUpdate();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update due date",
        variant: "destructive",
      });
    }
  };

  return (
    <div className={cn(
      "group flex items-center justify-between gap-2 rounded-lg border p-3 transition-all hover:bg-gray-50 animate-fade-in",
      todo.completed && "bg-gray-50 opacity-70",
      isPastDue() && "border-red-300 bg-red-50"
    )}>
      <div className="flex items-center gap-3 flex-1">
        <Checkbox 
          checked={todo.completed} 
          onCheckedChange={handleStatusChange}
          className="h-5 w-5"
        />
        
        {editing ? (
          <div className="flex items-center gap-2 flex-1">
            <Input
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="flex-1"
              autoFocus
            />
            <Button size="icon" variant="ghost" onClick={handleSaveEdit}>
              <Check className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="ghost" onClick={() => setEditing(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="flex-1">
            <span className={cn(
              "text-sm font-medium",
              todo.completed && "line-through text-gray-500",
              isPastDue() && "text-red-600"
            )}>
              {todo.text}
            </span>
            <div className="flex items-center mt-1 gap-2 flex-wrap">
              <span className={cn(
                "text-xs px-2 py-0.5 rounded-full",
                priorityColors[todo.priority]
              )}>
                {todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1)}
              </span>
              
              {dueDateToJsDate && (
                <span className={cn(
                  "text-xs flex items-center gap-1 px-2 py-0.5 rounded-full border",
                  isPastDue() 
                    ? "text-red-600 border-red-200 bg-red-50 font-medium" 
                    : "text-blue-600 border-blue-200 bg-blue-50"
                )}>
                  {isPastDue() ? <AlertTriangle className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                  {formatDueDate()}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
      
      {!editing && (
        <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity gap-1">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 px-2">
                <Calendar className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <div className="p-2 flex justify-between items-center border-b">
                <span className="text-sm font-medium">Due Date</span>
                {dueDateToJsDate && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleDueDateChange(null)}
                    className="h-8 px-2 text-red-500 hover:text-red-600"
                  >
                    Clear
                  </Button>
                )}
              </div>
              <CalendarComponent
                mode="single"
                selected={dueDateToJsDate || undefined}
                onSelect={handleDueDateChange}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 px-2">
                Priority
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handlePriorityChange("low")}>
                Low
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handlePriorityChange("medium")}>
                Medium
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handlePriorityChange("high")}>
                High
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button onClick={handleEdit} size="icon" variant="ghost">
            <Pen className="h-4 w-4" />
          </Button>
          <Button 
            onClick={handleDelete} 
            size="icon" 
            variant="ghost" 
            disabled={isDeleting}
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default TodoItem;
