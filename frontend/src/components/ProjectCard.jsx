import React from 'react';
import { Link } from 'react-router-dom';

const ProjectCard = ({ project }) => {
  return (
    <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden hover:border-blue-500 transition duration-200">
      {/* Project Header */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-lg font-semibold text-white flex-1 truncate">{project.title}</h3>
          <span className="ml-2 px-2 py-1 bg-blue-600 text-white text-xs rounded">
            {project.language}
          </span>
        </div>

        {/* Description */}
        <p className="text-slate-400 text-sm mb-4 line-clamp-2">
          {project.description || 'No description'}
        </p>

        {/* Stats */}
        <div className="flex items-center justify-between text-xs text-slate-400 mb-4">
          <span>📅 {new Date(project.createdAt).toLocaleDateString()}</span>
          <span>👁️ {project.stats?.views || 0} views</span>
        </div>

        {/* Deployment Status */}
        {project.deployment?.status !== 'none' && (
          <div className="mb-4 p-2 bg-slate-700 rounded text-xs text-slate-200">
            Status: <span className="font-semibold capitalize">{project.deployment?.status}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Link
            to={`/editor/${project._id}`}
            className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded transition duration-200 text-center"
          >
            Edit
          </Link>
          <Link
            to={`/project/${project._id}`}
            className="flex-1 px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white text-sm font-medium rounded transition duration-200 text-center"
          >
            View
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
