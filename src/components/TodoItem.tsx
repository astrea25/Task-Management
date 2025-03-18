
import React, { useState } from "react";
import { Todo, updateTodoStatus, updateTodoText, updateTodoPriority, deleteTodo } from "@/services/todoService";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pen, Trash2, Check, X } from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

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

  return (
    <div className={cn(
      "group flex items-center justify-between gap-2 rounded-lg border p-3 transition-all hover:bg-gray-50 animate-fade-in",
      todo.completed && "bg-gray-50 opacity-70"
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
              todo.completed && "line-through text-gray-500"
            )}>
              {todo.text}
            </span>
            <div className="flex items-center mt-1 gap-2">
              <span className={cn(
                "text-xs px-2 py-0.5 rounded-full",
                priorityColors[todo.priority]
              )}>
                {todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1)}
              </span>
            </div>
          </div>
        )}
      </div>
      
      {!editing && (
        <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
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
