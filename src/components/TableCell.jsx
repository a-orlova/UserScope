import React from 'react'

export default function TableCell({item}) {

    return(
        <div className="table-cell">
            <p className={item === 'male' ? 'male': item === 'female' ? 'female' : ''}>{item}</p>
        </div>
    )
}