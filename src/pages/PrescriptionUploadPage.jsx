// pages/PrescriptionUploadPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

const PrescriptionUploadPage = () => {
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    prescriptionDate: "",
    doctorName: "",
    licenseNumber: "",
    doctorContact: "",
    notes: "",
  });
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    
    // Check file sizes
    const oversizedFiles = selectedFiles.filter(file => file.size > 5 * 1024 * 1024); // 5MB
    
    if (oversizedFiles.length > 0) {
      toast.error(`Some files exceed 5MB limit: ${oversizedFiles.map(f => f.name).join(", ")}`);
      return;
    }
    
    setFiles(selectedFiles);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (files.length === 0) {
      toast.error("Please upload at least one prescription image");
      return;
    }

    try {
      setIsLoading(true);
      
      // First upload all files
      const uploadPromises = files.map(file => {
        const formData = new FormData();
        formData.append("images", file);
        return axios.post("http://localhost:3030/api/prescriptions/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      });

      const uploadResponses = await Promise.all(uploadPromises);
      const imageUrls = uploadResponses.map(res => res.data.url);

      // Then submit prescription data with image URLs
      const prescriptionData = {
        ...formData,
        images: imageUrls,
        items: [], // You might want to add items from the prescription
      };
      const token = localStorage.getItem("accessToken");
      await axios.post("http://localhost:3030/api/prescriptions", prescriptionData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      toast.success("Prescription uploaded successfully!");
      navigate("/orders");
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error(error.response?.data?.message || "Failed to upload prescription");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Upload Prescription</h1>
          <p className="mt-2 text-lg text-gray-600">
            Upload clear images of your doctor's prescription for verification
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="prescription-images" className="block text-sm font-medium text-gray-700">
              Prescription Images (Max 5MB each)
            </label>
            <input
              id="prescription-images"
              type="file"
              multiple
              accept="image/*,.pdf"
              onChange={handleFileChange}
              className="mt-1 block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
            />
            <p className="mt-1 text-sm text-gray-500">
              You can upload multiple images (JPEG, PNG, PDF)
            </p>
            {files.length > 0 && (
              <div className="mt-2">
                <p className="text-sm font-medium text-gray-700">Selected files:</p>
                <ul className="mt-1 text-sm text-gray-600">
                  {files.map((file, index) => (
                    <li key={index}>{file.name} - {(file.size / 1024 / 1024).toFixed(2)}MB</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div>
            <label htmlFor="prescription-date" className="block text-sm font-medium text-gray-700">
              Prescription Date
            </label>
            <input
              type="date"
              id="prescription-date"
              name="prescriptionDate"
              value={formData.prescriptionDate}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
            />
          </div>

          <div>
            <label htmlFor="doctor-name" className="block text-sm font-medium text-gray-700">
              Doctor's Name
            </label>
            <input
              type="text"
              id="doctor-name"
              name="doctorName"
              value={formData.doctorName}
              onChange={handleInputChange}
              required
              placeholder="Dr. John Smith"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
            />
          </div>

          <div>
            <label htmlFor="license-number" className="block text-sm font-medium text-gray-700">
              Doctor's License Number (Optional)
            </label>
            <input
              type="text"
              id="license-number"
              name="licenseNumber"
              value={formData.licenseNumber}
              onChange={handleInputChange}
              placeholder="Medical license number"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
            />
          </div>

          <div>
            <label htmlFor="doctor-contact" className="block text-sm font-medium text-gray-700">
              Doctor's Contact (Optional)
            </label>
            <input
              type="text"
              id="doctor-contact"
              name="doctorContact"
              value={formData.doctorContact}
              onChange={handleInputChange}
              placeholder="Phone or email"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
            />
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
              Additional Notes (Optional)
            </label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="Any special instructions"
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Uploading...
                </>
              ) : 'Submit Prescription'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PrescriptionUploadPage;