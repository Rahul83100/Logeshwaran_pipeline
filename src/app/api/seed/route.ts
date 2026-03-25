import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, setDoc, writeBatch } from 'firebase/firestore';
import {
    mockProfile, mockSkills, mockEducation, mockExperience,
    mockResearchPapers, mockBlogPosts, mockProjects, mockTestimonials
} from '@/lib/mockData';

export async function GET() {
    try {
        const batch = writeBatch(db);

        // 1. Profile
        batch.set(doc(db, 'profile', 'main'), mockProfile);

        // 2. Skills
        mockSkills.forEach((item, i) => {
            batch.set(doc(db, 'skills', `skill_${i}`), { ...item, order: i });
        });

        // 3. Education
        mockEducation.forEach((item, i) => {
            batch.set(doc(db, 'education', `edu_${i}`), { ...item, degree: item.title, year_range: item.period, order: i });
        });

        // 4. Experience
        mockExperience.forEach((item, i) => {
            batch.set(doc(db, 'experience', `exp_${i}`), { ...item, organization: item.company, year_range: item.duration, order: i });
        });

        // 5. Research Papers
        mockResearchPapers.forEach((item) => {
            batch.set(doc(db, 'research_papers', item.id), item);
        });

        // 6. Blog Posts
        mockBlogPosts.forEach((item) => {
            batch.set(doc(db, 'blog_posts', item.id), { ...item, published: true, created_at: new Date() });
        });

        // 7. Projects
        mockProjects.forEach((item) => {
            batch.set(doc(db, 'projects', item.id), item);
        });

        // 8. Testimonials
        mockTestimonials.forEach((item) => {
            batch.set(doc(db, 'testimonials', item.id), item);
        });

        await batch.commit();

        return NextResponse.json({ success: true, message: 'Database successfully seeded with Logishoren data!' });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
