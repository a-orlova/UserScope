import React from 'react'
import TableHeader from './TableHeader'
import TableRow from './TableRow'
import Modal from './Modal/Modal'

export default function Table() {

    const [usersInfo, setUsersInfo] = React.useState([])
    const [sortConfig, setSortConfig] = React.useState({key: null, direction: null})

    const [selectedIds, setSelectedIds] = React.useState([])
    const [modalUser, setModalUser] = React.useState(null)

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
            isAllSelected={isAllSelected}
            onToggleAll={onToggleAll} 
            sortConfig={sortConfig} 
            onSort={handleSort}
            selectedIds={selectedIds}
            />
            {usersInfo.map(user => (<TableRow 
                                    onRowClick={() => handleRowClick(user)}
                                    onToggle={() => handleToggleRow(user.id)} 
                                    isSelected={selectedIds.includes(user.id)} 
                                    key={user.id} 
                                    userInfo={user}/>))}
            {modalUser && <Modal userInfo={modalUser} onClose={() => setModalUser(null)}/>}
        </div>
    )
}