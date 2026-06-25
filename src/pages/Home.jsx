import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight, BookOpen, Building2, ChevronLeft, ChevronRight, CircleDot, Network, Play, Quote, ShieldCheck, Sparkles } from 'lucide-react';
import './Home.css';

const partners = ['INJAZ AL MAGHRIB', 'YEEP', 'HULT PRIZE', 'BIODIVERSITÉ', 'CLUSTER OUM RABII'];
const heroSlides = [
  `${import.meta.env.BASE_URL}events/Image1.jpeg`,
  `${import.meta.env.BASE_URL}events/Image2.jpeg`,
  `${import.meta.env.BASE_URL}events/image3.jpeg`,
  `${import.meta.env.BASE_URL}events/image4.jpeg`,
  `${import.meta.env.BASE_URL}events/image5.jpeg`,
  `${import.meta.env.BASE_URL}events/image6.jpeg`,
  `${import.meta.env.BASE_URL}events/image7.jpeg`,
];

export default function Home() {
  const { t } = useTranslation();
  const [heroSlide, setHeroSlide] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setHeroSlide((current) => (current + 1) % heroSlides.length);
    }, 4500);

    return () => window.clearInterval(timer);
  }, []);

  const changeHeroSlide = (direction) => {
    setHeroSlide((current) => (current + direction + heroSlides.length) % heroSlides.length);
  };

  const offers = [
    { icon: ShieldCheck, title: t('home.offerMentorship'), description: t('home.offerMentorshipDesc') },
    { icon: BookOpen, title: t('home.offerTraining'), description: t('home.offerTrainingDesc') },
    { icon: Network, title: t('home.offerNetworking'), description: t('home.offerNetworkingDesc') },
    { icon: Building2, title: t('home.offerWorkspace'), description: t('home.offerWorkspaceDesc') },
  ];

  const timeline = [
    { number: '1', title: t('home.timelineSubmit'), description: t('home.timelineSubmitDesc') },
    { number: '2', title: t('home.timelineReview'), description: t('home.timelineReviewDesc') },
    { number: '3', title: t('home.timelineImprove'), description: t('home.timelineImproveDesc') },
    { number: '4', title: t('home.timelineLaunch'), description: t('home.timelineLaunchDesc') },
  ];

  const programs = [
    { tag: t('home.seedFund'), title: t('home.prog1Title'), description: t('home.prog1Desc'), tone: 'green' },
    { tag: t('home.equity'), title: t('home.prog2Title'), description: t('home.prog2Desc'), tone: 'blue' },
    { tag: t('home.yield'), title: t('home.prog3Title'), description: t('home.prog3Desc'), tone: 'orange' },
  ];

  const stats = [
    { value: '390', label: t('home.statsActive') },
    { value: '200', label: t('home.statsExits') },
    { value: '131', label: t('home.statsEntrepreneurs') },
  ];

  return (
    <main className="home-shell">
      <section className="home-hero">
        <div className="home-hero-slides" aria-hidden="true">
          {heroSlides.map((image, index) => (
            <div
              key={image}
              className={`home-hero-slide ${index === heroSlide ? 'active' : ''}`}
              style={{ backgroundImage: `url('${image}')` }}
            />
          ))}
        </div>
        <div className="home-hero-glow" />
        <div className="home-badge"><Sparkles size={13} /> {t('home.badge')}</div>
        <h1>
          {t('home.heroTitle1')}
          <span>{t('home.heroTitle2')}</span>
        </h1>
        <p>{t('home.heroSubtitle')}</p>
        <div className="home-hero-actions">
          <Link to="/submit" className="home-primary-btn">{t('home.submitIdea')}</Link>
          <Link to="/opportunities" className="home-outline-btn">{t('home.explorePrograms')}</Link>
        </div>
        <div className="home-hero-slider-controls" aria-label={t('home.heroSliderControls')}>
          <button type="button" onClick={() => changeHeroSlide(-1)} aria-label={t('home.previousSlide')}>
            <ChevronLeft size={18} />
          </button>
          <div>
            {heroSlides.map((image, index) => (
              <button
                key={`home-dot-${image}`}
                type="button"
                className={index === heroSlide ? 'active' : ''}
                onClick={() => setHeroSlide(index)}
                aria-label={`${t('home.goToSlide')} ${index + 1}`}
                aria-current={index === heroSlide ? 'true' : undefined}
              />
            ))}
          </div>
          <button type="button" onClick={() => changeHeroSlide(1)} aria-label={t('home.nextSlide')}>
            <ChevronRight size={18} />
          </button>
        </div>

        <div className="home-product-frame" aria-hidden="true">
          <div className="home-product-window">
            <div className="home-product-tabs">
              {[t('home.windowTabInjaz'), t('home.windowTabYeep'), t('home.windowTabHult'), t('home.windowTabSmart'), t('home.windowTabCan')].map((item) => <span key={item}>{item}</span>)}
            </div>
            <div className="home-product-metrics">
              {['390', '200', '131', '15'].map((item) => <strong key={item}>{item}</strong>)}
              <CircleDot size={18} />
            </div>
            <div className="home-product-row">
              <div><span>{t('home.windowSensitization')}</span><small>{t('home.windowSensitized')}</small><small>{t('home.windowTrained')}</small></div>
              <div className="home-bars"><i /><i /><i /><i /></div>
              <span>390</span>
            </div>
            <div className="home-product-row is-wide">
              <div><span>{t('home.windowSupport')}</span><small>{t('home.windowProjects')}</small><small>{t('home.windowWebsites')}</small></div>
              <div className="home-line" />
              <span>131</span>
            </div>
          </div>
        </div>
      </section>

      <section className="home-partners">
        <p>{t('home.partnersTitle')}</p>
        <div>{partners.map((partner) => <span key={partner}>{partner}</span>)}</div>
      </section>

      <section className="home-section home-offer">
        <header>
          <h2>{t('home.whatWeOfferTitle')}</h2>
          <p>{t('home.whatWeOfferSub')}</p>
        </header>
        <div className="home-offer-grid">
          {offers.map(({ icon: Icon, title, description }) => (
            <article key={title} className="home-offer-card">
              <div><Icon size={20} /></div>
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="home-timeline-band">
        <h2>{t('home.timelineTitle')}</h2>
        <div className="home-timeline">
          {timeline.map((step) => (
            <article key={step.number}>
              <span>{step.number}</span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="home-section">
        <header><h2>{t('home.eliteProgramsTitle')}</h2></header>
        <div className="home-program-grid">
          {programs.map((program, index) => (
            <article key={program.title} className="home-program-card">
              <div className={`home-program-visual visual-${index + 1}`}>
                <Play size={22} />
                <span className={`home-program-tag ${program.tone}`}>{program.tag}</span>
              </div>
              <div className="home-program-body">
                <h3>{program.title}</h3>
                <p>{program.description}</p>
                <Link to="/opportunities">{t('home.learnMore')} <ArrowRight size={14} /></Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="home-stats">
        {stats.map((stat) => <div key={stat.label}><strong>{stat.value}</strong><span>{stat.label}</span></div>)}
      </section>

      <section className="home-testimonial">
        <div>
          <h2>{t('home.quoteTitle')}</h2>
          <p>{t('home.quoteSub')}</p>
          <div className="home-slider-controls"><button><ChevronLeft size={16} /></button><button><ChevronRight size={16} /></button></div>
        </div>
        <article>
          <Quote size={42} />
          <p>“{t('home.quoteText')}”</p>
          <div><span>{t('home.quoteInitials')}</span><div><strong>{t('home.quoteAuthor')}</strong><small>{t('home.quoteRole')}</small></div></div>
        </article>
      </section>

      <section className="home-final-cta">
        <h2>{t('home.startJourney')}</h2>
        <p>{t('home.startJourneySub')}</p>
        <Link to="/submit">{t('home.submitIdea')}</Link>
      </section>
    </main>
  );
}
