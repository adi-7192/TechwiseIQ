# Insights drafts — ROADMAP 5.2 (owner review)

**Status:** drafts, 2026-10-04. Not on the site. Approve, edit or reject each article.
Research done 2026-10-04. Every number links to its source, and each one gives its year, because
some of the classic studies are old. Community voices are paraphrased, never quoted with usernames.

**Honesty rules used (D-002):**
- No client results, stats or stories that aren't already approved.
- Our own automations are described only in the words already approved on `/services/ai`.
- Any line that says what *we* do is marked **[OWNER]** and needs your OK.
- No prices (D-003). Voice: D-035.

**Research limits:**
- Reddit blocks our research tools, so no Reddit threads are used.
- Community experience comes from Hacker News and UK Business Forums instead.
- If you have Reddit threads you want cited, send the links and I'll read them.

**Byline:** "Techwise IQ team" (D-005: no names).

| # | Title | Slug | Service it supports |
|---|---|---|---|
| 1 | Visits, but no enquiries? Here's where they leave. | `website-visits-no-enquiries` | Websites |
| 2 | Who actually owns your website? Check before you need to. | `who-owns-your-website` | Websites |
| 3 | Your business runs on a spreadsheet. Here's when that stops working. | `outgrowing-spreadsheets` | Software |
| 4 | Build or buy? Software for a business that doesn't fit the box. | `build-or-buy-software` | Software |
| 5 | What to automate with AI, and what still needs a person. | `what-to-automate-with-ai` | AI |
| 6 | When your customers ask ChatGPT instead of Google. | `ai-search-visibility` | Websites / search |

---

## 1. Visits, but no enquiries? Here's where they leave.

**Dek:** Traffic is the easy part to measure. The leak is usually somewhere between "landed" and
"got in touch". Here's what the research says about where it happens.

People decide fast. Nielsen Norman Group's analysis of page visits found that **the first 10
seconds** decide whether someone stays. Pages that survive that still lose most visitors within
the next 20 seconds [1]. So your page gets about ten seconds to answer three questions: *what do you do,
is it for me, and what do I do next?*

### Leak 1: the page is slow on a phone

Most of your visitors are on a phone. In the UAE, there are more mobile connections than people
(**195%** of the population) [2].

- Google's mobile research found that **53%** of mobile visits are abandoned if a page takes longer
  than 3 seconds to load (2016 data) [3].
- Deloitte's study for Google (2020) found that a **0.1-second** faster mobile site lifted conversions
  by 8.4% for retail sites and 10.1% for travel sites [4].

Fast isn't a nice-to-have. It's the doorway.

### Leak 2: the visitor can't tell what you do

If the first screen talks about you ("Welcome to…", "We are a leading…") instead of their problem,
the visitor has to work out whether they're in the right place. Most won't. The fix is plain words:
say what you do, who it's for, and the next step, before they scroll.

### Leak 3: the form asks too much

HubSpot looked at about 40,000 landing pages (c. 2010). It found that conversions fell as forms got
longer, and that **several text boxes or drop-downs** hurt the most. Extra single-line fields hurt
far less [5]. Ask for what you need to reply, and nothing more.

### Leak 4: there's only one way to reach you

**87.4%** of internet users in the UAE use WhatsApp [2]. Some people will never fill in a form, but
they'll happily send a message. Offer the channel your customers already use, next to the form, not
instead of it.

### Leak 5: the reply is slow

This one happens after the website, but it still loses the lead. In a Harvard Business Review study
of 1.25 million sales leads (2011), firms that responded **within an hour** were nearly **7 times**
as likely to qualify the lead as firms that waited even one more hour. Firms that waited a day or
more did far worse [6].

### A 10-minute check you can do today

1. Open your site on your phone, on mobile data. Count the seconds.
2. Show the first screen to a friend for five seconds. Ask them what you do.
3. Count your form fields. Remove one.
4. Check whether WhatsApp or a phone number is visible without scrolling.
5. Send your own form. Time how long the reply takes.

