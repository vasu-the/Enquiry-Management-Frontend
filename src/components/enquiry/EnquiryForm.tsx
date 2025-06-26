import React, { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';

const MAX_FILE_SIZE_MB = 2;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'application/pdf'];

const EnquiryForm: React.FC = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
  });
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [agree, setAgree] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (!ALLOWED_TYPES.includes(selectedFile.type)) {
      setError('Only JPG, PNG, or PDF files are allowed.');
      return;
    }

    if (selectedFile.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setError(`File size must be under ${MAX_FILE_SIZE_MB}MB.`);
      return;
    }

    setFile(selectedFile);
    setError('');

    if (selectedFile.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(selectedFile);
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setMessage('');
    setError('');

    const token = localStorage.getItem('token');
    if (!token) {
      setError('You must be logged in to submit an enquiry.');
      setLoading(false);
      return;
    }

    const form = new FormData();
    form.append('title', formData.title);
    form.append('description', formData.description);
    form.append('category', formData.category);
    if (file) form.append('file', file);

    try {
      const res = await axios.post('https://enquiry-management-backend.vercel.app/api/enquiries', form, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      setMessage('Enquiry submitted successfully.');
      setFormData({ title: '', description: '', category: '' });
      setFile(null);
      setPreview(null);
      setAgree(false);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Submission failed');
      } else {
        setError('An unexpected error occurred');
      }
    }

    setLoading(false);
  };

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.category) {
      setError('All fields are required.');
      return;
    }

    if (!agree) {
      setError('You must agree to the terms.');
      return;
    }

    handleSubmit();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-100 p-4">
      <form
        onSubmit={handleFormSubmit}
        className="bg-white p-8 shadow-xl rounded-2xl w-full max-w-lg space-y-6"
      >
        <h2 className="text-2xl font-bold text-center text-blue-700">Submit Enquiry</h2>

        {message && <p className="text-green-600 text-center">{message}</p>}
        {error && <p className="text-red-600 text-center">{error}</p>}

        <div>
          <label className="block mb-1 font-medium text-gray-700">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-blue-300 rounded-xl focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            rows={4}
            value={formData.description}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-blue-300 rounded-xl focus:ring-2 focus:ring-blue-500"
            required
          ></textarea>
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-700">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-blue-300 rounded-xl focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="" disabled>Select a category</option>
            <option value="Feedback">Feedback</option>
            <option value="Issues">Issues</option>
            <option value="Feature Request">Feature Request</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-700">Upload File (optional)</label>
          <label
            htmlFor="file-upload"
            className="block w-full text-center px-4 py-2 border border-blue-500 text-blue-700 rounded-xl cursor-pointer bg-white hover:bg-blue-50 transition"
          >
            {file ? file.name : 'Choose File'}
          </label>
          <input
            id="file-upload"
            type="file"
            onChange={handleFileChange}
            className="hidden"
          />
          {preview && (
            <div className="mt-2">
              <img src={preview} alt="Preview" className="h-32 rounded-md shadow-md" />
            </div>
          )}
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
            className="mr-2"
            id="agree"
          />
          <label htmlFor="agree" className="text-sm text-gray-700">
            I agree to the terms and conditions
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full text-white py-2 rounded-xl transition duration-300 shadow-lg ${
            loading
              ? 'bg-blue-300 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:from-blue-600 hover:to-blue-800'
          }`}
        >
          {loading ? 'Submitting...' : 'Submit Enquiry'}
        </button>
      </form>
    </div>
  );
};

export default EnquiryForm;
