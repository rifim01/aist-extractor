import React, { useState } from 'react';

function PreviewStep({ data, onDataChange, onExport }) {
  const [editingIdx, setEditingIdx] = useState(null);
  const [editData, setEditData] = useState({});

  const VALID_SUMS = [45000, 95000, 145000, 195000];

  const validateRow = (row) => {
    const errors = [];
    
    if (!row.date || !/\d{2}\.\d{2}\.\d{4}\s\d{2}:\d{2}:\d{2}/.test(row.date)) {
      errors.push('Invalid date format');
    }
    
    const sum = parseInt(row.sum.replace(/\s/g, ''));
    if (isNaN(sum) || !VALID_SUMS.includes(sum)) {
      errors.push(`Sum must be: ${VALID_SUMS.join(', ')}`);
    }
    
    if (!row.account || row.account.trim() === '') {
      errors.push('Credit account required');
    }

    return errors;
  };

  const handleEdit = (idx) => {
    setEditingIdx(idx);
    setEditData({ ...data[idx] });
  };

  const handleSave = (idx) => {
    const updated = [...data];
    updated[idx] = { ...editData, errors: validateRow(editData) };
    onDataChange(updated);
    setEditingIdx(null);
  };

  const handleDelete = (idx) => {
    onDataChange(data.filter((_, i) => i !== idx));
  };

  const errorCount = data.filter(row => row.errors?.length > 0).length;
  const validCount = data.length - errorCount;

  return (
    <div className="step">
      <h2>📊 Step 3: Data Preview & Validation</h2>

      <div className="validation-summary">
        <div className="summary-card valid">
          <span className="label">Valid Rows</span>
          <span className="value">{validCount}</span>
        </div>
        <div className="summary-card error">
          <span className="label">Errors</span>
          <span className="value">{errorCount}</span>
        </div>
        <div className="summary-card total">
          <span className="label">Total</span>
          <span className="value">{data.length}</span>
        </div>
      </div>

      <div className="data-table">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Sum</th>
              <th>Credit Account</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr key={idx} className={row.errors?.length > 0 ? 'error-row' : ''}>
                <td>
                  {editingIdx === idx ? (
                    <input
                      type="text"
                      value={editData.date}
                      onChange={(e) => setEditData({ ...editData, date: e.target.value })}
                    />
                  ) : (
                    row.date
                  )}
                </td>
                <td>
                  {editingIdx === idx ? (
                    <input
                      type="text"
                      value={editData.sum}
                      onChange={(e) => setEditData({ ...editData, sum: e.target.value })}
                    />
                  ) : (
                    row.sum
                  )}
                </td>
                <td>
                  {editingIdx === idx ? (
                    <input
                      type="text"
                      value={editData.account}
                      onChange={(e) => setEditData({ ...editData, account: e.target.value })}
                    />
                  ) : (
                    row.account
                  )}
                </td>
                <td>
                  {row.errors?.length > 0 ? (
                    <span className="error-badge">⚠️ {row.errors[0]}</span>
                  ) : (
                    <span className="valid-badge">✅</span>
                  )}
                </td>
                <td className="actions">
                  {editingIdx === idx ? (
                    <>
                      <button onClick={() => handleSave(idx)} className="btn-sm save">Save</button>
                      <button onClick={() => setEditingIdx(null)} className="btn-sm cancel">Cancel</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => handleEdit(idx)} className="btn-sm edit">Edit</button>
                      <button onClick={() => handleDelete(idx)} className="btn-sm delete">Delete</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        className="btn-primary"
        onClick={onExport}
        disabled={errorCount > 0}
      >
        Proceed to Export → ({validCount} valid rows)
      </button>
    </div>
  );
}

export default PreviewStep;
