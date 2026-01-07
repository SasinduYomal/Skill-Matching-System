import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Target, CheckCircle2, XCircle, Calendar, Users, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';
import projectsApi from '../api/projectsApi';
import personnelApi from '../api/personnelApi';

const MatchingPage = () => {
  const [searchParams] = useSearchParams();
  const [projects, setProjects] = useState([]);
  const [personnel, setPersonnel] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedProjectId, setSelectedProjectId] = useState(searchParams.get('project') || '');
  const [matchResults, setMatchResults] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch projects with their required skills
        const projectsData = await projectsApi.getAll();
        
        // Fetch personnel with their skills
        const personnelData = await personnelApi.getAllWithSkills();
        
        // Transform the data to match the expected structure
        const transformedProjects = projectsData.map(project => ({
          id: project.id.toString(),
          name: project.name,
          description: project.description,
          status: project.status,
          requiredSkills: project.requiredSkills?.map(skill => ({
            skillId: skill.id || skill.skill_id,
            skill: {
              id: skill.id || skill.skill_id,
              name: skill.name || skill.skill,
              category: skill.category || 'N/A'
            },
            minimumProficiency: skill.ProjectSkills?.required_level || skill.level || 'Mid-level'
          })) || [],
          startDate: new Date(project.start_date || project.startDate || Date.now()),
          endDate: new Date(project.end_date || project.endDate || Date.now())
        }));
        
        const transformedPersonnel = personnelData.map(person => ({
          id: person.id.toString(),
          name: person.name,
          role: person.department || person.position || 'N/A',
          experienceLevel: person.experience_level || 'N/A',
          skills: person.skills?.map(skill => ({
            id: skill.id || skill.skill_id,
            name: skill.name || skill.skill_name || skill,
            proficiency: skill.PersonnelSkills?.proficiency_level || skill.level || 'Mid-level'
          })) || []
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

  useEffect(() => {
    if (selectedProjectId) {
      const project = projects.find((p) => p.id === selectedProjectId);
      if (project) {
        setSelectedProject(project);
        const results = matchPersonnelToProject(personnel, project);
        setMatchResults(results);
      }
    } else {
      setSelectedProject(null);
      setMatchResults([]);
    }
  }, [selectedProjectId, projects, personnel]);

  const perfectMatches = matchResults.filter((r) => r.meetsAllRequirements);
  const partialMatches = matchResults.filter((r) => !r.meetsAllRequirements);

  // Matching utility function
  const matchPersonnelToProject = (personnelList, project) => {
    return personnelList.map(person => {
      const personSkillsMap = new Map();
      person.skills?.forEach(skill => {
        personSkillsMap.set(skill.name.toLowerCase(), skill);
      });

      const requiredSkills = project.requiredSkills;
      let matchedSkills = [];
      let totalScore = 0;
      let maxPossibleScore = 0;
      
      // Define level values for scoring
      const levelValues = { 'Beginner': 1, 'Intermediate': 2, 'Mid-level': 3, 'Advanced': 4, 'Expert': 4 };
      
      let hasAllRequiredSkills = true;
      
      for (const reqSkill of requiredSkills) {
        const personSkill = personSkillsMap.get(reqSkill.skill.name.toLowerCase());
        
        if (!personSkill) {
          // Person doesn't have this required skill
          hasAllRequiredSkills = false;
          break;
        }
        
        const personLevelValue = levelValues[personSkill.proficiency] || 1;
        const requiredLevelValue = levelValues[reqSkill.minimumProficiency] || 1;
        
        // Check if person meets minimum proficiency
        if (personLevelValue < requiredLevelValue) {
          // Person doesn't meet minimum proficiency for this skill
          hasAllRequiredSkills = false;
          break;
        }
        
        // Add to matched skills and calculate score
        matchedSkills.push({
          name: reqSkill.skill.name,
          requiredLevel: reqSkill.minimumProficiency,
          personLevel: personSkill.proficiency
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
        personnel: person,
        matchedSkills,
        matchPercentage, 
        meetsAllRequirements: hasAllRequiredSkills
      };
    }).filter(result => result.matchedSkills.length > 0); // Only return results that have matched skills
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Team Matching</h1>
            <p className="mt-2 text-gray-600">Find the best team members for your projects</p>
          </div>
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Team Matching</h1>
          <p className="mt-2 text-gray-600">Find the best team members for your projects</p>
        </div>
        
        <div className="space-y-6">
          {/* Project Selection */}
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-6">
            <div className="pb-4">
              <h3 className="text-lg font-semibold leading-none tracking-tight">Select Project</h3>
            </div>
            <div className="pt-0">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                <div className="flex-1 max-w-md">
                  <div className="relative">
                    <select 
                      value={selectedProjectId} 
                      onChange={(e) => setSelectedProjectId(e.target.value)}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="">Choose a project to find matching team members</option>
                      {projects.map((project) => (
                        <option key={project.id} value={project.id}>
                          {project.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                {selectedProject && (
                  <button 
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background border border-input bg-background hover:bg-accent hover:text-accent-foreground px-4 py-2"
                    onClick={() => {
                      setSelectedProjectId('');
                      setSelectedProject(null);
                      setMatchResults([]);
                    }}
                  >
                    Clear Selection
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Project Details */}
          {selectedProject && (
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
              <div className="p-6 pb-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold leading-none tracking-tight">{selectedProject.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{selectedProject.description}</p>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {selectedProject.status}
                  </span>
                </div>
              </div>
              <div className="p-6 pt-0">
                <div className="flex flex-wrap gap-6 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {format(selectedProject.startDate, 'MMM d, yyyy')} - {format(selectedProject.endDate, 'MMM d, yyyy')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Target className="h-4 w-4" />
                    <span>{selectedProject.requiredSkills.length} required skills</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Users className="h-4 w-4" />
                    <span>{matchResults.length} potential matches</span>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                    Required Skills
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.requiredSkills.map((reqSkill, index) => (
                      <div key={index} className="flex items-center gap-1 bg-gray-100/50 rounded-lg px-2 py-1">
                        <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-indigo-100 text-indigo-800">
                          {reqSkill.skill.name}
                        </span>
                        <span className="text-xs text-gray-600">(min:</span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {reqSkill.minimumProficiency}
                        </span>
                        <span className="text-xs text-gray-600">)</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Match Results */}
          {selectedProject && selectedProject.requiredSkills.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto h-12 w-12 text-gray-400">
                <Target className="h-12 w-12" />
              </div>
              <h3 className="mt-2 text-lg font-medium text-gray-900">No skill requirements defined</h3>
              <p className="mt-1 text-sm text-gray-500">This project doesn't have any skill requirements yet. Add required skills to find matching team members.</p>
            </div>
          ) : selectedProject && matchResults.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto h-12 w-12 text-gray-400">
                <Users className="h-12 w-12" />
              </div>
              <h3 className="mt-2 text-lg font-medium text-gray-900">No matches found</h3>
              <p className="mt-1 text-sm text-gray-500">No team members have any of the required skills for this project.</p>
            </div>
          ) : selectedProject ? (
            <div className="space-y-6">
              {/* Summary Stats */}
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                  <div className="pt-6 p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Perfect Matches</p>
                        <p className="text-3xl font-bold text-green-800">{perfectMatches.length}</p>
                      </div>
                      <CheckCircle2 className="h-10 w-10 text-green-400" />
                    </div>
                  </div>
                </div>
                <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                  <div className="pt-6 p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Partial Matches</p>
                        <p className="text-3xl font-bold text-yellow-800">{partialMatches.length}</p>
                      </div>
                      <TrendingUp className="h-10 w-10 text-yellow-400" />
                    </div>
                  </div>
                </div>
                <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                  <div className="pt-6 p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Candidates</p>
                        <p className="text-3xl font-bold text-gray-900">{matchResults.length}</p>
                      </div>
                      <Users className="h-10 w-10 text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Perfect Matches */}
              {perfectMatches.length > 0 && (
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    Perfect Matches
                  </h2>
                  <div className="grid gap-4 md:grid-cols-2">
                    {perfectMatches.map((result) => (
                      <MatchCard key={result.personnel.id} result={result} />
                    ))}
                  </div>
                </div>
              )}

              {/* Partial Matches */}
              {partialMatches.length > 0 && (
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-yellow-600" />
                    Partial Matches
                  </h2>
                  <div className="grid gap-4 md:grid-cols-2">
                    {partialMatches.map((result) => (
                      <MatchCard key={result.personnel.id} result={result} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="mx-auto h-12 w-12 text-gray-400">
                <Target className="h-12 w-12" />
              </div>
              <h3 className="mt-2 text-lg font-medium text-gray-900">Select a project</h3>
              <p className="mt-1 text-sm text-gray-500">Choose a project above to find matching team members based on skill requirements.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const MatchCard = ({ result }) => {
  const { personnel, matchedSkills, matchPercentage, meetsAllRequirements } = result;

  return (
    <div className={`rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden transition-all hover:shadow-md ${meetsAllRequirements ? 'border-green-300' : ''}`}>
      <div className="p-4">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-800">
              {personnel.name.split(' ').map((n) => n[0]).join('')}
            </div>
            <div>
              <p className="font-medium text-gray-900">{personnel.name}</p>
              <p className="text-sm text-gray-600">{personnel.role || 'N/A'}</p>
            </div>
          </div>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {personnel.experienceLevel || 'N/A'}
          </span>
        </div>

        {/* Match Score */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-gray-600">Match Score</span>
            <span className={`text-sm font-bold ${meetsAllRequirements ? 'text-green-600' : 'text-yellow-600'}`}>
              {matchPercentage}%
            </span>
          </div>
          <div className={`w-full bg-gray-200 rounded-full h-2 ${meetsAllRequirements ? 'bg-green-200' : 'bg-yellow-200'}`}>
            <div 
              className="bg-indigo-600 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${matchPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Skill Matches */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Skills Matched</p>
          <div className="flex flex-wrap gap-1">
            {matchedSkills?.map((skill, index) => (
              <div key={index} className="flex items-center gap-1 bg-gray-100 rounded-lg px-2 py-1">
                <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-indigo-100 text-indigo-800">
                  {skill.name}
                </span>
                <span className="text-xs text-gray-600">({skill.personLevel})</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchingPage;