"use client";

import { useEffect, useState } from "react";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import { Loader , BookOpenCheck } from 'lucide-react';

const DownloadModal = () => {
  const [open, setOpen] = useState(false);
  const [modalMessage , setModalMessage] = useState('');
  const [isLoaded , setIsLoaded] = useState(false);

  const onOpenModal = () => setOpen(true);
  const onCloseModal = () => setOpen(false);


  useEffect(() => {
    setModalMessage('Loading dataset. Please wait..');
    setOpen(true);
    const downloadFiles = async () => {
      try {
        const response = await fetch("/api/downloadCache");
        if (!response.ok) {
          throw new Error("Failed to initiate download");
        } else {
            setModalMessage('Dataset Loaded successfully');
            setIsLoaded(true);
            setOpen(false);
          
        }

        const data = await response.json();
        if (!data.success) {
          throw new Error(data.message || "Download failed");
        }
      } catch (error) {
        console.error("Error downloading files:", error);
        // Handle error
      }
    };

    downloadFiles();
  }, []);

  return (
    <div className="w-full h-full">
      <Modal
        open={open}
        center
        closeOnOverlayClick={false}
        showCloseIcon={false}
        onClose={onCloseModal}
        styles={{
            modal: {
              borderRadius: '8px',
              padding: '20px', // Adjust the padding as needed
              background: '#fff', // Set modal background color
            },
            overlay: {
              backdropFilter: 'blur(5px)', // Adjust the backdrop blur value as needed
            },
          }}
        
      >
        <div className="flex flex-col items-center justify-center">
        <p className="mb-2">{modalMessage}</p>
        {isLoaded?
        <BookOpenCheck size={28}/>
        :<Loader className="animate-spin" size={28}/>}
        </div>
      </Modal>
    </div>
  );
};

export default DownloadModal;
