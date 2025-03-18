
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { addTodo, NewTodo } from "@/services/todoService";
import { Plus } from "lucide-react";
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!text.trim()) return;
    
    const newTodo: NewTodo = {
      text: text.trim(),
      priority
    };
    
    try {
      setIsSubmitting(true);
      await addTodo(userId, newTodo);
      setText("");
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
      <div className="flex items-start gap-2">
        <div className="flex-1">
          <Input
            placeholder="Add a new task..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full"
          />
        </div>
        <Select 
          value={priority} 
          onValueChange={(value) => setPriority(value as "low" | "medium" | "high")}
        >
          <SelectTrigger className="w-[120px]">
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
          className="bg-todo-blue hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add
        </Button>
      </div>
    </form>
  );
};

export default AddTodoForm;
