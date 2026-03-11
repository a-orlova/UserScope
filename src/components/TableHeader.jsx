import React from 'react'

export default function TableHeader({onAddClick, onReload, onDeleteSelected, selectedIds, isAllSelected, onToggleAll, sortConfig, onSort}) {

    const columns = [
        { label: 'First Name', sortKey: 'firstName' },
        { label: 'Last Name', sortKey: 'lastName' },
        { label: 'Maiden Name'},
        { label: 'Age', sortKey: 'age' },
        { label: 'Gender', sortKey: 'gender' },
        { label: 'Phone'},
        { label: 'Email'},
        { label: 'Country'},
        { label: 'City'}
    ]

    return (
       <div className='table-header'>
            <div className="functional-block">
                <div className="left-block">
                    <button className="filter-btn"><img src="public/filter-icon.svg" alt="filter button" id='filter-icon'/></button>
                    
                    <div className="search-field">
                        <img src="public/search-input-icon.svg" alt="search icon" id='search-icon'/>
                        <input type="search" placeholder='Search...'/>
                    </div>

                    {selectedIds.length > 0 ? 
                    <div className="remove-block">
                        <p>Remove {isAllSelected ? 'all' : selectedIds.length} {selectedIds.length === 1 ? 'item' : 'items'} ? </p> 
                        <button className="remove-btn" onClick={onDeleteSelected}><img src="public/trash-icon.svg" alt="remove button" /></button>
                    </div>
                    : ''}
                </div>
                <div className='right-block'>
                    <button onClick={onReload} className='reload-page-btn'><img src="public/reload-page.svg" alt="" /></button>
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
                        {sortConfig.key === column.sortKey ? (sortConfig.direction === 'asc' ? <img src="public/sort-up.svg" alt="sort asc" />
                                                            : sortConfig.direction === 'desc' ? <img src="public/sort-down.svg" alt="sort desc" /> 
                                                            : <img src="public/sorting.svg" alt="sort asc" />) 
                        : <img src="public/sorting.svg" alt="sort button" />}
                     </span>)}
                    </button>
                ))}
            </div>
        </div>
    )
}