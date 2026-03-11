import React from 'react'
import TableHeader from './TableHeader'
import TableRow from './TableRow'
import Modal from './Modal/Modal'
import AddUserModal from './AddUserModal/AddUserModal'

export default function Table() {

    const [usersInfo, setUsersInfo] = React.useState([])
    const [sortConfig, setSortConfig] = React.useState({key: null, direction: null})

    const [selectedIds, setSelectedIds] = React.useState([])
    const [modalUser, setModalUser] = React.useState(null)

    const [isAddModalOpen, setIsAddModalOpen] = React.useState(false)

    const [loading, setLoading] = React.useState(false)
    const [error, setError] = React.useState(null)

    const isAllSelected = selectedIds.length === usersInfo.length && usersInfo.length > 0

    function onToggleAll() {
        if(isAllSelected) {
            setSelectedIds([])
        }
        else{
            setSelectedIds(usersInfo.map(user => user.id))
        }
    }

    function handleRowClick(user) {
        setModalUser(user)
    }

    function handleToggleRow(id) {
        setSelectedIds( prev => ( 
            prev.includes(id) ?
            prev.filter(selectedId => selectedId !== id) :
            [...prev, id]
        ))
    }

    function handleDeleteSelected() {
        const deletedUsers = selectedIds.map(id =>
            fetch(`https://dummyjson.com/users/${id}`, {
                method: 'DELETE'
            })
            .then(res => {
                if (!res.ok) throw new Error(`error during deleting user with id = ${id}`)
                return res.json()
            })
        )

        Promise.all(deletedUsers)
            .then(() => {
                const updatedUsers = usersInfo.filter(user => !selectedIds.includes(user.id))
                setUsersInfo(updatedUsers)
                setSelectedIds([])
            })

    }

    const loadUsers = async (sortBy, order) => {
        setLoading(true)
        setError(null)

        try {
            let url = 'https://dummyjson.com/users'
            const params = new URLSearchParams

            if (sortBy && order) {
                params.append('sortBy', sortBy)
                params.append('order', order)
            }

            if (params.toString()) {
                url += `?${params.toString()}`
            }
            const response = await fetch(url)
            if(!response.ok) {
                throw new Error('произошла ошибка загрузки!')
            }
            const data = await response.json()
            setUsersInfo(data.users)
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

            setUsersInfo(prev => [createdUser, ...prev])
            // setSortConfig({ key: null, direction: null })
            // setIsAddModalOpen(false) 
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
        loadUsers()
    }, [])

    React.useEffect(() => {
        if (sortConfig.key && sortConfig.direction) {
            loadUsers(sortConfig.key, sortConfig.direction)
        } else if (sortConfig.direction === null) {
            loadUsers()
        }
    }, [sortConfig])

    function handleReload() {
        setSortConfig({key: null, direction: null})
        setSelectedIds([])
        loadUsers()
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
        setSortConfig({key, direction})
        console.log(sortConfig)
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
                <button onClick={loadUsers}>Fetch new users <img src="public/fetch-new-users.svg" alt="icon of downloading" /></button>
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