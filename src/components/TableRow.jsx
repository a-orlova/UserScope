import React from 'react'
import TableCell from './TableCell'

export default function TableRow({onRowClick, onToggle, isSelected, userInfo}) {

    return (
        <div onClick={onRowClick} className={`user-table-row ${isSelected ? 'selected' : ''}`}>
            <input type="checkbox" 
            id={userInfo.id} 
            checked={isSelected} 
            onChange={onToggle}
            onClick={(e) => e.stopPropagation()}
            />
            <TableCell item={userInfo?.firstName || '#'}/>
            <TableCell item={userInfo?.lastName || '#'}/>
            <TableCell item={userInfo?.maidenName || '#'}/>
            <TableCell item={userInfo?.age || '#'}/>
            <TableCell item={userInfo?.gender || '#'}/>
            <TableCell item={userInfo?.phone || '#'}/>
            <TableCell item={userInfo?.email || '#'}/>
            <TableCell item={userInfo?.address?.country || '#'}/>
            <TableCell item={userInfo?.address?.city || '#'}/>
        </div>
    )
}