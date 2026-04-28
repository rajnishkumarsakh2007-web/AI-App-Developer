import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import ProjectCard from '../components/ProjectCard';
import toast from 'react-hot-toast';

const DashboardPage = () => {
  const { user, token } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/projects`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProjects(response.data.data);
    } catch (error) {
      toast.error('Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Welcome, {user?.name}! 🚀</h1>
          <p className="text-slate-400">Build amazing apps with AI assistance</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <h3 className="text-slate-400 text-sm font-medium mb-2">Projects</h3>
            <p className="text-3xl font-bold">{projects.length}</p>
          </div>
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <h3 className="text-slate-400 text-sm font-medium mb-2">AI Generations</h3>
            <p className="text-3xl font-bold">{user?.stats?.aiGenerations || 0}</p>
          </div>
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <h3 className="text-slate-400 text-sm font-medium mb-2">Deployed</h3>
            <p className="text-3xl font-bold">{user?.stats?.appsDeployed || 0}</p>
          </div>
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <h3 className="text-slate-400 text-sm font-medium mb-2">Subscription</h3>
            <p className="text-3xl font-bold capitalize">{user?.subscription?.type || 'Free'}</p>
          </div>
        </div>

        {/* Create New Project Button */}
        <div className="mb-8">
          <a
            href="/create"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition duration-200"
          >
            + Create New Project
          </a>
        </div>

        {/* Projects Grid */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Your Projects</h2>
          {loading ? (
            <p className="text-slate-400">Loading projects...</p>
          ) : projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <ProjectCard key={project._id} project={project} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-slate-800 rounded-lg border border-slate-700">
              <p className="text-slate-400 mb-4">No projects yet</p>
              <a
                href="/create"
                className="text-blue-500 hover:text-blue-400 font-medium"
              >
                Create your first project →
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
