/**
 * Quotes for the Legacy page, in three groups with honest provenance:
 *  - tributes: what others said about Dhoni, each with a portrait and where it is recorded;
 *  - ownWords: Dhoni's own lines, with the moment he said them;
 *  - fanCollection: the remaining lines from the original tribute, not independently sourced.
 */

export interface Tribute {
  text: string;
  author: string;
  /** Slug of a Commons portrait in /public/people, or null for initials. */
  portrait: string | null;
  role: string;
  provenance: string;
}

export const tributes: Tribute[] = [
  {
    text: 'If I die, the last thing I want to see is the six that Dhoni hit in the 2011 World Cup final.',
    author: 'Sunil Gavaskar',
    portrait: 'sunil-gavaskar',
    role: 'Former India captain, commentator',
    provenance: 'Said on air; widely reported',
  },
  {
    text: 'Dhoni is the best captain I have played under.',
    author: 'Sachin Tendulkar',
    portrait: 'sachin-tendulkar',
    role: 'Teammate, 2004–2013',
    provenance: 'Compiled on Wikiquote',
  },
  {
    text: 'It was nothing but lovely playing with you, @mahi7781. With my heart full of pride, I choose to join you in this journey. Thank you India. Jai Hind!',
    author: 'Suresh Raina',
    portrait: 'suresh-raina',
    role: 'Retiring minutes after him, 15 August 2020',
    provenance: 'Instagram, reported by ESPNcricinfo',
  },
  {
    text: 'He will always be my captain.',
    author: 'Virat Kohli',
    portrait: 'virat-kohli',
    role: 'Teammate and successor as captain',
    provenance: 'Widely reported',
  },
  {
    text: 'I would go to war with Dhoni by my side.',
    author: 'Gary Kirsten',
    portrait: 'gary-kirsten',
    role: 'India coach, 2008–2011',
    provenance: 'Compiled on Wikiquote',
  },
  {
    text: 'If 15 runs are needed off the last over, pressure is on the bowler, not on MS Dhoni.',
    author: 'Ian Bishop',
    portrait: null,
    role: 'Commentator, former West Indies fast bowler',
    provenance: 'Compiled on Wikiquote',
  },
  {
    text: 'If I am supposed to select a team, Sachin will be the opener and Dhoni will be the captain.',
    author: 'Steve Waugh',
    portrait: 'steve-waugh',
    role: 'Former Australia captain',
    provenance: 'Compiled on Wikiquote',
  },
  {
    text: 'Dhoni is the greatest captain of our country. His record is proof of that.',
    author: 'Sourav Ganguly',
    portrait: 'sourav-ganguly',
    role: 'Former India captain',
    provenance: 'Compiled on Wikiquote',
  },
  {
    text: 'If you want to learn batting, bat with MS Dhoni.',
    author: 'Ravindra Jadeja',
    portrait: 'ravindra-jadeja',
    role: 'Teammate for India and Chennai',
    provenance: 'Compiled on Wikiquote',
  },
  {
    text: 'The coolest man in world cricket, MS Dhoni delivers when it matters the most.',
    author: 'Michael Vaughan',
    portrait: 'michael-vaughan',
    role: 'Former England captain',
    provenance: 'Compiled on Wikiquote',
  },
  {
    text: 'MS Dhoni is the best captain I have ever seen.',
    author: 'Kevin Pietersen',
    portrait: 'kevin-pietersen',
    role: 'Former England captain',
    provenance: 'Compiled on Wikiquote',
  },
  {
    text: 'When you compare the icons of the game, you have Sunil Gavaskar, Kapil Dev, Sachin Tendulkar and Dhoni in the same bracket.',
    author: 'Ravi Shastri',
    portrait: 'ravi-shastri',
    role: 'Commentator, former India coach',
    provenance: 'Compiled on Wikiquote',
  },
  {
    text: 'Dhoni has the respect of all other playing nations. I’ve found him to be a really strong leader.',
    author: 'Glenn McGrath',
    portrait: 'glenn-mcgrath',
    role: 'Former Australia fast bowler',
    provenance: 'Compiled on Wikiquote',
  },
  {
    text: 'I’m really lucky to play under the leadership of MSD.',
    author: 'Michael Hussey',
    portrait: 'michael-hussey',
    role: 'Chennai Super Kings teammate',
    provenance: 'Compiled on Wikiquote',
  },
  {
    text: 'I am learning the ropes of captaincy from MS Dhoni.',
    author: 'Dwayne Bravo',
    portrait: 'dwayne-bravo',
    role: 'Chennai Super Kings teammate',
    provenance: 'Compiled on Wikiquote',
  },
  {
    text: 'Need a six in a pressure situation? Call MS Dhoni.',
    author: 'Ramiz Raja',
    portrait: 'ramiz-raja',
    role: 'Commentator, former Pakistan captain',
    provenance: 'Compiled on Wikiquote',
  },
  {
    text: 'India is lucky to have Dhoni as captain.',
    author: 'Tom Moody',
    portrait: 'tom-moody',
    role: 'Coach and commentator',
    provenance: 'Compiled on Wikiquote',
  },
  {
    text: 'No calmer finisher than Dhoni.',
    author: 'Harsha Bhogle',
    portrait: 'harsha-bhogle',
    role: 'Commentator',
    provenance: 'Compiled on Wikiquote',
  },
];

