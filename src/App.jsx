import React, { useState } from 'react';
import TravelGlobe from './TravelGlobe';
import './globals.css';

export default function JackWebsite() {
  const [activeTab, setActiveTab] = useState('overview');

  const stats = [
    { label: 'Companies', value: '8+', icon: 'ti-briefcase' },
    { label: 'Finished', value: '100mi', subtitle: 'ultramarathon', icon: 'ti-run' },
    { label: 'Countries', value: '12+', icon: 'ti-plane' },
    { label: 'Apps Built', value: '4+', icon: 'ti-code' },
  ];

  const roles = [
    {
      title: 'Risk Analyst',
      company: 'Morgan Stanley',
      location: 'Glasgow',
      dates: '2026',
      description: 'Built agentic AI workflows for macroeconomic & geopolitical risk modeling',
      tags: ['AI/ML', 'Finance', 'Python'],
    },
    {
      title: 'Software Engineer',
      company: 'Tenora',
      description: 'Developed Monte Carlo FX Cash-Flow-at-Risk model, 95% data reduction via AI',
      tags: ['ML', 'Finance', 'Python'],
    },
    {
      title: 'ML Engineer',
      company: 'LexTrack AI',
      description: 'Legal document processing, 60% speed improvement on contract review',
      tags: ['ML', 'Legal', 'Python'],
    },
    {
      title: 'Investment Banking Analyst',
      company: 'J.P. Morgan',
      description: 'LBO modeling, DCF, three-statement integration, M&A analysis',
      tags: ['Finance', 'Modeling', 'Excel'],
    },
  ];

  const projects = [
    {
      name: 'Eiliad',
      tagline: 'QR-based payments & instant refunds for independent retailers',
      status: 'Active',
      tech: ['Node.js', 'React', 'Stripe', 'PostgreSQL'],
      highlight: true,
    },
    {
      name: 'Postinvested',
      tagline: 'Payments platform for independent merchants',
      tech: ['Finance', 'Payments'],
    },
    {
      name: 'GOLLM',
      tagline: 'LLM application for gene ontology summarization (published)',
      tech: ['LLM', 'Bioinformatics'],
    },
    {
      name: 'FX Cash-Flow-at-Risk Model',
      tagline: 'Monte Carlo simulation for currency exposure analysis',
      tech: ['Python', 'Finance', 'Risk'],
    },
  ];

  const mediaCredits = [
    {
      title: 'The Witcher',
      role: 'Actor',
      platform: 'Netflix',
      description: 'Season 2',
    },
    {
      title: 'Maxton Hall',
      role: 'Lead',
      platform: 'Netflix / German Series',
      description: 'Romantic comedy',
    },
    {
      title: 'Tom Ford',
      role: 'Model',
      description: 'Campaign',
    },
    {
      title: 'BoohooMAN',
      role: 'Model',
      description: 'Campaign',
    },
    {
      title: 'The Witcher',
      role: 'Model',
      description: 'Credits',
    },
  ];

  const achievements = [
    {
      title: 'Morgan Stanley Future Generations Scholarship',
      description: '1 of 25 awarded globally to exceptional undergraduates',
      year: '2026',
    },
    {
      title: '100-Mile Ultramarathon',
      description: 'Completed 27:38 finish time',
      year: '2025',
    },
    {
      title: '17th Place, Umushroom Investment Competition',
      description: '84% return portfolio, 1,000+ teams',
      year: '2024',
    },
    {
      title: 'BDO Voice of the Future Challenge',
      description: 'Winner',
      year: '2023',
    },
  ];

  return (
    <div style={{ background: 'var(--surface-0)', minHeight: '100vh', padding: '0' }}>
      {/* Header */}
      <header style={{
        background: 'var(--surface-2)',
        borderBottom: '0.5px solid var(--border)',
        padding: '1.5rem 2rem',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '20px', fontWeight: 500 }}>Jack</div>
          <nav style={{ display: 'flex', gap: '2rem', fontSize: '14px' }}>
            <button onClick={() => setActiveTab('overview')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: activeTab === 'overview' ? 'var(--text-primary)' : 'var(--text-secondary)', fontWeight: activeTab === 'overview' ? 500 : 400 }}>
              Overview
            </button>
            <button onClick={() => setActiveTab('work')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: activeTab === 'work' ? 'var(--text-primary)' : 'var(--text-secondary)', fontWeight: activeTab === 'work' ? 500 : 400 }}>
              Work
            </button>
            <button onClick={() => setActiveTab('projects')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: activeTab === 'projects' ? 'var(--text-primary)' : 'var(--text-secondary)', fontWeight: activeTab === 'projects' ? 500 : 400 }}>
              Projects
            </button>
            <button onClick={() => setActiveTab('media')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: activeTab === 'media' ? 'var(--text-primary)' : 'var(--text-secondary)', fontWeight: activeTab === 'media' ? 500 : 400 }}>
              Media
            </button>
            <button onClick={() => setActiveTab('travel')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: activeTab === 'travel' ? 'var(--text-primary)' : 'var(--text-secondary)', fontWeight: activeTab === 'travel' ? 500 : 400 }}>
              Travel
            </button>
          </nav>
        </div>
      </header>

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '3rem 2rem' }}>
        {/* Hero Section */}
        {activeTab === 'overview' && (
          <>
            <section style={{ marginBottom: '4rem' }}>
              <h1 style={{ fontSize: '42px', fontWeight: 500, margin: '0 0 1rem 0', color: 'var(--text-primary)' }}>
                Mathematician. Builder. Performer.
              </h1>
              <p style={{ fontSize: '18px', color: 'var(--text-secondary)', margin: '0 0 2rem 0', lineHeight: 1.6, maxWidth: '600px' }}>
                University of Manchester (Mathematics + Finance). Morgan Stanley Future Generations Scholar. Founder of Eiliad. Actor & model across Netflix, Tom Ford, and major campaigns.
              </p>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <a href="mailto:hello@sailkcaj.com" style={{
                  padding: '0.75rem 1.5rem',
                  background: 'var(--fill-accent)',
                  color: 'var(--on-accent)',
                  textDecoration: 'none',
                  borderRadius: 'var(--radius)',
                  fontSize: '14px',
                  fontWeight: 500,
                }}>
                  Get in touch
                </a>
                <a href="#" style={{
                  padding: '0.75rem 1.5rem',
                  background: 'var(--surface-2)',
                  border: '0.5px solid var(--border)',
                  color: 'var(--text-primary)',
                  textDecoration: 'none',
                  borderRadius: 'var(--radius)',
                  fontSize: '14px',
                  fontWeight: 500,
                }}>
                  View CV
                </a>
              </div>
            </section>

            {/* Stats Grid */}
            <section style={{ marginBottom: '4rem' }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1rem',
              }}>
                {stats.map((stat, i) => (
                  <div key={i} style={{
                    background: 'var(--surface-2)',
                    border: '0.5px solid var(--border)',
                    borderRadius: '12px',
                    padding: '1.5rem',
                    textAlign: 'center',
                  }}>
                    <i className={`ti ${stat.icon}`} style={{ fontSize: '24px', color: 'var(--text-accent)', marginBottom: '0.5rem', display: 'block' }} aria-hidden="true"></i>
                    <div style={{ fontSize: '28px', fontWeight: 500, margin: '0.5rem 0' }}>{stat.value}</div>
                    <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{stat.label}</div>
                    {stat.subtitle && <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{stat.subtitle}</div>}
                  </div>
                ))}
              </div>
            </section>

            {/* Quick Links */}
            <section>
              <h2 style={{ fontSize: '18px', fontWeight: 500, marginBottom: '1rem' }}>Connect</h2>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                {['LinkedIn', 'GitHub', 'Email', 'Spotify'].map((link, i) => (
                  <a key={i} href="#" style={{
                    padding: '0.5rem 1rem',
                    background: 'var(--surface-2)',
                    border: '0.5px solid var(--border)',
                    borderRadius: 'var(--radius)',
                    fontSize: '14px',
                    color: 'var(--text-primary)',
                    textDecoration: 'none',
                  }}>
                    {link}
                  </a>
                ))}
              </div>
            </section>
          </>
        )}

        {/* Work Section */}
        {activeTab === 'work' && (
          <section>
            <h2 style={{ fontSize: '24px', fontWeight: 500, marginBottom: '2rem' }}>Experience</h2>
            <div style={{ display: 'grid', gap: '1.5rem' }}>
              {roles.map((role, i) => (
                <div key={i} style={{
                  background: 'var(--surface-2)',
                  border: '0.5px solid var(--border)',
                  borderRadius: '12px',
                  padding: '1.5rem',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.75rem' }}>
                    <div>
                      <h3 style={{ fontSize: '16px', fontWeight: 500, margin: '0 0 0.25rem 0' }}>{role.title}</h3>
                      <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: 0 }}>
                        {role.company} {role.location && `• ${role.location}`}
                      </p>
                    </div>
                    {role.dates && <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{role.dates}</span>}
                  </div>
                  <p style={{ fontSize: '14px', color: 'var(--text-primary)', margin: '0.75rem 0 1rem 0', lineHeight: 1.6 }}>{role.description}</p>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {role.tags.map((tag, j) => (
                      <span key={j} style={{
                        fontSize: '12px',
                        background: 'var(--bg-accent)',
                        color: 'var(--text-accent)',
                        padding: '0.25rem 0.75rem',
                        borderRadius: 'var(--radius)',
                      }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Achievements Subsection */}
            <h3 style={{ fontSize: '18px', fontWeight: 500, marginTop: '3rem', marginBottom: '1.5rem' }}>Key Achievements</h3>
            <div style={{ display: 'grid', gap: '1rem' }}>
              {achievements.map((ach, i) => (
                <div key={i} style={{
                  background: 'var(--surface-2)',
                  border: '0.5px solid var(--border)',
                  borderRadius: '12px',
                  padding: '1rem 1.5rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                }}>
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: 500, margin: '0 0 0.25rem 0' }}>{ach.title}</p>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>{ach.description}</p>
                  </div>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)', whiteSpace: 'nowrap', marginLeft: '1rem' }}>{ach.year}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects Section */}
        {activeTab === 'projects' && (
          <section>
            <h2 style={{ fontSize: '24px', fontWeight: 500, marginBottom: '2rem' }}>Projects & Apps</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
              {projects.map((proj, i) => (
                <div key={i} style={{
                  background: proj.highlight ? 'var(--bg-accent)' : 'var(--surface-2)',
                  border: proj.highlight ? '2px solid var(--border-accent)' : '0.5px solid var(--border)',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  position: 'relative',
                }}>
                  {proj.highlight && (
                    <span style={{
                      position: 'absolute',
                      top: '-12px',
                      left: '12px',
                      fontSize: '11px',
                      background: 'var(--fill-accent)',
                      color: 'var(--on-accent)',
                      padding: '0.25rem 0.75rem',
                      borderRadius: 'var(--radius)',
                      fontWeight: 500,
                    }}>
                      Active
                    </span>
                  )}
                  <h3 style={{ fontSize: '16px', fontWeight: 500, margin: '0 0 0.5rem 0', marginTop: proj.highlight ? '0.5rem' : 0 }}>{proj.name}</h3>
                  <p style={{ fontSize: '13px', color: proj.highlight ? 'var(--text-accent)' : 'var(--text-secondary)', margin: '0 0 1rem 0', lineHeight: 1.5 }}>{proj.tagline}</p>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {proj.tech.map((t, j) => (
                      <span key={j} style={{
                        fontSize: '11px',
                        background: proj.highlight ? 'rgba(0,0,0,0.1)' : 'var(--surface-1)',
                        color: proj.highlight ? 'var(--text-accent)' : 'var(--text-secondary)',
                        padding: '0.25rem 0.5rem',
                        borderRadius: 'var(--radius)',
                      }}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Media Section */}
        {activeTab === 'media' && (
          <section>
            <h2 style={{ fontSize: '24px', fontWeight: 500, marginBottom: '2rem' }}>Acting & Modeling</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {mediaCredits.map((media, i) => (
                <div key={i} style={{
                  background: 'var(--surface-2)',
                  border: '0.5px solid var(--border)',
                  borderRadius: '12px',
                  padding: '1.5rem',
                }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 500, margin: '0 0 0.5rem 0' }}>{media.title}</h3>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '0 0 0.5rem 0' }}>
                    <i className="ti ti-star" style={{ marginRight: '0.25rem' }} aria-hidden="true"></i>
                    {media.role}
                  </p>
                  {media.platform && <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '0 0 0.5rem 0' }}>{media.platform}</p>}
                  {media.description && <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>{media.description}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Travel Section */}
        {activeTab === 'travel' && (
          <section>
            <h2 style={{ fontSize: '24px', fontWeight: 500, marginBottom: '0.5rem' }}>Where I've been</h2>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: '0 0 2rem 0' }}>
              Spin the globe or drag to look around.
            </p>
            <TravelGlobe />
          </section>
        )}
      </main>

      {/* Footer */}
      <footer style={{
        borderTop: '0.5px solid var(--border)',
        padding: '2rem',
        textAlign: 'center',
        fontSize: '13px',
        color: 'var(--text-secondary)',
        marginTop: '4rem',
      }}>
        <p style={{ margin: 0 }}>Built by Jack • sailkcaj.com</p>
      </footer>
    </div>
  );
}