**[OWNER]** Closing line: "Want a second pair of eyes? The [free 20-minute bottleneck review](/bottleneck-review)
is exactly this conversation."

**Sources**
1. Nielsen Norman Group, "How Long Do Users Stay on Web Pages?" — https://www.nngroup.com/articles/how-long-do-users-stay-on-web-pages/
2. DataReportal, "Digital 2025: The United Arab Emirates" — https://datareportal.com/reports/digital-2025-united-arab-emirates
3. Think with Google, mobile site load time statistics — https://www.thinkwithgoogle.com/consumer-insights/consumer-trends/mobile-site-load-time-statistics/
4. Deloitte Digital for Google, "Milliseconds Make Millions" — https://web.dev/case-studies/milliseconds-make-millions
5. HubSpot (Dan Zarrella), "Which Types of Form Fields Lower Landing Page Conversions?" — https://blog.hubspot.com/blog/tabid/6307/bid/6746/which-types-of-form-fields-lower-landing-page-conversions.aspx
6. Oldroyd, McElheran & Elkington, "The Short Life of Online Sales Leads", Harvard Business Review (2011) — https://hbr.org/2011/03/the-short-life-of-online-sales-leads

---

## 2. Who actually owns your website? Check before you need to.

**Dek:** Your domain, hosting, code and logins are business assets. Many businesses only find out
who controls them when they try to leave a supplier.

Here's how it usually goes. A designer offers a bundle: design, hosting and "we'll register the domain
for you". It's convenient. Years later the relationship goes sour, or the designer disappears, and
the business finds out the domain was registered **in the designer's name**.

This isn't rare. Domain Name Wire, an industry publication, has covered cases of web designers
holding client domains "hostage" since at least 2008 [1]. One case from 2015: a Miami chef said his
former web firm refused to release his domain after he cancelled the service [2].

### What it looks like from the inside

- **UK Business Forums, 2016:** a client wanted to move its .com domain away from a former designer.
  The designer held the domain in their own company's name, refused to release the transfer code,
  and asked for a fee even though the contract said moving was free. Other members pointed out
  something worse. Because the designer was the registered owner, even a completed transfer would
  not make the client the owner [3].
- **Hacker News, 2025:** a commenter described projects falling apart because one key thing was
  never moved into the organisation's name. "A common one is the domain name." Nobody notices
  until there's a falling-out [4].

### The five things you should own, in your name

| Asset | What "owning it" means |
|---|---|
| Domain name | You are the **registrant** (owner) at the registrar, on an account you control. Your supplier can be added as a technical contact. |
| DNS | You can log in and see where your domain points. |
| Hosting | The account is in your name, or your contract says it moves to you on request. |
| Code and content | The contract says you own them once you've paid, and you have a copy. |
| Admin logins | You have admin access to the site, analytics, Google Business Profile and email, not just "a user". |

### A UAE note

`.ae` domains are run by the .ae Domain Administration (.aeDA), which is part of the TDRA [5]. For
`co.ae`, the name generally has to match a company or trademark that the registrant controls [5][6].
In other words, the registrant should be **your** business.

### What to do this week

1. Look up your domain at your registrar. Whose name is on it?
2. Ask your supplier, in writing, for a list of every account they set up for you.
3. Make sure at least one person in your business has admin access to each one.
4. Put the logins in a password manager the business owns, not one person's head.

None of this is about distrusting your supplier. Good suppliers are happy to do it, because it's
how it should be set up anyway.

**[OWNER]** Optional closing line about us: "When we hand over a project, the accounts are in your
name and you get the logins." Only if this is always true.

