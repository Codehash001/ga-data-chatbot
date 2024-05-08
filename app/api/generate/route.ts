import { VectorStoreIndex , ChromaVectorStore } from "llamaindex";
import { storageContextFromDefaults } from "llamaindex/storage/StorageContext";

import * as dotenv from "dotenv";

import { getDocuments } from "../chat/engine/loader";
import { initSettings } from "../chat/engine/settings";
import { STORAGE_CACHE_DIR } from "../chat/engine/shared";
import { NextRequest, NextResponse } from "next/server";

// Load environment variables from local .env file
dotenv.config();

async function getRuntime(func: any) {
  const start = Date.now();
  await func();
  const end = Date.now();
  return end - start;
}


export async function POST(request: NextRequest) {
  try {
    // Check if the request contains necessary authentication or any other validations
    initSettings();
    console.log(`Generating storage context...`);
    // Split documents, create embeddings and store them in the storage context
    const ms = await getRuntime(async () => {
      const storageContext = await storageContextFromDefaults({
        persistDir: STORAGE_CACHE_DIR,
      });
      const documents = await getDocuments();
      await VectorStoreIndex.fromDocuments(documents, {
        storageContext,
      });
    }); 
    console.log(`Storage context successfully generated in ${ms / 1000}s.`);
    
    return NextResponse.json({ success: true, message: "Storage generation complete." },{ status: 200 });
  } catch (error) {
    console.error("Error generating storage:", error);
    return NextResponse.json({ success: false, message: "Error generating storage." } , { status: 400 });
  }
}
