import { db } from './firebase';
import {
    collection,
    doc,
    getDoc,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    limit,
    serverTimestamp,
    DocumentData,
    QueryConstraint,
} from 'firebase/firestore';

// ============ PROFILE ============

export async function getProfile() {
    const docRef = doc(db, 'profile', 'main');
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
}

export async function updateProfile(data: Partial<DocumentData>) {
    const docRef = doc(db, 'profile', 'main');
    await updateDoc(docRef, { ...data, updated_at: serverTimestamp() });
}

// ============ RESEARCH PAPERS ============

export async function getResearchPapers(options?: { isPrivate?: boolean; limitCount?: number }) {
    const constraints: QueryConstraint[] = [orderBy('year', 'desc')];

    if (options?.isPrivate !== undefined) {
        constraints.push(where('is_private', '==', options.isPrivate));
    }
    if (options?.limitCount) {
        constraints.push(limit(options.limitCount));
    }

    const q = query(collection(db, 'research_papers'), ...constraints);
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

export async function addResearchPaper(data: DocumentData) {
    return addDoc(collection(db, 'research_papers'), {
        ...data,
        created_at: serverTimestamp(),
    });
}

export async function updateResearchPaper(id: string, data: Partial<DocumentData>) {
    await updateDoc(doc(db, 'research_papers', id), { ...data, updated_at: serverTimestamp() });
}

export async function deleteResearchPaper(id: string) {
    await deleteDoc(doc(db, 'research_papers', id));
}

// ============ BLOG POSTS ============

export async function getBlogPosts(options?: { published?: boolean; limitCount?: number }) {
    const constraints: QueryConstraint[] = [orderBy('created_at', 'desc')];

    if (options?.published !== undefined) {
        constraints.push(where('published', '==', options.published));
    }
    if (options?.limitCount) {
        constraints.push(limit(options.limitCount));
    }

    const q = query(collection(db, 'blog_posts'), ...constraints);
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

export async function getBlogPostBySlug(slug: string) {
    const q = query(collection(db, 'blog_posts'), where('slug', '==', slug));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    const docSnap = snapshot.docs[0];
    return { id: docSnap.id, ...docSnap.data() };
}

export async function addBlogPost(data: DocumentData) {
    return addDoc(collection(db, 'blog_posts'), {
        ...data,
        created_at: serverTimestamp(),
    });
}

export async function updateBlogPost(id: string, data: Partial<DocumentData>) {
    await updateDoc(doc(db, 'blog_posts', id), { ...data, updated_at: serverTimestamp() });
}

export async function deleteBlogPost(id: string) {
    await deleteDoc(doc(db, 'blog_posts', id));
}

// ============ EDUCATION ============

export async function getEducation() {
    const q = query(collection(db, 'education'), orderBy('order', 'asc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

export async function addEducation(data: DocumentData) {
    return addDoc(collection(db, 'education'), { ...data, created_at: serverTimestamp() });
}

export async function updateEducation(id: string, data: Partial<DocumentData>) {
    await updateDoc(doc(db, 'education', id), data);
}

export async function deleteEducation(id: string) {
    await deleteDoc(doc(db, 'education', id));
}

// ============ EXPERIENCE ============

export async function getExperience() {
    const q = query(collection(db, 'experience'), orderBy('order', 'asc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

export async function addExperience(data: DocumentData) {
    return addDoc(collection(db, 'experience'), { ...data, created_at: serverTimestamp() });
}

export async function updateExperience(id: string, data: Partial<DocumentData>) {
    await updateDoc(doc(db, 'experience', id), data);
}

export async function deleteExperience(id: string) {
    await deleteDoc(doc(db, 'experience', id));
}

// ============ SKILLS ============

export async function getSkills() {
    const q = query(collection(db, 'skills'), orderBy('order', 'asc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

export async function addSkill(data: DocumentData) {
    return addDoc(collection(db, 'skills'), { ...data, created_at: serverTimestamp() });
}

export async function updateSkill(id: string, data: Partial<DocumentData>) {
    await updateDoc(doc(db, 'skills', id), data);
}

export async function deleteSkill(id: string) {
    await deleteDoc(doc(db, 'skills', id));
}

// ============ ACCESS REQUESTS (RBAC) ============

export async function getAccessRequests(status?: string) {
    const constraints: QueryConstraint[] = [orderBy('created_at', 'desc')];
    if (status) {
        constraints.push(where('status', '==', status));
    }

    const q = query(collection(db, 'access_requests'), ...constraints);
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

export async function createAccessRequest(data: {
    requester_name: string;
    requester_email: string;
    institution?: string;
    reason: string;
}) {
    return addDoc(collection(db, 'access_requests'), {
        ...data,
        status: 'pending',
        access_code: null,
        created_at: serverTimestamp(),
        approved_at: null,
        expires_at: null,
    });
}

export async function updateAccessRequest(id: string, data: Partial<DocumentData>) {
    await updateDoc(doc(db, 'access_requests', id), data);
}

// ============ SITE SETTINGS ============

export async function getSiteSettings() {
    const docRef = doc(db, 'site_settings', 'config');
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() : null;
}

export async function updateSiteSettings(data: Partial<DocumentData>) {
    const docRef = doc(db, 'site_settings', 'config');
    await updateDoc(docRef, { ...data, updated_at: serverTimestamp() });
}
