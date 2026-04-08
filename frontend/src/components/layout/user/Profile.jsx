import React, { useState } from 'react';

function Profile() {
  const [formData, setFormData] = useState({
    id: '',
    phoneNumber: '',
    gender: '',
    state: '',
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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
        setMessage('Profile added successfully ✅');

        setFormData({
          phoneNumber: '',
          gender: '',
          state: '',
        });
      } else {
        const errorText = await response.text();
        setMessage(`Failed: ${errorText}`);
      }
    } catch (error) {
      console.error(error);
      setMessage('Something went wrong');
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Add Profile</h1>

      <form onSubmit={handleSubmit} className="space-y-4">

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

      {message && <p className="mt-4">{message}</p>}
    </div>
  );
}

export default Profile;