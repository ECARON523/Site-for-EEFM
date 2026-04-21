import React, { useState } from 'react';
import { X } from 'lucide-react';

interface AdminEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  fields: { name: string; label: string; type: 'text' | 'number' | 'textarea'; value: any }[];
  onSave: (data: any) => void;
}

export const AdminEditModal: React.FC<AdminEditModalProps> = ({ isOpen, onClose, title, fields, onSave }) => {
  const [formData, setFormData] = useState(
    fields.reduce((acc, field) => ({ ...acc, [field.name]: field.value }), {})
  );

  if (!isOpen) return null;

  const handleChange = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-bg-surface p-6 rounded-2xl w-full max-w-md border border-border-color shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-text-primary">{title}</h2>
          <button onClick={onClose} className="p-1 hover:bg-bg-surface-light rounded-full transition-colors text-text-muted">
            <X className="w-5 h-5" />
          </button>
        </div>
        {fields.map(field => (
          <div key={field.name} className="mb-4">
            <label className="block text-sm font-bold text-text-muted mb-1.5">{field.label}</label>
            {field.type === 'textarea' ? (
              <textarea
                className="w-full bg-bg-surface-light border border-border-color p-3 rounded-xl text-text-primary focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                value={formData[field.name]}
                onChange={(e) => handleChange(field.name, e.target.value)}
                rows={4}
              />
            ) : (
              <input
                type={field.type}
                className="w-full bg-bg-surface-light border border-border-color p-3 rounded-xl text-text-primary focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                value={formData[field.name]}
                onChange={(e) => handleChange(field.name, e.target.value)}
              />
            )}
          </div>
        ))}
        <div className="mt-8 flex gap-3">
          <button
            className="flex-1 bg-bg-surface-light text-text-primary py-3 rounded-xl font-bold hover:bg-border-color transition-colors"
            onClick={onClose}
          >
            Отмена
          </button>
          <button
            className="flex-1 bg-primary text-black py-3 rounded-xl font-bold hover:bg-yellow-500 transition-colors shadow-lg"
            onClick={() => { onSave(formData); onClose(); }}
          >
            Сохранить
          </button>
        </div>
      </div>
    </div>
  );
};
