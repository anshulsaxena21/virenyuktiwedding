import React from "react";

const events = [
  ["मेहंदी", "Mehendi", "A joyful afternoon of colours, music and blessings."],
  ["संगीत", "Sangeet", "An evening of music, dance and celebration."],
  ["विवाह", "Shubh Vivah", "Together with our families, we invite you to celebrate our wedding."]
];

function Floral({ children }) {
  return <span className="floral">{children}</span>;
}

export default function App() {
  return <main className="invitation">
    <section className="hero">
      <div className="hero-sky" />
      <div className="hero-card">
        <p className="eyebrow">॥ शुभ विवाह ॥</p>
        <h1>Viren <em>&</em> Yukti</h1>
        <p className="hero-script">A celebration of love</p>
        <div className="couple-art" aria-hidden="true">♥</div>
        <p className="date">07 <small>·</small> 10 <small>·</small> 16</p>
        <p className="invite-line">Together with our families, we invite you</p>
        <a className="gold-button" href="#families">Save the date</a>
      </div>
    </section>
    <section className="blessing">
      <div className="ornate-frame">
        <p className="eyebrow">WITH THE BLESSINGS OF</p>
        <h2>Our beloved families</h2>
        <p>With grateful hearts and the blessings of our elders,</p>
        <p>we invite you to join us as we begin our forever.</p>
        <Floral>✿ ❧ ✿</Floral>
      </div>
    </section>
    <section id="families" className="section families">
      <p className="eyebrow">TWO FAMILIES, ONE CELEBRATION</p><h2>Our Families</h2>
      <div className="family-grid"><article><Floral>✿</Floral><h3>Groom's Family</h3><p>With love and blessings</p></article><article><Floral>✿</Floral><h3>Bride's Family</h3><p>With love and blessings</p></article></div>
    </section>
    <section className="section story">
      <p className="eyebrow">A JOURNEY TO FOREVER</p><h2>Our Love Story</h2>
      <div className="story-list">{[["How We Met","Every beautiful story has a beginning. Ours began with a moment that brought two hearts closer."],["Friends to Soulmates","From shared laughter to treasured memories, friendship blossomed into something beautiful."],["The Big Yes","A promise, a new beginning, and a lifetime of love waiting to unfold."]].map(([title,body],i)=><article className="story-card" key={title}><div className="story-number">0{i+1}</div><div><p className="eyebrow">CHAPTER {i+1}</p><h3>{title}</h3><p>{body}</p></div><Floral>✿</Floral></article>)}</div>
    </section>
    <section className="section save-date"><p className="eyebrow">MARK YOUR CALENDAR</p><h2>Save the Date</h2><div className="date-tile"><span>THE WEDDING CELEBRATION</span><strong>07 · 10 · 16</strong><small>Viren & Yukti</small></div></section>
    <section className="section journey"><p className="eyebrow">THE CELEBRATIONS</p><h2>Our Wedding Journey</h2><div className="event-list">{events.map(([hi,title,desc],i)=><article className="event" key={title}><div><span className="eyebrow">EVENT 0{i+1}</span><h3>{title}</h3><p className="hindi">{hi}</p><p>{desc}</p><span className="event-meta">Date & time to be announced</span></div><div className="event-seal">{hi}</div></article>)}</div></section>
    <section className="section gallery"><p className="eyebrow">MEMORIES IN THE MAKING</p><h2>Rituals & Portraits</h2><div className="gallery-grid">{["The celebration","Together","A new beginning","Family moments","The promise","Forever"].map((x,i)=><div className="gallery-placeholder" key={x}><span>✿</span><small>{x}</small></div>)}</div></section>
    <section className="section venues"><p className="eyebrow">WHERE WE CELEBRATE</p><h2>Venues</h2><div className="venue-grid"><article><span>⌖</span><h3>Our Home</h3><p>Family celebrations<br/>Venue details to follow</p></article><article><span>⌖</span><h3>Wedding Venue</h3><p>Shubh Vivah<br/>Venue details to follow</p></article></div></section>
    <footer><p className="eyebrow">॥ शुभ मंगल ॥</p><h2>Viren <em>&</em> Yukti</h2><p>Can't wait to celebrate with you</p><a className="gold-button" href="mailto:">Send us your wishes</a><small>MADE WITH LOVE · 2026</small></footer>
  </main>;
}
