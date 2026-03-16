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

    const [searchQuery, setSearchQuery] = React.useState('')

    const [femFltr, setFemFltr] = React.useState(false)

    const [currentPage, setCurrentPage] = React.useState(1)
    const [usersPerPage] = React.useState(10)

    function handleFemaleFilter() {
        setFemFltr(prev => {
            const next = !prev
            if (next) setMaleFltr(false)
            return next
        })
    }

    const [maleFltr, setMaleFltr] = React.useState(false)

    function handleMaleFilter() {
        setMaleFltr(prev => {
            const next = !prev
            if (next) setFemFltr(false)
            return next
        })
    }

    const [webFltr, setWebFltr] = React.useState(false)

    function handleWebFilter() {
        setWebFltr(prev => !prev)
    }

    function resetFilters() {
        setFemFltr(false)
        setMaleFltr(false)
        setWebFltr(false)
        setSearchQuery('')
    }

    const filteredUsers = React.useMemo(() => {

        let result = usersInfo

        if (femFltr) {
            result = result.filter(user => user.gender === 'female')
        }

        if (maleFltr) {
            result = result.filter(user => user.gender === 'male')
        }

        if (webFltr) {
            result = result.filter(user => user.company.title === 'Web Developer')
        }

        if (searchQuery.trim()) {

            const q = searchQuery.toLowerCase()

            return result.filter(user => {
                const values = [
                    user.firstName,
                    user.lastName,
                    user.maidenName,
                    user.phone,
                    user.email,
                    user.address?.country,
                    user.address?.city,
                ].filter(Boolean)

                return values.some(v => String(v).toLowerCase().includes(q))
            })
        }

        if (sortConfig.direction) {
            result = sortUsers(result, sortConfig)
        }
        
        return result

      }, [usersInfo, searchQuery, femFltr, maleFltr, webFltr, sortConfig])

    const indexOfLastUser = currentPage * usersPerPage
    const indexOfFirstUser = indexOfLastUser - usersPerPage
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser)
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage)

    function goToPage(pageNumber) {
        setCurrentPage(pageNumber)
    }

    React.useEffect(() => {
        setCurrentPage(1)
    }, [searchQuery, femFltr, maleFltr, webFltr])

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
            const response = await fetch('https://dummyjson.com/users?limit=100')
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
    }

    if (loading && usersInfo.length === 0) return <h3 className="loading">Loading...</h3>
    if (error) return <h3>Error: {error}</h3>

    return (
        <>
            <div className="table">
                <TableHeader 
                    femFltr={femFltr}
                    maleFltr={maleFltr}
                    webFltr={webFltr}
                    onResetFilters={resetFilters}

                    onFemaleFilter={handleFemaleFilter}
                    onMaleFilter={handleMaleFilter}
                    onWebFilter={handleWebFilter}

                    onSort={handleSort}
                    onSearchChange={setSearchQuery}
                    onAddClick={handleOpenAddModal}
                    onReload={handleReload}
                    onToggleAll={onToggleAll} 
                    onDeleteSelected={handleDeleteSelected}
                    isAllSelected={isAllSelected}

                    searchQuery={searchQuery}
                    sortConfig={sortConfig} 
                    selectedIds={selectedIds}
                />
                {usersInfo.length === 0 ? (
                    <div className="empty-message">
                        <h2>Right now there is no users in database.</h2>
                        <button className="new-users-btn" onClick={loadUsers}>
                            Fetch new users 
                            <i className="fa-solid fa-download" style={{color: '#d12953'}}></i>
                        </button>
                    </div>
                ) : filteredUsers.length === 0 && searchQuery.trim() ? (
                    <div className="empty-message">
                        <h2>No users found for this search.</h2>
                        <button className="new-users-btn" onClick={() => setSearchQuery('')}>
                            Clear search
                            <i className="fa-solid fa-xmark" style={{color: '#d12953', marginLeft: '8px'}}></i>
                        </button>
                    </div>
                ) : (
                    currentUsers.map(user => (
                        <TableRow 
                            onRowClick={() => handleRowClick(user)}
                            onToggle={() => handleToggleRow(user.id)} 
                            isSelected={selectedIds.includes(user.id)} 
                            key={user.id} 
                            userInfo={user}
                        />
                    ))
                )}
                {modalUser && <Modal userInfo={modalUser} onClose={() => setModalUser(null)}/>}

                {isAddModalOpen && (<AddUserModal
                                        isOpen={isAddModalOpen}
                                        onClose={() => setIsAddModalOpen(false)}
                                        onAdd={handleAddUser}
                                    />)}
            </div>

            <div className="pagination">
                {Array.from({ length: totalPages }, (_, i) => (
                    <button
                        key={i}
                        onClick={() => goToPage(i + 1)}
                        className={currentPage === i + 1 ? "active" : ""}
                    >
                        {i + 1}
                    </button>
                ))}
            </div>
        </>
    )
}