**Sources**
1. Domain Name Wire, "Web designers holding domain names hostage" (2008) — https://domainnamewire.com/2008/10/22/web-designers-holding-domain-names-hostage/
2. Domain Name Wire, "Miami chef alleges web designer is holding domain name hostage" (2015) — https://domainnamewire.com/2015/03/04/miami-chef-alleges-web-designer-is-holding-domain-name-hostage/
3. UK Business Forums, "Previous web designer holding my client's .com domain name" (2016) — https://www.ukbusinessforums.co.uk/threads/previous-web-designer-holding-my-clients-com-domain-name.359925/
4. Hacker News comment (2025-12-30) — https://news.ycombinator.com/item?id=46438571
5. Wikipedia, ".ae" — https://en.wikipedia.org/wiki/.ae
6. AE Server, ".ae domain name policy explained" — https://www.aeserver.com/ae-domain-name-policy-explained/

---

## 3. Your business runs on a spreadsheet. Here's when that stops working.

**Dek:** Spreadsheets are brilliant until they aren't. The trick is spotting the moment yours turns
from a tool into a risk.

Let's be fair to spreadsheets first. They're cheap, flexible and everyone knows them. Plenty of good
businesses run on one. A consultant on Hacker News summed up a decade of client work like this: the
business world runs on "insanely complex spreadsheets", built from lots of small decisions that each
made sense at the time [1].

The problem is that small errors are almost guaranteed.

### What the research says

Raymond Panko, who has studied spreadsheet errors for decades, reviewed audits of real
spreadsheets used in organisations [2]:

- **94%** of the audited spreadsheets had errors.
- On average, **5.2%** of formula cells were wrong.
- Experience doesn't save you. In his lab studies, people with hundreds of hours of spreadsheet
  experience made errors at about the same rate as beginners.

And then there are limits nobody remembers until they hit them. In October 2020, **15,841** positive
COVID-19 cases in England were left out of daily reports. Data was loaded into the old `.xls` Excel
format, which stops at about 65,000 rows, and anything past the limit was silently dropped [3].

### Signs you've outgrown it

- **One person is "the spreadsheet person"**, and things stop when they're on holiday.
- **The same data is typed in two places**, like the sheet and the invoice, or the sheet and WhatsApp.
- **There are versions:** `final.xlsx`, `final-v2.xlsx`, `final-USE-THIS.xlsx`.
- **You can't answer simple questions quickly**, like "how many orders are late?", without building
  a new tab.
- **Mistakes reach customers:** a wrong price, a missed delivery, a double booking.
- **Customer data is in it**, with no control over who can see or copy it.

### What "next" looks like

It doesn't have to be a big system. Often the right step is small:

1. **Fix the input.** A simple form in front of the sheet stops bad data at the door.
2. **Connect what's retyped.** If data moves by copy-paste, it can usually move by itself.
3. **Replace the core.** When the sheet *is* the business process, a small custom app with
   proper permissions and history is often cheaper than the mistakes.

Keep the spreadsheet for what it's good at: thinking, modelling, one-off analysis. Just don't make it
your database.

**[OWNER]** Closing line: "Not sure which step you're at? Bring us the spreadsheet." → `/contact`

**Sources**
1. Hacker News comment (2017-06-07) — https://news.ycombinator.com/item?id=14508475
2. Panko, "What We Know About Spreadsheet Errors" (revised 2008) — https://arxiv.org/pdf/0802.3457
3. The Register, "Excel: Why using Microsoft's tool caused Covid-19 results to be lost" (2020) — https://www.theregister.com/2020/10/05/excel_england_coronavirus_contact_error/

---

## 4. Build or buy? Software for a business that doesn't fit the box.

**Dek:** "There's an app for that" is usually true. Until your process is the thing that makes you
different.

Most businesses shouldn't build most of their software. Accounting, payroll, email and file storage
are solved problems, and someone has solved them better than you could afford to. Buy those.

The harder question is the work that's *yours*: how you quote, schedule, track jobs, or serve a
customer in a way competitors don't.

### The case for buying

- It's ready today.
- Someone else fixes bugs and keeps it secure.
- If it's the standard way of working in your industry, fitting the tool is fine.

