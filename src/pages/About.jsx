import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight, BookOpen, Building2, Eye, Network, Rocket, ShieldCheck, Sparkles } from 'lucide-react';
import './About.css';

export default function About() {
  const { t } = useTranslation();

  const advantages = [
    { icon: ShieldCheck, title: t('about.adv1Title'), description: t('about.adv1Desc'), tone: 'green' },
    { icon: BookOpen, title: t('about.adv2Title'), description: t('about.adv2Desc'), tone: 'blue' },
    { icon: Network, title: t('about.adv3Title'), description: t('about.adv3Desc'), tone: 'orange' },
    { icon: Building2, title: t('about.adv4Title'), description: t('about.adv4Desc'), tone: 'green' },
  ];

  const phases = [
    { phase: t('about.app1Phase'), title: t('about.app1Title'), description: t('about.app1Desc'), tone: 'green' },
    { phase: t('about.app2Phase'), title: t('about.app2Title'), description: t('about.app2Desc'), tone: 'blue' },
    { phase: t('about.app3Phase'), title: t('about.app3Title'), description: t('about.app3Desc'), tone: 'orange' },
  ];


  const stats = [
    { value: '15', label: t('about.statStartups'), tone: 'green' },
    { value: '390', label: t('about.statCapital'), tone: 'blue' },
    { value: '131', label: t('about.statMentors'), tone: 'orange' },
  ];

  const teamProfiles = [
    {
      image: 'about/responsable-incubateur.jpg',
      badge: t('about.responsibleBadge'),
      name: t('about.responsibleName'),
      role: t('about.responsibleRole'),
      description: t('about.responsibleDescription'),
    },
    {
      image: 'about/incup2.jpg',
      badge: t('about.profileEntrepreneurshipBadge'),
      name: t('about.profileEntrepreneurshipName'),
      role: t('about.profileEntrepreneurshipRole'),
      description: t('about.profileEntrepreneurshipDescription'),
    },
    {
      image: 'about/incup3.jpg',
      badge: t('about.profileFablabBadge'),
      name: t('about.profileFablabName'),
      role: t('about.profileFablabRole'),
      description: t('about.profileFablabDescription'),
    },
  ];


  return (
    <main className="about-shell">
      <section className="about-hero">
        <div className="about-hero-orbit" />
        <h1>{t('about.title')}</h1>
        <p>{t('about.subtitle')}</p>
        <a href="#mission" className="about-hero-btn">{t('about.discoverMission')}</a>
      </section>

      <section id="mission" className="about-story-section">
        <div className="about-story-copy">
          <span>{t('about.section1Tag')}</span>
          <h2>{t('about.section1Title')}</h2>
          <p>{t('about.section1Text1')}</p>
          <p>{t('about.section1Text2')}</p>
        </div>
        <div className="about-story-media">
          <img src={`${import.meta.env.BASE_URL}events/Image2.jpeg`} alt={t('about.storyImageAlt')} />
        </div>
      </section>

      <section className="about-mission-grid">
        <article>
          <div><Rocket size={22} /></div>
          <h3>{t('about.mission')}</h3>
          <p>{t('about.missionText')}</p>
        </article>
        <article>
          <div><Eye size={22} /></div>
          <h3>{t('about.vision')}</h3>
          <p>{t('about.visionText')}</p>
        </article>
      </section>

      <section className="about-advantage-section">
        <header>
          <h2>{t('about.advantageTitle')}</h2>
          <p>{t('about.advantageSub')}</p>
        </header>
        <div className="about-advantage-grid">
          {advantages.map(({ icon: Icon, title, description, tone }) => (
            <article key={title} className={`about-mini-card ${tone}`}>
              <Icon size={18} />
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="about-approach-band">
        <h2>{t('about.approachTitle')}</h2>
        <div className="about-phase-grid">
          {phases.map((item) => (
            <article key={item.phase} className={item.tone}>
              <span>{item.phase}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="about-stats-grid">
        {stats.map((stat) => (
          <article key={stat.label} className={stat.tone}>
            <strong>{stat.value}</strong>
            <span>{stat.label}</span>
          </article>
        ))}
      </section>

      <section className="about-team-section">
        <h2>{t('about.teamTitle')}</h2>
        <div className="about-responsible-list">
          {teamProfiles.map((profile) => (
            <article className="about-responsible-card" key={profile.image}>
              <img
                src={`${import.meta.env.BASE_URL}${profile.image}`}
                alt={profile.name}
              />
              <div>
                <span>{profile.badge}</span>
                <h3>{profile.name}</h3>
                <p>{profile.role}</p>
                <small>{profile.description}</small>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="about-final-cta">
        <Sparkles size={22} />
        <h2>{t('about.ctaTitle')}</h2>
        <p>{t('about.ctaSub')}</p>
        <Link to="/submit">{t('about.ctaBtn')} <ArrowRight size={16} /></Link>
      </section>
    </main>
  );
}


