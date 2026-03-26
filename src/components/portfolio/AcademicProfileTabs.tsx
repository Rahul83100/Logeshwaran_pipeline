"use client";

import { useState, Suspense, useEffect } from "react";
import Image from "next/image";

const academicTabs = [
    { name: "Profile", id: "profile" },
    { name: "Articles in Journals", id: "articles" },
    { name: "Book Chapters / Articles", id: "books" },
    { name: "Participation in Conferences / Seminars / Symposium", id: "conferences" },
    { name: "Patents", id: "patents" },
    { name: "Research Projects", id: "projects" },
    { name: "Workshops / FDP / Training Programmes", id: "workshops" },
    { name: "Awards / Achievements / Others", id: "awards" },
];

const mockArticles = [
    {
        year: "2025",
        title: "Toward Smart 5G and 6G: Standardization of AI-Native Network Architectures and Semantic Communication Protocols",
        details: [
            { label: "Name of Journal", value: "IEEE Communications Standards Magazine" },
            { label: "Date Of Publication", value: "15-Aug-2025" },
            { label: "Category", value: "Article in Research Journal" },
            { label: "Author Name(s)", value: "LOGESHWARAN J, et al." },
            { label: "Indexing Agency", value: "Web of Science and Scopus" },
        ]
    },
    {
        year: "2025",
        title: "Optimizing resource management using hybrid metaheuristic algorithm for fog layer design in edge computing",
        details: [
            { label: "Name of Journal", value: "Systems and Soft Computing" },
            { label: "Date Of Publication", value: "11-Jun-2025" },
            { label: "Category", value: "Article in Research Journal" },
            { label: "Sole Authored /Co Authored", value: "Co-Author" },
            { label: "Author Name(s)", value: "LOGESHWARAN J, SANJAIKANTH E, SANTHOSH PARAMASIVAM, et al." },
            { label: "URL", value: "https://www.sciencedirect.com/journal/systems-and-soft-computing" },
            { label: "Indexing Agency", value: "Web of Science and Scopus" },
        ]
    },
    { year: "2025", title: "An enhanced performance analysis of load based resource sharing framework for MIMO systems in 5G communication systems", details: [] },
    { year: "2025", title: "An improved LSTM based thermal prediction and control algorithm for battery management system in hybrid electric vehicles", details: [] },
    
    // 2024
    { year: "2024", title: "Design and Optimization of a MXene-Based Terahertz Surface Plasmon Resonance Sensor for Malaria Detection", details: [] },
    { year: "2024", title: "Hybrid optimization for efficient 6G IoT traffic management and multi-routing strategy", details: [] },
    { year: "2024", title: "Improving crop production using an agro-deep learning framework in precision agriculture", details: [] },
    { year: "2024", title: "Multi-Model Traffic Forecasting in Smart Cities using Graph Neural Networks and Transformer-based Multi-Source Visual Fusion for Intelligent Transportation Management", details: [] },
    { year: "2024", title: "A reliable inter-domain routing framework for autonomous systems using hybrid Blockchain", details: [] },
    { year: "2024", title: "The feasibility analysis of load based resource optimization algorithm for cooperative communication in 5G wireless ad-hoc networks", details: [] },
    { year: "2024", title: "Enhancing mobility management in 5G networks using deep residual LSTM model", details: [] }
];

const mockBooks = [
    {
        year: "2025",
        title: "An Improved AI-Based Low Latency Data Transmission in 5G Communication Systems",
        details: [
            { label: "Type of Book", value: "Chapter" },
            { label: "Title", value: "Lecture Notes in Networks and Systems" },
            { label: "ISBN", value: "978-981-96-3313-5" },
            { label: "Month/Year", value: "Jul 2025" }
        ]
    },
    { year: "2025", title: "Energy Efficient Smart Scheduling for Multi-path Routing Using Deep Learning", details: [] }
];

