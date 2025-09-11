import React, { useState } from 'react';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, LoaderCircle } from 'lucide-react';
import heic2any from 'heic2any';

const ImageUpload = ({ value, onChange }) => {
  const [status, setStatus] = useState('idle'); // 'idle', 'converting', 'uploading'

  const onDrop = async (acceptedFiles) => {
    let file = acceptedFiles[0];
    if (!file) return;

    const fileName = file.name.toLowerCase();
    if (fileName.endsWith('.heic') || fileName.endsWith('.heif')) {
      setStatus('converting');
      try {
        const convertedBlob = await heic2any({ blob: file, toType: "image/jpeg", quality: 0.8 });
        file = new File([convertedBlob], "converted.jpeg", { type: "image/jpeg" });
      } catch (error) {
        console.error("HEIC conversion failed:", error);
        alert("Sorry, there was an error converting that Apple image. Please try a different format like JPG or PNG.");
        setStatus('idle');
        return;
      }
    }

    const formData = new FormData();
    formData.append('file', file);
    setStatus('uploading');

    try {
      const configResponse = await axios.get('/api/upload');
      const { cloudName, uploadPreset } = configResponse.data;
      formData.append('upload_preset', uploadPreset);

      const cloudinaryResponse = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        formData
      );
      
      onChange(cloudinaryResponse.data.secure_url);
    } catch (error) {
      console.error('Image upload failed:', error);
      alert('Image upload failed. Please check the console for details.');
    } finally {
      setStatus('idle');
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.png', '.jpg', '.heic', '.heif'] },
    multiple: false,
  });

  return (
    <div>
      <label className="block text-sm font-medium text-gray-600 mb-2">Product Image</label>
      {value && (
        <div className="mb-4">
          <img src={value} alt="Product Preview" className="w-48 h-48 object-cover rounded-md" />
        </div>
      )}
      <div {...getRootProps({ className: 'w-full border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-center text-gray-500 cursor-pointer hover:bg-gray-100 p-4 transition-colors' })}>
        <input {...getInputProps()} />
        {status === 'idle' && (
          <>
            <UploadCloud size={32} />
            <span className="mt-2 text-sm">Click or drag to upload an image</span>
          </>
        )}
        {status === 'converting' && (
          <>
            <LoaderCircle size={32} className="animate-spin" />
            <span className="mt-2 text-sm">Converting image...</span>
          </>
        )}
        {status === 'uploading' && (
          <>
            <LoaderCircle size={32} className="animate-spin" />
            <span className="mt-2 text-sm">Uploading...</span>
          </>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;