export interface OwnWords {
  text: string;
  when: string;
  context: string;
  provenance: string;
}

export const ownWords: OwnWords[] = [
  {
    text: 'Thanks a lot for ur love and support throughout. From 1929 hrs consider me as Retired.',
    when: '15 August 2020',
    context: 'The Instagram post that ended his international career.',
    provenance: 'Instagram',
  },
  {
    text: 'As of now, I am on national duty, so I think everything else can wait.',
    when: 'February 2015',
    context: 'Asked about missing the birth of his daughter Ziva while leading India at the World Cup in Australia.',
    provenance: 'Pre-tournament press conference',
  },
  {
    text: '…God helps those who help themselves. I said God is not coming to save us.',
    when: '2011 World Cup final',
    context: 'Recalling why he promoted himself above an in-form Yuvraj Singh in the chase at Wankhede.',
    provenance: 'Reported by Onmanorama',
  },
  {
    text: 'When you die, you die. You don’t think which is a better way to die.',
    when: '2011–12',
    context: 'Asked which Test whitewash hurt more, England or Australia.',
    provenance: 'Compiled on Wikiquote',
  },
  {
    text: 'Definitely not.',
    when: '1 November 2020',
    context: 'At the toss, when Danny Morrison asked if this could be his last game in yellow.',
    provenance: 'Live broadcast',
  },
  {
    text: 'The easy thing for me to say would be thank you very much, but the tough thing for me is to work hard for another nine months and play at least one more season.',
    when: '29 May 2023',
    context: 'After winning a fifth IPL title, explaining why he would not retire yet.',
    provenance: 'Post-final presentation, reported by Wisden',
  },
  {
    text: 'Till full stop doesn’t come, the sentence is not complete.',
    when: 'Mid-series',
    context: 'Asked whether India were already beaten in a series that was not over.',
    provenance: 'Compiled on Wikiquote',
  },
  {
    text: 'I have three dogs at home. Even after losing a series or winning a series, they treat me the same way.',
    when: 'On perspective',
    context: 'His answer to the noise that follows results.',
    provenance: 'Compiled on Wikiquote',
  },
  {
    text: 'It’s like having 100 kg put over you. After that, even if you put a mountain, it will not make any difference.',
    when: 'On pressure',
    context: 'Describing what the weight of captaincy feels like.',
    provenance: 'Compiled on Wikiquote',
  },
  {
    text: 'Frankly speaking, I don’t understand Duckworth-Lewis. I just wait for the umpire’s decision.',
    when: 'On rain rules',
    context: 'Deadpan, as ever.',
    provenance: 'Compiled on Wikiquote',
  },
];

