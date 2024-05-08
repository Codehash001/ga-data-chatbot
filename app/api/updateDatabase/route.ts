import { supabase } from "@/app/utils/supabase-client";
import fs from "fs";
import { NextResponse } from "next/server";


const cacheFolder = "./cache";
    // Read files from ./cache folder
    const files = fs.readdirSync(cacheFolder);

    const deleteCurrent = async () => {
        try {
            // Delete all current files from Supabase storage
            const { data: existingFiles, error: listError } = await supabase.storage
                .from("cache")
                .list();
    
            if (listError) {
                throw new Error(`Error listing existing files in Supabase storage: ${listError.message}`);
            }
    
            // Iterate through each existing file and delete it
            for (const existingFile of existingFiles) {
                const { error: deleteError } = await supabase.storage
                    .from("cache")
                    .remove([existingFile.name]);
    
                if (deleteError) {
                    throw new Error(`Error deleting file ${existingFile.name} from Supabase storage: ${deleteError.message}`);
                }
                console.log(`File ${existingFile.name} deleted from Supabase storage.`);
            }
        } catch (error) {
            throw new Error(`Error deleting current cache files from Supabase: ${error}`);
        }
    }
    

const updateBucket = async () => {
    try {
        for (const file of files) {
            const filePath = `${cacheFolder}/${file}`;
            const fileData = fs.readFileSync(filePath);
      
            // Upload file to Supabase bucket
            const { data, error } = await supabase.storage
              .from("cache")
              .upload(file, fileData, {
                cacheControl: "3600", // Set cache control in seconds (optional)
              });
      
            if (error) {
              console.error("Error uploading file to Supabase storage:", error.message);
              return NextResponse.json(
                { success: false, message: `Error uploading file ${file} to Supabase storage.` },
                { status: 400 },
              );
            }
            console.log(`File ${file} uploaded to Supabase storage successfully.`);
          }
    } catch (error) {
        console.log('error upload cache files to Supabase storage' , error)
    }
    
}

export async function POST() {
  try {

    await deleteCurrent();
    await new Promise(resolve => setTimeout(resolve, 2000));
    await updateBucket();

    return NextResponse.json({ success: true, message: "Updating database complete" },{ status: 200 });
  } catch (error) {
    console.error("Error updating cache to Supabase:", error);
    return NextResponse.json(
      { success: false, message: "Error updating cache to Supabase." },
      { status: 400 },
    );
  }
}
