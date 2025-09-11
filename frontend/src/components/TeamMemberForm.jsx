import React from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud } from 'lucide-react';

const TeamMemberForm = ({ member, index, onMemberChange, onImageDrop }) => {
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (files) => onImageDrop(files, index),
    accept: { 'image/*': [] },
    multiple: false
  });

  return (
    <div className="bg-gray-50 p-4 rounded-lg border space-y-4">
      <h4 className="font-bold text-lg text-gray-800">Team Member {index + 1}</h4>
      <div className="flex items-center gap-4">
        <img src={member.image || 'https://placehold.co/100x100'} alt={`Profile of ${member.name || 'Team Member'}`} className="w-24 h-24 rounded-full object-cover bg-gray-200" />
        <div {...getRootProps({ className: 'w-full h-24 border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-center text-gray-500 cursor-pointer hover:bg-gray-100' })}>
          <input {...getInputProps()} />
          <UploadCloud size={24} />
          <p className="text-xs mt-2">Drop image or click to upload</p>
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">Name</label>
        <input 
          type="text" 
          value={member.name} 
          onChange={(e) => onMemberChange(index, 'name', e.target.value)} 
          className="w-full border-gray-300 rounded-md px-2 py-1 text-sm" 
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">Role</label>
        <input 
          type="text" 
          value={member.role} 
          onChange={(e) => onMemberChange(index, 'role', e.target.value)} 
          className="w-full border-gray-300 rounded-md px-2 py-1 text-sm" 
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">Bio</label>
        <textarea 
          rows="3" 
          value={member.bio} 
          onChange={(e) => onMemberChange(index, 'bio', e.target.value)} 
          className="w-full border-gray-300 rounded-md px-2 py-1 text-sm"
        ></textarea>
      </div>
    </div>
  );
};

export default TeamMemberForm;