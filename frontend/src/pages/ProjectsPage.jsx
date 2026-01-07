import React, { useState } from 'react';
import ProjectsList from '../components/projects/ProjectsList';
import ProjectsForm from '../components/projects/ProjectsForm';
import toast from 'react-hot-toast';
import projectsApi from '../api/projectsApi';

const ProjectsPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0); // State to trigger refresh

  const handleCreateProject = async (formData) => {
    try {
      await projectsApi.create(formData);
      toast.success('Project created successfully');
      setRefreshTrigger(prev => prev + 1); // Trigger refresh
    } catch (error) {
      console.error('Error creating project:', error);
      toast.error('Failed to create project');
    }
  };

  const handleUpdateProject = async (formData) => {
    try {
      await projectsApi.update(formData.id, formData);
      toast.success('Project updated successfully');
      setRefreshTrigger(prev => prev + 1); // Trigger refresh
    } catch (error) {
      console.error('Error updating project:', error);
      toast.error('Failed to update project');
    }
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setShowForm(true);
  };

  const handleSubmit = (formData) => {
    if (editingProject) {
      handleUpdateProject({ ...formData, id: editingProject.id });
    } else {
      handleCreateProject(formData);
    }
  };

  return (
    <div className="space-y-6">
      <ProjectsList 
        onAdd={() => {
          setEditingProject(null);
          setShowForm(true);
        }}
        onEdit={handleEdit}
        refreshTrigger={refreshTrigger}
      />

      {showForm && (
        <ProjectsForm
          project={editingProject}
          onClose={() => {
            setShowForm(false);
            setEditingProject(null);
          }}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
};

export default ProjectsPage;