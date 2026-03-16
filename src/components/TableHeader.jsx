import React from 'react'

export default function TableHeader({onAddClick, 
                                    onReload, 
                                    onDeleteSelected, 
                                    selectedIds, 
                                    isAllSelected, 
                                    onToggleAll, 
                                    sortConfig, 
                                    onSort,
                                    searchQuery,
                                    onSearchChange,
                                    onFemaleFilter,
                                    onMaleFilter,
                                    onWebFilter,
                                    femFltr,
                                    maleFltr,
                                    webFltr,
                                    onResetFilters}) {

    const columns = [
        { label: 'First Name', sortKey: 'firstName' },
        { label: 'Last Name', sortKey: 'lastName' },
        { label: 'Career'},
        { label: 'Age', sortKey: 'age' },
        { label: 'Gender', sortKey: 'gender' },
        { label: 'Phone'},
        { label: 'Email'},
        { label: 'Country'},
        { label: 'City'}
    ]

    function handleSearch(e) {
        const value = e.target.value
        onSearchChange(value)
    }

    // const filteredUsers = usersInfo.filter(user => {
    //     return Object.values(user).some(value => value.toString().toLowerCase().includes(searchQuery.toLowerCase()))
    // })

    return (
       <div className='table-header'>
            <div className="functional-block">
                <div className="left-block">
                    {/* <button className="filter-btn">
                        <i className="fa-solid fa-filter" id="filter-icon" aria-hidden="true"></i>
                    </button> */}
                    
                    <div className="search-field">
                        <i className="fa-solid fa-magnifying-glass" id="search-icon" aria-hidden="true"></i>
                        <input type="search" 
                               placeholder='Search...'
                               value={searchQuery}
                               onChange={handleSearch}
                            />
                    </div>

                    <button className={femFltr ? "filter-btn fltr active" : "filter-btn fltr"}  onClick={onFemaleFilter}>
                        Female <i className="fa-solid fa-filter" id="filter-icon" aria-hidden="true"></i>
                    </button>

                    <button className={maleFltr ? "filter-btn fltr active" : "filter-btn fltr"} onClick={onMaleFilter}>
                        Male <i className="fa-solid fa-filter" id="filter-icon" aria-hidden="true"></i>
                    </button>

                    <button className={webFltr ? "filter-btn fltr active" : "filter-btn fltr"}  onClick={onWebFilter}>
                        Web developer <i className="fa-solid fa-filter" id="filter-icon" aria-hidden="true"></i>
                    </button>

                    {femFltr || maleFltr || webFltr ?
                        <button className="filter-btn fltr reset-btn" onClick={onResetFilters}>
                            Reset filters
                        </button>
                        : ''}

                    {selectedIds.length > 0 ? 
                    <div className="remove-block">
                        <p className='remove'>Remove {isAllSelected ? 'all' : selectedIds.length} {selectedIds.length === 1 ? 'item' : 'items'} ? </p> 
                        <button className="remove-btn" onClick={onDeleteSelected}>
                            <i className="fa-solid fa-trash" aria-hidden="true"></i>
                        </button>
                    </div>
                    : ''}
                </div>
                <div className='right-block'>
                    <button onClick={onReload} className='reload-page-btn'>
                        <i className="fa-solid fa-rotate-right" aria-hidden="true"></i>
                    </button>
                    <button onClick={onAddClick} className='add-new-user-btn'>+ Add new user</button>
                </div>
                    
            </div>

            <div className="header-row">
                <input type="checkbox" checked={isAllSelected} onChange={onToggleAll}/>
                {columns.map((column) => (
                    <button
                        key={column.label}
                        className={`header-cell ${column.sortKey ? 'sortable' : ''}`}
                        onClick={() => column.sortKey && onSort(column.sortKey)}
                    >
                    <span>{column.label.toUpperCase()}</span>
                    {column.sortKey && 
                    (<span className='sort-icon'>
                        {sortConfig.key === column.sortKey ? (
                            sortConfig.direction === 'asc' ? (
                                <i className="fa-solid fa-sort-up" aria-hidden="true"></i>
                            ) : sortConfig.direction === 'desc' ? (
                                <i className="fa-solid fa-sort-down" aria-hidden="true"></i>
                            ) : (
                                <i className="fa-solid fa-sort" aria-hidden="true"></i>
                            )
                        ) : (
                            <i className="fa-solid fa-sort" aria-hidden="true"></i>
                        )}
                     </span>)}
                    </button>
                ))}
            </div>
        </div>
    )
}