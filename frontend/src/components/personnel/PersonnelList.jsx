import React, { useEffect, useState } from "react";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  User,
  Briefcase,
  Building,
  MoreVertical,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import toast from "react-hot-toast";
import personnelApi from "../../api/personnelApi";
import skillsApi from "../../api/skillsApi";

const PersonnelList = ({ onAdd, onEdit, refreshTrigger } = {}) => {
  const [personnel, setPersonnel] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterLevel, setFilterLevel] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [showSkillModal, setShowSkillModal] = useState(false);
  const [selectedPersonnel, setSelectedPersonnel] = useState(null);
  const [allSkills, setAllSkills] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchPersonnel = async () => {
      try {
        const data = await personnelApi.getAllWithSkills();
        setPersonnel(data);
      } catch (error) {
        toast.error("Failed to fetch personnel");
      }
    };

    fetchPersonnel();
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

  const filteredPersonnel = personnel && Array.isArray(personnel) ? personnel.filter(p => {
    // Map backend fields to frontend fields
    const mappedPerson = {
      ...p,
      role: p.department && p.position ? `${p.department} - ${p.position}` : p.department || p.position || '',
      experienceLevel: p.experience_level || p.experience || '',
      department: p.department || '',
      position: p.position || ''
    };
    
    const matchesSearch =
      mappedPerson.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mappedPerson.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mappedPerson.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mappedPerson.position.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesLevel = !filterLevel || mappedPerson.experienceLevel === filterLevel;
    return matchesSearch && matchesLevel;
  }) : [];

  const totalPages = Math.ceil(filteredPersonnel.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filteredPersonnel.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this personnel?")) return;
    try {
      await personnelApi.delete(id);
      toast.success("Personnel deleted");
      // Refresh the personnel list to reflect the deletion
      const updatedPersonnel = await personnelApi.getAll();
      setPersonnel(updatedPersonnel);
    } catch {
      toast.error("Delete failed");
      // Refresh the personnel list in case of error to sync with actual database state
      try {
        const updatedPersonnel = await personnelApi.getAll();
        setPersonnel(updatedPersonnel);
      } catch (error) {
        console.error('Error refreshing personnel list:', error);
      }
    }
  };

  const handleAssignSkill = async (personnel) => {
    try {
      setSelectedPersonnel(personnel);
      const skills = await skillsApi.getAll();
      setAllSkills(skills);
      // Initialize selected skills with existing skills
      const existingSkills = personnel.skills?.map(skill => 
        typeof skill === 'string' ? 
          { id: skill, name: skill, proficiency_level: 'Beginner' } : 
          { id: skill.id, name: skill.skillName || skill.name, proficiency_level: skill.PersonnelSkills?.proficiency_level || 'Beginner' }
      ) || [];
      setSelectedSkills(existingSkills);
      setShowSkillModal(true);
    } catch (error) {
      toast.error('Failed to load skills');
    }
  };

  const handleSkillAssignment = async () => {
    if (!selectedPersonnel || selectedSkills.length === 0) return;
    
    try {
      const skillsData = selectedSkills.map(skill => ({
        skill_id: skill.id,
        proficiency_level: skill.proficiency_level
      }));
      
      await personnelApi.assignSkills(selectedPersonnel.id, skillsData);
      toast.success('Skills assigned successfully');
      setShowSkillModal(false);
      setSelectedPersonnel(null);
      setAllSkills([]);
      setSelectedSkills([]);
      // Refresh the personnel list
      const data = await personnelApi.getAllWithSkills();
      setPersonnel(data);
    } catch (error) {
      toast.error('Failed to assign skills');
    }
  };

  const handleSkillChange = (skillId, proficiency) => {
    setSelectedSkills(prev => {
      const existingSkillIndex = prev.findIndex(skill => skill.id === skillId);
      if (existingSkillIndex >= 0) {
        // Update existing skill
        const updated = [...prev];
        updated[existingSkillIndex] = { ...updated[existingSkillIndex], proficiency_level: proficiency };
        return updated;
      } else {
        // Add new skill
        const skillToAdd = allSkills.find(skill => skill.id === skillId || skill.name === skillId);
        if (skillToAdd) {
          return [...prev, { ...skillToAdd, proficiency_level: proficiency }];
        }
        return prev;
      }
    });
  };

  const handleRemoveSkill = async (skillId) => {
    // Check if the skill exists in the database (was previously assigned)
    const skillExistsInDB = selectedPersonnel?.skills?.some(skill => 
      skill.id === skillId || skill.skill_id === skillId
    );
    
    if (skillExistsInDB && selectedPersonnel) {
      try {
        // Remove the skill from the database
        await personnelApi.removeSkill(selectedPersonnel.id, skillId);
        toast.success('Skill removed successfully');
        
        // Update the local state
        setSelectedSkills(prev => prev.filter(skill => skill.id !== skillId));
        
        // Refresh the personnel list to update the UI
        const data = await personnelApi.getAllWithSkills();
        setPersonnel(data);
      } catch (error) {
        toast.error('Failed to remove skill');
      }
    } else {
      // Just remove from local state if it was just added in the modal
      setSelectedSkills(prev => prev.filter(skill => skill.id !== skillId));
    }
  };

  const isSkillSelected = (skillId) => {
    return selectedSkills.some(skill => skill.id === skillId);
  };

  const getProficiencyForSkill = (skillId) => {
    const skill = selectedSkills.find(skill => skill.id === skillId);
    return skill ? skill.proficiency_level : 'Beginner';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Personnel Management
            </h2>
            <p className="text-gray-600 mt-1">
              Manage employees and experience levels
            </p>
          </div>
          <button
            onClick={onAdd}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Personnel
          </button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              placeholder="Search personnel..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <select
            value={filterLevel}
            onChange={(e) => setFilterLevel(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All Levels</option>
            <option>Junior</option>
            <option>Mid-Level</option>
            <option>Senior</option>
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Person
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Position
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Experience
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Skills
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {currentData.map((p) => {
                // Map backend fields to frontend fields
                const mappedPerson = {
                  ...p,
                  role: p.department && p.position ? `${p.department} - ${p.position}` : p.department || p.position || '',
                  experienceLevel: p.experience_level || p.experience || '',
                  department: p.department || '',
                  position: p.position || ''
                };
                
                return (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="h-10 w-10 bg-indigo-500 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-white" />
                      </div>
                      <div className="ml-4">
                        <div className="font-medium text-gray-900">
                          {p.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {p.email}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center text-sm text-gray-700">
                      <Building className="h-4 w-4 mr-2" />
                      {mappedPerson.department}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="flex items-center text-sm text-gray-700">
                      <Briefcase className="h-4 w-4 mr-2" />
                      {mappedPerson.position}
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <span className="px-2 py-1 text-xs rounded bg-indigo-100 text-indigo-700">
                      {mappedPerson.experienceLevel}
                    </span>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {p.skills && Array.isArray(p.skills) && p.skills.length > 0 ? (
                        p.skills.slice(0, 3).map((skill, index) => (
                          <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                            {typeof skill === 'string' ? skill : skill.skillName || skill.name || 'N/A'}
                            {typeof skill !== 'string' && skill.PersonnelSkills && (
                              <span className="ml-1 text-xs text-indigo-600">
                                ({skill.PersonnelSkills.proficiency_level})
                              </span>
                            )}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-gray-500">No skills</span>
                      )}
                      {p.skills && Array.isArray(p.skills) && p.skills.length > 3 && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          +{p.skills.length - 3} more
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="relative">
                      <button
                        onClick={() => setOpenDropdownId(openDropdownId === p.id ? null : p.id)}
                        className="p-1 rounded hover:bg-gray-100"
                      >
                        <MoreVertical className="h-4 w-4 text-gray-500" />
                      </button>
                      
                      {openDropdownId === p.id && (
                        <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                          <div className="py-1">
                            <button
                              onClick={() => {
                                onEdit(p);
                                setOpenDropdownId(null);
                              }}
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 flex items-center"
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </button>
                            <button
                              onClick={() => {
                                handleDelete(p.id);
                                setOpenDropdownId(null);
                              }}
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-700 flex items-center"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </button>
                            <button
                              onClick={() => {
                                handleAssignSkill(p);
                                setOpenDropdownId(null);
                              }}
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 flex items-center"
                            >
                              <User className="h-4 w-4 mr-2" />
                              Assign Skill
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-between mt-6">
            <p className="text-sm text-gray-600">
              Showing {startIndex + 1}–
              {Math.min(startIndex + itemsPerPage, filteredPersonnel.length)} of{" "}
              {filteredPersonnel.length}
            </p>
            <div className="flex gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => p - 1)}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Prev
              </button>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => p + 1)}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Skill Assignment Modal */}
      {showSkillModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">
                  Assign Skills to {selectedPersonnel?.name}
                </h3>
                <button 
                  onClick={() => {
                    setShowSkillModal(false);
                    setSelectedPersonnel(null);
                    setAllSkills([]);
                    setSelectedSkills([]);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 max-h-[60vh] overflow-y-auto">
              {/* Available Skills */}
              <div className="border rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l-1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                  </svg>
                  Available Skills
                </h4>
                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {allSkills.map((skill) => {
                    const isSelected = isSkillSelected(skill.id);
                    const proficiency = getProficiencyForSkill(skill.id);
                    
                    return (
                      <div key={skill.id} className={`flex items-center justify-between p-3 rounded-lg border ${isSelected ? 'bg-green-50 border-green-200' : 'hover:bg-gray-50 border-gray-200'}`}>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-900 truncate">{skill.skillName || skill.name || skill.skill_name}</div>
                          <div className="text-xs text-gray-500">{skill.category}</div>
                        </div>
                        <div className="flex items-center space-x-2 ml-3">
                          <select
                            value={proficiency}
                            onChange={(e) => handleSkillChange(skill.id, e.target.value)}
                            className="text-sm border rounded px-2 py-1 w-28"
                          >
                            <option value="Beginner">Beginner</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Advanced">Advanced</option>
                            <option value="Expert">Expert</option>
                          </select>
                          <button
                            onClick={() => {
                              if (isSelected) {
                                handleRemoveSkill(skill.id);
                              } else {
                                handleSkillChange(skill.id, proficiency);
                              }
                            }}
                            className={`text-sm px-3 py-1 rounded ${isSelected ? 'bg-red-100 text-red-700 hover:bg-red-200' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`}
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
              <div className="border rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Selected Skills ({selectedSkills.length})
                </h4>
                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {selectedSkills.length > 0 ? (
                    selectedSkills.map((skill) => (
                      <div key={skill.id} className="flex items-center justify-between p-3 bg-indigo-50 border border-indigo-200 rounded-lg">
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-900 truncate">{skill.skillName || skill.name || skill.skill_name}</div>
                          <div className="text-xs text-gray-500">{skill.category}</div>
                        </div>
                        <div className="flex items-center space-x-2 ml-3">
                          <span className="text-sm bg-indigo-100 text-indigo-800 px-2 py-1 rounded capitalize">
                            {skill.proficiency_level}
                          </span>
                          <button
                            onClick={() => handleRemoveSkill(skill.id)}
                            className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-100"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p>No skills selected</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200 flex justify-between">
              <div className="text-sm text-gray-600">
                {selectedSkills.length} skill{selectedSkills.length !== 1 ? 's' : ''} selected
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setShowSkillModal(false);
                    setSelectedPersonnel(null);
                    setAllSkills([]);
                    setSelectedSkills([]);
                  }}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSkillAssignment}
                  disabled={selectedSkills.length === 0}
                  className={`px-4 py-2 text-white rounded-lg ${
                    selectedSkills.length === 0 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-indigo-600 hover:bg-indigo-700'
                  }`}
                >
                  Assign Skills
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonnelList;
