import { Note, NoteCategory } from "@/types/note";

// This is a placeholder - replace with your actual data source
// (Markdown files, CMS, database, etc.)
export const notes: Note[] = [
  {
    slug: "ghanaian-podcast-ecosystem-lens-podcaster",
    title: "The Ghanaian Podcast ecosystem in the lens of a Podcaster",
    category: "Podcasting",
    datePublished: "2019-08-03",
    featuredImage: "/images/notes/ghanaian-podcast-ecosystem.jpg",
    content: `
      <p>I originally submitted this article on September 6, 2017, and it was first published on <a href="https://www.ameyawdebrah.com" target="_blank" rel="noopener noreferrer">www.ameyawdebrah.com</a></p>
      
      <p>The revolution of private radio in Ghana started in early 1995 with a bold step by Kwasi Twum current CEO of Multimedia group to start the first private radio Joy FM which was followed by a few others and many joined to what we call an active and booming radio industry not just in influence but in revenue. And currently there is yet another rise in the audio production scene which industry experts predict might put some radio stations out of business and that is Podcasts.</p>
      
      <p>Podcasts are an episodic series of digital audio or video files which a user can download and listen to. And currently, there are over 20 podcasts episodes release every week in Ghana with three main podcast networks and others from Traditional Radio stations.</p>
      
      <h2>What are the advantages of podcasting over a traditional radio show</h2>
      
      <h3>Ease of consumption</h3>
      
      <p>There have been times I missed my favorite radio show and never had the chance to listen to it again but with the podcasting model one can listen to an episode at his or her own convenience and it is very flexible. So currently in Ghana, you have some Radio station hosting their own podcast network of the episode of their shows for listeners. This is the ease podcasts produce to listeners subscribing to your favorite podcast and listen/watching the show when you want to.</p>
      
      <h3>No tight broadcasting rules</h3>
      
      <p>If you are a 90's baby or young at heart just like myself sometimes traditional radio can get boring with all those rules, don't say this and don't play this music. Podcasting has technical no broadcasting borders that allow presenters to present issues just as it is and play the music that traditional radio shows wouldn't.</p>
      
      <h3>Quality information shared in real-time</h3>
      
      <p>Podcasts in Ghana are mostly not produced/presented by journalist but by Geeks who know a lot on the subject which they broadcast on and this gives them the opportunity to share the real experience you would hear on radio and moreover podcasts are very personal when the host speaks directly to listeners and there is a great sense of connection over traditional radio shows.</p>
      
      <h2>Who are the industry players of the Ghanaian podcast ecosystem?</h2>
      
      <h3>Podcast Networks</h3>
      
      <p>There are three major podcasting networks in Ghana Gold Coast Reporters in my view is the first Ghanaian Podcast network with currently 4 shows touching on entertainment, social issues, and sports. Accra we Dey radio is formed out of the famous Accra we dey podcasts, currently AWD radio has 3 podcasts on their networks and lastly is YA Media producers of Young and Ambitious Show currently they have 2 podcasts on their network.</p>
      
      <h3>Podcasters</h3>
      
      <p>Every country's podcast ecosystem is populated with Christian podcasts and Ghana is of no difference the major Christian podcasters are; Dag Heward-Mills of Dag Heward-Mills Podcasts Mensa Otabil of Mensah Otabil Podcast Eastwood Anaba of Eastwood Anaba podcast</p>
      
      <p>Aside Christianity we can move to self-development, entertainment, and business podcasters. Albert and Comfort Ocran of Springboard Zone Bernard Kelvin Clive of Personal Branding Podcast DJ Black of DJ BLACK'S Podcast Nana Ama Agyemang Asante of Unfiltered Dzigbordi of Conversations with Dzigbordi</p>
      
      <h3>Organizations</h3>
      
      <ul>
        <li>iSpace producers of E-Talk Radio</li>
        <li>Global Shapers Accra hub producers of Global Shapers Accra podcast</li>
        <li>Humanist Association of Ghana producers of Hagtivist Podcast</li>
      </ul>
      
      <h2>What does the future look like for podcasting in Ghana?</h2>
      
      <p>The biggest breakthrough in most industries is in revenue and subscription, looking at the stats of the rise of podcasts production in Ghana and the ease of production and consumption.</p>
      
      <p>By mid of 2018, there will be over 100+ Ghanaian produced podcasts with not less than 8 fully owned Ghanaian podcast networks. And more importantly, advertisers will be considering podcasts are a new avenue to get the marketing campaigns to their target audience while companies will be considering branded podcasts as a new way to top up their social media strategy and get their brand stories to the masses.</p>
    `,
    excerpt: "An exploration of the Ghanaian podcast ecosystem, its advantages over traditional radio, key industry players, and predictions for the future of podcasting in Ghana.",
  },
  {
    slug: "ghanaian-artiste-equipped-technology-tools-exposure",
    title: "The Ghanaian Artiste Is Equipped with Technology Tools for Exposure",
    category: "Music",
    datePublished: "2019-08-03",
    featuredImage: "/images/notes/ghanaian-artiste-technology-tools.jpg",
    content: `
      <p>Originally published on <a href="https://www.technovagh.com" target="_blank" rel="noopener noreferrer">www.technovagh.com</a> in January 2018, this piece explores how technology has reshaped music consumption in Ghana.</p>
      
      <p>Streaming platforms, social media, digital stores, and analytics tools have empowered Ghanaian musicians more than ever before. Today, an artist no longer needs a traditional record label to build a sustainable career.</p>
      
      <p>Key pillars include branding, new media, and digital distribution. Artists now own their platforms, distribute music globally via Apple Music and Spotify, leverage local platforms like Aftown and OnBarz, and use analytics to understand audiences.</p>
      
      <p>Technology has helped Ghanaian musicians overcome the "famous but broke" syndrome by enabling ownership, reach, and monetization.</p>
    `,
    excerpt: "Exploring how technology has reshaped music consumption in Ghana, empowering artists with streaming platforms, social media, and digital distribution tools.",
  },
];

export function getNoteBySlug(slug: string): Note | undefined {
  return notes.find((note) => note.slug === slug);
}

export function getAllNotes(): Note[] {
  return notes.sort(
    (a, b) =>
      new Date(b.datePublished).getTime() -
      new Date(a.datePublished).getTime()
  );
}

export function getNotesByCategory(category: NoteCategory): Note[] {
  return notes
    .filter((note) => note.category === category)
    .sort(
      (a, b) =>
        new Date(b.datePublished).getTime() -
        new Date(a.datePublished).getTime()
    );
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

