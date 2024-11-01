'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useProject } from '@/hooks/useProject';
import { useSubscription } from '@/hooks/useSubscription';
import { Project } from '@/types';
import Link from 'next/link';

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { loading, error, createProject } = useProject();
  const { isWithinLimits, getFeatures, currentTier } = useSubscription();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/auth/signin');
      return;
    }

    const fetchProjects = async () => {
      try {
        const response = await fetch(`/api/projects?userId=${user.user_id}`);
        const data = await response.json();
        setProjects(data);
      } catch (err) {
        console.error('Error fetching projects:', err);
      } finally {
        setLoadingProjects(false);
      }
    };

    fetchProjects();
  }, [user, router]);

  const handleCreateProject = async () => {
    if (!user) return;

    if (!isWithinLimits('maxProjects', projects.length)) {
      router.push('/pricing');
      return;
    }

    try {
      const project = await createProject('New Project');
      router.push(`/projects/${project.project_id}`);
    } catch (err) {
      console.error('Error creating project:', err);
    }
  };

  if (!user) {
    return null; // Redirect handled in useEffect
  }

  const features = getFeatures();

  return (
    <div className="py-10">
      <header>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">
            Dashboard
          </h1>
        </div>
      </header>
      <main>
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          {/* Subscription Status */}
          <div className="mt-8 bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-base font-semibold leading-6 text-gray-900">
                Subscription Status
              </h3>
              <div className="mt-2 max-w-xl text-sm text-gray-500">
                <p>
                  Current Plan: <span className="font-medium capitalize">{currentTier}</span>
                </p>
                <p className="mt-1">
                  Projects: {projects.length} / {features.maxProjects === 'unlimited' ? '∞' : features.maxProjects}
                </p>
              </div>
              <div className="mt-3">
                <Link
                  href="/pricing"
                  className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
                >
                  Upgrade Plan
                </Link>
              </div>
            </div>
          </div>

          {/* Projects List */}
          <div className="mt-8">
            <div className="sm:flex sm:items-center">
              <div className="sm:flex-auto">
                <h2 className="text-xl font-semibold text-gray-900">Your Projects</h2>
                <p className="mt-2 text-sm text-gray-700">
                  Create and manage your comic projects
                </p>
              </div>
              <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                <button
                  onClick={handleCreateProject}
                  disabled={loading || !isWithinLimits('maxProjects', projects.length)}
                  className={`
                    block rounded-md px-3 py-2 text-center text-sm font-semibold text-white shadow-sm
                    ${loading || !isWithinLimits('maxProjects', projects.length)
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-500'}
                  `}
                >
                  Create Project
                </button>
              </div>
            </div>

            {loadingProjects ? (
              <div className="mt-6 flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
              </div>
            ) : projects.length === 0 ? (
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-500">No projects yet. Create your first one!</p>
              </div>
            ) : (
              <div className="mt-8 flow-root">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                  <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                      <table className="min-w-full divide-y divide-gray-300">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                              Project Name
                            </th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                              Created
                            </th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                              Last Updated
                            </th>
                            <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                              <span className="sr-only">Actions</span>
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                          {projects.map((project) => (
                            <tr key={project.project_id}>
                              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                {project.description}
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                {new Date(project.created_at).toLocaleDateString()}
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                {new Date(project.updated_at).toLocaleDateString()}
                              </td>
                              <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                <Link
                                  href={`/projects/${project.project_id}`}
                                  className="text-blue-600 hover:text-blue-900"
                                >
                                  Edit<span className="sr-only">, {project.description}</span>
                                </Link>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
