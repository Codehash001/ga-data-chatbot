'use client'

import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, PackagePlus, Loader } from 'lucide-react';
import { Button } from '../button';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const FileUpload = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);

  const onDrop = (acceptedFiles: File[]) => {
    setFiles(acceptedFiles);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setUploading(true);
      toast.info('Start feeding dataset. This may take a while');

      await handleUpload();
      await handleIngest();
      await handleUpdateDatabase();
    } catch (error) {
      console.error('Error feeding dataset', error);
      toast.error('Failed to create dataset or update database');
    } finally {
      await handleDelete();
      setFiles([]);
      setUploading(false);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: true, // enable multiple file upload
  });

  const handleIngest = async () => {
    try {
      // Start the fetch call and immediately show the pending message
      const resPromise = fetch('/api/generate', {
        method: 'POST',
      });
  
      const promiseOptions = {
        pending: 'Feeding dataset...',
        success: 'Feeding dataset completed', 
        error: 'Feeding dataset failed!'
      };
  
      // Use toast.promise to handle the toast messages based on the response
      await toast.promise(
        resPromise.then(async (res) => {
          if (!res.ok) {
            throw new Error(await res.text());
          }
          return res.json();
        }), // The promise to track
        promiseOptions
      );
    } catch (e: any) {
      // Handle errors here
      console.error(e);
      toast.error('Feeding dataset failed!');
    }
  };
  

  const handleUpload = async () => {
    if (files.length === 0) {
      toast.error('Please select at least one file');
      throw new Error('No files selected');
    }

    try {
      const data = new FormData();
      files.forEach((file, index) => {
        data.append(`file${index}`, file);
      });

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: data,
      });
      // handle the error
      if (!res.ok) throw new Error(await res.text());
    } catch (e: any) {
      // Handle errors here
      console.error(e);
      toast.error('Uploading files failed!');
    }
  };

  const handleUpdateDatabase = async () => {
    try {
      // Start the fetch call and immediately show the pending message
      const resPromise = fetch('/api/updateDatabase', {
        method: 'POST',
      });
  
      const promiseOptions = {
        pending: 'Updating database...',
        success: 'Databse updated successfully', 
        error: 'Updating databse failed!'
      };
  
      // Use toast.promise to handle the toast messages based on the response
      await toast.promise(
        resPromise.then(async (res) => {
          if (!res.ok) {
            throw new Error(await res.text());
          }
          return res.json();
        }), // The promise to track
        promiseOptions
      );
    } catch (e: any) {
      // Handle errors here
      console.error(e);
      toast.error('Updating databse failed!');
    }
  };

  const handleDelete = async () => {
    try {
      const res = await fetch('/api/removeFiles', {
        method: 'DELETE',
      });
      // handle the error
      if (!res.ok) throw new Error(await res.text());
    } catch (e: any) {
      // Handle errors here
      console.error(e);
    }
  };

  return (
    <form onSubmit={onSubmit} className='h-full flex flex-col space-y-2'>
      <div {...getRootProps()} className='border-2 border-dashed border-black p-4 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-slate-200'>
        <input {...getInputProps()} />
        <Upload size={48} />
        <p className='text-center'>Drag & drop some files here, or click to select files</p>
      </div>
      <ul className='w-full max-h-[300px] overflow-y-auto flex-grow'>
        {files.map((file, index) => (
          <li key={index} className='border rounded-md px-3 py-1 text-sm flex space-x-2 items-center mb-1'>
            <div><File size={16} /></div>
            <div>{file.name}</div>
          </li>
        ))}
      </ul>
      <div className="flex-grow w-full items-start">
        {/* Additional content */}
      </div>
      <Button variant='default' size='sm' className={uploading ? 'w-full opacity-45' : 'w-full'}><input type="submit" value={uploading ? "Feeding dataset" : "Feed dataset"} />
        {uploading ?
          <Loader size={18} className='ml-2 animate-spin' /> :
          <PackagePlus size={18} className='ml-2' />}
      </Button>
    </form>
  );
};

export default FileUpload;
