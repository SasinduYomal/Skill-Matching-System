import React, { useState } from 'react';
import SkillsList from '../components/skills/SkillsList';
import SkillsForm from '../components/skills/SkillsForm';
import toast from 'react-hot-toast';
import skillsApi from '../api/skillsApi';

const SkillsPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0); // State to trigger refresh

  const handleCreateSkill = async (formData) => {
    try {
      await skillsApi.create(formData);
      toast.success('Skill created successfully');
      setRefreshTrigger(prev => prev + 1); // Trigger refresh
    } catch (error) {
      console.error('Error creating skill:', error);
      toast.error('Failed to create skill');
    }
  };

  const handleUpdateSkill = async (formData) => {
    try {
      await skillsApi.update(formData.id, formData);
      toast.success('Skill updated successfully');
      setRefreshTrigger(prev => prev + 1); // Trigger refresh
    } catch (error) {
      console.error('Error updating skill:', error);
      toast.error('Failed to update skill');
    }
  };

  const handleEdit = (skill) => {
    setEditingSkill(skill);
    setShowForm(true);
  };

  const handleSubmit = (formData) => {
    if (editingSkill) {
      handleUpdateSkill({ ...formData, id: editingSkill.id });
    } else {
      handleCreateSkill(formData);
    }
  };

  return (
    <div className="space-y-6">
      <SkillsList 
        onAdd={() => {
          setEditingSkill(null);
          setShowForm(true);
        }}
        onEdit={handleEdit}
        refreshTrigger={refreshTrigger}
      />

      {showForm && (
        <SkillsForm
          skill={editingSkill}
          onClose={() => {
            setShowForm(false);
            setEditingSkill(null);
          }}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
};

export default SkillsPage;