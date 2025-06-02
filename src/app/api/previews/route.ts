import { NextResponse } from "next/server";
import { previewStorage } from "../../../lib/preview-storage";

export async function GET() {
  const storage = previewStorage;
  const previews = await storage.getAll();
  await storage.disconnect();
  return NextResponse.json(previews);
}