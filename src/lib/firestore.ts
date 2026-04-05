import { db } from './firebase';
import { collection, doc, getDoc, getDocs, addDoc, query, where, orderBy, serverTimestamp } from 'firebase/firestore';
import { mockProfile, mockSkills, mockEducation, mockExperience, mockResearchPapers, mockBlogPosts, mockProjects, mockTestimonials } from './mockData';

export interface Profile {
  name: string;
  title: string;
  subtitle: string;
  bio: string;
  email: string;
  phone: string;
  address: string;
  socialLinks: {
    instagram?: string;
    linkedin?: string;
    twitter?: string;
    facebook?: string;
    googleScholar?: string;
    researchGate?: string;
  };
  bannerImage: string;
  profileImage: string;
  yearsOfExperience: number;
  projectsCompleted: number;
  happyClients: number;
  clientReviews: number;
}

export interface Skill {
  id?: string;
  name: string;
  category: 'design' | 'development' | 'research' | string;
  percentage: number;
  icon?: string;
  projectCount?: number;
  order?: number;
}

export interface Education {
  id?: string;
  title: string;
  degree?: string;
  institution: string;
  period?: string;
  year_range?: string;
  description: string;
  order?: number;
}

export interface Experience {
  id?: string;
  company?: string;
  organization?: string;
  duration?: string;
  year_range?: string;
  role: string;
  description: string;
  order?: number;
  details?: { label: string; value: string }[];
}

export interface ResearchPaper {
  id: string;
  title: string;
  authors: string[];
  journal: string;
  year: number;
  abstract: string;
  is_private: boolean;
  pdfUrl?: string;
  pdf_url?: string;
  slug: string;
  doi?: string;
}

export interface BookChapter {
  id: string;
  title: string;
  bookTitle: string;
  isbn: string;
  year: number;
  month: string;
}

export interface ConferenceParticipation {
  id: string;
  conference: string;
  role: string;
  presentationTitle: string;
  date: string;
  organiser: string;
  level: string;
  year: number;
}

export interface Patent {
  id: string;
  title: string;
  inventors: string;
  grantedDate: string;
  patentNumber: string;
  fieldOfInvention: string;
  year: number;
}

export interface Workshop {
  id: string;
  title: string;
  organiser: string;
  level: string;
  role: string;
  date: string;
  year: number;
}

export interface Award {
  id: string;
  title: string;
  description: string;
  organisation: string;
  date: string;
  year: number;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  thumbnail: string;
  tags: string[];
  published?: boolean;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export interface PortfolioProject {
  id: string;
  title: string;
  category: string;
  image: string;
  description: string;
  link: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  quote: string;
  image: string;
}

// ============================================================
// DATA FETCHING FUNCTIONS (REAL FIRESTORE INTEGRATION)
// ============================================================

// Helper to serialize Firestore Timestamps for Next.js Client Components
function sanitizeData(data: any) {
  if (!data) return data;
  const serialized = { ...data };
  for (const key in serialized) {
    if (serialized[key] && typeof serialized[key] === 'object' && 'toDate' in serialized[key]) {
      serialized[key] = serialized[key].toDate().toISOString();
    }
  }
  return serialized;
}

export async function getProfile(): Promise<Profile> {
  try {
    const snap = await getDoc(doc(db, 'profile', 'main'));
    if (!snap.exists()) {
      console.warn("Profile not found in database. Using mock fallback.");
      return mockProfile;
    }
    return sanitizeData(snap.data()) as Profile;
  } catch (err) {
    console.warn("Failed to fetch profile. Using mock fallback.", err);
    return mockProfile;
  }
}

export async function getSkills() {
  try {
    const q = query(collection(db, 'skills'), orderBy('order', 'asc'));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...sanitizeData(d.data()) } as Skill));
  } catch (err) {
    console.warn("Failed to fetch skills. Using mock fallback.", err);
    return mockSkills;
  }
}

export async function getEducation() {
  try {
    const q = query(collection(db, 'education'), orderBy('order', 'asc'));
    const snap = await getDocs(q);
    return snap.docs.map(d => {
      const data = sanitizeData(d.data());
      return {
        id: d.id,
        title: data.degree || data.title,
        institution: data.institution,
        period: data.year_range || data.period,
        description: data.description,
        ...data
      } as Education;
    });
  } catch (err) {
    console.warn("Failed to fetch education. Using mock fallback.", err);
    return mockEducation;
  }
}

export async function getExperience() {
  try {
    const q = query(collection(db, 'experience'), orderBy('order', 'asc'));
    const snap = await getDocs(q);
    return snap.docs.map(d => {
      const data = sanitizeData(d.data());
      return {
        id: d.id,
        company: data.organization || data.company,
        duration: data.year_range || data.duration,
        role: data.role,
        description: data.description,
        ...data
      } as Experience;
    });
  } catch (err) {
    console.warn("Failed to fetch experience. Using mock fallback.", err);
    return mockExperience;
  }
}

