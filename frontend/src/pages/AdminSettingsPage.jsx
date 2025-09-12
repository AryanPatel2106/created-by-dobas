import React, { useState, useEffect } from 'react';
import api from '../utils/api.js';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const AdminSettingsPage = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);

    const [aboutStore, setAboutStore] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [socials, setSocials] = useState({ instagram: '', youtube: '', whatsapp: '', linkedin: '' });

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const { data } = await api.get('/api/site-settings');
                setAboutStore(data.aboutStore);
                setEmail(data.email);
                setPhone(data.phone);
                setAddress(data.address);
                if (data.socials) setSocials(data.socials);
            } catch (error) {
                console.error("Failed to fetch settings", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const handleSocialChange = (platform, value) => {
        setSocials(prev => ({ ...prev, [platform]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.put('/api/site-settings', { aboutStore, email, phone, address, socials });
            alert('Site settings updated successfully!');
            navigate('/admin');
        } catch (error) {
            alert('Failed to update settings.');
        }
    };

    if (isLoading) return <div className="text-center py-20">Loading Settings...</div>;

    return (
        <div className="py-12 max-w-4xl mx-auto">
            <Link to="/admin" className="flex items-center gap-2 text-gray-500 hover:text-[var(--theme-pink)] mb-8 transition-colors">
                <ArrowLeft size={20} />
                Back to Dashboard
            </Link>
            <div className="bg-white p-8 rounded-lg shadow-lg border">
                <form onSubmit={handleSubmit}>
                    <h1 className="font-playfair text-3xl font-bold mb-8 text-gray-800">Edit Site & Footer Information</h1>
                    
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-2">About Store Paragraph (for Footer)</label>
                            <textarea rows="4" value={aboutStore} onChange={(e) => setAboutStore(e.target.value)} className="w-full bg-gray-50 border border-gray-300 rounded-md px-3 py-2 focus:ring-[var(--theme-pink)] focus:border-[var(--theme-pink)]" />
                        </div>

                        <h3 className="font-playfair text-2xl font-bold pt-6 border-t text-gray-700">Contact Information</h3>
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-2">Email Address</label>
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-gray-50 border border-gray-300 rounded-md px-3 py-2 focus:ring-[var(--theme-pink)] focus:border-[var(--theme-pink)]" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-2">Phone Number</label>
                            <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full bg-gray-50 border border-gray-300 rounded-md px-3 py-2 focus:ring-[var(--theme-pink)] focus:border-[var(--theme-pink)]" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-2">Address</label>
                            <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} className="w-full bg-gray-50 border border-gray-300 rounded-md px-3 py-2 focus:ring-[var(--theme-pink)] focus:border-[var(--theme-pink)]" />
                        </div>

                        <h3 className="font-playfair text-2xl font-bold pt-6 border-t text-gray-700">Social Media Links</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-2">Instagram URL</label>
                                <input type="text" value={socials.instagram} onChange={(e) => handleSocialChange('instagram', e.target.value)} className="w-full bg-gray-50 border border-gray-300 rounded-md px-3 py-2" />
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-gray-600 mb-2">YouTube URL</label>
                                <input type="text" value={socials.youtube} onChange={(e) => handleSocialChange('youtube', e.target.value)} className="w-full bg-gray-50 border border-gray-300 rounded-md px-3 py-2" />
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-gray-600 mb-2">LinkedIn URL</label>
                                <input type="text" value={socials.linkedin} onChange={(e) => handleSocialChange('linkedin', e.target.value)} className="w-full bg-gray-50 border border-gray-300 rounded-md px-3 py-2" />
                            </div>
                        </div>
                    </div>
                    
                    <button type="submit" className="mt-8 w-full bg-green-600 text-white font-bold py-3 rounded-lg text-lg hover:bg-green-700 transition-all duration-300 transform hover:scale-105 shadow-lg">
                        Save All Settings
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminSettingsPage;