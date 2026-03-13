import React from 'react'
import TableHeader from './TableHeader'
import TableRow from './TableRow'
import Modal from './Modal/Modal'
import AddUserModal from './AddUserModal/AddUserModal'

export default function Table() {

    const [usersInfo, setUsersInfo] = React.useState(() => {
        const stored = localStorage.getItem('usersInfo')
        return stored ? JSON.parse(stored) : []
    })

    const [sortConfig, setSortConfig] = React.useState(() => {
        const stored = localStorage.getItem('sortConfig')
        return stored ? JSON.parse(stored) : {key: null, direction: null}
    })

    const [selectedIds, setSelectedIds] = React.useState(() => {
        const stored = localStorage.getItem('selectedIds')
        return stored ? JSON.parse(stored) : []
    })
    const [modalUser, setModalUser] = React.useState(null)

    const [isAddModalOpen, setIsAddModalOpen] = React.useState(false)

    const [loading, setLoading] = React.useState(false)
    const [error, setError] = React.useState(null)

    function sortUsers(users, config) {
        if (!config || !config.key || !config.direction) return users

        const sorted = [...users].sort((a, b) => {
            const aVal = a[config.key]
            const bVal = b[config.key]

            if (aVal == null && bVal == null) return 0
            if (aVal == null) return 1
            if (bVal == null) return -1

            if (typeof aVal === 'number' && typeof bVal === 'number') {
                return aVal - bVal
            }

            return String(aVal).localeCompare(String(bVal))
        })

        return config.direction === 'desc' ? sorted.reverse() : sorted
    }

    const isAllSelected = selectedIds.length === usersInfo.length && usersInfo.length > 0

    function onToggleAll() {
        if(isAllSelected) {
            setSelectedIds(() => {
                const next = []
                localStorage.setItem('selectedIds', JSON.stringify(next))
                return next
            })
        }
        else{
            const allIds = usersInfo.map(user => user.id)
            setSelectedIds(() => {
                localStorage.setItem('selectedIds', JSON.stringify(allIds))
                return allIds
            })
        }
    }

    function handleRowClick(user) {
        setModalUser(user)
    }

    function handleToggleRow(id) {
        setSelectedIds(prev => {
            const next = prev.includes(id)
                ? prev.filter(selectedId => selectedId !== id)
                : [...prev, id]
            localStorage.setItem('selectedIds', JSON.stringify(next))
            return next
        })
    }

    function handleDeleteSelected() {
        const updatedUsers = usersInfo.filter(user => !selectedIds.includes(user.id))
        setUsersInfo(updatedUsers)
        localStorage.setItem('usersInfo', JSON.stringify(updatedUsers))
        setSelectedIds([])
        localStorage.setItem('selectedIds', JSON.stringify([]))
    }

    const loadUsers = async (config = sortConfig) => {
        setLoading(true)
        setError(null)

        try {
            const response = await fetch('https://dummyjson.com/users')
            if(!response.ok) {
                throw new Error('произошла ошибка загрузки!')
            }
            const data = await response.json()
            const initialUsers = sortUsers(data.users, config)
            setUsersInfo(initialUsers)
            localStorage.setItem('usersInfo', JSON.stringify(initialUsers))
        }
        catch(err) {
            setError(err.message)
        }
        finally{
            setLoading(false)
        }
    }

    const handleAddUser = async (newUserData) => {
        setLoading(true)
        setError(null)
        try {
            const response = await fetch('https://dummyjson.com/users/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newUserData)
            })
            if (!response.ok) throw new Error('Failed to add user')
            const createdUser = await response.json()

            setUsersInfo(prev => {
                const updated = [createdUser, ...prev]
                const sorted = sortUsers(updated, sortConfig)
                localStorage.setItem('usersInfo', JSON.stringify(sorted))
                return sorted
            })
        } 
        catch (err) { 
            setError(err.message) 
        } 
        finally {
            setLoading(false) 
        }
    } 

    const handleOpenAddModal = () => setIsAddModalOpen(true)
    // const handleCloseAddModal = () => setIsAddModalOpen(false)

    React.useEffect(() => {
        if (usersInfo.length === 0) {
            loadUsers()
        }
    }, [])

    function handleReload() {
        const defaultSort = {key: null, direction: null}
        setSortConfig(defaultSort)
        localStorage.setItem('sortConfig', JSON.stringify(defaultSort))
        setSelectedIds([])
        localStorage.setItem('selectedIds', JSON.stringify([]))
        localStorage.removeItem('usersInfo')
        loadUsers(defaultSort)
    }

    function handleSort(key) {
        let direction = 'asc'
        if (sortConfig.key === key) {
            if (sortConfig.direction === 'asc') {
                direction = 'desc'
            }
            else if (sortConfig.direction === 'desc'){
                direction = null
            }
            else {
                direction = 'asc'
            }
        }
        const newSortConfig = {key, direction}
        setSortConfig(newSortConfig)
        localStorage.setItem('sortConfig', JSON.stringify(newSortConfig))
        setUsersInfo(prev => {
            const sorted = sortUsers(prev, newSortConfig)
            localStorage.setItem('usersInfo', JSON.stringify(sorted))
            return sorted
        })
    }

    if (loading && usersInfo.length === 0) return <h3>Loading...</h3>
    if (error) return <h3>Error: {error}</h3>

    return (
        <div className="table">
            <TableHeader 
            onAddClick={handleOpenAddModal}
            onReload={handleReload}
            onDeleteSelected={handleDeleteSelected}
            isAllSelected={isAllSelected}
            onToggleAll={onToggleAll} 
            sortConfig={sortConfig} 
            onSort={handleSort}
            selectedIds={selectedIds}
            />
            {usersInfo.length != 0 ? usersInfo.map(user => (<TableRow 
                                    onRowClick={() => handleRowClick(user)}
                                    onToggle={() => handleToggleRow(user.id)} 
                                    isSelected={selectedIds.includes(user.id)} 
                                    key={user.id} 
                                    userInfo={user}/>))
            : <div className="empty-message">
                <h2>Right now there is no users in database.</h2>
                <button onClick={loadUsers}>
                    Fetch new users 
                    <i className="fa-solid fa-download" style={{color: '#d12953'}}></i>
                </button>
            </div>}
            {modalUser && <Modal userInfo={modalUser} onClose={() => setModalUser(null)}/>}

            {isAddModalOpen && (<AddUserModal
                                    isOpen={isAddModalOpen}
                                    onClose={() => setIsAddModalOpen(false)}
                                    onAdd={handleAddUser}
                                />)}
        </div>
    )
}