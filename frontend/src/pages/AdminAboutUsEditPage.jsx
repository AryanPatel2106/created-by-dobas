import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, UploadCloud } from 'lucide-react';
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import heic2any from 'heic2any';
import api from '../utils/api.js';

// --- RELIABLE Image Editor Modal ---
const ImageEditorModal = ({ imageSrc, onSave, onCancel }) => {
    const imgRef = useRef(null);
    const [crop, setCrop] = useState();
    const [completedCrop, setCompletedCrop] = useState(null);

    function onImageLoad(e) {
        const { width, height } = e.currentTarget;
        const initialCrop = centerCrop(
            makeAspectCrop({ unit: '%', width: 90 }, 1, width, height),
            width,
            height
        );
        setCrop(initialCrop);
    }

    const handleSave = () => {
        if (!completedCrop || !imgRef.current) {
            alert("Could not save crop. Please try again.");
            return;
        }
        const image = imgRef.current;
        const canvas = document.createElement('canvas');
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        
        canvas.width = completedCrop.width;
        canvas.height = completedCrop.height;
        const ctx = canvas.getContext('2d');
        
        ctx.drawImage(
            image,
            completedCrop.x * scaleX,
            completedCrop.y * scaleY,
            completedCrop.width * scaleX,
            completedCrop.height * scaleY,
            0, 0, completedCrop.width, completedCrop.height
        );
        
        const base64Image = canvas.toDataURL('image/jpeg');
        onSave(base64Image);
    };

    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex flex-col items-center justify-center p-4">
            <div className="bg-white p-4 rounded-lg">
                <ReactCrop
                    crop={crop}
                    onChange={(_, percentCrop) => setCrop(percentCrop)}
                    onComplete={(c) => setCompletedCrop(c)}
                    aspect={1}
                    circularCrop={true}
                >
                    <img
                        ref={imgRef}
                        alt="Crop me"
                        src={imageSrc}
                        onLoad={onImageLoad}
                        style={{ maxHeight: '70vh' }}
                    />
                </ReactCrop>
            </div>
            <div className="flex gap-4 mt-4">
                <button onClick={onCancel} className="bg-gray-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-gray-600 transition-colors">Cancel</button>
                <button onClick={handleSave} className="bg-[var(--theme-pink)] text-gray-800 font-bold py-2 px-6 rounded-lg hover:bg-[var(--theme-pink-hover)] transition-colors">Save Photo</button>
            </div>
        </div>
    );
};

// --- RELIABLE Team Member Form ---
const TeamMemberForm = ({ member, index, onMemberChange, onImageSelect }) => {
    const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            onImageSelect(e.target.files[0], index);
        }
    };
    
    return (
        <div className="bg-gray-50 p-4 rounded-lg border space-y-4">
            <h4 className="font-bold text-lg text-gray-800">Team Member {index + 1}</h4>
            <div className="flex items-center gap-4">
                <img src={member.image || 'https://placehold.co/100x100'} alt={`Profile of ${member.name || 'Team Member'}`} className="w-24 h-24 rounded-full object-cover bg-gray-200" />
                <label className="w-full h-24 border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-center text-gray-500 cursor-pointer hover:bg-gray-100">
                    <input type="file" accept="image/*,.heic,.heif" onChange={handleFileChange} className="hidden" />
                    <UploadCloud size={24} />
                    <span className="text-xs mt-2">Click to select a photo</span>
                </label>
            </div>
            <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Name</label>
                <input type="text" value={member.name} onChange={(e) => onMemberChange(index, 'name', e.target.value)} className="w-full border-gray-300 rounded-md px-2 py-1 text-sm" />
            </div>
            <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Role</label>
                <input type="text" value={member.role} onChange={(e) => onMemberChange(index, 'role', e.target.value)} className="w-full border-gray-300 rounded-md px-2 py-1 text-sm" />
            </div>
            <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Bio</label>
                <textarea rows="3" value={member.bio} onChange={(e) => onMemberChange(index, 'bio', e.target.value)} className="w-full border-gray-300 rounded-md px-2 py-1 text-sm"></textarea>
            </div>
        </div>
    );
};