const mockConferences = [
    // 2025
    { year: "2025", title: "3rd International Conference on Intelligent Cyber Physical Systems and Internet of Things (ICoICI-2025)", details: [] },
    { year: "2025", title: "Sixteenth International Conference on Computing, Communication and Networking Technologies (ICCCNT 2025)", details: [] },
    { year: "2025", title: "Sixteenth International Conference on Computing, Communication and Networking Technologies (ICCCNT 2025)", details: [] },
    { year: "2025", title: "Sixteenth International Conference on Computing, Communication and Networking Technologies (ICCCNT 2025)", details: [] },
    { year: "2025", title: "6th International Conference on Intelligent Communication Technologies and Virtual Mobile Networks (ICICV-2025)", details: [] },
    { year: "2025", title: "6th International Conference on Intelligent Communication Technologies and Virtual Mobile Networks (ICICV-2025)", details: [] },
    { year: "2025", title: "4th International Conference On Networks And Cryptology", details: [] },
    { year: "2025", title: "4th International Conference On Networks And Cryptology", details: [] },
    { year: "2025", title: "International Conference on Pervasive Computing and Social Networking (ICPCSN-2025)", details: [] },
    { year: "2025", title: "International Conference On Wireless Technologies,Networks And Science 2025", details: [] },

    // 2024
    { year: "2024", title: "2024 2nd International Conference on Advances in Computation, Communication and Information Technology (ICAICCIT)", details: [] },
    { year: "2024", title: "2024 2nd International Conference on Advances in Computation, Communication and Information Technology (ICAICCIT)", details: [] },
    { year: "2024", title: "2024 2nd International Conference on Advances in Computation, Communication and Information Technology (ICAICCIT)", details: [] },
    { year: "2024", title: "International Conference on Renewable Energy and Conservation (ICREC 2024)", details: [] },
    { year: "2024", title: "2nd World Conference on Communication & Computing (WCONF)", details: [] },
    { year: "2024", title: "15th International Conference on Computing Communication and Networking Technologies (ICCCNT)", details: [] },
    { year: "2024", title: "15th International Conference on Computing Communication and Networking Technologies (ICCCNT)", details: [] },
    { year: "2024", title: "15th International Conference on Computing Communication and Networking Technologies (ICCCNT)", details: [] },
    { year: "2024", title: "15th International Conference on Computing Communication and Networking Technologies (ICCCNT)", details: [] }
];

const mockPatents = [
    // 2024
    { year: "2024", title: "IOT INTEGRATED HEALTHCARE MONITORING AND ALERT SYSTEM", details: [] },
    { year: "2024", title: "DEVICE TO ANALYSE CEMENT QUALITY", details: [] },
    { year: "2024", title: "SOLAR POWERED AIR POLLUTION MONITORING SYSTEM", details: [] },
    { year: "2024", title: "IMPORTANCE OF MARKETING RESEARCH IN ENHANCING THE SERVICE LEVEL OF MANUFACTURING COMPANY", details: [] },
    { year: "2024", title: "SMART LOGISTICS TRACKING AND MONITORING DEVICE", details: [] },
    { year: "2024", title: "IOT Whether Station Airship", details: [] },
    { year: "2024", title: "IOT BASED HEART MONITORING SYSTEM", details: [] },
    { year: "2024", title: "DEVICE FOR MEASURING PH VALUE OF FLUID", details: [] },
    { year: "2024", title: "NOISE POLLUTION AND LIGHT POLLUTION CONTROL SYSTEM", details: [] },
    { year: "2024", title: "AI BASED BRAIN CANCER DETECTION DEVICE", details: [] }
];

const mockProjectsList = [
    { year: "1", title: "Quantum Cryptography for Secure Communication in IoT Networks", details: [] }
];

const mockWorkshops = [
    {
        year: "2025",
        title: "Machine Learning from Data to Decisions",
        details: [
            { label: "Name of the Organiser", value: "EICT Academy IIT Roorkee" },
            { label: "Level", value: "National" },
            { label: "Role", value: "Participant" },
            { label: "Date", value: "2025-09-17" },
        ]
    },
    { year: "2025", title: "Foundations of Artificial Intelligence: Concepts, Techniques, and Applications", details: [] },
    { year: "2025", title: "Exploring IoT in the Digital Era: From Smart Devices to Intelligent Systems", details: [] },
    { year: "2025", title: "Faculty Development Programme 2025", details: [] },
];

const mockAwards = [
    {
        year: "2024",
        title: "Reviewer",
        details: [
            { label: "Name of the Awards/Achievements", value: "Reviewer" },
            { label: "Description", value: "Associate Reviewer in Discover Computing Journal associated with Springer Nature" },
            { label: "Organisation", value: "Springer Nature" },
            { label: "Month/Year", value: "18 October 2024" },
        ]
    },
    { year: "2024", title: "World Top 2% Scientist (in 2024)", details: [] },
    { year: "2024", title: "Guest Editor", details: [] },
];

