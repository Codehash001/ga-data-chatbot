import { supabase } from "@/app/utils/supabase-client";
import fs from "fs";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const cacheFolder = "./cache";
    
    // Check if cache folder exists, create it if not
    if (!fs.existsSync(cacheFolder)) {
      fs.mkdirSync(cacheFolder);
    }
    
    // Get list of files from Supabase bucket
    const { data: files, error } = await supabase.storage.from("cache").list();
    if (error) {
      throw error;
    }

    // Download each file from Supabase bucket to the cache folder
    for (const file of files) {
      const filePath = `${cacheFolder}/${file.name}`;
      const { data: fileData, error: downloadError } = await supabase.storage
        .from("cache")
        .download(file.name);
      
      if (downloadError) {
        console.error(`Error downloading file ${file.name} from Supabase:`, downloadError.message);
      } else {
        const fileStream = fs.createWriteStream(filePath);
        fileStream.write(Buffer.from(await fileData.arrayBuffer()));
        fileStream.end();
        console.log(`File ${file.name} downloaded successfully to ${cacheFolder}.`);
      }
    }

    return NextResponse.json(
      { success: true, message: "Downloaded files from Supabase successfully." },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error downloading files from Supabase:", error);
    return NextResponse.json(
      { success: false, message: "Error downloading files from Supabase." },
      { status: 400 },
    );
  }
}
