import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Briefcase, Calendar, Clock, Users, BarChart3, MoreVertical } from 'lucide-react';
import toast from 'react-hot-toast';
import projectsApi from '../../api/projectsApi';
import skillsApi from '../../api/skillsApi';

const ProjectsList = ({ onAdd, onEdit, refreshTrigger } = {}) => {
  const [projects, setProjects] = useState([]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [showProjectSkillModal, setShowProjectSkillModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [allSkills, setAllSkills] = useState([]);
  const [selectedProjectSkills, setSelectedProjectSkills] = useState([]);
  
  // Fetch projects from API
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await projectsApi.getAll();
        setProjects(data);
      } catch (error) {
        console.error('Error fetching projects:', error);
        toast.error('Failed to fetch projects');
      }
    };
    
    fetchProjects();
  }, [refreshTrigger]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.relative')) {
        setOpenDropdownId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Filter projects based on search and filters
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !filterStatus || project.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProjects = filteredProjects.slice(startIndex, startIndex + itemsPerPage);

  // Get unique statuses for filters
  const uniqueStatuses = [...new Set(projects.map(p => p.status))];

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await projectsApi.delete(id);
        toast.success('Project deleted successfully');
        // The refreshTrigger prop will handle updating the list
      } catch (error) {
        console.error('Error deleting project:', error);
        toast.error('Failed to delete project');
      }
    }
  };

  const handleEdit = (project) => {
    // This would typically open a modal or navigate to edit page
    toast.success(`Editing ${project.name}`);
  };

  const handleManageSkills = async (project) => {
    try {
      setSelectedProject(project);
      const skills = await skillsApi.getAll();
      setAllSkills(skills);
      
      // Initialize selected project skills with existing skills
      const existingSkills = project.requiredSkills?.map(skill => 
        typeof skill === 'string' ? 
          { id: skill, skill: skill, level: 'Mid-level' } : 
          { id: skill.id || skill.skill, skill: skill.skill, level: skill.level || 'Mid-level' }
      ) || [];
      
      setSelectedProjectSkills(existingSkills);
      setShowProjectSkillModal(true);
    } catch (error) {
      toast.error('Failed to load skills');
    }
  };

  const handleProjectSkillAssignment = async () => {
    if (!selectedProject || selectedProjectSkills.length === 0) return;
    
    try {
      // Prepare the required skills data
      const requiredSkillsData = selectedProjectSkills.map(skill => ({
        skill_id: skill.id,
        required_level: skill.level
      }));
      
      // Use the new endpoint to assign skills to the project
      await projectsApi.assignSkillsToProject(selectedProject.id, requiredSkillsData);
      toast.success('Project skills updated successfully');
      
      // Close modal and reset state
      setShowProjectSkillModal(false);
      setSelectedProject(null);
      setAllSkills([]);
      setSelectedProjectSkills([]);
      
      // Refresh the projects list
      const data = await projectsApi.getAll();
      setProjects(data);
    } catch (error) {
      toast.error('Failed to update project skills');
    }
  };

  const handleProjectSkillChange = (skillId, level) => {
    setSelectedProjectSkills(prev => {
      const existingSkillIndex = prev.findIndex(skill => skill.id === skillId);
      if (existingSkillIndex >= 0) {
        // Update existing skill
        const updated = [...prev];
        updated[existingSkillIndex] = { ...updated[existingSkillIndex], level: level };
        return updated;
      } else {
        // Add new skill
        const skillToAdd = allSkills.find(skill => skill.id === skillId || skill.name === skillId);
        if (skillToAdd) {
          return [...prev, { ...skillToAdd, level: level, id: skillToAdd.id || skillToAdd.name }];
        }
        return prev;
      }
    });
  };

  const handleRemoveProjectSkill = (skillId) => {
    setSelectedProjectSkills(prev => prev.filter(skill => skill.id !== skillId));
  };

  const isProjectSkillSelected = (skillId) => {
    return selectedProjectSkills.some(skill => skill.id === skillId);
  };

  const getProjectSkillLevel = (skillId) => {
    const skill = selectedProjectSkills.find(skill => skill.id === skillId);
    return skill ? skill.level : 'Mid-level';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Planning':
        return 'bg-yellow-100 text-yellow-800';
      case 'Completed':
        return 'bg-blue-100 text-blue-800';
      case 'On Hold':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Project Management</h2>
            <p className="text-gray-600 mt-1">Manage your projects and required skills</p>
          </div>
          <button 
            onClick={onAdd}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Project
          </button>
        </div>

        {/* Filters and Search */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
          >
            <option value="">All Statuses</option>
            {uniqueStatuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>

        {/* Projects Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentProjects.map((project) => (
            <div key={project.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
                <div className="relative">
                  <button
                    onClick={() => setOpenDropdownId(openDropdownId === project.id ? null : project.id)}
                    className="p-1 rounded hover:bg-gray-100"
                  >
                    <MoreVertical className="h-4 w-4 text-gray-500" />
                  </button>
                  
                  {openDropdownId === project.id && (
                    <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                      <div className="py-1">
                        <button
                          onClick={() => {
                            onEdit(project);
                            setOpenDropdownId(null);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 flex items-center"
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            handleDelete(project.id);
                            setOpenDropdownId(null);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-700 flex items-center"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </button>
                        <button
                          onClick={() => {
                            handleManageSkills(project);
                            setOpenDropdownId(null);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 flex items-center"
                        >
                          <Briefcase className="h-4 w-4 mr-2" />
                          Manage Skill
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(project.status)}`}>
                    {project.status}
                  </span>
                </div>
                
                <div className="text-sm text-gray-600">
                  {project.description}
                </div>
                
                {(project.start_date || project.startDate) && (project.end_date || project.endDate) && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                    <span>Start: {project.start_date || project.startDate}</span>
                    <span className="mx-2">-</span>
                    <span>End: {project.end_date || project.endDate}</span>
                  </div>
                )}
                {!(project.start_date || project.startDate) && !(project.end_date || project.endDate) && (
                  <div className="text-sm text-gray-500 italic">No dates specified</div>
                )}
                
                <div className="flex flex-wrap gap-1">
                  {project.requiredSkills && project.requiredSkills.length > 0 ? project.requiredSkills.slice(0, 3).map((skill, index) => (
                    <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                      {(skill.name || skill.skill)} ({skill.ProjectSkills?.required_level || skill.level})
                    </span>
                  )) : <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">No skills</span>}
                  {project.requiredSkills && project.requiredSkills.length > 3 && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      +{project.requiredSkills.length - 3} more
                    </span>
                  )}
                </div>
                
                <button className="w-full mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm text-sm">
                  Find a Matching
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-700">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredProjects.length)} of {filteredProjects.length} results
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-3 py-1 rounded-md border text-sm font-medium ${
                      currentPage === pageNum
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    } transition-colors`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Project Skill Assignment Modal */}
      {showProjectSkillModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">
                  Manage Skills for {selectedProject?.name}
                </h3>
                <button 
                  onClick={() => {
                    setShowProjectSkillModal(false);
                    setSelectedProject(null);
                    setAllSkills([]);
                    setSelectedProjectSkills([]);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 max-h-[60vh] overflow-y-auto">
              {/* Available Skills */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Available Skills</h4>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {allSkills.map((skill) => {
                    const isSelected = isProjectSkillSelected(skill.id || skill.name);
                    const level = getProjectSkillLevel(skill.id || skill.name);
                    
                    return (
                      <div key={skill.id || skill.name} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                        <span className="text-gray-700">{skill.name || skill.skill_name}</span>
                        <div className="flex items-center space-x-2">
                          <select
                            value={level}
                            onChange={(e) => handleProjectSkillChange(skill.id || skill.name, e.target.value)}
                            className="text-sm border rounded px-2 py-1"
                          >
                            <option value="Beginner">Beginner</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Mid-level">Mid-level</option>
                            <option value="Advanced">Advanced</option>
                            <option value="Expert">Expert</option>
                          </select>
                          <button
                            onClick={() => {
                              if (isSelected) {
                                handleRemoveProjectSkill(skill.id || skill.name);
                              } else {
                                handleProjectSkillChange(skill.id || skill.name, level);
                              }
                            }}
                            className={`text-sm ${isSelected ? 'text-red-500 hover:text-red-700' : 'text-green-500 hover:text-green-700'}`}
                          >
                            {isSelected ? 'Remove' : 'Add'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {/* Selected Skills */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Selected Skills</h4>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {selectedProjectSkills.length > 0 ? (
                    selectedProjectSkills.map((skill) => (
                      <div key={skill.id} className="flex items-center justify-between p-3 bg-indigo-50 border border-indigo-200 rounded-lg">
                        <span className="text-gray-700">{skill.skill || skill.name}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm bg-indigo-100 text-indigo-800 px-2 py-1 rounded">
                            {skill.level}
                          </span>
                          <button
                            onClick={() => handleRemoveProjectSkill(skill.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">No skills selected</p>
                  )}
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowProjectSkillModal(false);
                  setSelectedProject(null);
                  setAllSkills([]);
                  setSelectedProjectSkills([]);
                }}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleProjectSkillAssignment}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Update Skills
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsList;