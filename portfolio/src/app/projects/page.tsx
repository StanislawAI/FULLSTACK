// This marks the component as a Server Component, which runs on the server
// Server Components can fetch data directly and don't need useState or useEffect

import Image from 'next/image'; // Next.js Image component for optimized images
import Link from 'next/link'; // Next.js Link component for client-side navigation
import { supabase } from '../../../lib/supabaseClient';

// Define the shape of a project object
type Project = {
  id: number;
  title: string;
  description: string;
  image_url: string;
  tags: string[]; // Array of technology tags
  github_url: string | null;
  live_url: string | null;
};

// This is a Server Component function that fetches data on the server
export default async function ProjectsPage() {
  // Fetch projects from Supabase
  const { data: projects, error } = await supabase
    .from('projects') // Use the "projects" table
    .select('*') // Select all columns
    .order('created_at', { ascending: false }); // Order by creation date, newest first
  
  // If there was an error fetching the data
  if (error) {
    console.error('Error fetching projects:', error);
    return <div>Failed to load projects</div>;
  }

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-8">My Projects</h1>
      
      {/* Display message if no projects were found */}
      {projects.length === 0 && (
        <p className="text-gray-500">No projects available yet.</p>
      )}
      
      {/* Grid layout for projects */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Map over the projects array to render each project */}
        {projects.map((project: Project) => (
          <div 
            key={project.id} // React needs a unique key for each item in a list
            className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
          >
            {/* Project image with Next.js Image component for optimization */}
            {project.image_url && (
              <div className="relative h-48 w-full">
                <Image
                  src={project.image_url}
                  alt={project.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            
            {/* Project information */}
            <div className="p-4">
              <h2 className="text-xl font-bold mb-2">{project.title}</h2>
              <p className="text-gray-600 mb-4">{project.description}</p>
              
              {/* Display project tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {project.tags?.map((tag, index) => (
                  <span 
                    key={index}
                    className="bg-gray-100 text-gray-800 px-2 py-1 text-sm rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              
              {/* Project links */}
              <div className="flex gap-3 mt-2">
                {project.github_url && (
                  <a
                    href={project.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    GitHub
                  </a>
                )}
                {project.live_url && (
                  <a
                    href={project.live_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Live Demo
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
  