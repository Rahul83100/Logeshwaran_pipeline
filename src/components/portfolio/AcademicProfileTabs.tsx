"use client";

import { useState, Suspense, useEffect } from "react";
import Image from "next/image";

import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface DynSection {
    label: string;
    sectionId: string;
    showInNavbar: boolean;
    isNew: boolean;
    order: number;
    isCustom: boolean;
    firestoreCollection: string;
    fields: { name: string; label: string; type: string }[];
}

const FALLBACK_TABS = [
    { name: "Profile", id: "profile" },
    { name: "Articles in Journals", id: "articles" },
    { name: "Book Chapters / Articles", id: "books" },
    { name: "Participation in Conferences / Seminars / Symposium", id: "conferences" },
    { name: "Patents", id: "patents" },
    { name: "Research Projects", id: "projects" },
    { name: "Workshops / FDP / Training Programmes", id: "workshops" },
    { name: "Awards / Achievements / Others", id: "awards" },
];

function AccordionItem({ item, index, expandedKey, setExpandedKey }: { item: any, index: number, expandedKey: string | null, setExpandedKey: any }) {
    const isExpanded = expandedKey === (item.title + "-" + index);

    // Some simple yellow highlights for specific row content items if needed
    // The UI screenshot implies a yellowish background for the rows:
    return (
        <div className="accordion-item-animated" style={{ marginBottom: '15px', borderLeft: '4px solid #e60000', background: isExpanded ? '#f5f5dc' : '#f5f5dc', border: '1px solid #e0e0e0', borderLeftWidth: '4px', borderRadius: '4px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <button
                onClick={() => setExpandedKey(isExpanded ? null : (item.title + "-" + index))}
                style={{ width: '100%', padding: '16px 20px', background: 'transparent', color: '#000', border: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', textAlign: 'left' }}
            >
                <span style={{ fontWeight: 500, fontSize: '15px', lineHeight: '1.4' }}>{item.title}</span>
                {item.details && item.details.length > 0 ? (
                    <i className={"fa-solid " + (isExpanded ? "fa-xmark" : "fa-plus")} style={{ color: '#000', marginLeft: '15px' }}></i>
                ) : (
                    <i className="fa-solid fa-plus" style={{ color: '#000', marginLeft: '15px' }}></i>
                )}
            </button>

            {isExpanded && item.details && item.details.length > 0 && (
                <div style={{ padding: '0 20px 20px 20px', color: '#333', fontSize: '14px', background: '#fefefe' }}>
                    <div style={{ borderTop: '1px solid #e0e0e0', paddingTop: '15px' }}>
                        {item.details.map((detail: any, idx: number) => (
                            <div key={idx} style={{ marginBottom: '12px' }}>
                                <strong style={{ color: '#000', display: 'block', marginBottom: '4px' }}>{detail.label}:</strong>
                                {detail.type === 'image' && detail.value ? (
                                    <div style={{ marginTop: '8px', position: 'relative', width: '100%', maxWidth: '300px', height: '200px' }}>
                                        <Image src={detail.value} alt={detail.label} fill style={{ borderRadius: '8px', objectFit: 'cover' }} unoptimized />
                                    </div>
                                ) : detail.type === 'url' && detail.value ? (
                                    <a href={detail.value} target="_blank" rel="noopener noreferrer" style={{ color: '#667eea', textDecoration: 'underline', wordBreak: 'break-all' }}>{detail.value}</a>
                                ) : (
                                    <span style={{ whiteSpace: 'pre-wrap', display: 'block' }}>{detail.value}</span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

function AcademicProfileTabsInner({ profile }: { profile: any }) {
    const [expandedKey, setExpandedKey] = useState<string | null>(null);
    const [activeSection, setActiveSection] = useState<string>("profile");
    
    const [mappedArticles, setMappedArticles] = useState<any[]>([]);
    const [mappedBooks, setMappedBooks] = useState<any[]>([]);
    const [mappedConferences, setMappedConferences] = useState<any[]>([]);
    const [mappedPatents, setMappedPatents] = useState<any[]>([]);
    const [mappedProjects, setMappedProjects] = useState<any[]>([]);
    const [mappedWorkshops, setMappedWorkshops] = useState<any[]>([]);
    const [mappedAwards, setMappedAwards] = useState<any[]>([]);

    // Dynamic sections from Firestore
    const [dynamicSections, setDynamicSections] = useState<DynSection[]>([]);
    const [customSectionData, setCustomSectionData] = useState<Record<string, any[]>>({});
    const [academicTabs, setAcademicTabs] = useState(FALLBACK_TABS);

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const articlesSnap = await getDocs(query(collection(db, 'research_papers'), orderBy('year', 'desc')));
                setMappedArticles(articlesSnap.docs.map((d: any) => {
                    const p = d.data();
                    return {
                        year: p.year?.toString() || "",
                        title: p.title || "",
                        details: [
                            { label: "Journal", value: p.journal || "" },
                            { label: "Authors", value: p.authors || "" },
                            { label: "Abstract", value: p.abstract || "" }
                        ].filter(x => x.value)
                    };
                }));

                const booksSnap = await getDocs(collection(db, 'books'));
                setMappedBooks(booksSnap.docs.map((d: any) => {
                    const p = d.data();
                    return {
                        year: p.year?.toString() || "",
                        title: p.title || "",
                        details: [
                            { label: "Book Title", value: p.bookTitle || "" },
                            { label: "ISBN", value: p.isbn || "" },
                            { label: "Month/Year", value: p.month ? `${p.month} ${p.year}` : (p.year || "") }
                        ].filter(x => x.value)
                    };
                }));

                const conferencesSnap = await getDocs(collection(db, 'conferences'));
                setMappedConferences(conferencesSnap.docs.map((d: any) => {
                    const p = d.data();
                    return {
                        year: p.year?.toString() || "",
                        title: p.conference || "",
                        details: [
                            { label: "Presentation Title", value: p.presentationTitle || 'None' },
                            { label: "Role", value: p.role || "" },
                            { label: "Organiser", value: p.organiser || "" },
                            { label: "Level", value: p.level || "" },
                            { label: "Date", value: p.date || "" }
                        ].filter(x => x.value)
                    };
                }));

                const patentsSnap = await getDocs(collection(db, 'patents'));
                setMappedPatents(patentsSnap.docs.map((d: any) => {
                    const p = d.data();
                    return {
                        year: p.year?.toString() || "",
                        title: p.title || "",
                        details: [
                            { label: "Inventors", value: p.inventors || "" },
                            { label: "Granted Date", value: p.grantedDate || "" },
                            { label: "Patent Number", value: p.patentNumber || "" },
                            { label: "Field", value: p.fieldOfInvention || "" }
                        ].filter(x => x.value)
                    };
                }));

                const projectsSnap = await getDocs(collection(db, 'projects'));
                setMappedProjects(projectsSnap.docs.map((d: any) => {
                    const p = d.data();
                    return {
                        year: p.year?.toString() || "",
                        title: p.title || "",
                        details: [
                            { label: "Category", value: p.category || "" },
                            { label: "Description", value: p.description || "" },
                            { label: "Link", value: p.link || "" }
                        ].filter(x => x.value)
                    };
                }));

                const workshopsSnap = await getDocs(collection(db, 'workshops'));
                setMappedWorkshops(workshopsSnap.docs.map((d: any) => {
                    const p = d.data();
                    return {
                        year: p.year?.toString() || "",
                        title: p.title || "",
                        details: [
                            { label: "Organiser", value: p.organiser || "" },
                            { label: "Level", value: p.level || "" },
                            { label: "Role", value: p.role || "" },
                            { label: "Date", value: p.date || "" }
                        ].filter(x => x.value)
                    };
                }));

                const awardsSnap = await getDocs(collection(db, 'awards'));
                setMappedAwards(awardsSnap.docs.map((d: any) => {
                    const p = d.data();
                    return {
                        year: p.year?.toString() || "",
                        title: p.title || "",
                        details: [
                            { label: "Description", value: p.description || "" },
                            { label: "Organisation", value: p.organisation || "" },
                            { label: "Date", value: p.date || "" }
                        ].filter(x => x.value)
                    };
                }));

            } catch (err) {
                console.error("Error fetching academic data:", err);
            }
        };

        fetchContent();
    }, []);

    // Fetch dynamic sections from Firestore
    useEffect(() => {
        const fetchSections = async () => {
            try {
                const snap = await getDocs(query(collection(db, 'navbar_sections'), orderBy('order', 'asc')));
                if (!snap.empty) {
                    const secs = snap.docs.map(d => d.data() as DynSection);
                    setDynamicSections(secs);
                    setAcademicTabs(secs.map(s => ({ name: s.label, id: s.sectionId })));

                    // Fetch custom section data
                    const customSecs = secs.filter(s => s.isCustom && s.firestoreCollection);
                    const customData: Record<string, any[]> = {};
                    for (const cs of customSecs) {
                        try {
                            const cSnap = await getDocs(collection(db, cs.firestoreCollection));
                            customData[cs.sectionId] = cSnap.docs.map(d => {
                                const data = d.data();
                                return {
                                    title: data.title || data.name || 'Untitled',
                                    year: data.year?.toString() || '',
                                    details: cs.fields
                                        .filter(f => f.name !== 'title' && data[f.name])
                                        .map(f => ({ label: f.label, value: data[f.name], type: f.type }))
                                };
                            });
                        } catch {
                            customData[cs.sectionId] = [];
                        }
                    }
                    setCustomSectionData(customData);
                }
            } catch (err) {
                console.error('Failed to fetch navbar sections:', err);
            }
        };
        fetchSections();
    }, []);
    
    // Simple scroll spy logic
    useEffect(() => {
        const handleScroll = () => {
            const sections = academicTabs.map(tab => document.getElementById(tab.id));
            let current = "";
            let minTop = Infinity;
            
            for (const section of sections) {
                if (section) {
                    const rect = section.getBoundingClientRect();
                    // Consider it active if it is mostly in view at the top 
                    if (rect.top <= window.innerHeight * 0.4 && rect.bottom >= window.innerHeight * 0.2) {
                        current = section.id;
                    }
                }
            }
            if (current) {
                setActiveSection(current);
            }
        };
        window.addEventListener('scroll', handleScroll);
        setTimeout(handleScroll, 100);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToSection = (e: any, id: string) => {
        e.preventDefault();
        setExpandedKey(null);
        setActiveSection(id);
        const element = document.getElementById(id);
        if (element) {
            const offset = 100; // Offset for sticky header
            const bodyRect = document.body.getBoundingClientRect().top;
            const elementRect = element.getBoundingClientRect().top;
            const elementPosition = elementRect - bodyRect;
            const offsetPosition = elementPosition - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    };

    // Helper function to render grouped data by year
    const renderYearGroup = (data: any[], typePrefix: string) => {
        const years = Array.from(new Set(data.map(item => item.year))).sort((a, b) => {
            // Keep numerical ordering for years. "1" comes last or first depending on usage, but here descending works.
            return Number(b) - Number(a);
        });

        return years.map(year => (
            <div key={`${typePrefix}-${year}`} style={{ display: 'flex', gap: '20px', flexDirection: 'column', marginBottom: '30px' }}>
                {year && <div style={{ fontWeight: 700, fontSize: '18px', color: '#000', width: '100px' }}>{year}</div>}
                <div style={{ flex: 1, borderTop: '2px solid #e60000', paddingTop: '20px' }}>
                    {data.filter(item => item.year === year).map((item, index) => (
                        <AccordionItem key={`${typePrefix}-${year}-${index}`} item={item} index={index} expandedKey={expandedKey} setExpandedKey={setExpandedKey} />
                    ))}
                </div>
            </div>
        ));
    };

    return (
        <div id="academic" className="academic-profile-wrapper" style={{ padding: '80px 0', position: 'relative', margin: '0' }}>
            <div className="container" style={{ position: 'relative', zIndex: 2 }}>
                <h2 className="custom-title mb-32 tmp-scroll-trigger tmp-fade-in animation-order-1 text-center" style={{ marginBottom: '50px', color: '#000' }}>
                    Faculty <span>Details</span>
                </h2>

                <div className="row align-items-stretch">
                    {/* Sidebar */}
                    <div className="d-none d-md-block" style={{ width: '40%', flex: '0 0 40%', padding: '0 15px' }}>
                        <div style={{ background: '#ffffff', border: '1px solid #e0e0e0', borderRadius: '12px', padding: '30px 0', height: '100%', boxShadow: '0 8px 24px rgba(0,0,0,0.08)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            <style>{`
                                .sidebar-menu-btn {
                                    width: 100%;
                                    text-align: left;
                                    cursor: pointer;
                                    transition: all 0.2s ease;
                                    display: block;
                                    text-decoration: none;
                                }
                                .sidebar-menu-btn.active {
                                    padding: 16px 24px;
                                    background: #fff5f5;
                                    border-left: 5px solid #e60000;
                                    color: #e60000;
                                    font-weight: 700;
                                    font-size: 18px;
                                }
                                .sidebar-menu-btn.inactive {
                                    padding: 12px 24px;
                                    background: transparent;
                                    border-left: 5px solid transparent;
                                    color: #666666;
                                    font-weight: 400;
                                    font-size: 14px;
                                }
                                .sidebar-menu-btn.inactive:hover {
                                    background: #fdfdfd;
                                    color: #e60000;
                                }
                            `}</style>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                {academicTabs.map((tabObj) => (
                                    <li key={tabObj.name}>
                                        <a
                                            href={`#${tabObj.id}`}
                                            onClick={(e) => scrollToSection(e, tabObj.id)}
                                            className={`sidebar-menu-btn ${activeSection === tabObj.id ? 'active' : 'inactive'}`}
                                        >
                                            {tabObj.name}
                                        </a>
                                        <div style={{ height: '1px', background: '#f0f0f0', margin: '0 24px' }}></div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Main Content Areas */}
                    <div className="mt-5 mt-md-0" style={{ width: '60%', flex: '0 0 60%', padding: '0 15px' }}>
                        {/* Profile Section */}
                        {/* Profile Section */}
                        <div id="profile" style={{ background: '#ffffff', border: '1px solid #e0e0e0', borderRadius: '12px', padding: '40px', height: '100%', marginBottom: '0', boxShadow: '0 8px 24px rgba(0,0,0,0.08)', scrollMarginTop: '150px', display: 'flex', flexDirection: 'column' }} className="tmp-fade-in">
                            <h3 style={{ marginBottom: '30px', borderBottom: '2px solid #f0f0f0', paddingBottom: '15px', color: '#000', fontSize: '30px', fontWeight: 800 }}>Personal Profile</h3>
                            <div style={{ display: 'flex', gap: '40px', alignItems: 'center', flexWrap: 'wrap', flex: 1 }}>
                                <Image src={profile?.profileImage || "/assets/images/logo/man.png"} alt={profile?.name || "Profile"} width={220} height={220} style={{ borderRadius: '16px', border: '1px solid #eeeeee', boxShadow: '0 8px 25px rgba(0,0,0,0.1)', objectFit: 'cover' }} />
                                <div style={{ flex: 1, minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                    <h4 style={{ margin: 0, color: '#000', fontSize: '30px', fontWeight: 800 }}>{profile?.name || "Dr LOGESHWARAN J, ME, PhD"}</h4>
                                    <p style={{ margin: 0, color: '#e60000', fontWeight: 700, textTransform: 'uppercase', fontSize: '18px', letterSpacing: '1.5px' }}>{profile?.subtitle || "ASSISTANT PROFESSOR"}</p>
                                    <p style={{ margin: 0, color: '#333', fontSize: '18px', lineHeight: '1.8', fontWeight: 400 }}>{profile?.bio || "A dedicated researcher and professor specializing in artificial intelligence and machine learning."}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Centered Data Cards Container */}
                <div className="row justify-content-center" style={{ marginTop: '80px' }}>
                    <div className="col-lg-10">
                        {/* Articles in Journals Section */}
                        <div id="articles" style={{ background: '#ffffff', border: '1px solid #e0e0e0', borderRadius: '8px', padding: '40px', marginBottom: '80px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', scrollMarginTop: '150px' }} className="tmp-fade-in">
                            <h3 style={{ marginBottom: '30px', borderBottom: '2px solid #f0f0f0', paddingBottom: '10px', color: '#000', fontSize: '24px' }}>Articles in Journals</h3>
                            {renderYearGroup(mappedArticles, "articles")}
                        </div>
                        
                        {/* Book Chapters / Articles Section */}
                        <div id="books" style={{ background: '#ffffff', border: '1px solid #e0e0e0', borderRadius: '8px', padding: '40px', marginBottom: '80px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', scrollMarginTop: '150px' }} className="tmp-fade-in">
                             <h3 style={{ marginBottom: '30px', borderBottom: '2px solid #f0f0f0', paddingBottom: '10px', color: '#000', fontSize: '24px' }}>Book Chapters</h3>
                             {renderYearGroup(mappedBooks, "books")}
                        </div>
                        
                        {/* Conferences Section */}
                        <div id="conferences" style={{ background: '#ffffff', border: '1px solid #e0e0e0', borderRadius: '8px', padding: '40px', marginBottom: '80px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', scrollMarginTop: '150px' }} className="tmp-fade-in">
                             <h3 style={{ marginBottom: '30px', borderBottom: '2px solid #f0f0f0', paddingBottom: '10px', color: '#000', fontSize: '24px' }}>Participation in Seminars/Conferences/Symposium</h3>
                             {renderYearGroup(mappedConferences, "conferences")}
                        </div>
                        
                        {/* Patents Section */}
                        <div id="patents" style={{ background: '#ffffff', border: '1px solid #e0e0e0', borderRadius: '8px', padding: '40px', marginBottom: '80px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', scrollMarginTop: '150px' }} className="tmp-fade-in">
                             <h3 style={{ marginBottom: '30px', borderBottom: '2px solid #f0f0f0', paddingBottom: '10px', color: '#000', fontSize: '24px' }}>Patents</h3>
                             {renderYearGroup(mappedPatents, "patents")}
                        </div>
                        
                        {/* Research Projects Section */}
                        <div id="projects" style={{ background: '#ffffff', border: '1px solid #e0e0e0', borderRadius: '8px', padding: '40px', marginBottom: '80px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', scrollMarginTop: '150px' }} className="tmp-fade-in">
                             <h3 style={{ marginBottom: '30px', borderBottom: '2px solid #f0f0f0', paddingBottom: '10px', color: '#000', fontSize: '24px' }}>Research Project</h3>
                             {renderYearGroup(mappedProjects, "projects")}
                        </div>

                        {/* Workshops Section */}
                        <div id="workshops" style={{ background: '#ffffff', border: '1px solid #e0e0e0', borderRadius: '8px', padding: '40px', marginBottom: '80px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', scrollMarginTop: '150px' }} className="tmp-fade-in">
                            <h3 style={{ marginBottom: '30px', borderBottom: '2px solid #f0f0f0', paddingBottom: '10px', color: '#000', fontSize: '24px' }}>Workshops / FDP / Training Programmes</h3>
                            {renderYearGroup(mappedWorkshops, "workshops")}
                        </div>

                        {/* Awards Section */}
                        <div id="awards" style={{ background: '#ffffff', border: '1px solid #e0e0e0', borderRadius: '8px', padding: '40px', marginBottom: '80px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', scrollMarginTop: '150px' }} className="tmp-fade-in">
                            <h3 style={{ marginBottom: '30px', borderBottom: '2px solid #f0f0f0', paddingBottom: '10px', color: '#000', fontSize: '24px' }}>Awards / Achievements / Others</h3>
                            {renderYearGroup(mappedAwards, "awards")}
                        </div>

                        {/* Dynamic Custom Sections */}
                        {dynamicSections.filter(s => s.isCustom).map((cs) => (
                            <div key={cs.sectionId} id={cs.sectionId} style={{ background: '#ffffff', border: '1px solid #e0e0e0', borderRadius: '8px', padding: '40px', marginBottom: '80px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', scrollMarginTop: '150px' }} className="tmp-fade-in">
                                <h3 style={{ marginBottom: '30px', borderBottom: '2px solid #f0f0f0', paddingBottom: '10px', color: '#000', fontSize: '24px' }}>
                                    {cs.label}
                                    {cs.isNew && (
                                        <span style={{ marginLeft: '10px', background: '#e60000', color: '#fff', padding: '3px 10px', borderRadius: '10px', fontSize: '12px', fontWeight: 700, verticalAlign: 'middle' }}>NEW</span>
                                    )}
                                </h3>
                                {customSectionData[cs.sectionId] && customSectionData[cs.sectionId].length > 0 ? (
                                    renderYearGroup(customSectionData[cs.sectionId], cs.sectionId)
                                ) : (
                                    <p style={{ color: '#888', textAlign: 'center', padding: '30px 0' }}>No content added yet. Add items from the Admin Dashboard.</p>
                                )}
                            </div>
                        ))}

                    </div>
                </div>
            </div>
        </div>
    );
}

export default function AcademicProfileTabs({ profile }: { profile: any }) {
    return (
        <Suspense fallback={<div style={{ minHeight: '500px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000' }}>Loading Details...</div>}>
            <AcademicProfileTabsInner profile={profile} />
        </Suspense>
    );
}
