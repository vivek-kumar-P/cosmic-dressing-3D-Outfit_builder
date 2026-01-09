"use server"

import { createClient } from "@/lib/supabase"

export async function setupDatabase() {
  // Instead, just return instructions for manual setup
  console.log("[v0] Showing database setup instructions...")
  return {
    success: false,
    error: "Database table needs to be created manually.",
    needsManualSetup: true,
  }
}

export async function testDatabaseConnection() {
  try {
    console.log("[v0] Testing database connection...")
    const supabase = createClient()

    const { data, error } = await supabase.from("models").select("id").limit(1)

    if (error) {
      if (error.code === "PGRST205" || error.message?.includes("Could not find the table")) {
        console.log("[v0] Database table still does not exist")
        return {
          success: false,
          error: "Table not found. Please make sure you ran the SQL script correctly.",
          needsManualSetup: true,
        }
      }

      console.error("[v0] Database connection error:", error.message)
      return {
        success: false,
        error: error.message,
        needsManualSetup: false,
      }
    }

    console.log("[v0] Database connection successful!")
    return { success: true }
  } catch (error: any) {
    console.error("[v0] Unexpected database connection error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      needsManualSetup: false,
    }
  }
}
