"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Workflow, ArrowRight, Loader2, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { api, SavedWorkflow } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function DashboardPage() {
    const router = useRouter();
    const [workflows, setWorkflows] = useState<SavedWorkflow[]>([]);
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);

    useEffect(() => {
        loadWorkflows();
    }, []);

    const loadWorkflows = async () => {
        try {
            const data = await api.workflow.getAll();
            // Filter out internal/auto-save workflows if any
            const filtered = data.filter((w) => w.name !== "__current__").sort((a, b) =>
                new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
            );
            setWorkflows(filtered);
        } catch (error) {
            console.error("Failed to load workflows:", error);
            toast.error("Failed to load workflows");
        } finally {
            setLoading(false);
        }
    };

    const handleCreateWorkflow = async () => {
        setCreating(true);
        try {
            const newWorkflow = await api.workflow.create({
                name: "Untitled Workflow",
                description: "",
                nodes: [],
                edges: [],
            });
            router.push(`/workflows/${newWorkflow.id}`);
        } catch (error) {
            console.error("Failed to create workflow:", error);
            toast.error("Failed to create workflow");
            setCreating(false);
        }
    };

    const handleDeleteWorkflow = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (!confirm("Are you sure you want to delete this workflow?")) return;

        try {
            await api.workflow.delete(id);
            toast.success("Workflow deleted");
            loadWorkflows();
        } catch (error) {
            console.error("Failed to delete workflow:", error);
            toast.error("Failed to delete workflow");
        }
    };

    const handleOpenWorkflow = (id: string) => {
        router.push(`/workflows/${id}`);
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8 px-4 max-w-6xl">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Workflows</h1>
                    <p className="text-muted-foreground mt-1">
                        Manage your automation workflows
                    </p>
                </div>
                <Button onClick={handleCreateWorkflow} disabled={creating} className="bg-primary hover:bg-primary/90">
                    {creating ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <Plus className="mr-2 h-4 w-4" />
                    )}
                    New Workflow
                </Button>
            </div>

            <Separator className="my-6" />

            {workflows.length === 0 ? (
                <div className="text-center py-20 border rounded-lg bg-muted/20 border-dashed">
                    <div className="bg-muted w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Workflow className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-medium mb-2">No workflows created</h3>
                    <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                        Get started by creating your first workflow to automate your business logic.
                    </p>
                    <Button onClick={handleCreateWorkflow} disabled={creating}>
                        Create your first workflow
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {workflows.map((workflow) => (
                        <Card
                            key={workflow.id}
                            className="cursor-pointer hover:shadow-md transition-shadow group relative overflow-hidden border-muted-foreground/20"
                            onClick={() => handleOpenWorkflow(workflow.id)}
                        >
                            <div className="absolute top-0 left-0 w-1 h-full bg-primary/0 group-hover:bg-primary transition-colors" />
                            <CardHeader className="pb-3">
                                <div className="flex justify-between items-start">
                                    <div className="bg-primary/10 p-2 rounded-md">
                                        <Workflow className="h-5 w-5 text-primary" />
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={(e) => handleDeleteWorkflow(e, workflow.id)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                                <CardTitle className="text-lg mt-3 truncate pr-2">
                                    {workflow.name || "Untitled Workflow"}
                                </CardTitle>
                                <CardDescription className="line-clamp-2 h-10 text-xs">
                                    {workflow.description || "No description provided."}
                                </CardDescription>
                            </CardHeader>
                            <CardFooter className="pt-3 pb-4 text-xs text-muted-foreground flex justify-between items-center border-t bg-muted/5">
                                <span>Updated {format(new Date(workflow.updatedAt), "MMM d, yyyy")}</span>
                                <div className="flex items-center text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                                    Open <ArrowRight className="ml-1 h-3 w-3" />
                                </div>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
