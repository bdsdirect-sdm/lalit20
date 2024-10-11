import React, { useState } from 'react';
import axios from 'axios';
import './RegistrationForm.css';

const RegistrationForm: React.FC = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        gender: '',
        userType: '',
        hobbies: [] as string[],
        profileImage: null as File | null,
        agencyId: '',
        resume: null as File | null,
    });

    const agencies = ['Agency A', 'Agency B', 'Agency C'];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        if (type === 'file') {
            const target = e.target as HTMLInputElement; // Type assertion
            const file = target.files ? target.files[0] : null;
            setFormData({ ...formData, [name]: file });
        } else if (name === 'hobbies') {
            const updatedHobbies = formData.hobbies.includes(value)
                ? formData.hobbies.filter(hobby => hobby !== value)
                : [...formData.hobbies, value];
            setFormData({ ...formData, hobbies: updatedHobbies });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const formPayload = new FormData();
        for (const key in formData) {
            const value = formData[key as keyof typeof formData];

            if (value instanceof File) {
                formPayload.append(key, value);
            } else if (Array.isArray(value)) {
                value.forEach(hobby => formPayload.append('hobbies[]', hobby));
            } else if (value) {
                formPayload.append(key, value);
            }
        }

        try {
            const response = await axios.post('http://localhost:5000/api/users/register', formPayload, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log(response.data);
        } catch (error) {
            console.error('Error registering user:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h1>Registration Form</h1>
            <input type="text" name="firstName" placeholder="First Name" onChange={handleChange} required />
            <input type="text" name="lastName" placeholder="Last Name" onChange={handleChange} required />
            <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
            <input type="tel" name="phone" placeholder="Phone" onChange={handleChange} required pattern="[0-9]*" />
            <label>
                <input type="radio" name="gender" value="Male" onChange={handleChange} required /> Male
            </label>
            <label>
                <input type="radio" name="gender" value="Female" onChange={handleChange} required /> Female
            </label>
            <select name="userType" onChange={handleChange} required>
                <option value="">Select User Type</option>
                <option value="Job Seeker">Job Seeker</option>
                <option value="Agency">Agency</option>
            </select>

            <fieldset>
                <legend>Select Hobbies:</legend>
                <label>
                    <input type="checkbox" name="hobbies" value="Sports" onChange={handleChange} /> Sports
                </label>
                <label>
                    <input type="checkbox" name="hobbies" value="Dance" onChange={handleChange} /> Dance
                </label>
                <label>
                    <input type="checkbox" name="hobbies" value="Reading" onChange={handleChange} /> Reading
                </label>
                <label>
                    <input type="checkbox" name="hobbies" value="Singing" onChange={handleChange} /> Singing
                </label>
            </fieldset>
            <label>
                <span className='width'>Profile Photo</span>
                <input type="file" name="profileImage" accept=".png, .jpg, .jpeg" onChange={handleChange} />
            </label>
            {formData.userType === 'Job Seeker' && (
                <>
                    <span className='width2'>Resume</span>
                    <input type="file" name="resume" accept=".pdf, .docx" onChange={handleChange} />
                    <select name="agencyId" onChange={handleChange} required>
                        <option value="">Select Agency</option>
                        {agencies.map((agency, index) => (
                            <option key={index} value={agency}>{agency}</option>
                        ))}
                    </select>
                </>
            )}
            <button type="submit">Register</button>
        </form>
    );
};

export default RegistrationForm;