export interface Quote {
  text: string;
  author: string;
}

/** Lines gathered for the original tribute. Not independently sourced; shown as a fan collection. */
export const fanCollection: Quote[] = [
  { text: 'Dhoni is my hero. He has as much talent as anyone in the game.', author: 'Kapil Dev' },
  { text: 'When he walks on the field, the opposition knows they are under pressure.', author: 'Ricky Ponting' },
  { text: 'He knows exactly what he is doing. He is a master tactician.', author: 'Graeme Smith' },
  { text: 'There is no one better than him in finishing games.', author: 'Mike Hussey' },
  { text: 'Dhoni finishes off in style! A magnificent strike into the crowd!', author: 'Ravi Shastri' },
  { text: 'He has the Midas touch. Whatever he touches turns to gold.', author: 'Nasser Hussain' },
  { text: 'He is a great leader. He gives you belief.', author: 'Shane Watson' },
  { text: 'The era of Dhoni is the greatest era of Indian cricket.', author: 'Matthew Hayden' },
  { text: 'He’s the best wicketkeeper-batsman the game has seen.', author: 'Adam Gilchrist' },
  { text: 'He is ice cool. Nothing fazes him.', author: 'VVS Laxman' },
  { text: 'He backs his players like no one else.', author: 'Rohit Sharma' },
  { text: 'My inspiration. My big brother.', author: 'Hardik Pandya' },
  { text: 'He told me to just enjoy my game.', author: 'Jasprit Bumrah' },
  { text: 'A bowler’s captain.', author: 'Zaheer Khan' },
  { text: 'He can read the game better than anyone.', author: 'Muttiah Muralitharan' },
  { text: 'He made us believe we can win anywhere.', author: 'Gautam Gambhir' },
  { text: 'The best finisher world cricket has ever seen.', author: 'Shoaib Akhtar' },
  { text: 'He doesn’t follow the textbook, he writes it.', author: 'Wasim Akram' },
  { text: 'Most dangerous batsman in death overs.', author: 'Sanath Jayasuriya' },
  { text: 'One of the greatest cricketing minds.', author: 'Stephen Fleming' },
  { text: 'He defines calm.', author: 'Faf du Plessis' },
  { text: 'I have never seen anyone so humble.', author: 'Hashim Amla' },
  { text: 'He is a legend. Pure and simple.', author: 'Brian Lara' },
  { text: 'He changed the face of Indian cricket.', author: 'Rahul Dravid' },
  { text: 'He taught me how to bowl in T20s.', author: 'Ravichandran Ashwin' },
  { text: 'He gives you freedom to express yourself.', author: 'Mohammed Shami' },
  { text: 'He knows what the batsman will do before he does it.', author: 'Kuldeep Yadav' },
  { text: 'He is my half bowler.', author: 'Yuzvendra Chahal' },
  { text: 'Unbelievable cricket brain.', author: 'Devon Conway' },
  { text: 'He treats everyone the same.', author: 'Ruturaj Gaikwad' },
  { text: 'Amazing human being.', author: 'Moeen Ali' },
  { text: 'Just his presence gives you confidence.', author: 'Sam Curran' },
  { text: 'Like a father figure to me.', author: 'Matheesha Pathirana' },
  { text: 'The way he manages pressure is a lesson for all.', author: 'Kane Williamson' },
  { text: 'He is the heartbeat of CSK.', author: 'N Srinivasan' },
  { text: 'A complete cricketer.', author: 'Jacques Kallis' },
  { text: 'He won everything there is to win.', author: 'Harsha Bhogle' },
  { text: 'Thala is an emotion.', author: 'Suresh Raina' },
];