export async function getResearchPapers(options?: { isPrivate?: boolean }) {
  try {
    let q = query(collection(db, 'research_papers'), orderBy('year', 'desc'));

    if (options?.isPrivate !== undefined) {
      q = query(collection(db, 'research_papers'), where('is_private', '==', options.isPrivate), orderBy('year', 'desc'));
    }

    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...sanitizeData(d.data()) } as ResearchPaper));
  } catch (err) {
    console.warn("Failed to fetch research papers. Using mock fallback.", err);
    return options?.isPrivate === undefined 
      ? mockResearchPapers 
      : mockResearchPapers.filter(p => p.is_private === options.isPrivate);
  }
}

export async function getBlogPosts() {
  try {
    const q = query(collection(db, 'blog_posts'), where('published', '==', true), orderBy('created_at', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...sanitizeData(d.data()) } as BlogPost));
  } catch (err) {
    console.warn("Failed to fetch blog posts. Using mock fallback.", err);
    return mockBlogPosts;
  }
}

export async function getBlogPost(slug: string) {
  const q = query(collection(db, 'blog_posts'), where('slug', '==', slug));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  return { id: snap.docs[0].id, ...sanitizeData(snap.docs[0].data()) } as BlogPost;
}

export async function getProjects() {
  try {
    const snap = await getDocs(collection(db, 'projects'));
    return snap.docs.map(d => ({ id: d.id, ...sanitizeData(d.data()) } as PortfolioProject));
  } catch (err) {
    console.warn("Failed to fetch projects. Using mock fallback.", err);
    return mockProjects;
  }
}

export async function getTestimonials() {
  try {
    const snap = await getDocs(collection(db, 'testimonials'));
    return snap.docs.map(d => ({ id: d.id, ...sanitizeData(d.data()) } as Testimonial));
  } catch (err) {
    console.warn("Failed to fetch testimonials. Using mock fallback.", err);
    return mockTestimonials;
  }
}

export async function getResearchPaper(slug: string) {
  const q = query(collection(db, 'research_papers'), where('slug', '==', slug));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  return { id: snap.docs[0].id, ...sanitizeData(snap.docs[0].data()) } as ResearchPaper;
}

export async function getEducationItem(id: string) {
  const snap = await getDoc(doc(db, 'education', id));
  if (!snap.exists()) return null;
  const data = sanitizeData(snap.data());
  return {
    id: snap.id,
    title: data.degree || data.title,
    institution: data.institution,
    period: data.year_range || data.period,
    description: data.description,
    ...data
  } as Education;
}

export async function getExperienceItem(id: string) {
  const snap = await getDoc(doc(db, 'experience', id));
  if (!snap.exists()) return null;
  const data = sanitizeData(snap.data());
  return {
    id: snap.id,
    company: data.organization || data.company,
    duration: data.year_range || data.duration,
    role: data.role,
    description: data.description,
    ...data
  } as Experience;
}

export async function getSkillItem(id: string) {
  const snap = await getDoc(doc(db, 'skills', id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...sanitizeData(snap.data()) } as Skill;
}

export async function submitContactForm(data: ContactFormData) {
  await addDoc(collection(db, 'contact_submissions'), {
    ...data,
    created_at: serverTimestamp(),
    status: 'new'
  });
  return { success: true };
}

export async function getLatestServices() {
  try {
    const q = query(collection(db, 'latest_services'), orderBy('order', 'asc'));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...sanitizeData(d.data()) }));
  } catch (err) {
    console.warn('Failed to fetch latest services. Using fallback.');
    return require('./mockData').mockLatestServices;
  }
}

export async function getCompanyLogos() {
  try {
    const q = query(collection(db, 'company_logos'), orderBy('order', 'asc'));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...sanitizeData(d.data()) }));
  } catch (err) {
    console.warn('Failed to fetch company logos. Using fallback.');
    return require('./mockData').mockCompanyLogos;
  }
}

export async function getSkillWidgets() {
  try {
    const q = query(collection(db, 'skill_widgets'), orderBy('order', 'asc'));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...sanitizeData(d.data()) }));
  } catch (err) {
    console.warn('Failed to fetch skill widgets. Using fallback.');
    return require('./mockData').mockSkillWidgets;
  }
}


export async function seedMainNavbar() {
  const defaults = [
    { label: 'Home', path: '/', showInNavbar: true, isNew: false, order: 0 },
    { label: 'About', path: '/#about', showInNavbar: true, isNew: false, order: 1 },
    { label: 'Projects', path: '/projects', showInNavbar: true, isNew: false, order: 2 },
    { label: 'Blog', path: '/#blog', showInNavbar: true, isNew: false, order: 3 },
    { label: 'Contact', path: '/#contact', showInNavbar: true, isNew: false, order: 4 },
  ];
  try {
    for (const item of defaults) {
      await addDoc(collection(db, 'main_navbar'), item);
    }
  } catch(e) {}
}

