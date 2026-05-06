// src/components/pond/PondForm.jsx

import { useState } from 'react';
import { pondAPI } from '../../api/axios';
import toast from 'react-hot-toast';

export default function PondForm({ farmId, onSuccess, onCancel }) {
  const [form, setForm] = useState({
    pondName: '',
    sizeAcre: '',
    stockingDate: new Date().toISOString().split('T')[0],
    seedCount: 200000,
    prawnType: 'VANNAMEI',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await pondAPI.create(farmId, {
        ...form,
        sizeAcre: parseFloat(form.sizeAcre),
        seedCount: parseInt(form.seedCount),
      });
      toast.success('Pond created! 🦐');
      onSuccess();
    } catch (error) {
      toast.error('Failed to create pond');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="modal-header">
          <h2 className="modal-title">Add New Pond 🦐</h2>
          <button className="modal-close" onClick={onCancel} aria-label="Close">
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="modal-body">

          {/* Pond Name */}
          <div className="form-group">
            <label className="form-label">Pond Name</label>
            <input
              type="text"
              value={form.pondName}
              onChange={(e) => setForm({ ...form, pondName: e.target.value })}
              placeholder="e.g., Pond 1"
              className="form-input"
              required
            />
          </div>

          {/* Size */}
          <div className="form-group">
            <label className="form-label">Size (Acres)</label>
            <input
              type="number"
              value={form.sizeAcre}
              onChange={(e) => setForm({ ...form, sizeAcre: e.target.value })}
              placeholder="e.g., 1.3"
              className="form-input"
              required
              step="0.1"
              min="0.1"
            />
          </div>

          {/* Stocking Date */}
          <div className="form-group">
            <label className="form-label">Stocking Date</label>
            <input
              type="date"
              value={form.stockingDate}
              onChange={(e) => setForm({ ...form, stockingDate: e.target.value })}
              className="form-input"
            />
          </div>

          {/* Seed Count */}
          <div className="form-group">
            <label className="form-label">Seed Count</label>
            <input
              type="number"
              value={form.seedCount}
              onChange={(e) => setForm({ ...form, seedCount: e.target.value })}
              placeholder="e.g., 200000"
              className="form-input"
              min="1000"
            />
            <span className="form-hint">
              {(form.seedCount / 100000).toFixed(1)} Lakhs
            </span>
          </div>

          {/* Prawn Type */}
          <div className="form-group">
            <label className="form-label">Prawn Type</label>
            <select
              value={form.prawnType}
              onChange={(e) => setForm({ ...form, prawnType: e.target.value })}
              className="form-input"
            >
              <option value="VANNAMEI">Vannamei</option>
              <option value="TIGER">Tiger</option>
              <option value="MONODON">Monodon</option>
            </select>
          </div>

          {/* Actions */}
          <div className="modal-actions">
            <button
              type="button"
              onClick={onCancel}
              className="modal-btn modal-btn-cancel"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="modal-btn modal-btn-submit"
            >
              {loading ? (
                <>
                  <span className="spinner" /> Creating...
                </>
              ) : (
                'Create Pond'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}