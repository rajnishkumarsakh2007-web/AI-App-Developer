import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';

const CreateProjectPage = () => {
  const [prompt, setPrompt] = useState('');
  const [projectName, setProjectName] = useState('');
  const [language, setLanguage] = useState('react');
  const [loading, setLoading] = useState(false);
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const languages = [
    { value: 'html', label: 'HTML + CSS + JS' },
    { value: 'javascript', label: 'JavaScript' },
    { value: 'react', label: 'React' },
    { value: 'vue', label: 'Vue.js' },
    { value: 'python', label: 'Python' },
    { value: 'node', label: 'Node.js' }
  ];

  const handleCreateProject = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Generate code using AI
      const aiResponse = await axios.post(
        `${process.env.REACT_APP_API_URL}/ai/generate`,
        { prompt, language },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (aiResponse.data.success) {
        const files = aiResponse.data.data.files.map((file) => ({
          name: file.name,
          content: file.content,
          language: file.language || language,
          type: 'file'
        }));

        // Create project
        const projectResponse = await axios.post(
          `${process.env.REACT_APP_API_URL}/projects`,
          {
            title: projectName || 'Untitled Project',
            description: prompt,
            prompt,
            language,
            files
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (projectResponse.data.success) {
          toast.success('Project created successfully!');
          navigate(`/editor/${projectResponse.data.data._id}`);
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <a href="/dashboard" className="text-blue-400 hover:text-blue-300 mb-4 inline-block">
            ← Back to Dashboard
          </a>
          <h1 className="text-4xl font-bold mb-2">Create New Project</h1>
          <p className="text-slate-400">Describe your app idea and let AI generate it for you</p>
        </div>

        <div className="bg-slate-800 rounded-lg shadow-xl p-8 border border-slate-700">
          <form onSubmit={handleCreateProject} className="space-y-6">
            {/* Project Name */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">Project Name</label>
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                placeholder="My Awesome App"
              />
            </div>

            {/* Language Selection */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">Technology Stack</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
              >
                {languages.map((lang) => (
                  <option key={lang.value} value={lang.value}>
                    {lang.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Prompt */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">Project Description</label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 resize-none h-32"
                placeholder="e.g., Create a Todo app with login, add/delete tasks, and dark mode..."
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !prompt.trim()}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Generating your app... ✨' : 'Generate App with AI 🚀'}
            </button>
          </form>
        </div>

        {/* Tips */}
        <div className="mt-8 bg-slate-800 rounded-lg p-6 border border-slate-700">
          <h3 className="text-lg font-semibold mb-4">💡 Tips for Better Results</h3>
          <ul className="space-y-2 text-slate-300 text-sm">
            <li>• Be specific about features you want</li>
            <li>• Mention the design style (modern, minimalist, etc.)</li>
            <li>• Include authentication requirements if needed</li>
            <li>• Specify data persistence needs (database, localStorage, etc.)</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CreateProjectPage;
