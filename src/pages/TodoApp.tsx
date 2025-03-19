
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Todo, getTodos } from "@/services/todoService";
import { useToast } from "@/hooks/use-toast";
import { toast } from "sonner";
import TodoItem from "@/components/TodoItem";
import AddTodoForm from "@/components/AddTodoForm";
import TodoFilter, { FilterOption, SortOption } from "@/components/TodoFilter";
import TodoStats from "@/components/TodoStats";
import { Button } from "@/components/ui/button";
import { LogOut, RefreshCcw, ExternalLink } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";

const TodoApp = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast: uiToast } = useToast();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filteredTodos, setFilteredTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<FilterOption>("all");
  const [sort, setSort] = useState<SortOption>("newest");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    
    fetchTodos();
  }, [user, navigate]);

  useEffect(() => {
    if (!todos.length) {
      setFilteredTodos([]);
      return;
    }
    
    let filtered = [...todos];
    
    if (filter === "active") {
      filtered = filtered.filter((todo) => !todo.completed);
    } else if (filter === "completed") {
      filtered = filtered.filter((todo) => todo.completed);
    }
    
    if (priorityFilter !== "all") {
      filtered = filtered.filter((todo) => todo.priority === priorityFilter);
    }
    
    filtered.sort((a, b) => {
      if (sort === "newest") {
        return b.createdAt?.toMillis?.() - a.createdAt?.toMillis?.() || 0;
      } else if (sort === "oldest") {
        return a.createdAt?.toMillis?.() - b.createdAt?.toMillis?.() || 0;
      } else if (sort === "priority") {
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      } else if (sort === "alphabetical") {
        return a.text.localeCompare(b.text);
      } else if (sort === "dueDate") {
        // Sort by due date, null dates at the end
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return a.dueDate.toMillis() - b.dueDate.toMillis();
      }
      return 0;
    });
    
    setFilteredTodos(filtered);
  }, [todos, filter, sort, priorityFilter]);

  const fetchTodos = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);
      const fetchedTodos = await getTodos(user.uid);
      setTodos(fetchedTodos);
    } catch (error) {
      console.error("Error fetching todos:", error);
      setError("Failed to fetch todos. Please try again later.");
      uiToast({
        title: "Error",
        description: "Failed to fetch todos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchTodos();
    setRefreshing(false);
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-todo-blue text-white py-4 shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl md:text-2xl font-bold">Todo Cloud Keeper</h1>
            <div className="flex items-center space-x-3">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleRefresh}
                disabled={refreshing}
                className="text-white hover:bg-blue-700"
              >
                <RefreshCcw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button 
                variant="headerOutline" 
                size="sm"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
          <div className="mt-2 text-sm md:text-base">
            Welcome, {user.email}
          </div>
        </div>
      </header>
      
      <main className="container mx-auto p-4 md:p-6 max-w-3xl">
        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Add New Task</h2>
          {user && <AddTodoForm userId={user.uid} onAdd={fetchTodos} />}
        </section>
        
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>
              {error}
              <div className="mt-2">
                <a 
                  href="https://console.firebase.google.com/project/to-do-list-ff37e/firestore/indexes" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-blue-600 hover:underline"
                >
                  Create Firestore Index <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </div>
            </AlertDescription>
          </Alert>
        )}
        
        {loading ? (
          <div className="space-y-3">
            <Skeleton className="h-[125px] w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : (
          <>
            {todos.length > 0 && (
              <TodoStats todos={todos} />
            )}
            
            <section>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Your Tasks</h2>
                <span className="text-sm text-gray-500">
                  {filteredTodos.length} 
                  {filter === "all" 
                    ? " total" 
                    : filter === "active" 
                    ? " active" 
                    : " completed"} tasks
                </span>
              </div>
              
              <TodoFilter
                filter={filter}
                setFilter={setFilter}
                sort={sort}
                setSort={setSort}
                priorityFilter={priorityFilter}
                setPriorityFilter={setPriorityFilter}
              />
              
              <div className="space-y-2">
                {filteredTodos.length > 0 ? (
                  filteredTodos.map((todo) => (
                    <TodoItem key={todo.id} todo={todo} onUpdate={fetchTodos} />
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">
                      {todos.length > 0 
                        ? "No tasks match your current filters" 
                        : "You don't have any tasks yet"}
                    </p>
                    {todos.length > 0 && (
                      <Button 
                        variant="link" 
                        onClick={() => {
                          setFilter("all");
                          setPriorityFilter("all");
                        }}
                      >
                        Clear filters
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
};

export default TodoApp;
