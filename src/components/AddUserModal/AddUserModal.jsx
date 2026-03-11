import React, { useState } from 'react'
import './addUserModalStyles.css'

export default function AddUserModal({ isOpen, onClose, onAdd }) {

    const [formData, setFormData] = useState({
                                    firstName: '',
                                    lastName: '',
                                    maidenName: '',
                                    age: '',
                                    gender: 'male',
                                    phone: '',
                                    email: '',
                                    country: '',
                                    city: '',
                                    address: {
                                    address: '',
                                    city: '',
                                    state: ''
                                    },
                                    height: '',
                                    weight: '',
                                    university: '',
                                    image: 'public/new-user-pfp.png'
                                })
    
    const [open, setOpen] = React.useState(false)

    React.useEffect(() => {
        const timer = setTimeout(() => setOpen(true), 10)
        return () => clearTimeout(timer)
    }, [])

    const handleClose = () => {
        setOpen(false)
        setTimeout(() => onClose(), 300)
    }

    function handleChange(e)  {
        const {name, value} = e.target

        if (name.startsWith('address.')) {
            const field = name.split('.')[1]
            setFormData(prev => 
                ({...prev, address: {...prev.address, [field]: value}}));
            } 
            else {
                setFormData(prev => ({ ...prev, [name]: value }))
            }
        }

    function handleSubmit(e) {
        e.preventDefault()
        const newUser = {
            ...formData,
            age: Number(formData.age),
            height: Number(formData.height),
            weight: Number(formData.weight)
        }
        onAdd(newUser)
        handleClose()
    }

    return (
        <div className={`overlay ${open ? '' : 'overlay-hidden'}`} onClick={handleClose}>
            <div className={`modal-content ${open ? '' : 'modal-content-hidden'}`} onClick={(e) => e.stopPropagation()}>
            <h2>Please, enter info about new user:</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-grid">
                <div>
                    <label>First Name *</label>
                    <input name="firstName" value={formData.firstName} onChange={handleChange} required />
                </div>
                <div>
                    <label>Last Name *</label>
                    <input name="lastName" value={formData.lastName} onChange={handleChange} required />
                </div>
                <div>
                    <label>Maiden Name</label>
                    <input name="maidenName" value={formData.maidenName} onChange={handleChange} />
                </div>
                <div>
                    <label>Age *</label>
                    <input type="number" name="age" value={formData.age} onChange={handleChange} required />
                </div>
                <div>
                    <label>Gender</label>
                    <select name="gender" value={formData.gender} onChange={handleChange}>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    </select>
                </div>
                <div>
                    <label>Phone *</label>
                    <input name="phone" value={formData.phone} onChange={handleChange} required />
                </div>
                <div>
                    <label>Email *</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                </div>
                <div>
                    <label>Country *</label>
                    <input name="country" value={formData.country} onChange={handleChange} required />
                </div>
                <div>
                    <label>City *</label>
                    <input name="city" value={formData.city} onChange={handleChange} required />
                </div>
                <div>
                    <label>Street Address</label>
                    <input name="address.address" value={formData.address.address} onChange={handleChange} />
                </div>
                <div>
                    <label>State</label>
                    <input name="address.state" value={formData.address.state} onChange={handleChange} />
                </div>
                <div>
                    <label>Height (cm)</label>
                    <input type="number" name="height" value={formData.height} onChange={handleChange} />
                </div>
                <div>
                    <label>Weight (kg)</label>
                    <input type="number" name="weight" value={formData.weight} onChange={handleChange} />
                </div>
                <div>
                    <label>University</label>
                    <input name="university" value={formData.university} onChange={handleChange} />
                </div>
                </div>
                <div className="modal-actions">
                    <button type="button" onClick={handleClose}>Cancel</button>
                    <button type="submit">Add User</button>
                </div>
            </form>
            </div>
        </div>
    )
}