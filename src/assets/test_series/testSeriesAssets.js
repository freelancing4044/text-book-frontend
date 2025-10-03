import upscLogo from './upsc.webp';
import tspscLogo from './tspsc.webp';
import rrbLogo from './rrb.webp';
import rrbGroupDLogo from './rrb-groupd.webp';
import ibpsLogo from './ibps.webp';
import sbiLogo from './sbi.webp';
import sscLogo from './ssc.webp';
import appscLogo from './appsc.webp';
import capfLogo from './capf.webp';
import testSeries_section4 from './section4.webp';

import testSeries_section1 from './test_series_section1.webp';

export const section1 = testSeries_section1;
export const section4 =  testSeries_section4
export const testSeriesData = [
  {
    category: 'Civil Service Exams',
    tests: [
      {
        id: 1,
        title: 'UPSC CSE',
        logo: upscLogo,
        exampleTest: 'Union Public Service Commission Civil Services Exam',
        duration: '2 hours',
        coverage: 'History, Polity, Economy, Environment',
        features: 'Timed test, instant results, performance analysis',
        ranking: 'All-India leaderboard',
        subject:'samplepaper'
      },
      {
        id: 2,
        title: 'CAPF',
        logo: capfLogo,
        exampleTest: 'CAPF AC Mock Test – Paper I & II Drill',
        duration: '2 hours',
        coverage: 'General Ability & Intelligence, General Studies, Essay & Comprehension',
        features: 'Instant results, detailed explanations',
        ranking: 'All-India leaderboard',
        subject:'samplepaper'
      },
    ],
  },

  {
    category: 'State Service Exams',
    tests: [
      {
        id: 1,
        title: 'TSPSC',
        logo: tspscLogo,
        exampleTest: 'TSPSC GS Paper I – Chapter-Wise Practice',
        duration: '60 minutes',
        coverage: 'State-specific history, geography, polity',
        features: 'Topic-wise insights, instant scoring',
        ranking: 'State comparison',
        subject:'samplepaper'
      },
      {
        id: 2,
        title: 'APPSC',
        logo: appscLogo,
        exampleTest: 'APPSC Group II Prelims Practice Test',
        duration: '90 minutes',
        coverage: 'General Studies, Mental Ability, Andhra Pradesh Economy & History',
        features: 'Instant results, progress analysis',
        ranking: 'State comparison',
        subject:'samplepaper'
      },
    ],
  },

  {
    category: 'Railway Exams',
    tests: [
      {
        id: 1,
        title: 'RRB NTPC',
        logo: rrbLogo,
        exampleTest: 'Non-Technical Popular Categories',
        duration: '90 minutes',
        coverage: 'General Awareness, Math, Reasoning',
        features: 'Timed test, detailed solutions',
        ranking: 'National comparison',
        subject:'samplepaper'
      },
      {
        id: 2,
        title: 'RRB Group D',
        logo: rrbGroupDLogo,
        exampleTest: 'RRB Group D Full-Length Mock',
        duration: '90 minutes',
        coverage: 'Mathematics, General Intelligence & Reasoning, General Science, GK & Current Affairs',
        features: 'Instant results, previous year trend-based questions',
        ranking: 'All-India leaderboard',
        subject:'samplepaper'
      },
    ],
  },

  {
    category: 'Banking Exams',
    tests: [
      {
        id: 1,
        title: 'IBPS PO',
        logo: ibpsLogo,
        exampleTest: 'IBPS PO Prelims – Quant & Reasoning Drill',
        duration: '60 minutes',
        coverage: 'Quantitative Aptitude, Reasoning',
        features: 'Instant results, performance tracking',
        ranking: 'All-India leaderboard',
        subject:'samplepaper'
      },
      {
        id: 2,
        title: 'SBI Clerk',
        logo: sbiLogo,
        exampleTest: 'SBI Clerk Prelims Practice Test',
        duration: '60 minutes',
        coverage: 'Quantitative Aptitude, Reasoning, English Language',
        features: 'Instant results, performance tracking',
        ranking: 'All-India leaderboard',
        subject:'samplepaper'
      },
    ],
  },

  {
    category: 'SSC Exams',
    tests: [
      {
        id: 1,
        title: 'SSC CGL',
        logo: sscLogo,
        exampleTest: 'SSC CGL Tier I Mock Exam',
        duration: '60 minutes',
        coverage: 'General Intelligence, Quantitative Aptitude, English Comprehension, General Awareness',
        features: 'Instant results, performance tracking',
        ranking: 'All-India leaderboard',
        subject:'samplepaper'
      },
      {
        id: 2,
        title: 'SSC CHSL',
        logo: sscLogo,
        exampleTest: 'SSC CHSL Tier I Drill Test',
        duration: '60 minutes',
        coverage: 'Quantitative Aptitude, Reasoning, English Language',
        features: 'Instant results, performance tracking',
        ranking: 'All-India leaderboard',
        subject:'samplepaper'
      },
    ],
  },
];


import realTime from './realTime.webp';
import instantResult from './instantResult.webp';
import expertQuestion from './expertQuestion.webp';
import anytime from './anytime.webp';

export const landingFeatures = [
  {
    img: realTime,
    title: "Real Exam Simulation",
    desc: "Experience the same format, difficulty, and timing as actual exams."
  },
  {
    img: instantResult,
    title: "Instant Results",
    desc: "Get scores and detailed answers immediately after submission."
  },
  {
    img: expertQuestion,
    title: "Expert Questions",
    desc: "Crafted by subject specialists with years of experience."
  },
  {
    img: anytime,
    title: "Anytime, Anywhere",
    desc: "Practice on desktop or mobile at your convenience."
  }
];
