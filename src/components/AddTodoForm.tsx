
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { addTodo, NewTodo } from "@/services/todoService";
import { Plus, Calendar } from "lucide-react";
import { format } from "date-fns";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";

interface AddTodoFormProps {
  userId: string;
  onAdd: () => void;
}

const AddTodoForm: React.FC<AddTodoFormProps> = ({ userId, onAdd }) => {
  const [text, setText] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!text.trim()) return;
    
    const newTodo: NewTodo = {
      text: text.trim(),
      priority,
      dueDate
    };
    
    try {
      setIsSubmitting(true);
      await addTodo(userId, newTodo);
      setText("");
      setDueDate(null);
      onAdd();
      toast({
        title: "Success",
        description: "Todo added successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add todo",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start gap-2">
        <div className="flex-1 w-full">
          <Input
            placeholder="Add a new task..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full"
          />
        </div>
        
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full sm:w-[150px] justify-start text-left font-normal",
                  !dueDate && "text-muted-foreground"
                )}
                type="button"
              >
                <Calendar className="mr-2 h-4 w-4" />
                {dueDate ? format(dueDate, "MMM d, yyyy") : <span>Set due date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <CalendarComponent
                mode="single"
                selected={dueDate || undefined}
                onSelect={setDueDate}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>

          <Select 
            value={priority} 
            onValueChange={(value) => setPriority(value as "low" | "medium" | "high")}
          >
            <SelectTrigger className="w-full sm:w-[120px]">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
          
          <Button 
            type="submit" 
            disabled={isSubmitting || !text.trim()}
            className="bg-todo-blue hover:bg-blue-700 w-full sm:w-auto"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add
          </Button>
        </div>
      </div>
    </form>
  );
};

export default AddTodoForm;