### Where buying quietly gets expensive

Subscriptions are easy to start and easy to forget. Zylo's SaaS Management Index tracks software
use at larger companies. Its 2024 report found that only **49%** of the licences companies paid for
were actually used [1]. Small businesses have fewer apps, but the same pattern shows up:

- Two tools that don't talk to each other, so someone retypes data between them.
- A "side spreadsheet" that fills the gap the app doesn't cover.
- Paying for the top plan to get one feature.

### The case for building

Build when the process **is** your edge, and every off-the-shelf tool forces you to change it or
work around it.

The biggest risk with custom software isn't building. It's building **too much at once**. The
Standish Group has tracked IT project outcomes for decades, and its CHAOS reports keep finding that
small projects succeed far more often than large ones. In the 2012 data, projects under US$1 million
in labour had a **76%** success rate, and large projects did much worse [2].

### The usual answer: both

1. **Buy** the commodity tools.
2. **Build** the one piece that's the core of how you work, and keep it small.
3. **Connect** them, so data moves on its own and nobody retypes it.

A good partner should show you more than one way to solve it, including "just buy this app", and
tell you which they'd pick and why.

**[OWNER]** Closing line: "That's how we work: options with our recommendation, then you choose."
→ `/services#engage` (D-033).

**Sources**
1. Zylo, 2024 SaaS Management Index — https://zylo.com/news/2024-saas-management-index
2. Standish Group CHAOS report (2013 edition, 2012 data) — https://people.eecs.ku.edu/~saiedian/Teaching/811/Papers/Proj-Success-Failure/standish-2013-report.pdf

---

## 5. What to automate with AI, and what still needs a person.

**Dek:** Nearly every company is "using AI". Far fewer are getting much out of it. The difference is
usually *what* they chose to automate.

### The gap between using and benefiting

- McKinsey's 2025 global survey: **88%** of organisations use AI regularly in at least one part of
  the business. Only **39%** report any impact on profit (EBIT), and most of those say it's under 5% [1].
- The US Census Bureau's business survey puts AI use across all US firms at about **17–20%** in late
  2025 to mid-2026. It is higher at bigger firms [2].

So a lot of businesses are trying it. Fewer are getting results. Here's the pattern that tends to work.

### Good first candidates

Work that is **frequent, boring and checkable**:
- Sorting and tagging incoming email or enquiries.
- Pulling fields out of documents (invoices, forms, PDFs) into a system.
- Drafting routine replies and follow-ups for a person to approve.
- Summarising long threads or call notes.
- Turning one piece of content into several formats.

### Keep a person on these

Anything where a wrong answer **costs money, trust or legal trouble**: prices, refunds, policies,
contracts, medical or legal advice, and anything sent to a customer without review.

Here's why this matters. In 2024, Air Canada's website chatbot told a grieving customer he could
claim a bereavement discount after booking. The airline's actual policy said otherwise. A Canadian
tribunal ruled that the airline was responsible for what its chatbot said. "It makes no difference
whether the information comes from a static page or a chatbot" [3].

Your AI speaks for your business. Plan for it being wrong sometimes.

### How we do it ourselves

We don't have a client automation case study to show you yet. We do run our own business on these
(this is the wording approved on `/services/ai`):
- **Gmail automation:** routine inbox handling runs on its own. A person still reviews anything that
  needs a reply.
- **Lead generation:** finding and qualifying prospects runs as a workflow. A person decides who we
  approach.
- **Customer outreach:** follow-ups are prepared and scheduled automatically. A person approves what
  gets sent.
- **Motion graphics from code:** edit a line, get a new cut.

The pattern is the same each time. The machine does the repetitive part, and a person makes the call.

### A simple test before you automate

1. Does it happen at least weekly?
2. Can you describe "done right" in a sentence?
3. Can a person check the output in seconds?
4. What happens if it's wrong once? If the answer is "a customer gets hurt", keep a person in the loop.

