import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { api } from "@/lib/api";

type HealthState =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "ok"; status: string; timestamp: string }
  | { kind: "error"; message: string };

export function App() {
  const [state, setState] = useState<HealthState>({ kind: "idle" });

  async function check() {
    setState({ kind: "loading" });
    try {
      const res = await api.api.health.$get();
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setState({ kind: "ok", ...data });
    } catch (err) {
      setState({
        kind: "error",
        message: err instanceof Error ? err.message : String(err),
      });
    }
  }

  useEffect(() => {
    void check();
  }, []);

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Knowledge Hub</CardTitle>
          <CardDescription>
            Web → API health check via Hono RPC
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-md border p-4 font-mono text-sm">
            {state.kind === "idle" && "Idle"}
            {state.kind === "loading" && "Checking…"}
            {state.kind === "ok" && (
              <div className="space-y-1">
                <div>
                  status:{" "}
                  <span className="text-green-600 dark:text-green-400">
                    {state.status}
                  </span>
                </div>
                <div className="text-muted-foreground">{state.timestamp}</div>
              </div>
            )}
            {state.kind === "error" && (
              <div className="text-destructive">Error: {state.message}</div>
            )}
          </div>
          <Button onClick={check} disabled={state.kind === "loading"}>
            {state.kind === "loading" ? "Checking…" : "Refresh"}
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
