import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Palette, Type, Heart } from 'lucide-react';

const EnhancedCustomizationModal = ({ product, onConfirm, onCancel }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [customization, setCustomization] = useState({
    // Basic Info
    forWhom: '',
    relation: '',
    occasion: '',
    
    // Design Options
    colorScheme: '',
    fontStyle: '',
    layout: '',
    
    // Content
    mainText: '',
    subText: '',
    specialMessage: '',
    
    // Additional Options
    size: '',
    material: '',
    rushOrder: false,
    giftWrap: false,
    
    // File Uploads
    uploadedImages: [],
    referenceImages: []
  });

  const [errors, setErrors] = useState({});

  // Product type detection based on name/category
  const getProductType = () => {
    const name = product.name.toLowerCase();
    if (name.includes('card')) return 'card';
    if (name.includes('frame')) return 'frame';
    if (name.includes('journal')) return 'journal';
    if (name.includes('shadow box')) return 'shadowbox';
    if (name.includes('family tree')) return 'familytree';
    return 'general';
  };

  const productType = getProductType();

  const colorOptions = [
    { name: 'Warm Sunset', value: 'warm-sunset', colors: ['#FF6B6B', '#FFE66D', '#FF8E53'] },
    { name: 'Ocean Breeze', value: 'ocean-breeze', colors: ['#4ECDC4', '#45B7D1', '#96CEB4'] },
    { name: 'Elegant Black', value: 'elegant-black', colors: ['#2C3E50', '#34495E', '#7F8C8D'] },
    { name: 'Rose Gold', value: 'rose-gold', colors: ['#E8B4B8', '#D4A574', '#F4E4C1'] },
    { name: 'Forest Green', value: 'forest-green', colors: ['#2ECC71', '#27AE60', '#16A085'] },
    { name: 'Royal Purple', value: 'royal-purple', colors: ['#9B59B6', '#8E44AD', '#BB8FCE'] }
  ];

  const fontOptions = [
    { name: 'Elegant Script', value: 'script', preview: 'font-serif italic' },
    { name: 'Modern Sans', value: 'sans', preview: 'font-sans' },
    { name: 'Classic Serif', value: 'serif', preview: 'font-serif' },
    { name: 'Handwritten', value: 'handwritten', preview: 'font-mono' },
    { name: 'Bold Display', value: 'display', preview: 'font-bold' }
  ];

  const validateStep = (step) => {
    const newErrors = {};
    
    if (step === 1) {
      if (!customization.forWhom.trim()) newErrors.forWhom = 'Please specify who this is for';
      if (!customization.occasion.trim()) newErrors.occasion = 'Please select an occasion';
    }
    
    if (step === 2 && productType === 'card') {
      if (!customization.mainText.trim()) newErrors.mainText = 'Please enter the main text for your card';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, getTotalSteps()));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const getTotalSteps = () => {
    switch (productType) {
      case 'card': return 4;
      case 'frame': return 3;
      case 'journal': return 3;
      default: return 3;
    }
  };

  const handleSubmit = () => {
    if (validateStep(currentStep)) {
      onConfirm(customization);
    }
  };

  const updateCustomization = (field, value) => {
    setCustomization(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <Heart className="w-12 h-12 text-[var(--theme-pink)] mx-auto mb-2" />
        <h3 className="text-xl font-semibold text-gray-800">Tell us about your gift</h3>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Who is this gift for? *
        </label>
        <input
          type="text"
          value={customization.forWhom}
          onChange={(e) => updateCustomization('forWhom', e.target.value)}
          placeholder="e.g., Mom, Sarah, My Best Friend"
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[var(--theme-pink)] focus:border-transparent ${errors.forWhom ? 'border-red-300' : 'border-gray-300'}`}
        />
        {errors.forWhom && <p className="text-red-500 text-sm mt-1">{errors.forWhom}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          What's your relationship?
        </label>
        <select
          value={customization.relation}
          onChange={(e) => updateCustomization('relation', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--theme-pink)] focus:border-transparent"
        >
          <option value="">Select relationship</option>
          <option value="parent">Parent</option>
          <option value="spouse">Spouse/Partner</option>
          <option value="child">Child</option>
          <option value="sibling">Sibling</option>
          <option value="friend">Friend</option>
          <option value="colleague">Colleague</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          What's the occasion? *
        </label>
        <select
          value={customization.occasion}
          onChange={(e) => updateCustomization('occasion', e.target.value)}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[var(--theme-pink)] focus:border-transparent ${errors.occasion ? 'border-red-300' : 'border-gray-300'}`}
        >
          <option value="">Select occasion</option>
          <option value="birthday">Birthday</option>
          <option value="anniversary">Anniversary</option>
          <option value="wedding">Wedding</option>
          <option value="graduation">Graduation</option>
          <option value="baby-shower">Baby Shower</option>
          <option value="valentines">Valentine's Day</option>
          <option value="mothers-day">Mother's Day</option>
          <option value="fathers-day">Father's Day</option>
          <option value="christmas">Christmas</option>
          <option value="just-because">Just Because</option>
          <option value="other">Other</option>
        </select>
        {errors.occasion && <p className="text-red-500 text-sm mt-1">{errors.occasion}</p>}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <Palette className="w-12 h-12 text-[var(--theme-pink)] mx-auto mb-2" />
        <h3 className="text-xl font-semibold text-gray-800">Choose your style</h3>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Color Scheme
        </label>
        <div className="grid grid-cols-2 gap-3">
          {colorOptions.map((color) => (
            <button
              key={color.value}
              onClick={() => updateCustomization('colorScheme', color.value)}
              className={`p-3 border-2 rounded-lg transition-all ${
                customization.colorScheme === color.value
                  ? 'border-[var(--theme-pink)] bg-pink-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex gap-1 mb-2">
                {color.colors.map((c, i) => (
                  <div
                    key={i}
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
              <p className="text-sm font-medium text-gray-700">{color.name}</p>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Font Style
        </label>
        <div className="space-y-2">
          {fontOptions.map((font) => (
            <button
              key={font.value}
              onClick={() => updateCustomization('fontStyle', font.value)}
              className={`w-full p-3 border-2 rounded-lg text-left transition-all ${
                customization.fontStyle === font.value
                  ? 'border-[var(--theme-pink)] bg-pink-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <p className={`text-lg ${font.preview}`}>{font.name}</p>
              <p className="text-sm text-gray-500">Sample text in this style</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <Type className="w-12 h-12 text-[var(--theme-pink)] mx-auto mb-2" />
        <h3 className="text-xl font-semibold text-gray-800">Add your content</h3>
      </div>

      {productType === 'card' && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Main Text (Front of card) *
            </label>
            <input
              type="text"
              value={customization.mainText}
              onChange={(e) => updateCustomization('mainText', e.target.value)}
              placeholder="e.g., Happy Birthday, Congratulations"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[var(--theme-pink)] focus:border-transparent ${errors.mainText ? 'border-red-300' : 'border-gray-300'}`}
            />
            {errors.mainText && <p className="text-red-500 text-sm mt-1">{errors.mainText}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subtitle (Optional)
            </label>
            <input
              type="text"
              value={customization.subText}
              onChange={(e) => updateCustomization('subText', e.target.value)}
              placeholder="e.g., To the best mom ever"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--theme-pink)] focus:border-transparent"
            />
          </div>
        </>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Special Message {productType === 'card' ? '(Inside card)' : ''}
        </label>
        <textarea
          rows="4"
          value={customization.specialMessage}
          onChange={(e) => updateCustomization('specialMessage', e.target.value)}
          placeholder="Write your heartfelt message here..."
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--theme-pink)] focus:border-transparent"
        />
        <p className="text-sm text-gray-500 mt-1">
          {customization.specialMessage.length}/200 characters
        </p>
      </div>

      {(productType === 'frame' || productType === 'familytree') && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Names to Include
          </label>
          <textarea
            rows="3"
            value={customization.mainText}
            onChange={(e) => updateCustomization('mainText', e.target.value)}
            placeholder="List the names you want included (one per line)"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--theme-pink)] focus:border-transparent"
          />
        </div>
      )}
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <Upload className="w-12 h-12 text-[var(--theme-pink)] mx-auto mb-2" />
        <h3 className="text-xl font-semibold text-gray-800">Final touches</h3>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Size
          </label>
          <select
            value={customization.size}
            onChange={(e) => updateCustomization('size', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--theme-pink)] focus:border-transparent"
          >
            <option value="">Standard</option>
            <option value="small">Small</option>
            <option value="large">Large</option>
            <option value="custom">Custom Size</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Material
          </label>
          <select
            value={customization.material}
            onChange={(e) => updateCustomization('material', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--theme-pink)] focus:border-transparent"
          >
            <option value="">Standard</option>
            <option value="premium">Premium (+₹50)</option>
            <option value="luxury">Luxury (+₹100)</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={customization.rushOrder}
            onChange={(e) => updateCustomization('rushOrder', e.target.checked)}
            className="w-4 h-4 text-[var(--theme-pink)] border-gray-300 rounded focus:ring-[var(--theme-pink)]"
          />
          <span className="ml-2 text-sm text-gray-700">
            Rush Order (2-3 days) - Additional ₹200
          </span>
        </label>

        <label className="flex items-center">
          <input
            type="checkbox"
            checked={customization.giftWrap}
            onChange={(e) => updateCustomization('giftWrap', e.target.checked)}
            className="w-4 h-4 text-[var(--theme-pink)] border-gray-300 rounded focus:ring-[var(--theme-pink)]"
          />
          <span className="ml-2 text-sm text-gray-700">
            Gift Wrapping - Additional ₹50
          </span>
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Upload Reference Images (Optional)
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600">
            Drop images here or click to upload
          </p>
          <p className="text-xs text-gray-500 mt-1">
            PNG, JPG up to 5MB each
          </p>
        </div>
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1: return renderStep1();
      case 2: return renderStep2();
      case 3: return renderStep3();
      case 4: return renderStep4();
      default: return renderStep1();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onCancel}
    >
      <motion.div
        initial={{ y: -50, opacity: 0, scale: 0.9 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: -50, opacity: 0, scale: 0.9 }}
        className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div>
            <h2 className="font-playfair text-2xl font-bold text-gray-800">
              Customize "{product.name}"
            </h2>
            <p className="text-sm text-gray-600">
              Step {currentStep} of {getTotalSteps()}
            </p>
          </div>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-4 bg-gray-50">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-[var(--theme-pink)] h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / getTotalSteps()) * 100}%` }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {renderCurrentStep()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          
          <div className="flex gap-3">
            {currentStep < getTotalSteps() ? (
              <button
                onClick={nextStep}
                className="px-6 py-2 bg-[var(--theme-pink)] text-gray-800 font-semibold rounded-lg hover:bg-[var(--theme-pink-hover)] transition-all"
              >
                Next Step
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="px-6 py-2 bg-[var(--theme-pink)] text-gray-800 font-semibold rounded-lg hover:bg-[var(--theme-pink-hover)] transition-all"
              >
                Add to Cart
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default EnhancedCustomizationModal;
