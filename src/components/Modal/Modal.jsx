import React from 'react'
import './modalStyles.css'

export default function Modal({userInfo, onClose}) {

    const [isOpen, setIsOpen] = React.useState(false)

    React.useEffect(() => {
        const timer = setTimeout(() => setIsOpen(true), 10)
        return () => clearTimeout(timer)
    }, [])

    function handleClose () {
        setIsOpen(false)
        setTimeout(() => onClose(), 300)
    }

    return (
    <div className={`overlay ${isOpen ? '' : 'overlay-hidden'}`} onClick={handleClose}>
        <div className={`modal ${isOpen ? '' : 'modal-hidden'}`} onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={handleClose}>
                <i className="fa-solid fa-xmark" aria-hidden="true"></i>
            </button>

            <div className="user-info-details">
                <img className="users-photo" src={userInfo.image} alt="users photo" />
                <p className='feature'>Height: <span className='fetched-data'>{userInfo.height}</span></p>
                <p className='feature'>Weight: <span className='fetched-data'>{userInfo.weight}</span></p>
            </div>

            <div className="user-info-main">
                <p className='feature'>Full name: </p>
                <p className='fetched-data'>{userInfo.firstName} {userInfo.lastName} {userInfo?.maidenName}</p>
                <p className='feature'>Date of birth: </p>
                <p className='fetched-data'>{userInfo.birthDate} ({userInfo.age} years old)</p>
                <p className='feature'>Address: </p>
                <p className='fetched-data'>{userInfo.address.address}, {userInfo.address.city}, {userInfo.address.state}</p>
                <p className='feature'>Education: </p>
                <p className='fetched-data'>{userInfo?.university || '-'}</p>
            </div>

        </div>
    </div>
)
}
