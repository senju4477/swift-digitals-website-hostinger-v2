'use client';

import { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { workFilters, workProjects, type WorkFilter, type WorkProject } from '@/lib/work';

function ProjectCard({ project }: { project: WorkProject }) {
  const linkLabel = `Visit ${project.name} website (opens in a new tab)`;

  return (
    <article className={`work-card${project.featured ? ' work-card-featured' : ''}`} aria-labelledby={`project-${project.slug}`}>
      <div className="work-browser">
        <div className="work-browser-chrome" aria-hidden="true">
          <span className="work-browser-dots"><i /><i /><i /></span>
          <span className="work-browser-address" />
        </div>
        <img
          src={project.image}
          alt={`${project.name} website homepage`}
          width={1348}
          height={926}
          loading="lazy"
          decoding="async"
        />
      </div>
      <div className="work-card-copy">
        <h3 id={`project-${project.slug}`}>{project.name}</h3>
        <p className="work-industry">{project.industry}</p>
        <div className="work-card-links">
          <a className="work-domain" href={project.url} target="_blank" rel="noopener noreferrer" aria-label={linkLabel}>
            {project.domain}
          </a>
          {project.description && <p className="work-description">{project.description}</p>}
          <a className="work-visit" href={project.url} target="_blank" rel="noopener noreferrer" aria-label={linkLabel}>
            Visit website <ArrowUpRight size={17} aria-hidden="true" />
          </a>
        </div>
      </div>
    </article>
  );
}

export function WorkGallery() {
  const [filter, setFilter] = useState<WorkFilter>('all');
  const projects = filter === 'all' ? workProjects : workProjects.filter(project => project.category === filter);
  const activeLabel = workFilters.find(option => option.id === filter)?.label || 'All projects';

  return (
    <section className="section lavender work-gallery" aria-labelledby="work-heading">
      <div className="container">
        <div className="work-heading">
          <p className="eyebrow">Selected website projects</p>
          <h2 id="work-heading">A closer look at our work.</h2>
          <p>Explore a project, then visit the website.</p>
        </div>
        <div className="work-filters" role="group" aria-label="Filter website projects">
          {workFilters.map(option => (
            <button
              key={option.id}
              type="button"
              className="work-filter"
              aria-pressed={filter === option.id}
              aria-controls="work-projects"
              onClick={() => setFilter(option.id)}
            >
              {option.label}{option.id === 'all' ? ` (${workProjects.length})` : ''}
            </button>
          ))}
        </div>
        <p className="work-filter-status" role="status" aria-live="polite" aria-atomic="true">
          {activeLabel}: showing {projects.length} website {projects.length === 1 ? 'project' : 'projects'}.
        </p>
        <div className="work-grid" id="work-projects">
          {projects.map(project => <ProjectCard key={project.slug} project={project} />)}
        </div>
      </div>
    </section>
  );
}