const AdminAboutUsEditPage = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [isConverting, setIsConverting] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [teamMembers, setTeamMembers] = useState([
        { name: '', role: '', bio: '', image: '' }, { name: '', role: '', bio: '', image: '' },
        { name: '', role: '', bio: '', image: '' }, { name: '', role: '', bio: '', image: '' },
    ]);
    
    const [imageToEdit, setImageToEdit] = useState(null);
    const [editingMemberIndex, setEditingMemberIndex] = useState(null);

    useEffect(() => {
        const fetchContent = async () => {
            try {
                // Use the api instance instead of axios directly
                const { data } = await api.get('/api/about-us');
                setTitle(data.title);
                setDescription(data.description);
                if (data.teamMembers && data.teamMembers.length) {
                    setTeamMembers(data.teamMembers);
                }
            } catch (error) {
                console.error("Failed to fetch About Us content", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchContent();
    }, []);

    const handleImageSelect = async (file, index) => {
        if (!file) return;

        let fileToProcess = file;
        const fileName = file.name.toLowerCase();

        if (fileName.endsWith('.heic') || fileName.endsWith('.heif')) {
            setIsConverting(true);
            try {
                const convertedBlob = await heic2any({ blob: file, toType: "image/jpeg", quality: 0.8 });
                fileToProcess = new File([convertedBlob], "converted.jpeg", { type: "image/jpeg" });
            } catch (error) {
                console.error("HEIC conversion failed:", error);
                alert("Sorry, there was an error converting that image. Please try a different format like JPG or PNG.");
                setIsConverting(false);
                return;
            } finally {
                setIsConverting(false);
            }
        }

        const reader = new FileReader();
        reader.readAsDataURL(fileToProcess);
        reader.onloadend = () => {
            setEditingMemberIndex(index);
            setImageToEdit(reader.result);
        };
    };

    const handleTeamMemberChange = (index, field, value) => {
        const updatedMembers = [...teamMembers];
        updatedMembers[index][field] = value;
        setTeamMembers(updatedMembers);
    };
    
    const onSaveCroppedImage = (croppedImageBase64) => {
        handleTeamMemberChange(editingMemberIndex, 'image', croppedImageBase64);
        setImageToEdit(null);
        setEditingMemberIndex(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Use the api instance instead of axios directly
            await api.put('/api/about-us', { title, description, teamMembers });
            alert('About Us page updated successfully!');
            navigate('/admin');
        } catch (error) {
            alert('Failed to update page.');
        }
    };

    if (isLoading) return <div className="text-center py-20">Loading Editor...</div>;

    return (
        <>
            {imageToEdit && (
                <ImageEditorModal 
                    imageSrc={imageToEdit} 
                    onSave={onSaveCroppedImage} 
                    onCancel={() => setImageToEdit(null)} 
                />
            )}
            <div className="py-12 max-w-4xl mx-auto">
                <Link to="/admin" className="flex items-center gap-2 text-gray-500 hover:text-[var(--theme-pink)] mb-8 transition-colors">
                    <ArrowLeft size={20} /> Back to Dashboard
                </Link>
                <div className="bg-white p-8 rounded-lg shadow-lg border">
                    <form onSubmit={handleSubmit}>
                        <h1 className="font-playfair text-3xl font-bold mb-8 text-gray-800">Edit 'About Us' Page</h1>
                        <div className="space-y-6 mb-12">
                           <div>
                                <label className="block text-sm font-medium text-gray-600 mb-2">Main Title</label>
                                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-gray-50 border border-gray-300 rounded-md px-3 py-2" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-2">Introductory Paragraph</label>
                                <textarea rows="4" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full bg-gray-50 border border-gray-300 rounded-md px-3 py-2"></textarea>
                            </div>
                        </div>

                        <h3 className="font-playfair text-2xl font-bold mb-6 text-gray-700">Team Member Profiles</h3>
                        {isConverting && <p className="text-center text-blue-600 font-semibold mb-4">Converting Apple image, please wait...</p>}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {teamMembers.map((member, index) => (
                                <TeamMemberForm
                                    key={index}
                                    member={member}
                                    index={index}
                                    onMemberChange={handleTeamMemberChange}
                                    onImageSelect={handleImageSelect}
                                />
                            ))}
                        </div>
                        
                        <button type="submit" className="mt-8 w-full bg-green-600 text-white font-bold py-3 rounded-lg text-lg hover:bg-green-700 transition-all">
                            Save All Settings
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default AdminAboutUsEditPage;