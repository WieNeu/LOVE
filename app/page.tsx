import Link from 'next/link';
import { ArrowRight, Sparkles, Heart, MessageCircle } from 'lucide-react';
import { StoryCard } from '@/components/story-card';
import { getFeaturedStories, getPopularStories } from '@/lib/data';

export default async function HomePage() {
  const [featured, popular] = await Promise.all([getFeaturedStories(3), getPopularStories(3)]);

  return (
    <>
      <section className="hero">
        <div className="container hero-inner">
          <div>
            <div className="eyebrow"><Sparkles size={16} /> Eine ruhige Community für ehrliche Geschichten</div>
            <h1>Erzähl deine Geschichte.</h1>
            <p>Manche Geschichten bleiben im Kopf. Manche im Herzen. Und manche müssen einfach raus.</p>

            <div className="hero-actions">
              <Link href="/write" className="button primary">
                Meine Geschichte erzählen
              </Link>
              <Link href="/stories" className="button ghost">
                Geschichten lesen
              </Link>
            </div>

            <div className="hero-note">Anonym. Echt. Ohne Urteil.</div>
          </div>

          <div className="float-card">
            <div className="story-preview-panel">
              <div className="story-token">
                <div>
                  <div className="muted">Heute erzählt</div>
                  <strong>„Ich habe drei Jahre auf sie gewartet.“</strong>
                </div>
                <Heart size={18} color="#9f4f5d" />
              </div>
              <div className="story-token">
                <div>
                  <div className="muted">von Herzsucher23</div>
                  <strong>Liebeskummer</strong>
                </div>
                <MessageCircle size={18} color="#9f4f5d" />
              </div>
              <div className="story-token">
                <div>
                  <div className="muted">„Manchmal merkt man erst viel zu spät…“</div>
                  <strong>❤️ 124 · 💬 18</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2>Heute erzählt</h2>
          </div>
          <div className="grid grid-three">
            {featured.map((story) => (
              <StoryCard key={story.id} story={story} />
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2>Die beliebtesten Geschichten</h2>
          </div>
          <div className="grid grid-three">
            {popular.map((story) => (
              <StoryCard key={story.id} story={story} />
            ))}
          </div>
        </div>
      </section>

      <section className="container cta-band">
        <div className="cta-band-inner">
          <div>
            <h3>Vielleicht findest du dich in einer anderen Geschichte wieder.</h3>
            <p className="muted">Zufällige Geschichten öffnen neue Perspektiven – manchmal genau da, wo du sie brauchst.</p>
          </div>
          <Link href="/stories/random" className="button primary">
            Zufällige Geschichte lesen <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </>
  );
}