function AccordionItem({ item, index, expandedKey, setExpandedKey }: { item: any, index: number, expandedKey: string | null, setExpandedKey: any }) {
    const isExpanded = expandedKey === (item.title + "-" + index);

    // Some simple yellow highlights for specific row content items if needed
    // The UI screenshot implies a yellowish background for the rows:
    return (
        <div style={{ marginBottom: '15px', borderLeft: '4px solid #e60000', background: isExpanded ? '#f5f5dc' : '#f5f5dc', border: '1px solid #e0e0e0', borderLeftWidth: '4px', borderRadius: '4px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
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
                            <p key={idx} style={{ marginBottom: '8px' }}>
                                <strong style={{ color: '#000' }}>{detail.label}:</strong> {detail.value}
                            </p>
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

    // Helper function to render grouped data by year
    const renderYearGroup = (data: any[], typePrefix: string) => {
        const years = Array.from(new Set(data.map(item => item.year))).sort((a, b) => {
            // Keep numerical ordering for years. "1" comes last or first depending on usage, but here descending works.
            return Number(b) - Number(a);
        });

        return years.map(year => (
            <div key={`${typePrefix}-${year}`} style={{ display: 'flex', gap: '20px', flexDirection: 'column', marginBottom: '30px' }}>
                <div style={{ fontWeight: 700, fontSize: '18px', color: '#000', width: '100px' }}>{year}</div>
                <div style={{ flex: 1, borderTop: '2px solid #e60000', paddingTop: '20px' }}>
                    {data.filter(item => item.year === year).map((item, index) => (
                        <AccordionItem key={`${typePrefix}-${year}-${index}`} item={item} index={index} expandedKey={expandedKey} setExpandedKey={setExpandedKey} />
                    ))}
                </div>
            </div>
        ));
    };

    return (
        <div id="academic" className="academic-profile-wrapper" style={{ margin: '60px 0', position: 'relative', paddingTop: '80px', marginTop: '-80px' }}>
            <div className="container" style={{ position: 'relative', zIndex: 2 }}>
                <h2 className="custom-title mb-32 tmp-scroll-trigger tmp-fade-in animation-order-1 text-center" style={{ marginBottom: '50px', color: '#000' }}>
                    Faculty <span>Details</span>
                </h2>

                <div className="row">
                    {/* Sticky Sidebar */}
                    <div className="col-lg-4 col-md-5 d-none d-md-block">
                        <div style={{ background: '#ffffff', border: '1px solid #e0e0e0', borderRadius: '8px', padding: '20px 0', position: 'sticky', top: '100px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                {academicTabs.map((tabObj) => (
                                    <li key={tabObj.name}>
                                        <a
                                            href={`#${tabObj.id}`}
                                            onClick={() => setExpandedKey(null)}
                                            style={{
                                                width: '100%',
                                                textAlign: 'left',
                                                padding: '12px 24px',
                                                background: activeSection === tabObj.id ? '#fff5f5' : 'transparent',
                                                border: 'none',
                                                borderLeft: activeSection === tabObj.id ? '4px solid #e60000' : '4px solid transparent',
                                                color: activeSection === tabObj.id ? '#e60000' : '#333',
                                                fontWeight: activeSection === tabObj.id ? 700 : 500,
                                                fontSize: '15px',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s ease',
                                                display: 'block',
                                                textDecoration: 'none'
                                            }}
                                        >
                                            {tabObj.name}
                                        </a>
                                        <div style={{ height: '1px', background: '#e0e0e0', margin: '0 24px' }}></div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Main Content Areas */}
                    <div className="col-lg-8 col-md-7 mt-5 mt-md-0">
                        {/* Profile Section */}
                        <div id="profile" style={{ background: '#ffffff', border: '1px solid #e0e0e0', borderRadius: '8px', padding: '40px', marginBottom: '40px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', scrollMarginTop: '100px' }} className="tmp-fade-in">
                            <h3 style={{ marginBottom: '20px', borderBottom: '2px solid #f0f0f0', paddingBottom: '10px', color: '#000', fontSize: '24px' }}>Personal Profile</h3>
                            <div style={{ display: 'flex', gap: '30px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                                <Image src={profile?.profileImage || "/assets/images/logo/man.png"} alt={profile?.name || "Profile"} width={150} height={150} style={{ borderRadius: '8px', border: '1px solid #eeeeee' }} />
                                <div style={{ flex: 1, minWidth: '250px' }}>
                                    <h4 style={{ margin: '0 0 5px 0', color: '#000' }}>{profile?.name || "Dr LOGESHWARAN J, ME, PhD"}</h4>
                                    <p style={{ color: '#e60000', fontWeight: 600, textTransform: 'uppercase', fontSize: '14px', letterSpacing: '1px' }}>{profile?.subtitle || "ASSISTANT PROFESSOR"}</p>
                                    <p style={{ color: '#666', marginTop: '15px' }}>{profile?.bio || "A dedicated researcher and professor specializing in artificial intelligence and machine learning."}</p>
                                </div>
                            </div>
                        </div>

                        {/* Articles in Journals Section */}
                        <div id="articles" style={{ background: '#ffffff', border: '1px solid #e0e0e0', borderRadius: '8px', padding: '40px', marginBottom: '40px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', scrollMarginTop: '100px' }} className="tmp-fade-in">
                            <h3 style={{ marginBottom: '30px', borderBottom: '2px solid #f0f0f0', paddingBottom: '10px', color: '#000', fontSize: '24px' }}>Articles in Journals</h3>
                            {renderYearGroup(mockArticles, "articles")}
                        </div>
                        
                        {/* Book Chapters / Articles Section */}
                        <div id="books" style={{ background: '#ffffff', border: '1px solid #e0e0e0', borderRadius: '8px', padding: '40px', marginBottom: '40px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', scrollMarginTop: '100px' }} className="tmp-fade-in">
                             <h3 style={{ marginBottom: '30px', borderBottom: '2px solid #f0f0f0', paddingBottom: '10px', color: '#000', fontSize: '24px' }}>Book Chapters</h3>
                             {renderYearGroup(mockBooks, "books")}
                        </div>
                        
                        {/* Conferences Section */}
                        <div id="conferences" style={{ background: '#ffffff', border: '1px solid #e0e0e0', borderRadius: '8px', padding: '40px', marginBottom: '40px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', scrollMarginTop: '100px' }} className="tmp-fade-in">
                             <h3 style={{ marginBottom: '30px', borderBottom: '2px solid #f0f0f0', paddingBottom: '10px', color: '#000', fontSize: '24px' }}>Participation in Seminars/Conferences/Symposium</h3>
                             {renderYearGroup(mockConferences, "conferences")}
                        </div>
                        
                        {/* Patents Section */}
                        <div id="patents" style={{ background: '#ffffff', border: '1px solid #e0e0e0', borderRadius: '8px', padding: '40px', marginBottom: '40px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', scrollMarginTop: '100px' }} className="tmp-fade-in">
                             <h3 style={{ marginBottom: '30px', borderBottom: '2px solid #f0f0f0', paddingBottom: '10px', color: '#000', fontSize: '24px' }}>Patents</h3>
                             {renderYearGroup(mockPatents, "patents")}
                        </div>
                        
                        {/* Research Projects Section */}
                        <div id="projects" style={{ background: '#ffffff', border: '1px solid #e0e0e0', borderRadius: '8px', padding: '40px', marginBottom: '40px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', scrollMarginTop: '100px' }} className="tmp-fade-in">
                             <h3 style={{ marginBottom: '30px', borderBottom: '2px solid #f0f0f0', paddingBottom: '10px', color: '#000', fontSize: '24px' }}>Research Project</h3>
                             {renderYearGroup(mockProjectsList, "projects")}
                        </div>

                        {/* Workshops Section */}
                        <div id="workshops" style={{ background: '#ffffff', border: '1px solid #e0e0e0', borderRadius: '8px', padding: '40px', marginBottom: '40px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', scrollMarginTop: '100px' }} className="tmp-fade-in">
                            <h3 style={{ marginBottom: '30px', borderBottom: '2px solid #f0f0f0', paddingBottom: '10px', color: '#000', fontSize: '24px' }}>Workshops / FDP / Training Programmes</h3>
                            {renderYearGroup(mockWorkshops, "workshops")}
                        </div>

                        {/* Awards Section */}
                        <div id="awards" style={{ background: '#ffffff', border: '1px solid #e0e0e0', borderRadius: '8px', padding: '40px', marginBottom: '40px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', scrollMarginTop: '100px' }} className="tmp-fade-in">
                            <h3 style={{ marginBottom: '30px', borderBottom: '2px solid #f0f0f0', paddingBottom: '10px', color: '#000', fontSize: '24px' }}>Awards / Achievements / Others</h3>
                            {renderYearGroup(mockAwards, "awards")}
                        </div>

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