**Sources**
1. McKinsey, "The state of AI in 2025" — https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai
2. US Census Bureau, "Large Firms With at Least 20 Employees Biggest AI Users" (2026) — https://www.census.gov/library/stories/2026/05/ai-use-businesses.html
3. Moffatt v. Air Canada, 2024 BCCRT 149, as reported by Law360 Canada — https://www.law360.ca/ca/articles/1804075

---

## 6. When your customers ask ChatGPT instead of Google.

**Dek:** More people now get an answer without clicking a link. Here's what's actually changing,
what isn't, and what's worth doing about it.

### What's changing

- **Fewer clicks when there's an AI summary.** Pew Research tracked the real browsing of 900 US
  adults in March 2025. When Google showed an AI summary, users clicked a regular result **8%** of
  the time, compared with **15%** without one. Only **1%** clicked a link inside the summary [1].
- **The top result loses clicks too.** Ahrefs compared 300,000 keywords. When an AI Overview
  appeared, the #1 result's click-through rate was **34.5%** lower [2].
- **AI assistants send traffic, and it's growing fast.** Similarweb counted **1.13 billion**
  referrals from AI platforms to the top 1,000 websites in June 2025, up **357%** in a year [3].

### What isn't changing

That growth is from a small base. In the same month, Google Search sent about **191 billion**
referrals to the same sites [3]. Search still matters most.

And Google says there's no secret AI trick. To appear in AI Overviews, a page just has to be indexed
and eligible to show in normal search with a snippet. "There are no additional technical
requirements" [4].

### So what's worth doing

The basics now matter twice, because both search engines and AI assistants read them:
1. **Say plainly what you do and where.** "Custom software for logistics firms in Dubai" beats
   "solutions that move you forward". AI answers quote clear sentences.
2. **Answer real questions on your pages:** prices (if you publish them), process, timelines, areas
   served. Those are what people ask assistants.
3. **Make it crawlable.** Real text, not text baked into images. Fast pages. A sitemap.
4. **Structured data** (schema.org) so machines know your business name, location and services.
5. **Be the same everywhere.** The same name, address and description on your site, Google Business
   Profile and directories.
6. **Optional: `llms.txt`.** This is a proposed file that gives AI tools a plain summary of your site.
   It's cheap to add, but it's a proposal, not a standard, and no major engine has committed to using
   it. Don't pay anyone a premium for it.

Be wary of anyone promising "guaranteed ChatGPT rankings". Nobody can guarantee that.

**[OWNER]** Closing line: "We build search foundations into every site we make: clear copy,
structured data, sitemaps." Only if true for every site.

**Sources**
1. Pew Research Center, "Google users are less likely to click on links when an AI summary appears in the results" (2025) — https://www.pewresearch.org/short-reads/2025/07/22/google-users-are-less-likely-to-click-on-links-when-an-ai-summary-appears-in-the-results/
2. Ahrefs, "AI Overviews Reduce Clicks by 34.5%" (2025) — https://ahrefs.com/blog/ai-overviews-reduce-clicks/
3. TechCrunch, "AI referrals to top websites were up 357% year-over-year in June, reaching 1.13B" (Similarweb data, 2025) — https://techcrunch.com/2025/07/25/ai-referrals-to-top-websites-were-up-357-year-over-year-in-june-reaching-1-13b/
4. Google Search Central, "AI features and your website" — https://developers.google.com/search/docs/appearance/ai-features

---

## Before publishing (build plan, after approval)

- `/insights` list page and `/insights/[slug]` pages, static, from `src/data/insights.ts`.
- `Article` JSON-LD with the byline "Techwise IQ team" and real publish dates.
- Sitemap and `llms.txt` entries; a footer link; each service page links to its related articles.
- Full agent pipeline (D-020) and e2e.
- Re-check every source link the week we publish. Swap secondary citations (marked "as cited by"
  or "as reported by") for the primary page where it loads.
