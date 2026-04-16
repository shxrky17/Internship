import React, { useState } from 'react';

function Profile() {
  const [formData, setFormData] = useState({
    id: '',
    phoneNumber: '',
    gender: '',
    state: '',
  });

  const [file, setFile] = useState(null);
  const [profileMessage, setProfileMessage] = useState('');
  const [uploadMessage, setUploadMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8081/add-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setProfileMessage('Profile added successfully ✅');
        setFormData({
          id: '',
          phoneNumber: '',
          gender: '',
          state: '',
        });
      } else {
        const errorText = await response.text();
        setProfileMessage(`Failed: ${errorText}`);
      }
    } catch (error) {
      console.error(error);
      setProfileMessage('Something went wrong while adding profile');
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setUploadMessage('Please select a PDF');
      return;
    }

    const uploadData = new FormData();
    uploadData.append('file', file);

    try {
      const response = await fetch('http://localhost:8081/upload', {
        method: 'POST',
        body: uploadData,
        credentials: 'include',
      });

      const data = await response.json();

      if (response.ok) {
        setUploadMessage('File uploaded successfully ✅');
        console.log('Upload response:', data);
        setFile(null);
      } else {
        setUploadMessage(`Upload failed ❌ ${data.error || ''}`);
        console.error(data);
      }
    } catch (error) {
      console.error(error);
      setUploadMessage('Error uploading file');
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Add Profile</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="id"
          placeholder="ID"
          value={formData.id}
          onChange={handleChange}
          className="w-full border p-3 rounded"
        />

        <input
          type="text"
          name="phoneNumber"
          placeholder="Phone Number"
          value={formData.phoneNumber}
          onChange={handleChange}
          className="w-full border p-3 rounded"
        />

        <input
          type="text"
          name="gender"
          placeholder="Gender"
          value={formData.gender}
          onChange={handleChange}
          className="w-full border p-3 rounded"
        />

        <input
          type="text"
          name="state"
          placeholder="State"
          value={formData.state}
          onChange={handleChange}
          className="w-full border p-3 rounded"
        />

        <button
          type="submit"
          className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700"
        >
          Add Profile
        </button>
      </form>

      {profileMessage && <p className="mt-4">{profileMessage}</p>}

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Upload PDF</h2>

        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          className="w-full border p-3 rounded"
        />

        <button
          type="button"
          onClick={handleUpload}
          className="mt-4 bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
        >
          Upload PDF
        </button>

        {uploadMessage && <p className="mt-4">{uploadMessage}</p>}
      </div>
    </div>
  );
}

export default Profile;