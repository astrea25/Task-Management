
import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";

export type FilterOption = "all" | "active" | "completed";
export type SortOption = "newest" | "oldest" | "priority" | "alphabetical";

interface TodoFilterProps {
  filter: FilterOption;
  setFilter: (filter: FilterOption) => void;
  sort: SortOption;
  setSort: (sort: SortOption) => void;
  priorityFilter: string;
  setPriorityFilter: (priority: string) => void;
}

const TodoFilter: React.FC<TodoFilterProps> = ({
  filter,
  setFilter,
  sort,
  setSort,
  priorityFilter,
  setPriorityFilter
}) => {
  return (
    <div className="mb-6 flex flex-col md:flex-row gap-4 justify-between">
      <div className="flex gap-2 flex-wrap">
        <Button
          variant={filter === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("all")}
          className={cn(
            filter === "all" && "bg-todo-blue hover:bg-blue-700"
          )}
        >
          All
        </Button>
        <Button
          variant={filter === "active" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("active")}
          className={cn(
            filter === "active" && "bg-todo-blue hover:bg-blue-700"
          )}
        >
          Active
        </Button>
        <Button
          variant={filter === "completed" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("completed")}
          className={cn(
            filter === "completed" && "bg-todo-blue hover:bg-blue-700"
          )}
        >
          Completed
        </Button>
      </div>
      
      <div className="flex gap-2">
        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={sort} onValueChange={(value) => setSort(value as SortOption)}>
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="oldest">Oldest</SelectItem>
            <SelectItem value="priority">Priority</SelectItem>
            <SelectItem value="alphabetical">Alphabetical</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default TodoFilter;
