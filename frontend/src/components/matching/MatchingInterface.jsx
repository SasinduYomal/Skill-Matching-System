import React, { useState, useEffect } from 'react';
import { Shuffle, Search, User, Wrench, Briefcase, CheckCircle, TrendingUp, BarChart3, Users, Star, Filter, SortAsc, SortDesc } from 'lucide-react';
import projectsApi from '../../api/projectsApi';
import personnelApi from '../../api/personnelApi';

const MatchingInterface = () => {
  const [projects, setProjects] = useState([]);
  const [personnel, setPersonnel] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);
  const [matchedPersonnel, setMatchedPersonnel] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('match');
  const [filterAvailability, setFilterAvailability] = useState('all');
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch projects with their required skills
        const projectsData = await projectsApi.getAll();
        
        // Fetch personnel with their skills
        const personnelData = await personnelApi.getAllWithSkills();
        
        // Transform the data to match the expected structure
        const transformedProjects = projectsData.map(project => ({
          id: project.id,
          name: project.name,
          description: project.description,
          requiredSkills: project.requiredSkills?.map(skill => ({
            name: skill.name || skill.skill,
            level: skill.ProjectSkills?.required_level || skill.level || 'Mid-level'
          })) || []
        }));
        
        const transformedPersonnel = personnelData.map(person => ({
          id: person.id,
          name: person.name,
          role: person.department || person.position || 'N/A',
          skills: person.skills?.map(skill => ({
            name: skill.name || skill.skill_name || skill,
            level: skill.PersonnelSkills?.proficiency_level || skill.level || 'Mid-level'
          })) || [],
          experience: person.experience_level || 'N/A',
          availability: 'Available' // Default availability, can be extended later
        }));
        
        setProjects(transformedProjects);
        setPersonnel(transformedPersonnel);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Calculate match scores based on ALL required skills and minimum proficiency
  const calculateMatchScore = (person, project) => {
    const personSkillsMap = new Map();
    person.skills.forEach(skill => {
      personSkillsMap.set(skill.name.toLowerCase(), skill);
    });

    const requiredSkills = project.requiredSkills;
    let matchedSkills = [];
    let totalScore = 0;
    let maxPossibleScore = 0;
    
    // Define level values for scoring
    const levelValues = { 'Beginner': 1, 'Mid-level': 2, 'Senior': 3, 'Expert': 4 };
    
    let hasAllRequiredSkills = true;
    
    for (const reqSkill of requiredSkills) {
      const personSkill = personSkillsMap.get(reqSkill.name.toLowerCase());
      
      if (!personSkill) {
        // Person doesn't have this required skill
        hasAllRequiredSkills = false;
        break;
      }
      
      const personLevelValue = levelValues[personSkill.level] || 1;
      const requiredLevelValue = levelValues[reqSkill.level] || 1;
      
      // Check if person meets minimum proficiency
      if (personLevelValue < requiredLevelValue) {
        // Person doesn't meet minimum proficiency for this skill
        hasAllRequiredSkills = false;
        break;
      }
      
      // Add to matched skills and calculate score
      matchedSkills.push({
        name: reqSkill.name,
        requiredLevel: reqSkill.level,
        personLevel: personSkill.level
      });
      
      // Score calculation: full points if equal or higher, partial if lower
      if (personLevelValue >= requiredLevelValue) {
        totalScore += requiredLevelValue;
      } else {
        totalScore += personLevelValue * 0.5;
      }
      
      maxPossibleScore += requiredLevelValue;
    }
    
    const matchPercentage = maxPossibleScore > 0 ? Math.round((totalScore / maxPossibleScore) * 100) : 0;
    
    return { 
      matchPercentage, 
      matchedSkills, 
      totalScore, 
      maxPossibleScore,
      hasAllRequiredSkills
    };
  };

  // Perform matching when project is selected
  useEffect(() => {
    if (selectedProject) {
      let matches = personnel.map(person => {
        const { matchPercentage, matchedSkills, totalScore, maxPossibleScore, hasAllRequiredSkills } = calculateMatchScore(person, selectedProject);
        return {
          ...person,
          matchPercentage,
          matchedSkills,
          requiredSkills: selectedProject.requiredSkills,
          totalScore,
          maxPossibleScore,
          hasAllRequiredSkills
        };
      });
      
      // Filter to only those who have ALL required skills and meet minimum proficiency
      matches = matches.filter(match => match.hasAllRequiredSkills);
      
      // Sort based on match percentage
      const sortedMatches = [...matches].sort((a, b) => b.matchPercentage - a.matchPercentage);
      setMatchedPersonnel(sortedMatches);
    } else {
      setMatchedPersonnel([]);
    }
  }, [selectedProject, personnel]);

  // Filter matched personnel based on search and availability
  const filteredMatchedPersonnel = matchedPersonnel.filter(person => {
    const matchesSearch = person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         person.role.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesAvailability = filterAvailability === 'all' || person.availability === filterAvailability;
    
    return matchesSearch && matchesAvailability;
  });

  // Sort matched personnel based on selected option
  const sortedMatchedPersonnel = [...filteredMatchedPersonnel].sort((a, b) => {
    switch (sortOption) {
      case 'match':
        return b.matchPercentage - a.matchPercentage;
      case 'name':
        return a.name.localeCompare(b.name);
      case 'experience':
        const experienceOrder = { 'Senior': 4, 'Lead': 4, 'Mid-level': 3, 'Junior': 2 };
        return (experienceOrder[b.experience] || 0) - (experienceOrder[a.experience] || 0);
      case 'availability':
        return a.availability.localeCompare(b.availability);
      default:
        return 0;
    }
  });

  const getAvailabilityColor = (availability) => {
    switch (availability) {
      case 'Available':
        return 'bg-green-100 text-green-800';
      case 'On Leave':
        return 'bg-yellow-100 text-yellow-800';
      case 'Busy':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'Expert':
        return 'bg-purple-100 text-purple-800';
      case 'Senior':
        return 'bg-blue-100 text-blue-800';
      case 'Mid-level':
        return 'bg-yellow-100 text-yellow-800';
      case 'Beginner':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Skill Matching</h2>
        <p className="text-gray-600 mt-1">Match personnel to projects based on skills and availability</p>
      </div>

      {/* Project Selection */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Project</h3>
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map(project => (
              <div
                key={project.id}
                onClick={() => setSelectedProject(project)}
                className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                  selectedProject?.id === project.id
                    ? 'border-indigo-500 bg-indigo-50 ring-2 ring-indigo-200'
                    : 'border-gray-300 hover:border-indigo-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center mb-2">
                  <Briefcase className="h-5 w-5 text-indigo-600 mr-2" />
                  <h4 className="font-medium text-gray-900">{project.name}</h4>
                </div>
                <p className="text-sm text-gray-600 mb-2">{project.description}</p>
                <div className="mt-3">
                  <p className="text-xs font-medium text-gray-700 mb-1">Required Skills:</p>
                  <div className="flex flex-wrap gap-1">
                    {project.requiredSkills.map((skill, index) => (
                      <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                        {skill.name} ({skill.level})
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Matching Results */}
      {selectedProject && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Matching Results for: {selectedProject.name}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Required skills: {selectedProject.requiredSkills.map(s => `${s.name} (${s.level})`).join(', ')}
                </p>
              </div>
            </div>

            {/* Filters and Sort */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="relative md:col-span-2">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search personnel..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                />
              </div>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              >
                <option value="match">Sort by Match %</option>
                <option value="name">Sort by Name</option>
                <option value="experience">Sort by Experience</option>
                <option value="availability">Sort by Availability</option>
              </select>
              <select
                value={filterAvailability}
                onChange={(e) => setFilterAvailability(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              >
                <option value="all">All Availability</option>
                <option value="Available">Available</option>
                <option value="On Leave">On Leave</option>
                <option value="Busy">Busy</option>
              </select>
            </div>

            {/* Results Table */}
            {sortedMatchedPersonnel.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Personnel</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Experience</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Matched Skills</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Match %</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Availability</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {sortedMatchedPersonnel.map(person => (
                      <tr key={person.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
                              <User className="h-5 w-5 text-white" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{person.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{person.role}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            person.experience === 'Senior' ? 'bg-green-100 text-green-800' :
                            person.experience === 'Mid-level' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {person.experience}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1">
                            {person.matchedSkills.map((skill, index) => (
                              <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                {skill.name} ({skill.personLevel})
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-16 bg-gray-200 rounded-full h-2.5 mr-2">
                              <div 
                                className="bg-indigo-600 h-2.5 rounded-full" 
                                style={{ width: `${person.matchPercentage}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium text-gray-900">{person.matchPercentage}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getAvailabilityColor(person.availability)}`}>
                            {person.availability}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <Shuffle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">
                  {searchTerm || filterAvailability !== 'all' 
                    ? 'No personnel match your filters.' 
                    : selectedProject 
                      ? 'No personnel meet all required skills and proficiency levels.' 
                      : 'No personnel match the selected project requirements.'}
                </p>
                <p className="text-gray-400 mt-2">
                  {searchTerm || filterAvailability !== 'all' 
                    ? 'Try different search terms or filters.' 
                    : 'Ensure personnel have all required skills at minimum proficiency levels.'}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {!selectedProject && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <Shuffle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Project to Match</h3>
          <p className="text-gray-500">Choose a project from the list above to see matching personnel.</p>
        </div>
      )}
    </div>
  );
};

export default MatchingInterface;