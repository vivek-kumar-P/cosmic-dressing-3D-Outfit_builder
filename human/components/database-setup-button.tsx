"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Database, Loader2, CheckCircle, ExternalLink, Copy } from "lucide-react"
import { testDatabaseConnection } from "@/lib/actions/setup-database"
import { useToast } from "@/hooks/use-toast"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export function DatabaseSetupButton() {
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle")
  const [showInstructions, setShowInstructions] = useState(false)
  const { toast } = useToast()

  const handleSetup = async () => {
    setShowInstructions(true)
  }

  const handleTest = async () => {
    try {
      setIsLoading(true)
      setStatus("idle")

      console.log("[v0] Testing database connection...")
      const result = await testDatabaseConnection()

      if (result.success) {
        setStatus("success")
        localStorage.setItem("dbAvailable", "true")
        toast({
          title: "Database Ready! ✓",
          description: "Your models will now be saved permanently.",
        })
        console.log("[v0] Database is ready")
        setShowInstructions(false)
        setTimeout(() => window.location.reload(), 1000)
      } else {
        setStatus("error")
        toast({
          title: "Connection Failed",
          description: result.error || "Table not found. Please run the SQL script first.",
          variant: "destructive",
        })
        console.error("[v0] Database connection failed:", result.error)
      }
    } catch (error) {
      setStatus("error")
      toast({
        title: "Test Error",
        description: "An unexpected error occurred. Check console for details.",
        variant: "destructive",
      })
      console.error("[v0] Database test error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const sqlScript = `-- Create table for storing 3D models
CREATE TABLE IF NOT EXISTS public.models (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  category TEXT DEFAULT 'upload',
  is_permanent BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_models_created_at ON public.models(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_models_category ON public.models(category);

-- Enable Row Level Security
ALTER TABLE public.models ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations for authenticated and anonymous users
CREATE POLICY IF NOT EXISTS "Allow all operations on models" 
ON public.models
FOR ALL
TO public
USING (true)
WITH CHECK (true);

-- Grant permissions to anon and authenticated roles
GRANT ALL ON public.models TO anon;
GRANT ALL ON public.models TO authenticated;

-- Refresh schema cache
NOTIFY pgrst, 'reload schema';`

  return (
    <>
      <Button
        onClick={handleSetup}
        disabled={isLoading}
        variant={status === "success" ? "outline" : status === "error" ? "destructive" : "default"}
        size="sm"
        className="w-full gap-2"
      >
        {status === "success" ? (
          <>
            <CheckCircle className="h-4 w-4" />
            Database Ready
          </>
        ) : (
          <>
            <Database className="h-4 w-4" />
            Setup Database
          </>
        )}
      </Button>

      <Dialog open={showInstructions} onOpenChange={setShowInstructions}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Database Setup Required</DialogTitle>
            <DialogDescription>Follow these steps to enable permanent model storage in Supabase.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Step 1: Copy the SQL Script</h4>
              <div className="rounded-lg bg-muted p-4 relative">
                <pre className="overflow-x-auto text-xs font-mono">
                  <code>{sqlScript}</code>
                </pre>
                <Button
                  onClick={() => {
                    navigator.clipboard.writeText(sqlScript)
                    toast({
                      title: "Copied! ✓",
                      description: "SQL script copied to clipboard.",
                    })
                  }}
                  size="sm"
                  variant="secondary"
                  className="absolute top-2 right-2 gap-2"
                >
                  <Copy className="h-3 w-3" />
                  Copy
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Step 2: Run in Supabase SQL Editor</h4>
              <ol className="list-inside list-decimal space-y-2 text-sm text-muted-foreground pl-2">
                <li>Click "Open Supabase Dashboard" below</li>
                <li>
                  Navigate to <span className="font-mono bg-muted px-1 rounded">SQL Editor</span> in the left sidebar
                </li>
                <li>
                  Click <span className="font-mono bg-muted px-1 rounded">New Query</span>
                </li>
                <li>Paste the copied SQL script</li>
                <li>
                  Click <span className="font-mono bg-muted px-1 rounded">Run</span> or press{" "}
                  <kbd className="px-1.5 py-0.5 text-xs bg-muted rounded border">Ctrl+Enter</kbd>
                </li>
                <li>Wait for "Success. No rows returned" message</li>
              </ol>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Step 3: Test Connection</h4>
              <p className="text-sm text-muted-foreground pl-2">
                After running the SQL script, click "Test Connection" below to verify the table was created
                successfully.
              </p>
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                onClick={() => window.open("https://supabase.com/dashboard/project/_/sql", "_blank")}
                className="flex-1 gap-2"
              >
                Open Supabase Dashboard
                <ExternalLink className="h-4 w-4" />
              </Button>
              <Button
                onClick={handleTest}
                disabled={isLoading}
                variant="outline"
                className="flex-1 gap-2 bg-transparent"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Testing...
                  </>
                ) : (
                  <>
                    <Database className="h-4 w-4" />
                    Test Connection
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
