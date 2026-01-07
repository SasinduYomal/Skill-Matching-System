import React, { useState, useEffect } from 'react';
import { Users, Wrench, Briefcase, Shuffle, TrendingUp, Calendar, Clock, CheckCircle, BarChart3 } from 'lucide-react';
import personnelApi from '../api/personnelApi';
import skillsApi from '../api/skillsApi';
import projectsApi from '../api/projectsApi';

// Simple bar chart component for personnel utilization
const UtilizationChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No personnel allocation data available
      </div>
    );
  }

  // Find the maximum allocation percentage for scaling
  const maxAllocation = Math.max(...data.map(item => item.allocation), 0) || 100;

  return (
    <div className="space-y-4">
      {data.map((person, index) => (
        <div key={index} className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium text-gray-700">{person.name}</span>
            <span className="text-gray-500">{person.allocation}% allocated</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className={`h-3 rounded-full ${
                person.allocation > 80 ? 'bg-red-500' : 
                person.allocation > 60 ? 'bg-yellow-500' : 'bg-green-500'
              }`}
              style={{ width: `${Math.min(person.allocation, 100)}%` }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );
};

const Dashboard = () => {
  const [stats, setStats] = useState([
    { title: 'Total Personnel', value: '0', icon: Users, color: 'bg-blue-500', change: '+0%' },
    { title: 'Total Skills', value: '0', icon: Wrench, color: 'bg-green-500', change: '+0%' },
    { title: 'Active Projects', value: '0', icon: Briefcase, color: 'bg-yellow-500', change: '+0%' },
    { title: 'Matches Made', value: '0', icon: Shuffle, color: 'bg-purple-500', change: '+0%' },
  ]);
  
  const [recentActivity, setRecentActivity] = useState([]);
  const [upcomingProjects, setUpcomingProjects] = useState([]);
  const [personnelUtilization, setPersonnelUtilization] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all required data
        const [personnelData, skillsData, projectsData] = await Promise.all([
          personnelApi.getAll(),
          skillsApi.getAll(),
          projectsApi.getAll()
        ]);

        // Calculate stats
        const totalPersonnel = personnelData.length;
        const totalSkills = skillsData.length;
        const activeProjects = projectsData.filter(project => 
          project.status.toLowerCase() === 'active' || project.status.toLowerCase() === 'planning'
        ).length;
        
        // Update stats with real data
        setStats([
          { title: 'Total Personnel', value: totalPersonnel.toString(), icon: Users, color: 'bg-blue-500', change: '+0%' },
          { title: 'Total Skills', value: totalSkills.toString(), icon: Wrench, color: 'bg-green-500', change: '+0%' },
          { title: 'Active Projects', value: activeProjects.toString(), icon: Briefcase, color: 'bg-yellow-500', change: '+0%' },
          { title: 'Matches Made', value: '0', icon: Shuffle, color: 'bg-purple-500', change: '+0%' }, // Placeholder for now
        ]);

        // Create recent activity based on fetched data
        const activity = [];
        
        // Add personnel activities
        personnelData.slice(0, 2).forEach((person, index) => {
          activity.push({
            id: `personnel-${index}`,
            action: `${person.name} added to system`,
            time: 'Just now',
            icon: Users,
            color: 'text-blue-500'
          });
        });
        
        // Add skill activities
        skillsData.slice(0, 2).forEach((skill, index) => {
          activity.push({
            id: `skill-${index}`,
            action: `New skill added: ${skill.name}`,
            time: 'Just now',
            icon: Wrench,
            color: 'text-green-500'
          });
        });
        
        // Add project activities
        projectsData.slice(0, 2).forEach((project, index) => {
          activity.push({
            id: `project-${index}`,
            action: `New project created: ${project.name}`,
            time: 'Just now',
            icon: Briefcase,
            color: 'text-purple-500'
          });
        });
        
        setRecentActivity(activity);

        // Process upcoming projects
        const now = new Date();
        const upcoming = projectsData
          .filter(project => {
            const endDate = new Date(project.end_date || project.endDate);
            return endDate > now;
          })
          .map(project => {
            const startDate = new Date(project.start_date || project.startDate);
            const endDate = new Date(project.end_date || project.endDate);
            const totalDuration = endDate - startDate;
            const elapsed = now - startDate > 0 ? now - startDate : 0;
            const progress = totalDuration > 0 ? Math.min(100, Math.round((elapsed / totalDuration) * 100)) : 0;
            
            return {
              name: project.name,
              date: endDate.toLocaleDateString(),
              progress: progress
            };
          })
          .slice(0, 3); // Limit to 3 upcoming projects
        
        setUpcomingProjects(upcoming);

        // Calculate personnel utilization for the next 3 months
        const threeMonthsFromNow = new Date();
        threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);
        
        // For this example, I'll create simulated utilization data
        // In a real system, you would need to track which personnel are assigned to which projects
        const utilizationData = personnelData.map(person => {
          // Simulate allocation percentage (in a real system, this would come from project assignments)
          const randomAllocation = Math.floor(Math.random() * 100); // Random allocation for demo
          return {
            name: person.name,
            allocation: randomAllocation
          };
        }).sort((a, b) => b.allocation - a.allocation); // Sort by allocation percentage
        
        setPersonnelUtilization(utilizationData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const quickActions = [
    { label: 'Manage Personnel', icon: Users, color: 'bg-blue-50', textColor: 'text-blue-700', path: '/personnel' },
    { label: 'Manage Skills', icon: Wrench, color: 'bg-green-50', textColor: 'text-green-700', path: '/skills' },
    { label: 'Manage Projects', icon: Briefcase, color: 'bg-yellow-50', textColor: 'text-yellow-700', path: '/projects' },
    { label: 'Skill Matching', icon: Shuffle, color: 'bg-purple-50', textColor: 'text-purple-700', path: '/matching' },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
          <p className="text-gray-600 mt-1">Welcome back! Here's what's happening today.</p>
        </div>
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
        <p className="text-gray-600 mt-1">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600 font-medium">{stat.change}</span>
                </div>
              </div>
              <div className={`${stat.color} p-3 rounded-lg text-white`}>
                <stat.icon className="h-6 w-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
            <button className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">View All</button>
          </div>
          <div className="space-y-4">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start">
                  <div className={`${activity.color} p-2 rounded-full bg-opacity-10`}>
                    <activity.icon className="h-5 w-5" />
                  </div>
                  <div className="ml-4 flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="text-sm text-gray-500">{activity.time}</p>
                  </div>
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No recent activity</p>
            )}
          </div>
        </div>

        {/* Personnel Utilization */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-6">
            <BarChart3 className="h-5 w-5 text-indigo-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Personnel Utilization</h3>
          </div>
          <div className="space-y-6">
            <div className="text-sm text-gray-600">
              Allocation over next 3 months
            </div>
            <UtilizationChart data={personnelUtilization} />
          </div>
        </div>
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Projects */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Upcoming Projects</h3>
          <div className="space-y-4">
            {upcomingProjects.length > 0 ? (
              upcomingProjects.map((project, index) => (
                <div key={index} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-sm font-medium text-gray-900">{project.name}</h4>
                    <span className="text-xs text-gray-500 flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {project.date}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-indigo-600 h-2 rounded-full" 
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-xs text-gray-500">{project.progress}% complete</span>
                    <span className="text-xs text-indigo-600 font-medium">In Progress</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No upcoming projects</p>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            {quickActions.map((action, index) => (
              <a 
                key={index}
                href={action.path}
                className={`block p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow ${action.color} ${action.textColor}`}
              >
                <div className="flex items-center">
                  <action.icon className="h-5 w-5 mr-3" />
                  <span className="font-medium">{action.label}</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;