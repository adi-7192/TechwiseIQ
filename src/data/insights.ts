import type { ServiceId } from './services'

// Owner-approved 2026-10-04 (D-037). Source: docs/insights-drafts-2026-10-04.md.
// Inline markup: **strong**, *em*, `code`, [text](/internal-path), [n] = citation of sources[n-1].
export type Block =
  | { type: 'p'; text: string }
  | { type: 'h2'; text: string }
  | { type: 'ul' | 'ol'; items: string[] }
  | { type: 'table'; head: string[]; rows: string[][] }

export interface Insight {
  slug: string
  title: string
  dek: string
  service: ServiceId
  published: string
  body: Block[]
  closing?: string
  sources: { label: string; url: string }[]
}

export const INSIGHTS: Insight[] = [
  {
    slug: 'website-visits-no-enquiries',
    title: 'Visits, but no enquiries? Here\'s where they leave.',
    dek: 'Traffic is the easy part to measure. The leak is usually somewhere between "landed" and "got in touch". Here\'s what the research says about where it happens.',
    service: 'web',
    published: '2026-10-04',
    body: [
      { type: 'p', text: 'People decide fast. Nielsen Norman Group\'s analysis of page visits found that **the first 10 seconds** decide whether someone stays. Pages that survive that still lose most visitors within the next 20 seconds [1]. So your page gets about ten seconds to answer three questions: *what do you do, is it for me, and what do I do next?*' },
      { type: 'h2', text: 'Leak 1: the page is slow on a phone' },
      { type: 'p', text: 'Most of your visitors are on a phone. In the UAE, there are more mobile connections than people (**195%** of the population) [2].' },
      {
        type: 'ul',
        items: [
          'Google\'s mobile research found that **53%** of mobile visits are abandoned if a page takes longer than 3 seconds to load (2016 data) [3].',
          'Deloitte\'s study for Google (2020) found that a **0.1-second** faster mobile site lifted conversions by 8.4% for retail sites and 10.1% for travel sites [4].',
        ],
      },
      { type: 'p', text: 'Fast isn\'t a nice-to-have. It\'s the doorway.' },
      { type: 'h2', text: 'Leak 2: the visitor can\'t tell what you do' },
      { type: 'p', text: 'If the first screen talks about you ("Welcome to…", "We are a leading…") instead of their problem, the visitor has to work out whether they\'re in the right place. Most won\'t. The fix is plain words: say what you do, who it\'s for, and the next step, before they scroll.' },
      { type: 'h2', text: 'Leak 3: the form asks too much' },
      { type: 'p', text: 'HubSpot looked at about 40,000 landing pages (c. 2010). It found that conversions fell as forms got longer, and that **several text boxes or drop-downs** hurt the most. Extra single-line fields hurt far less [5]. Ask for what you need to reply, and nothing more.' },
      { type: 'h2', text: 'Leak 4: there\'s only one way to reach you' },
      { type: 'p', text: '**87.4%** of internet users in the UAE use WhatsApp [2]. Some people will never fill in a form, but they\'ll happily send a message. Offer the channel your customers already use, next to the form, not instead of it.' },
      { type: 'h2', text: 'Leak 5: the reply is slow' },
      { type: 'p', text: 'This one happens after the website, but it still loses the lead. In a Harvard Business Review study of 1.25 million sales leads (2011), firms that responded **within an hour** were nearly **7 times** as likely to qualify the lead as firms that waited even one more hour. Firms that waited a day or more did far worse [6].' },
      { type: 'h2', text: 'A 10-minute check you can do today' },
      {
        type: 'ol',
        items: [
          'Open your site on your phone, on mobile data. Count the seconds.',
          'Show the first screen to a friend for five seconds. Ask them what you do.',
          'Count your form fields. Remove one.',
          'Check whether WhatsApp or a phone number is visible without scrolling.',
          'Send your own form. Time how long the reply takes.',
        ],
      },
    ],
    closing: 'Want a second pair of eyes? The [free 20-minute bottleneck review](/bottleneck-review) is exactly this conversation.',
    sources: [
      {
        label: 'Nielsen Norman Group, "How Long Do Users Stay on Web Pages?"',
        url: 'https://www.nngroup.com/articles/how-long-do-users-stay-on-web-pages/',
      },
      {
        label: 'DataReportal, "Digital 2025: The United Arab Emirates"',
        url: 'https://datareportal.com/reports/digital-2025-united-arab-emirates',
      },
      {
        label: 'Think with Google, mobile site load time statistics',
        url: 'https://www.thinkwithgoogle.com/consumer-insights/consumer-trends/mobile-site-load-time-statistics/',
      },
      {
        label: 'Deloitte Digital for Google, "Milliseconds Make Millions"',
        url: 'https://web.dev/case-studies/milliseconds-make-millions',
      },
      {
        label: 'HubSpot (Dan Zarrella), "Which Types of Form Fields Lower Landing Page Conversions?"',
        url: 'https://blog.hubspot.com/blog/tabid/6307/bid/6746/which-types-of-form-fields-lower-landing-page-conversions.aspx',
      },
      {
        label: 'Oldroyd, McElheran & Elkington, "The Short Life of Online Sales Leads", Harvard Business Review (2011)',
        url: 'https://hbr.org/2011/03/the-short-life-of-online-sales-leads',
      },
    ],
  },
  {
    slug: 'who-owns-your-website',
    title: 'Who actually owns your website? Check before you need to.',
    dek: 'Your domain, hosting, code and logins are business assets. Many businesses only find out who controls them when they try to leave a supplier.',
    service: 'web',
    published: '2026-10-04',
    body: [
      { type: 'p', text: 'Here\'s how it usually goes. A designer offers a bundle: design, hosting and "we\'ll register the domain for you". It\'s convenient. Years later the relationship goes sour, or the designer disappears, and the business finds out the domain was registered **in the designer\'s name**.' },
      { type: 'p', text: 'This isn\'t rare. Domain Name Wire, an industry publication, has covered cases of web designers holding client domains "hostage" since at least 2008 [1]. One case from 2015: a Miami chef said his former web firm refused to release his domain after he cancelled the service [2].' },
      { type: 'h2', text: 'What it looks like from the inside' },
      {
        type: 'ul',
        items: [
          '**UK Business Forums, 2016:** a client wanted to move its .com domain away from a former designer. The designer held the domain in their own company\'s name, refused to release the transfer code, and asked for a fee even though the contract said moving was free. Other members pointed out something worse. Because the designer was the registered owner, even a completed transfer would not make the client the owner [3].',
          '**Hacker News, 2025:** a commenter described projects falling apart because one key thing was never moved into the organisation\'s name. "A common one is the domain name." Nobody notices until there\'s a falling-out [4].',
        ],
      },
      { type: 'h2', text: 'The five things you should own, in your name' },
      {
        type: 'table',
        head: ['Asset', 'What "owning it" means'],
        rows: [
          ['Domain name', 'You are the **registrant** (owner) at the registrar, on an account you control. Your supplier can be added as a technical contact.'],
          ['DNS', 'You can log in and see where your domain points.'],
          ['Hosting', 'The account is in your name, or your contract says it moves to you on request.'],
          ['Code and content', 'The contract says you own them once you\'ve paid, and you have a copy.'],
          ['Admin logins', 'You have admin access to the site, analytics, Google Business Profile and email, not just "a user".'],
        ],
      },
      { type: 'h2', text: 'A UAE note' },
      { type: 'p', text: '`.ae` domains are run by the .ae Domain Administration (.aeDA), which is part of the TDRA [5]. For `co.ae`, the name generally has to match a company or trademark that the registrant controls [5][6]. In other words, the registrant should be **your** business.' },
      { type: 'h2', text: 'What to do this week' },
      {
        type: 'ol',
        items: [
          'Look up your domain at your registrar. Whose name is on it?',
          'Ask your supplier, in writing, for a list of every account they set up for you.',
          'Make sure at least one person in your business has admin access to each one.',
          'Put the logins in a password manager the business owns, not one person\'s head.',
        ],
      },
      { type: 'p', text: 'None of this is about distrusting your supplier. Good suppliers are happy to do it, because it\'s how it should be set up anyway.' },
    ],
    sources: [
      {
        label: 'Domain Name Wire, "Web designers holding domain names hostage" (2008)',
        url: 'https://domainnamewire.com/2008/10/22/web-designers-holding-domain-names-hostage/',
      },
      {
        label: 'Domain Name Wire, "Miami chef alleges web designer is holding domain name hostage" (2015)',
        url: 'https://domainnamewire.com/2015/03/04/miami-chef-alleges-web-designer-is-holding-domain-name-hostage/',
      },
      {
        label: 'UK Business Forums, "Previous web designer holding my client\'s .com domain name" (2016)',
        url: 'https://www.ukbusinessforums.co.uk/threads/previous-web-designer-holding-my-clients-com-domain-name.359925/',
      },
      {
        label: 'Hacker News comment (2025-12-30)',
        url: 'https://news.ycombinator.com/item?id=46438571',
      },
      {
        label: 'Wikipedia, ".ae"',
        url: 'https://en.wikipedia.org/wiki/.ae',
      },
      {
        label: 'AE Server, ".ae domain name policy explained"',
        url: 'https://www.aeserver.com/ae-domain-name-policy-explained/',
      },
    ],
  },
  {
    slug: 'outgrowing-spreadsheets',
    title: 'Your business runs on a spreadsheet. Here\'s when that stops working.',
    dek: 'Spreadsheets are brilliant until they aren\'t. The trick is spotting the moment yours turns from a tool into a risk.',
    service: 'software',
    published: '2026-10-04',
    body: [
      { type: 'p', text: 'Let\'s be fair to spreadsheets first. They\'re cheap, flexible and everyone knows them. Plenty of good businesses run on one. A consultant on Hacker News summed up a decade of client work like this: the business world runs on "insanely complex spreadsheets", built from lots of small decisions that each made sense at the time [1].' },
      { type: 'p', text: 'The problem is that small errors are almost guaranteed.' },
      { type: 'h2', text: 'What the research says' },
      { type: 'p', text: 'Raymond Panko, who has studied spreadsheet errors for decades, reviewed audits of real spreadsheets used in organisations [2]:' },
      {
        type: 'ul',
        items: [
          '**94%** of the audited spreadsheets had errors.',
          'On average, **5.2%** of formula cells were wrong.',
          'Experience doesn\'t save you. In his lab studies, people with hundreds of hours of spreadsheet experience made errors at about the same rate as beginners.',
        ],
      },
      { type: 'p', text: 'And then there are limits nobody remembers until they hit them. In October 2020, **15,841** positive COVID-19 cases in England were left out of daily reports. Data was loaded into the old `.xls` Excel format, which stops at about 65,000 rows, and anything past the limit was silently dropped [3].' },
      { type: 'h2', text: 'Signs you\'ve outgrown it' },
      {
        type: 'ul',
        items: [
          '**One person is "the spreadsheet person"**, and things stop when they\'re on holiday.',
          '**The same data is typed in two places**, like the sheet and the invoice, or the sheet and WhatsApp.',
          '**There are versions:** `final.xlsx`, `final-v2.xlsx`, `final-USE-THIS.xlsx`.',
          '**You can\'t answer simple questions quickly**, like "how many orders are late?", without building a new tab.',
          '**Mistakes reach customers:** a wrong price, a missed delivery, a double booking.',
          '**Customer data is in it**, with no control over who can see or copy it.',
        ],
      },
      { type: 'h2', text: 'What "next" looks like' },
      { type: 'p', text: 'It doesn\'t have to be a big system. Often the right step is small:' },
      {
        type: 'ol',
        items: [
          '**Fix the input.** A simple form in front of the sheet stops bad data at the door.',
          '**Connect what\'s retyped.** If data moves by copy-paste, it can usually move by itself.',
          '**Replace the core.** When the sheet *is* the business process, a small custom app with proper permissions and history is often cheaper than the mistakes.',
        ],
      },
      { type: 'p', text: 'Keep the spreadsheet for what it\'s good at: thinking, modelling, one-off analysis. Just don\'t make it your database.' },
    ],
    closing: 'Not sure which step you\'re at? [Bring us the spreadsheet.](/contact)',
    sources: [
      {
        label: 'Hacker News comment (2017-06-07)',
        url: 'https://news.ycombinator.com/item?id=14508475',
      },
      {
        label: 'Panko, "What We Know About Spreadsheet Errors" (revised 2008)',
        url: 'https://arxiv.org/pdf/0802.3457',
      },
      {
        label: 'The Register, "Excel: Why using Microsoft\'s tool caused Covid-19 results to be lost" (2020)',
        url: 'https://www.theregister.com/2020/10/05/excel_england_coronavirus_contact_error/',
      },
    ],
  },
  {
    slug: 'build-or-buy-software',
    title: 'Build or buy? Software for a business that doesn\'t fit the box.',
    dek: '"There\'s an app for that" is usually true. Until your process is the thing that makes you different.',
    service: 'software',
    published: '2026-10-04',
    body: [
      { type: 'p', text: 'Most businesses shouldn\'t build most of their software. Accounting, payroll, email and file storage are solved problems, and someone has solved them better than you could afford to. Buy those.' },
      { type: 'p', text: 'The harder question is the work that\'s *yours*: how you quote, schedule, track jobs, or serve a customer in a way competitors don\'t.' },
      { type: 'h2', text: 'The case for buying' },
      {
        type: 'ul',
        items: [
          'It\'s ready today.',
          'Someone else fixes bugs and keeps it secure.',
          'If it\'s the standard way of working in your industry, fitting the tool is fine.',
        ],
      },
      { type: 'h2', text: 'Where buying quietly gets expensive' },
      { type: 'p', text: 'Subscriptions are easy to start and easy to forget. Zylo\'s SaaS Management Index tracks software use at larger companies. Its 2024 report found that only **49%** of the licences companies paid for were actually used [1]. Small businesses have fewer apps, but the same pattern shows up:' },
      {
        type: 'ul',
        items: [
          'Two tools that don\'t talk to each other, so someone retypes data between them.',
          'A "side spreadsheet" that fills the gap the app doesn\'t cover.',
          'Paying for the top plan to get one feature.',
        ],
      },
      { type: 'h2', text: 'The case for building' },
      { type: 'p', text: 'Build when the process **is** your edge, and every off-the-shelf tool forces you to change it or work around it.' },
      { type: 'p', text: 'The biggest risk with custom software isn\'t building. It\'s building **too much at once**. The Standish Group has tracked IT project outcomes for decades, and its CHAOS reports keep finding that small projects succeed far more often than large ones. In the 2012 data, projects under US$1 million in labour had a **76%** success rate, and large projects did much worse [2].' },
      { type: 'h2', text: 'The usual answer: both' },
      {
        type: 'ol',
        items: [
          '**Buy** the commodity tools.',
          '**Build** the one piece that\'s the core of how you work, and keep it small.',
          '**Connect** them, so data moves on its own and nobody retypes it.',
        ],
      },
      { type: 'p', text: 'A good partner should show you more than one way to solve it, including "just buy this app", and tell you which they\'d pick and why.' },
    ],
    closing: '[That\'s how we work](/services#engage): options with our recommendation, then you choose.',
    sources: [
      {
        label: 'Zylo, 2024 SaaS Management Index',
        url: 'https://zylo.com/news/2024-saas-management-index',
      },
      {
        label: 'Standish Group CHAOS report (2013 edition, 2012 data)',
        url: 'https://people.eecs.ku.edu/~saiedian/Teaching/811/Papers/Proj-Success-Failure/standish-2013-report.pdf',
      },
    ],
  },
  {
    slug: 'what-to-automate-with-ai',
    title: 'What to automate with AI, and what still needs a person.',
    dek: 'Nearly every company is "using AI". Far fewer are getting much out of it. The difference is usually *what* they chose to automate.',
    service: 'ai',
    published: '2026-10-04',
    body: [
      { type: 'h2', text: 'The gap between using and benefiting' },
      {
        type: 'ul',
        items: [
          'McKinsey\'s 2025 global survey: **88%** of organisations use AI regularly in at least one part of the business. Only **39%** report any impact on profit (EBIT), and most of those say it\'s under 5% [1].',
          'The US Census Bureau\'s business survey puts AI use across all US firms at about **17–20%** in late 2025 to mid-2026. It is higher at bigger firms [2].',
        ],
      },
      { type: 'p', text: 'So a lot of businesses are trying it. Fewer are getting results. Here\'s the pattern that tends to work.' },
      { type: 'h2', text: 'Good first candidates' },
      { type: 'p', text: 'Work that is **frequent, boring and checkable**:' },
      {
        type: 'ul',
        items: [
          'Sorting and tagging incoming email or enquiries.',
          'Pulling fields out of documents (invoices, forms, PDFs) into a system.',
          'Drafting routine replies and follow-ups for a person to approve.',
          'Summarising long threads or call notes.',
          'Turning one piece of content into several formats.',
        ],
      },
      { type: 'h2', text: 'Keep a person on these' },
      { type: 'p', text: 'Anything where a wrong answer **costs money, trust or legal trouble**: prices, refunds, policies, contracts, medical or legal advice, and anything sent to a customer without review.' },
      { type: 'p', text: 'Here\'s why this matters. In 2024, Air Canada\'s website chatbot told a grieving customer he could claim a bereavement discount after booking. The airline\'s actual policy said otherwise. A Canadian tribunal ruled that the airline was responsible for what its chatbot said. "It makes no difference whether the information comes from a static page or a chatbot" [3].' },
      { type: 'p', text: 'Your AI speaks for your business. Plan for it being wrong sometimes.' },
      { type: 'h2', text: 'How we do it ourselves' },
      { type: 'p', text: 'We don\'t have a client automation case study to show you yet. We do run our own business on these:' },
      {
        type: 'ul',
        items: [
          '**Gmail automation:** routine inbox handling runs on its own. A person still reviews anything that needs a reply.',
          '**Lead generation:** finding and qualifying prospects runs as a workflow. A person decides who we approach.',
          '**Customer outreach:** follow-ups are prepared and scheduled automatically. A person approves what gets sent.',
          '**Motion graphics from code:** edit a line, get a new cut.',
        ],
      },
      { type: 'p', text: 'The pattern is the same each time. The machine does the repetitive part, and a person makes the call.' },
      { type: 'h2', text: 'A simple test before you automate' },
      {
        type: 'ol',
        items: [
          'Does it happen at least weekly?',
          'Can you describe "done right" in a sentence?',
          'Can a person check the output in seconds?',
          'What happens if it\'s wrong once? If the answer is "a customer gets hurt", keep a person in the loop.',
        ],
      },
    ],
    sources: [
      {
        label: 'McKinsey, "The state of AI in 2025"',
        url: 'https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai',
      },
      {
        label: 'US Census Bureau, "Large Firms With at Least 20 Employees Biggest AI Users" (2026)',
        url: 'https://www.census.gov/library/stories/2026/05/ai-use-businesses.html',
      },
      {
        label: 'Moffatt v. Air Canada, 2024 BCCRT 149, as reported by Law360 Canada',
        url: 'https://www.law360.ca/ca/articles/1804075',
      },
    ],
  },
  {
    slug: 'ai-search-visibility',
    title: 'When your customers ask ChatGPT instead of Google.',
    dek: 'More people now get an answer without clicking a link. Here\'s what\'s actually changing, what isn\'t, and what\'s worth doing about it.',
    service: 'web',
    published: '2026-10-04',
    body: [
      { type: 'h2', text: 'What\'s changing' },
      {
        type: 'ul',
        items: [
          '**Fewer clicks when there\'s an AI summary.** Pew Research tracked the real browsing of 900 US adults in March 2025. When Google showed an AI summary, users clicked a regular result **8%** of the time, compared with **15%** without one. Only **1%** clicked a link inside the summary [1].',
          '**The top result loses clicks too.** Ahrefs compared 300,000 keywords. When an AI Overview appeared, the #1 result\'s click-through rate was **34.5%** lower [2].',
          '**AI assistants send traffic, and it\'s growing fast.** Similarweb counted **1.13 billion** referrals from AI platforms to the top 1,000 websites in June 2025, up **357%** in a year [3].',
        ],
      },
      { type: 'h2', text: 'What isn\'t changing' },
      { type: 'p', text: 'That growth is from a small base. In the same month, Google Search sent about **191 billion** referrals to the same sites [3]. Search still matters most.' },
      { type: 'p', text: 'And Google says there\'s no secret AI trick. To appear in AI Overviews, a page just has to be indexed and eligible to show in normal search with a snippet. "There are no additional technical requirements" [4].' },
      { type: 'h2', text: 'So what\'s worth doing' },
      { type: 'p', text: 'The basics now matter twice, because both search engines and AI assistants read them:' },
      {
        type: 'ol',
        items: [
          '**Say plainly what you do and where.** "Custom software for logistics firms in Dubai" beats "solutions that move you forward". AI answers quote clear sentences.',
          '**Answer real questions on your pages:** prices (if you publish them), process, timelines, areas served. Those are what people ask assistants.',
          '**Make it crawlable.** Real text, not text baked into images. Fast pages. A sitemap.',
          '**Structured data** (schema.org) so machines know your business name, location and services.',
          '**Be the same everywhere.** The same name, address and description on your site, Google Business Profile and directories.',
          '**Optional: `llms.txt`.** This is a proposed file that gives AI tools a plain summary of your site. It\'s cheap to add, but it\'s a proposal, not a standard, and no major engine has committed to using it. Don\'t pay anyone a premium for it.',
        ],
      },
      { type: 'p', text: 'Be wary of anyone promising "guaranteed ChatGPT rankings". Nobody can guarantee that.' },
    ],
    sources: [
      {
        label: 'Pew Research Center, "Google users are less likely to click on links when an AI summary appears in the results" (2025)',
        url: 'https://www.pewresearch.org/short-reads/2025/07/22/google-users-are-less-likely-to-click-on-links-when-an-ai-summary-appears-in-the-results/',
      },
      {
        label: 'Ahrefs, "AI Overviews Reduce Clicks by 34.5%" (2025)',
        url: 'https://ahrefs.com/blog/ai-overviews-reduce-clicks/',
      },
      {
        label: 'TechCrunch, "AI referrals to top websites were up 357% year-over-year in June, reaching 1.13B" (Similarweb data, 2025)',
        url: 'https://techcrunch.com/2025/07/25/ai-referrals-to-top-websites-were-up-357-year-over-year-in-june-reaching-1-13b/',
      },
      {
        label: 'Google Search Central, "AI features and your website"',
        url: 'https://developers.google.com/search/docs/appearance/ai-features',
      },
    ],
  },
]

export const getInsight = (slug: string) => INSIGHTS.find((i) => i.slug === slug)

const blockText = (b: Block) =>
  b.type === 'table'
    ? [...b.head, ...b.rows.flat()].join(' ')
    : 'items' in b
      ? b.items.join(' ')
      : b.text

export const readingMinutes = (i: Insight) =>
  Math.max(1, Math.round(i.body.map(blockText).join(' ').split(/\s+/).length / 200))
