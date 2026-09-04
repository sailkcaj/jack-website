import React, { useState } from 'react';
import TravelGlobe from './TravelGlobe';
import TimeTracker from './TimeTracker';
import Photo from './Photo';
import './globals.css';
import {
  stats,
  roles,
  education,
  projects,
  mediaCredits,
  achievements,
  HERO_IMAGE,
  companyLogoSrc,
  projectImageSrc,
  mediaImageSrc,
  achievementImageSrc,
} from './siteData';

export default function JackWebsite() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div style={{ background: 'var(--surface-0)', minHeight: '100vh', padding: '0' }}>
      {/* Header */}
      <header style={{
        background: 'var(--header-bg)',
        borderBottom: '0.5px solid var(--border)',
        padding: '1.5rem 2rem',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '20px', fontWeight: 500 }}>Jack Lias</div>
          <nav style={{ display: 'flex', gap: '2rem', fontSize: '14px' }}>
            <button onClick={() => setActiveTab('overview')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: activeTab === 'overview' ? 'var(--text-primary)' : 'var(--text-secondary)', fontWeight: activeTab === 'overview' ? 500 : 400 }}>
              Overview
            </button>
            <button onClick={() => setActiveTab('work')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: activeTab === 'work' ? 'var(--text-primary)' : 'var(--text-secondary)', fontWeight: activeTab === 'work' ? 500 : 400 }}>
              Work
            </button>
            <button onClick={() => setActiveTab('achievements')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: activeTab === 'achievements' ? 'var(--text-primary)' : 'var(--text-secondary)', fontWeight: activeTab === 'achievements' ? 500 : 400 }}>
              Achievements
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
            <button onClick={() => setActiveTab('time')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: activeTab === 'time' ? 'var(--text-primary)' : 'var(--text-secondary)', fontWeight: activeTab === 'time' ? 500 : 400 }}>
              Time
            </button>
          </nav>
        </div>
      </header>

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '3rem 2rem' }}>
        {/* Hero Section */}
        {activeTab === 'overview' && (
          <>
            <section style={{ marginBottom: '4rem' }}>
              <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                <Photo
                  src={HERO_IMAGE}
                  alt="Jack"
                  style={{
                    width: '140px',
                    height: '140px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '0.5px solid var(--border)',
                    flexShrink: 0,
                  }}
                />
                <div>
                  <h1 style={{ fontSize: '42px', fontWeight: 500, margin: '0 0 1rem 0', color: 'var(--text-primary)' }}>
                    Mathematician. Builder. Performer.
                  </h1>
                  <div style={{ fontSize: '18px', color: 'var(--text-secondary)', margin: '0 0 2rem 0', lineHeight: 1.6, maxWidth: '600px' }}>
                    <p style={{ margin: '0 0 0.3rem 0' }}>BSc Mathematics with Finance</p>
                    <p style={{ margin: '0 0 0.3rem 0' }}>Morgan Stanley Future Generations Scholar</p>
                    <p style={{ margin: '0 0 0.3rem 0' }}>Founder of Eiliad</p>
                    <p style={{ margin: 0 }}>Actor and Model across Netflix, Tom Ford and major campaigns</p>
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                    <a href="mailto:liasjack1@gmail.com" style={{
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
                    <a href="/jack-lias-cv.pdf" target="_blank" rel="noopener noreferrer" style={{
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
                  <p style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.7, maxWidth: '680px', margin: 0 }}>
                    Hey I’m Jack Lias, I come from a rather large family of 4 sisters and I sit right in the middle, ever since a young boy I always had a goal, when I was a lot younger I had somewhat of a crisis as I did not fully understand why we existed the conclusion I came to is your here to make as much impact as possible, I wake up every morning knowing I have 16 hours to achieve as much as I can I know if I stop and have and hour scrolling my phone or talking about the latest gossip I will achieve less so I try and strive for a goal at all hours of the day, all be it some hours are more productive than others, however this is where one of my key super powers comes in making unproductive hours productive by just doing the least brain power demanding jobs then when I my brain is up for it doing hard thought provoking stuff. I get asked a lot why I’m like this and since the age of 12 I was raised by a single Mum my Grandma joined helping raise us a few years later but there was one thing I remember growing up and that was until I was about 15 I never saw my Mum go to bed earlier than me or wake up later than me there would be sometimes I would purposely wake up early like I’m talking 5am and then I’m thinking I’ve done it I’ve woken up earlier than my Mum then next thing you know I would here some clanging in the garage, I watched my Mum for my whole life get after it and I mean get after it and that is definitely where I get my skills to work for very long days but also keep it going for years, also being the only man in my house also played huge role in what drives me today sometimes I would have to step up be more than just a brother and sometimes I would have to remember I’m just a brother. I want to make as big of an impact as possible on this world and the people within and I will not stop and I love that, so I suppose, bring on the 16 hour days and let’s GET AFTER IT!
                  </p>
                </div>
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
                {[
                  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/jack-lias-b0521b249/', external: true },
                  { label: 'GitHub', href: 'https://github.com/sailkcaj', external: true },
                  { label: 'Email', href: 'mailto:liasjack1@gmail.com', external: false },
                ].map((link, i) => (
                  <a
                    key={i}
                    href={link.href}
                    {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    style={{
                      padding: '0.5rem 1rem',
                      background: 'var(--surface-2)',
                      border: '0.5px solid var(--border)',
                      borderRadius: 'var(--radius)',
                      fontSize: '14px',
                      color: 'var(--text-primary)',
                      textDecoration: 'none',
                    }}>
                    {link.label}
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
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                      <Photo
                        src={companyLogoSrc(role.company)}
                        alt={`${role.company} logo`}
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '8px',
                          objectFit: 'cover',
                          border: '0.5px solid var(--border)',
                          flexShrink: 0,
                        }}
                      />
                      <div>
                        <h3 style={{ fontSize: '16px', fontWeight: 500, margin: '0 0 0.25rem 0' }}>{role.title}</h3>
                        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: 0 }}>
                          {role.company} {role.location && `• ${role.location}`}
                        </p>
                      </div>
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

            {/* Education Subsection */}
            <h3 style={{ fontSize: '18px', fontWeight: 500, marginTop: '3rem', marginBottom: '1.5rem' }}>Education</h3>
            <div style={{
              background: 'var(--surface-2)',
              border: '0.5px solid var(--border)',
              borderRadius: '12px',
              padding: '1.5rem',
            }}>
              <p style={{ fontSize: '14px', fontWeight: 500, margin: '0 0 0.25rem 0' }}>{education.school}</p>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '0 0 0.5rem 0' }}>{education.degree}</p>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>{education.detail}</p>
            </div>
          </section>
        )}

        {/* Achievements Section */}
        {activeTab === 'achievements' && (
          <section>
            <h2 style={{ fontSize: '24px', fontWeight: 500, marginBottom: '2rem' }}>Achievements</h2>
            <div style={{ display: 'grid', gap: '1rem' }}>
              {achievements.map((ach, i) => (
                <div key={i} style={{
                  background: 'var(--surface-2)',
                  border: '0.5px solid var(--border)',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  display: 'flex',
                  height: '140px',
                }}>
                  <Photo
                    src={achievementImageSrc(ach.title)}
                    alt={ach.title}
                    style={{
                      width: '200px',
                      height: '100%',
                      objectFit: 'cover',
                      flexShrink: 0,
                      display: 'block',
                    }}
                  />
                  <div style={{
                    flex: 1,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '1rem 1.5rem',
                    gap: '1rem',
                    minWidth: 0,
                  }}>
                    <div style={{ minWidth: 0 }}>
                      <p style={{ fontSize: '14px', fontWeight: 500, margin: '0 0 0.25rem 0' }}>{ach.title}</p>
                      <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>{ach.description}</p>
                    </div>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)', whiteSpace: 'nowrap', marginLeft: '1rem' }}>{ach.year}</span>
                  </div>
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
                  <Photo
                    src={projectImageSrc(proj.name)}
                    alt={`${proj.name} screenshot`}
                    style={{
                      display: 'block',
                      width: 'calc(100% + 3rem)',
                      height: '140px',
                      objectFit: 'cover',
                      margin: '-1.5rem -1.5rem 1rem -1.5rem',
                      borderTopLeftRadius: '11px',
                      borderTopRightRadius: '11px',
                    }}
                  />
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
                  <Photo
                    src={mediaImageSrc(media.title)}
                    alt={media.title}
                    style={{
                      display: 'block',
                      width: 'calc(100% + 3rem)',
                      height: '160px',
                      objectFit: 'cover',
                      margin: '-1.5rem -1.5rem 1rem -1.5rem',
                      borderTopLeftRadius: '11px',
                      borderTopRightRadius: '11px',
                    }}
                  />
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

        {/* Time Section */}
        {activeTab === 'time' && <TimeTracker />}
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
        <p style={{ margin: 0 }}>Built by Jack Lias • sailkcaj.com</p>
      </footer>
    </div>
  );
}
