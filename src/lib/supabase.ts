import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface WebsiteTransformation {
  id: string;
  original_url: string;
  theme: string;
  original_html: string;
  transformed_html: string;
  original_screenshot: string;
  transformed_screenshot: string;
  created_at: string;
  metadata: {
    title: string;
    description: string;
    keywords: string[];
  };
}

export async function saveTransformation(data: Omit<WebsiteTransformation, "created_at">): Promise<WebsiteTransformation> {
  const { data: transformation, error } = await supabase
    .from("website_transformations")
    .insert([{ ...data, created_at: new Date().toISOString() }])
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to save transformation: ${error.message}`);
  }

  return transformation;
}

export async function getTransformation(id: string): Promise<WebsiteTransformation | null> {
  const { data: transformation, error } = await supabase
    .from("website_transformations")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching transformation:", error);
    return null;
  }

  return transformation;
}

export async function getRecentTransformations(limit = 10): Promise<WebsiteTransformation[]> {
  const { data: transformations, error } = await supabase
    .from("website_transformations")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching recent transformations:", error);
    return [];
  }

  return transformations;
}