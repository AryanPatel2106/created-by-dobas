import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Trash2, XCircle } from 'lucide-react';
import Rating from '../components/Rating';

const AdminTestimonialListPage = () => {
    const [testimonials, setTestimonials] = useState([]);

    const fetchTestimonials = async () => {
        try {
            const { data } = await axios.get('/api/testimonials/all');
            setTestimonials(data);
        } catch (error) {
            console.error("Failed to fetch testimonials", error);
        }
    };
    
    useEffect(() => {
        fetchTestimonials();
    }, []);

    const approveHandler = async (id) => {
        if(window.confirm('Are you sure you want to approve this testimonial? It will appear on the homepage.')) {
            try {
                await axios.put(`/api/testimonials/${id}/approve`);
                fetchTestimonials();
            } catch (error) {
                alert('Failed to approve testimonial.');
            }
        }
    };

    const deleteHandler = async (id) => {
        if(window.confirm('Are you sure you want to permanently delete this testimonial?')) {
            try {
                await axios.delete(`/api/testimonials/${id}`);
                fetchTestimonials();
            } catch (error) {
                alert('Failed to delete testimonial.');
            }
        }
    };

    return (
        <div className="py-12">
            <Link to="/admin" className="flex items-center gap-2 text-gray-500 hover:text-[var(--theme-pink)] mb-8 transition-colors">
                <ArrowLeft size={20} />
                Back to Dashboard
            </Link>
            <h1 className="font-playfair text-4xl font-bold text-gray-800 mb-8">Manage Testimonials</h1>
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="p-4 font-semibold">USER</th>
                                <th className="p-4 font-semibold">RATING</th>
                                <th className="p-4 font-semibold">COMMENT</th>
                                <th className="p-4 font-semibold">STATUS</th>
                                <th className="p-4 font-semibold">ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {testimonials.map((testimonial) => (
                                <tr key={testimonial._id} className="border-b last:border-b-0 hover:bg-gray-50">
                                    <td className="p-4">{testimonial.user.name}</td>
                                    <td className="p-4"><Rating value={testimonial.rating} /></td>
                                    <td className="p-4 text-sm text-gray-600 max-w-sm">{testimonial.comment}</td>
                                    <td className="p-4">
                                        {testimonial.isApproved ? (
                                            <span className="flex items-center gap-1 text-green-600"><CheckCircle size={16} /> Approved</span>
                                        ) : (
                                            <span className="flex items-center gap-1 text-yellow-600"><XCircle size={16} /> Pending</span>
                                        )}
                                    </td>
                                    <td className="p-4 flex gap-4">
                                        {!testimonial.isApproved && (
                                            <button onClick={() => approveHandler(testimonial._id)} title="Approve">
                                                <CheckCircle className="text-gray-500 hover:text-green-500 cursor-pointer" />
                                            </button>
                                        )}
                                        <button onClick={() => deleteHandler(testimonial._id)} title="Delete">
                                            <Trash2 className="text-gray-500 hover:text-red-500 cursor-pointer" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminTestimonialListPage;