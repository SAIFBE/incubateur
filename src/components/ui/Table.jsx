import React from 'react';

const Table = ({ columns, data, keyField = 'id', onRowClick, className = '' }) => {
  if (!data || data.length === 0) {
    return (
      <div className="text-center p-8 text-secondary border border-border rounded-lg">
        Aucune donnée disponible.
      </div>
    );
  }

  return (
    <div className={`table-container ${className}`}>
      <table className="table">
        <thead>
          <tr>
            {columns.map((col, index) => (
              <th key={index} style={{ width: col.width, textAlign: col.align || 'left' }}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr 
              key={row[keyField]} 
              onClick={() => onRowClick && onRowClick(row)}
              style={onRowClick ? { cursor: 'pointer' } : {}}
            >
              {columns.map((col, index) => (
                <td key={index} style={{ textAlign: col.align || 'left' }}>
                  {col.render ? col.render(row[col.field], row) : row[col.field]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
