"use client";

import { useForm } from "react-hook-form";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useCreateSavingsGoal,
  useDeleteSavingsGoal,
  useSavingsGoals,
} from "@/lib/hooks";

export default function SavingsGoalsPage() {
  const { data, isLoading } = useSavingsGoals();
  const createMutation = useCreateSavingsGoal();
  const deleteMutation = useDeleteSavingsGoal();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      name: "",
      targetAmount: "",
      currentAmount: 0,
      deadline: new Date().toISOString().slice(0, 10),
    },
  });

  // Safely extract savings goals from response
  const goals = Array.isArray(data)
    ? data
    : Array.isArray(data?.data)
    ? data.data
    : Array.isArray(data?.data?.data)
    ? data.data.data
    : [];

  const onSubmit = async (payload: Record<string, unknown>) => {
    await createMutation.mutateAsync(payload);
  };

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Savings Goals</h1>
          <p className="text-muted-foreground">
            Track personal savings targets and deadlines.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">New Savings Goal</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end"
            >
              <div className="space-y-2">
                <Label>Goal Name</Label>
                <Input {...register("name", { required: true })} />
              </div>
              <div className="space-y-2">
                <Label>Target Amount</Label>
                <Input
                  type="number"
                  step="0.01"
                  {...register("targetAmount", { required: true })}
                />
              </div>
              <div className="space-y-2">
                <Label>Current Amount</Label>
                <Input
                  type="number"
                  step="0.01"
                  {...register("currentAmount")}
                />
              </div>
              <div className="space-y-2">
                <Label>Deadline</Label>
                <Input
                  type="date"
                  {...register("deadline", { required: true })}
                />
              </div>
              <div className="md:col-span-4">
                <Button
                  type="submit"
                  disabled={isSubmitting || createMutation.isPending}
                >
                  {isSubmitting || createMutation.isPending
                    ? "Saving..."
                    : "Save Goal"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Your Goals</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-sm text-muted-foreground">
                Loading savings goals...
              </div>
            ) : goals.length === 0 ? (
              <div className="text-sm text-muted-foreground">
                No savings goals yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {goals.map((goal) => {
                  const target = Number(goal.targetAmount);
                  const current = Number(goal.currentAmount);
                  const progress = target > 0 ? (current / target) * 100 : 0;
                  return (
                    <div
                      key={goal.id}
                      className="rounded-xl border p-4 space-y-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-medium">{goal.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Deadline:{" "}
                            {new Date(goal.deadline).toLocaleDateString()}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          onClick={() => deleteMutation.mutate(goal.id)}
                          disabled={deleteMutation.isPending}
                        >
                          Delete
                        </Button>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full bg-primary"
                          style={{ width: `${Math.min(progress, 100)}%` }}
                        />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {goal.currency || "$"}
                        {current.toFixed(2)} of {goal.currency || "$"}
                        {target.toFixed(2)} saved
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
