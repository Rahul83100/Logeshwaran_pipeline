import { db } from './firebase';
import { collection, doc, getDoc, getDocs, addDoc, query, where, orderBy, serverTimestamp } from 'firebase/firestore';

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

export async function getProfile(): Promise<Profile> {
  const snap = await getDoc(doc(db, 'profile', 'main'));
  if (!snap.exists()) {
    throw new Error("Profile not found in database. Please seed the database.");
  }
  return snap.data() as Profile;
}

export async function getSkills() {
  const q = query(collection(db, 'skills'), orderBy('order', 'asc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Skill));
}

export async function getEducation() {
  const q = query(collection(db, 'education'), orderBy('order', 'asc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({
    id: d.id,
    title: d.data().degree || d.data().title,
    institution: d.data().institution,
    period: d.data().year_range || d.data().period,
    description: d.data().description,
    ...d.data()
  } as Education));
}

export async function getExperience() {
  const q = query(collection(db, 'experience'), orderBy('order', 'asc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({
    id: d.id,
    company: d.data().organization || d.data().company,
    duration: d.data().year_range || d.data().duration,
    role: d.data().role,
    description: d.data().description,
    ...d.data()
  } as Experience));
}

export async function getResearchPapers(options?: { isPrivate?: boolean }) {
  let q = query(collection(db, 'research_papers'), orderBy('year', 'desc'));

  if (options?.isPrivate !== undefined) {
    q = query(collection(db, 'research_papers'), where('is_private', '==', options.isPrivate), orderBy('year', 'desc'));
  }

  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as ResearchPaper));
}

export async function getBlogPosts() {
  const q = query(collection(db, 'blog_posts'), where('published', '==', true), orderBy('created_at', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as BlogPost));
}

export async function getBlogPost(slug: string) {
  const q = query(collection(db, 'blog_posts'), where('slug', '==', slug));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  return { id: snap.docs[0].id, ...snap.docs[0].data() } as BlogPost;
}

export async function getProjects() {
  const snap = await getDocs(collection(db, 'projects'));
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as PortfolioProject));
}

export async function getTestimonials() {
  const snap = await getDocs(collection(db, 'testimonials'));
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Testimonial));
}

export async function submitContactForm(data: ContactFormData) {
  await addDoc(collection(db, 'contact_submissions'), {
    ...data,
    created_at: serverTimestamp(),
    status: 'new'
  });
  return { success: true };
}
