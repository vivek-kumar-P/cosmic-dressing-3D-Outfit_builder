"use server"

import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { put, del } from "@vercel/blob"

// Users can increase this if they have a Pro plan, but this prevents errors for most users
const MAX_FILE_SIZE_FREE = 4.5 * 1024 * 1024 // 4.5 MB for free tier
const MAX_FILE_SIZE_PRO = 500 * 1024 * 1024 // 500 MB for pro tier
const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50 MB - reasonable limit that works for most plans

const SUPPORTED_FORMATS = [".glb", ".gltf"]

async function createSupabaseServer() {
  const cookieStore = await cookies()

  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
        } catch {
          // The "setAll" method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
    },
  })
}

export async function ensureTableExists() {
  try {
    console.log("[v0] === CHECKING IF TABLE EXISTS ===")

    const supabase = await createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!, // Use service role for admin operations
      {
        cookies: {
          getAll() {
            return []
          },
          setAll() {},
        },
      },
    )

    // Try a simple select to see if table exists
    const { error: checkError } = await supabase.from("models").select("id", { count: "exact", head: true })

    if (!checkError) {
      console.log("[v0] ✓ Table already exists")
      return { success: true, created: false }
    }

    // Table doesn't exist, create it
    console.log("[v0] Table doesn't exist, creating it...")

    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS models (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        name TEXT NOT NULL,
        file_url TEXT NOT NULL,
        file_size INTEGER DEFAULT 0,
        category TEXT DEFAULT 'upload',
        is_permanent BOOLEAN DEFAULT false,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS idx_models_category ON models(category);
      CREATE INDEX IF NOT EXISTS idx_models_created_at ON models(created_at);
    `

    // Execute the SQL using rpc (if available) or direct query
    const { error: createError } = await supabase.rpc("exec_sql", { sql: createTableSQL })

    if (createError) {
      console.error("[v0] ✗ Error creating table:", createError)
      return {
        success: false,
        error:
          "Could not create table automatically. Please run the SQL script manually from the Setup Database button.",
        needsManualSetup: true,
      }
    }

    console.log("[v0] ✓ Table created successfully")
    return { success: true, created: true }
  } catch (error: any) {
    console.error("[v0] ✗ Exception in ensureTableExists:", error)
    const errorMessage = error?.message || String(error)

    return {
      success: false,
      error: "Could not create table automatically. Please run the SQL script manually from the Setup Database button.",
      needsManualSetup: true,
    }
  }
}

export async function saveModelToDatabase(name: string, file: File) {
  try {
    console.log("[v0] === TESTING SAVE MODEL TO DATABASE ===")
    console.log("[v0] Model name:", name)
    console.log("[v0] File size:", file.size, "bytes")
    console.log("[v0] File type:", file.type)

    const fileName = file.name.toLowerCase()
    const isSupported = SUPPORTED_FORMATS.some((format) => fileName.endsWith(format))

    if (!isSupported) {
      const errorMsg = `Unsupported file format. Please upload .glb or .gltf files only. For FBX files, convert them to GLB using Blender (see README for instructions).`
      console.error("[v0] ✗", errorMsg)
      return {
        success: false,
        error: errorMsg,
      }
    }

    if (file.size > MAX_FILE_SIZE) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(2)
      const maxSizeMB = (MAX_FILE_SIZE / (1024 * 1024)).toFixed(2)
      const errorMsg = `File too large: ${sizeMB} MB exceeds the ${maxSizeMB} MB limit. The model will remain available as a temporary file, but cannot be stored permanently. To store large files, try compressing your model or contact support.`
      console.error("[v0] ✗", errorMsg)
      return {
        success: false,
        error: errorMsg,
      }
    }

    const fileExtension = file.name.split(".").pop() || "glb"
    const sanitizedName = name
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .replace(/[^a-zA-Z0-9-_.]/g, "") // Remove special characters except hyphens, underscores, and dots
      .toLowerCase()

    // Add the file extension to the sanitized name
    const sanitizedFilename = `${sanitizedName}.${fileExtension}`

    console.log("[v0] Sanitized filename:", sanitizedFilename)

    console.log("[v0] Step 1: Uploading to Vercel Blob...")
    let blob
    try {
      blob = await put(`models/${sanitizedFilename}`, file, {
        access: "public",
      })
      console.log("[v0] ✓ File uploaded to Blob successfully")
      console.log("[v0] Blob URL:", blob.url)
    } catch (uploadError: any) {
      console.error("[v0] ✗ Vercel Blob upload failed:", uploadError)

      let errorMessage = ""

      // Try to extract error message from various error formats
      if (uploadError?.message) {
        errorMessage = uploadError.message
      } else if (typeof uploadError === "string") {
        errorMessage = uploadError
      } else {
        errorMessage = String(uploadError)
      }

      // Check if this is a JSON parsing error (which usually means "Request Entity Too Large")
      if (errorMessage.includes("not valid JSON") || errorMessage.includes("Unexpected token")) {
        const sizeMB = (file.size / (1024 * 1024)).toFixed(2)
        return {
          success: false,
          error: `File upload failed: ${sizeMB} MB file exceeds your Vercel Blob storage limit. The model will remain available as a temporary file. To store it permanently, try compressing the file to under 4.5 MB, or upgrade your Vercel plan for higher limits.`,
        }
      }

      // Check for other common error patterns
      if (
        errorMessage.includes("Request Entity Too Large") ||
        errorMessage.includes("413") ||
        errorMessage.includes("too large")
      ) {
        const sizeMB = (file.size / (1024 * 1024)).toFixed(2)
        return {
          success: false,
          error: `File too large: ${sizeMB} MB exceeds your Vercel Blob storage limit. The model will remain available as a temporary file. Try compressing the file or upgrading your Vercel plan.`,
        }
      }

      // Generic upload error
      return {
        success: false,
        error: `Failed to upload file to storage: ${errorMessage}`,
      }
    }

    console.log("[v0] Step 1.5: Verifying file is accessible...")
    try {
      const verifyResponse = await fetch(blob.url, { method: "HEAD" })
      if (!verifyResponse.ok) {
        console.error("[v0] ✗ File not accessible yet, status:", verifyResponse.status)
        throw new Error(`File uploaded but not accessible (status: ${verifyResponse.status})`)
      }
      console.log("[v0] ✓ File verified accessible")
    } catch (verifyError) {
      console.error("[v0] ✗ File verification failed:", verifyError)
      console.log("[v0] Continuing with save despite verification failure...")
    }

    // Save metadata to Supabase
    console.log("[v0] Step 2: Saving metadata to Supabase...")
    const supabase = await createSupabaseServer()

    const insertData = {
      name,
      file_url: blob.url,
      file_size: file.size,
      category: "upload",
      is_permanent: false,
    }
    console.log("[v0] Insert data:", insertData)

    const { data, error } = await supabase.from("models").insert(insertData).select().single()

    if (error) {
      console.error("[v0] ✗ Supabase error:", error)
      console.error("[v0] Error code:", error.code)
      console.error("[v0] Error message:", error.message)

      if (
        error.code === "PGRST205" ||
        error.message.includes("does not exist") ||
        error.message.includes("schema cache")
      ) {
        console.log("[v0] Database table does not exist")
        return {
          success: false,
          error: "Database not set up. Please run the SQL script first.",
          needsSetup: true,
        }
      }
      throw error
    }

    console.log("[v0] ✓ Model saved to database successfully")
    console.log("[v0] Saved data:", data)
    console.log("[v0] === SAVE TEST COMPLETE ===")
    return { success: true, data }
  } catch (error: any) {
    console.error("[v0] ✗ Exception in saveModelToDatabase:", error)
    console.error("[v0] Error details:", error?.message || String(error))

    const errorMessage = error?.message || String(error)

    if (errorMessage.includes("not valid JSON") || errorMessage.includes("Unexpected token")) {
      return {
        success: false,
        error:
          "File upload failed: File exceeds your Vercel Blob storage limit. The model will remain available as a temporary file. Try compressing the file or upgrading your Vercel plan.",
      }
    }

    if (
      error?.code === "PGRST205" ||
      errorMessage.includes("does not exist") ||
      errorMessage.includes("schema cache") ||
      error?.status === 404
    ) {
      console.log("[v0] Database table does not exist")
      return {
        success: false,
        error: "Database not set up. Please run the SQL script first.",
        needsSetup: true,
      }
    }

    return { success: false, error: errorMessage }
  }
}

export async function getModelsFromDatabase() {
  try {
    console.log("[v0] === TESTING GET MODELS FROM DATABASE ===")

    const supabase = await createSupabaseServer()
    console.log("[v0] Supabase client created")

    let data, error
    try {
      const result = await supabase.from("models").select("*").order("created_at", { ascending: false }).limit(100) // Reasonable limit

      data = result.data
      error = result.error
    } catch (queryError: any) {
      // Handle JSON parsing errors that occur when the table doesn't exist
      const errorMessage = queryError?.message || String(queryError)
      if (
        errorMessage.includes("not valid JSON") ||
        errorMessage.includes("Unexpected token") ||
        errorMessage.includes("Too Many")
      ) {
        console.log("[v0] Database error (table may not exist), returning empty array")
        return { success: true, data: [], needsSetup: true }
      }
      throw queryError
    }

    if (error) {
      console.error("[v0] ✗ Supabase error:", error)
      console.error("[v0] Error code:", error.code)
      console.error("[v0] Error message:", error.message)

      if (
        error.code === "PGRST205" ||
        error.message.includes("does not exist") ||
        error.message.includes("schema cache")
      ) {
        console.log("[v0] Database table does not exist, returning empty array")
        return { success: true, data: [], needsSetup: true }
      }
      throw error
    }

    console.log("[v0] ✓ Models fetched successfully")
    console.log("[v0] Number of models:", data?.length || 0)

    const modelsWithPermanentFlag = (data || []).map((model) => ({
      ...model,
      isPermanent: model.name === "just_body" || model.is_permanent === true,
    }))

    return { success: true, data: modelsWithPermanentFlag }
  } catch (error: any) {
    console.error("[v0] ✗ Exception in getModelsFromDatabase:", error)

    const errorMessage = error?.message || String(error)
    if (
      errorMessage.includes("not valid JSON") ||
      errorMessage.includes("Unexpected token") ||
      errorMessage.includes("Too Many")
    ) {
      console.log("[v0] Database error (table may not exist), returning empty array")
      return { success: true, data: [], needsSetup: true }
    }

    if (
      error?.code === "PGRST205" ||
      errorMessage.includes("does not exist") ||
      errorMessage.includes("schema cache") ||
      error?.status === 404
    ) {
      console.log("[v0] Database table does not exist, returning empty array")
      return { success: true, data: [], needsSetup: true }
    }

    return { success: false, error: errorMessage, data: [] }
  }
}

export async function deleteModelFromDatabase(id: string, fileUrl: string) {
  try {
    console.log("[v0] === TESTING DELETE MODEL FROM DATABASE ===")
    console.log("[v0] Model ID:", id)
    console.log("[v0] File URL:", fileUrl)

    console.log("[v0] Step 1: Deleting from Vercel Blob...")
    try {
      await del(fileUrl)
      console.log("[v0] ✓ File deleted from Blob")
    } catch (blobError: any) {
      // Check if this is a 403 error (external blob URL that we don't have permission to delete)
      const errorMessage = blobError?.message || String(blobError)
      if (
        errorMessage.includes("403") ||
        errorMessage.includes("Access denied") ||
        errorMessage.includes("forbidden")
      ) {
        console.log("[v0] ⚠ Cannot delete external blob file (expected for files from other projects)")
        console.log("[v0] Continuing with database deletion...")
      } else {
        // For other errors, log but continue
        console.error("[v0] ⚠ Error deleting blob file:", errorMessage)
        console.log("[v0] Continuing with database deletion...")
      }
    }

    // Delete from Supabase
    console.log("[v0] Step 2: Deleting from Supabase...")
    const supabase = await createSupabaseServer()
    const { error } = await supabase.from("models").delete().eq("id", id)

    if (error) {
      console.error("[v0] ✗ Supabase error:", error)
      console.error("[v0] Error code:", error.code)
      console.error("[v0] Error message:", error.message)

      if (
        error.code === "PGRST205" ||
        error.message.includes("does not exist") ||
        error.message.includes("schema cache")
      ) {
        console.log("[v0] Database table does not exist")
        return {
          success: false,
          error: "Database not set up. Please run the SQL script first.",
          needsSetup: true,
        }
      }
      throw error
    }

    console.log("[v0] ✓ Model deleted successfully")
    console.log("[v0] === DELETE TEST COMPLETE ===")
    return { success: true }
  } catch (error: any) {
    console.error("[v0] ✗ Exception in deleteModelFromDatabase:", error)
    console.error("[v0] Error details:", {
      code: error?.code,
      message: error?.message,
      status: error?.status,
    })

    if (
      error?.code === "PGRST205" ||
      error?.message?.includes("does not exist") ||
      error?.message?.includes("schema cache") ||
      error?.status === 404
    ) {
      console.log("[v0] Database table does not exist")
      return {
        success: false,
        error: "Database not set up. Please run the SQL script first.",
        needsSetup: true,
      }
    }
    return { success: false, error: String(error) }
  }
}

export async function renameModelInDatabase(id: string, newName: string) {
  try {
    console.log("[v0] === TESTING RENAME MODEL IN DATABASE ===")
    console.log("[v0] Model ID:", id)
    console.log("[v0] New name:", newName)

    const supabase = await createSupabaseServer()
    const { data, error } = await supabase.from("models").update({ name: newName }).eq("id", id).select().single()

    if (error) {
      console.error("[v0] ✗ Supabase error:", error)
      console.error("[v0] Error code:", error.code)
      console.error("[v0] Error message:", error.message)

      if (
        error.code === "PGRST205" ||
        error.message.includes("does not exist") ||
        error.message.includes("schema cache")
      ) {
        console.log("[v0] Database table does not exist")
        return {
          success: false,
          error: "Database not set up. Please run the SQL script first.",
          needsSetup: true,
        }
      }
      throw error
    }

    console.log("[v0] ✓ Model renamed successfully")
    console.log("[v0] Updated data:", data)
    console.log("[v0] === RENAME TEST COMPLETE ===")
    return { success: true, data }
  } catch (error: any) {
    console.error("[v0] ✗ Exception in renameModelInDatabase:", error)
    console.error("[v0] Error details:", {
      code: error?.code,
      message: error?.message,
      status: error?.status,
    })

    if (
      error?.code === "PGRST205" ||
      error?.message?.includes("does not exist") ||
      error?.message?.includes("schema cache") ||
      error?.status === 404
    ) {
      console.log("[v0] Database table does not exist")
      return {
        success: false,
        error: "Database not set up. Please run the SQL script first.",
        needsSetup: true,
      }
    }
    return { success: false, error: String(error) }
  }
}

export async function deleteAllModelsFromDatabase() {
  try {
    console.log("[v0] === DELETING ALL MODELS FROM DATABASE ===")

    const supabase = await createSupabaseServer()

    // First, get all models to delete their files from Vercel Blob
    const { data: models, error: fetchError } = await supabase.from("models").select("*")

    if (fetchError) {
      console.error("[v0] ✗ Error fetching models:", fetchError)
      throw fetchError
    }

    console.log("[v0] Found", models?.length || 0, "models to delete")

    if (models && models.length > 0) {
      for (const model of models) {
        // Skip deletion for external blob URLs (from other projects)
        // These URLs typically start with different subdomains
        const isExternalBlob = !model.file_url.includes(
          process.env.BLOB_READ_WRITE_TOKEN?.split("_")[0] || "vercel-storage",
        )

        if (isExternalBlob) {
          console.log("[v0] ⚠ Skipping external blob file:", model.name)
          continue
        }

        try {
          console.log("[v0] Deleting file from Blob:", model.file_url)
          await del(model.file_url)
          console.log("[v0] ✓ File deleted:", model.name)
        } catch (blobError: any) {
          // Silently handle 403 errors for external blobs
          const errorMessage = blobError?.message || String(blobError)
          const is403Error =
            errorMessage.includes("403") || errorMessage.includes("forbidden") || errorMessage.includes("Access denied")

          if (is403Error) {
            // Don't log anything for 403 errors - they're expected for external blobs
            continue
          }

          // Log other errors but continue
          console.log("[v0] ⚠ Could not delete blob file for:", model.name)
        }
      }
    }

    // Delete all records from database
    const { error: deleteError } = await supabase
      .from("models")
      .delete()
      .neq("id", "00000000-0000-0000-0000-000000000000") // Delete all rows

    if (deleteError) {
      console.error("[v0] ✗ Error deleting from database:", deleteError)
      throw deleteError
    }

    console.log("[v0] ✓ All models deleted successfully")
    console.log("[v0] === DELETE ALL COMPLETE ===")
    return { success: true, deletedCount: models?.length || 0 }
  } catch (error: any) {
    console.error("[v0] ✗ Exception in deleteAllModelsFromDatabase:", error)
    return { success: false, error: String(error) }
  }
}

export async function initializeDefaultModel() {
  try {
    console.log("[v0] === INITIALIZING DEFAULT MODEL ===")

    const supabase = await createSupabaseServer()

    const { data: existing } = await supabase.from("models").select("*").eq("name", "just_body").maybeSingle()

    if (existing) {
      console.log("[v0] Default model already exists")
      return { success: true, data: { ...existing, isPermanent: true }, alreadyExists: true }
    }

    const defaultModel = {
      name: "just_body",
      file_url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/just_body-rcOZSRE7s6nyArblYSi6fF9yertTgD.glb",
      file_size: 0,
      is_permanent: true,
    }

    console.log("[v0] Inserting default model:", defaultModel)

    const { data, error } = await supabase.from("models").insert(defaultModel).select().single()

    if (error) {
      console.error("[v0] ✗ Error inserting default model:", error)
      throw error
    }

    console.log("[v0] ✓ Default model initialized successfully")
    console.log("[v0] === INITIALIZATION COMPLETE ===")
    return { success: true, data: { ...data, isPermanent: true } }
  } catch (error: any) {
    console.error("[v0] ✗ Exception in initializeDefaultModel:", error)
    return { success: false, error: String(error) }
  }
}

export async function seedDefaultModels() {
  try {
    console.log("[v0] === SEEDING DEFAULT MODELS ===")

    const tableCheck = await ensureTableExists()
    if (!tableCheck.success && tableCheck.needsManualSetup) {
      console.log("[v0] ⚠ Table creation failed - manual setup required")
      return {
        success: false,
        error: tableCheck.error,
        needsSetup: true,
        insertedCount: 0,
        skippedCount: 0,
        total: 0,
      }
    }

    const supabase = await createSupabaseServer()

    // Define all default models from the category sidebar
    const defaultModels = [
      // Characters
      {
        name: "Default Body",
        file_url:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/just_body-rcOZSRE7s6nyArblYSi6fF9yertTgD.glb",
        file_size: 0,
        is_permanent: true,
        category: "character",
      },
      {
        name: "Woman Default",
        file_url:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/girl_body-fnVrNBzImBXQXAXZQuNrMARzUXlOeh.glb",
        file_size: 0,
        is_permanent: true,
        category: "character",
      },
      // Shoes
      {
        name: "Ladies Full Shoes",
        file_url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/shoes-3O5C5R5YU7fh9JVK1lDRW4VTaP3RUz.glb",
        file_size: 0,
        is_permanent: true,
        category: "shoes",
      },
      {
        name: "Printed Shoes",
        file_url:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/printed_fullshoes_for_ladies-h1J65nxUJ5MzyK1WW3Td2WPt8DuVi3.glb",
        file_size: 0,
        is_permanent: true,
        category: "shoes",
      },
      // Pants
      {
        name: "Ladies Black Pants",
        file_url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pants-YPkXnZuiuxppilSYrD5lx5hvmDvqho.glb",
        file_size: 0,
        is_permanent: true,
        category: "pants",
      },
      // T-Shirts/Dresses
      {
        name: "Leather Full Dress",
        file_url:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/leather_fulldress_for_ladies-G5dJvzw4zMilPerVFOVLGsjY1VhOmp.glb",
        file_size: 0,
        is_permanent: true,
        category: "tshirt",
      },
      // Shirts
      {
        name: "Ladies Turtle Neck",
        file_url:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/TurtleNeck-alcndfSFd620UUnvKEXuPmOZWmosxk.glb",
        file_size: 0,
        is_permanent: true,
        category: "shirt",
      },
      {
        name: "Default Shirt",
        file_url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/shirt-rUqTTSPdS5oU6cC0ihFhZ9cZXSLuVj.glb",
        file_size: 0,
        is_permanent: true,
        category: "shirt",
      },
    ]

    console.log("[v0] Seeding", defaultModels.length, "default models")

    let insertedCount = 0
    let skippedCount = 0

    for (const model of defaultModels) {
      // Check if model already exists
      const { data: existing } = await supabase.from("models").select("*").eq("name", model.name).maybeSingle()

      if (existing) {
        console.log("[v0] ⚠ Model already exists:", model.name)
        skippedCount++
        continue
      }

      // Insert the model
      const { error } = await supabase.from("models").insert(model)

      if (error) {
        console.error("[v0] ✗ Error inserting model:", model.name, error.message)
        continue
      }

      console.log("[v0] ✓ Inserted model:", model.name)
      insertedCount++
    }

    console.log("[v0] === SEEDING COMPLETE ===")
    console.log("[v0] Inserted:", insertedCount, "Skipped:", skippedCount)

    return {
      success: true,
      insertedCount,
      skippedCount,
      total: defaultModels.length,
    }
  } catch (error: any) {
    console.error("[v0] ✗ Exception in seedDefaultModels:", error)

    const errorMessage = error?.message || String(error)
    if (errorMessage.includes("not valid JSON") || errorMessage.includes("Unexpected token")) {
      return {
        success: false,
        error:
          "Database table 'models' does not exist. Please set up the database first using the 'Setup Database' button.",
        needsSetup: true,
        insertedCount: 0,
        skippedCount: 0,
        total: 0,
      }
    }

    return {
      success: false,
      error: errorMessage,
      insertedCount: 0,
      skippedCount: 0,
      total: 0,
    }
  }
}
