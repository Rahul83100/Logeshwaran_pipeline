/**
 * Firestore Data Layer — STUB FILE
 * 
 * This file contains mock data and stub functions.
 * Rahul will replace these with real Firebase Firestore calls.
 * 
 * All functions are async to match the future Firestore API.
 */

// ============================================================
// TYPE DEFINITIONS
// ============================================================

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
  };
  bannerImage: string;
  profileImage: string;
  yearsOfExperience: number;
  projectsCompleted: number;
  happyClients: number;
  clientReviews: number;
}

export interface Skill {
  name: string;
  category: 'design' | 'development';
  percentage: number;
  icon?: string;
  projectCount?: number;
}

export interface Education {
  title: string;
  institution: string;
  period: string;
  description: string;
}

export interface Experience {
  company: string;
  duration: string;
  role: string;
  description: string;
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
  slug: string;
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
}

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
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

// ============================================================
// MOCK DATA — Real data from Dr. Logeshwaran J, Christ University
// ============================================================

const mockProfile: Profile = {
  name: "Dr. Logeshwaran J",
  title: "Researcher",
  subtitle: "Assistant Professor — Christ University, Bangalore",
  bio: "Jaganathan Logeshwaran is an accomplished researcher and academic with expertise in Networking and Communication Systems. He specializes in 5G Communication Networks and Computational Intelligence Systems. He has published over 100 research papers and is cited more than 5350 times on Google Scholar. He has also published over 300 utility patents, five design patents, and five books. Recognized as a World Top 2% Scientist by Stanford University with Elsevier in both 2024 and 2025.",
  email: "logeshwaran.j@christuniversity.in",
  phone: "+91 80 4012 9100",
  address: "Department of Computer Science, Christ University, Bangalore Campus, India",
  socialLinks: {
    linkedin: "https://www.linkedin.com/in/logeshwaran-j/",
    twitter: "#",
    instagram: "#",
    facebook: "#",
  },
  bannerImage: "/assets/images/banner/real-banner.jpg",
  profileImage: "/assets/images/logo/real-profile.jpg",
  yearsOfExperience: 10,
  projectsCompleted: 100,
  happyClients: 5350,
  clientReviews: 300,
};

const mockSkills: Skill[] = [
  { name: "5G/6G Communication Networks", category: "development", percentage: 95, icon: "fa-light fa-tower-broadcast", projectCount: 40 },
  { name: "IoT Systems", category: "development", percentage: 90, icon: "fa-light fa-microchip", projectCount: 35 },
  { name: "Deep Learning", category: "development", percentage: 90, icon: "fa-light fa-brain", projectCount: 30 },
  { name: "Research & Publications", category: "design", percentage: 100, icon: "fa-light fa-book", projectCount: 100 },
  { name: "Wireless Networks", category: "design", percentage: 95, icon: "fa-light fa-wifi", projectCount: 50 },
  { name: "Edge & Fog Computing", category: "development", percentage: 85, icon: "fa-light fa-cloud", projectCount: 20 },
  { name: "Patent Development", category: "design", percentage: 100, icon: "fa-light fa-lightbulb", projectCount: 300 },
  { name: "Academic Mentoring", category: "design", percentage: 90, icon: "fa-light fa-chalkboard-teacher", projectCount: 25 },
];

const mockEducation: Education[] = [
  {
    title: "Ph.D. in Information & Communication Systems",
    institution: "Sri Eshwar College of Engineering",
    period: "Completed",
    description: "Research focused on Wireless Networks and Communication Systems under the guidance of Dr. N. Shanmugasundaram.",
  },
  {
    title: "M.E. in Communication Systems",
    institution: "Mahendra Engineering College, Tamil Nadu",
    period: "Completed",
    description: "Specialized in communication systems engineering, building deep expertise in wireless and network technologies.",
  },
  {
    title: "B.E. in Electronics & Communication Engineering",
    institution: "Mahendra Engineering College, Tamil Nadu",
    period: "Completed",
    description: "Strong foundation in electronics, communication engineering, embedded systems, and signal processing.",
  },
  {
    title: "World Top 2% Scientist Recognition",
    institution: "Stanford University with Elsevier",
    period: "2024 & 2025",
    description: "Recognized among the World Top 2% Scientists globally, securing 16,606th rank in 2025 by Stanford University with Elsevier.",
  },
];

const mockExperience: Experience[] = [
  {
    company: "Christ University, Bangalore",
    duration: "Current",
    role: "Assistant Professor",
    description: "Teaching and research in computer science, specializing in 5G/6G communication networks, IoT, and computational intelligence. Mentoring students in cutting-edge research.",
  },
  {
    company: "Mahendra College of Engineering, Salem",
    duration: "Since 2015",
    role: "Assistant Professor",
    description: "Began academic career in 2015, teaching and conducting research in networking and communication systems. Published extensively in top-tier journals.",
  },
];

const mockResearchPapers: ResearchPaper[] = [
  {
    id: "1",
    title: "Toward Smart 5G and 6G: Standardization of AI-Native Network Architectures and Semantic Communication Protocols",
    authors: ["Logeshwaran J", "Kurunandan Jain", "Prabhakar Krishnan", "Prabu Pachiyannan", "Muhammad Attique Khan", "Yang Li"],
    journal: "IEEE Communications Standards Magazine",
    year: 2025,
    abstract: "This paper explores the standardization of AI-native network architectures and semantic communication protocols for the evolution toward smart 5G and 6G networks, proposing novel frameworks for next-generation wireless systems.",
    is_private: false,
    slug: "smart-5g-6g-ai-native-architectures",
  },
  {
    id: "2",
    title: "Optimizing Resource Management Using Hybrid Metaheuristic Algorithm for Fog Layer Design in Edge Computing",
    authors: ["Logeshwaran J", "Sanjaikanth E V S Pillai", "Santhosh Paramasivam", "Kiran Polimetla", "Selvaraj Dhanasekaran", "Krishna Kant Agrawal", "Satya Prakash Yadav", "Gianluca Gatto"],
    journal: "Systems and Soft Computing",
    year: 2025,
    abstract: "Proposes a hybrid metaheuristic algorithm to optimize resource management in fog computing layers, improving efficiency and reducing latency in edge computing deployments for IoT applications.",
    is_private: false,
    slug: "hybrid-metaheuristic-fog-edge-computing",
  },
  {
    id: "3",
    title: "An Enhanced Performance Analysis of Load Based Resource Sharing Framework for MIMO Systems in 5G Communication Systems",
    authors: ["Logeshwaran J", "Shobhit K. Patel", "Om Prakash Kumar", "Fahad Ahmed Al-Zahrani"],
    journal: "Scientific Reports (Nature)",
    year: 2025,
    abstract: "Presents an enhanced load-based resource sharing framework for MIMO systems in 5G networks, demonstrating significant performance improvements in throughput and spectral efficiency.",
    is_private: false,
    slug: "load-resource-sharing-mimo-5g",
  },
  {
    id: "4",
    title: "An Improved LSTM Based Thermal Prediction and Control Algorithm for Battery Management System in Hybrid Electric Vehicles",
    authors: ["Logeshwaran J", "Prabu P", "Ganeshkumar P", "Prabhakar Krishnan", "Dhanasekaran S", "Weiwei Jiang"],
    journal: "International Communications in Heat and Mass Transfer",
    year: 2025,
    abstract: "Introduces an improved LSTM-based thermal prediction and control algorithm for battery management systems in hybrid electric vehicles, enhancing safety and battery longevity.",
    is_private: false,
    slug: "lstm-thermal-prediction-battery-hev",
  },
  {
    id: "5",
    title: "Design and Optimization of a MXene-Based Terahertz Surface Plasmon Resonance Sensor for Malaria Detection",
    authors: ["Logeshwaran J", "Haitham Alsaif", "Jacob Wekalao", "Naim Ben Ali", "Omar Kahouli", "Shobhit K. Patel", "Ammar Armghan"],
    journal: "Plasmonics (Springer)",
    year: 2024,
    abstract: "Designs and optimizes a MXene-based terahertz surface plasmon resonance sensor for rapid and accurate malaria detection, demonstrating high sensitivity and specificity.",
    is_private: false,
    slug: "mxene-thz-spr-malaria-detection",
  },
  {
    id: "6",
    title: "Hybrid Optimization for Efficient 6G IoT Traffic Management and Multi-Routing Strategy",
    authors: ["Logeshwaran J", "Shobhit K. Patel", "Om Prakash Kumar", "Fahad Ahmed Al-Zahrani"],
    journal: "Scientific Reports (Nature)",
    year: 2024,
    abstract: "Proposes a hybrid optimization approach for efficient IoT traffic management in 6G networks with a multi-routing strategy that significantly reduces latency and improves reliability.",
    is_private: false,
    slug: "hybrid-optimization-6g-iot-traffic",
  },
  {
    id: "7",
    title: "Improving Crop Production Using an Agro-Deep Learning Framework in Precision Agriculture",
    authors: ["Logeshwaran J", "Durgesh Srivastava", "K. Sree Kumar", "M. Jenolin Rex", "Amal Al-Rasheed", "Masresha Getahun", "Ben Othman Soufiene"],
    journal: "BMC Bioinformatics",
    year: 2024,
    abstract: "Develops an agro-deep learning framework for precision agriculture that improves crop production by leveraging advanced neural networks for crop health monitoring and yield prediction.",
    is_private: false,
    slug: "agro-deep-learning-precision-agriculture",
  },
  {
    id: "8",
    title: "Enhancing Mobility Management in 5G Networks Using Deep Residual LSTM Model",
    authors: ["Logeshwaran J", "Abdullah Baz", "Yuvaraj Natarajan", "Shobhit K. Patel"],
    journal: "Applied Soft Computing (Elsevier)",
    year: 2024,
    abstract: "Enhances mobility management in 5G networks through a deep residual LSTM model that predicts user mobility patterns for seamless handovers and improved quality of service.",
    is_private: false,
    slug: "mobility-management-5g-deep-lstm",
  },
  {
    id: "9",
    title: "The Feasibility Analysis of Load Based Resource Optimization Algorithm for Cooperative Communication in 5G Wireless Ad-Hoc Networks",
    authors: ["Logeshwaran J", "R. Kannadasan", "P.M. Benson Mansingh", "A. Mutharasan", "N. Yuvaraj", "S. Venkatasubramanian", "Mohammed H. Alsharif", "Peerapong Uthansakul", "Monthippa Uthansakul"],
    journal: "Alexandria Engineering Journal",
    year: 2024,
    abstract: "Analyzes the feasibility of a load-based resource optimization algorithm for cooperative communication in 5G wireless ad-hoc networks, showing improved resource utilization and network throughput.",
    is_private: true,
    slug: "load-resource-optimization-5g-adhoc",
  },
  {
    id: "10",
    title: "Quantum Cryptography for Secure Communication in IoT Networks",
    authors: ["Logeshwaran J", "Sandhiya B"],
    journal: "Research Project — Internal",
    year: 2025,
    abstract: "An ongoing research project investigating quantum cryptography techniques for establishing secure and tamper-proof communication channels in IoT networks.",
    is_private: true,
    slug: "quantum-cryptography-iot-networks",
  },
  {
    id: "11",
    title: "Multi-Model Traffic Forecasting in Smart Cities using Graph Neural Networks and Transformer-based Multi-Source Visual Fusion for Intelligent Transportation Management",
    authors: ["Logeshwaran J", "S. Dhanasekaran", "Dhanalakshmi Gopal", "N. Ramya", "Ayodeji Olalekan Salau"],
    journal: "International Journal of Intelligent Transportation Systems Research (Springer)",
    year: 2024,
    abstract: "Proposes a multi-model traffic forecasting approach for smart cities that combines Graph Neural Networks with Transformer-based multi-source visual fusion for intelligent transportation management.",
    is_private: false,
    slug: "multi-model-traffic-forecasting-smart-cities",
  },
  {
    id: "12",
    title: "A Reliable Inter-Domain Routing Framework for Autonomous Systems Using Hybrid Blockchain",
    authors: ["Logeshwaran J", "M. Sankara Mahalingam", "N. Suresh Kumar", "R. Kanniga Devi"],
    journal: "Computers and Electrical Engineering (Elsevier)",
    year: 2024,
    abstract: "Presents a reliable inter-domain routing framework for autonomous systems leveraging hybrid Blockchain technology to enhance security, transparency, and fault tolerance in network routing.",
    is_private: false,
    slug: "inter-domain-routing-hybrid-blockchain",
  },
];

const mockBlogPosts: BlogPost[] = [
  {
    id: "1",
    title: "The Evolution from 5G to 6G: What to Expect in Next-Gen Communication",
    slug: "evolution-5g-to-6g",
    excerpt: "Exploring the roadmap from current 5G deployments to the future 6G vision, covering AI-native architectures and semantic communication.",
    content: "<p>The transition from 5G to 6G represents more than just an incremental upgrade — it's a fundamental paradigm shift in how we conceive wireless communication systems.</p><p>With AI-native network architectures at the core, 6G promises to deliver unprecedented capabilities including terabit-per-second speeds, sub-millisecond latency, and intelligent network orchestration.</p><p>In this article, we explore the key technologies driving this evolution, including semantic communication protocols, digital twins, and reconfigurable intelligent surfaces (RIS).</p>",
    author: "Dr. Logeshwaran J",
    date: "October 24, 2025",
    thumbnail: "/assets/images/blog/blog-img-1.jpg",
    tags: ["5G", "6G", "AI", "Communication"],
  },
  {
    id: "2",
    title: "IoT in Precision Agriculture: How Deep Learning is Transforming Farming",
    slug: "iot-precision-agriculture-deep-learning",
    excerpt: "How IoT sensors combined with deep learning frameworks are revolutionizing crop monitoring, yield prediction, and sustainable farming.",
    content: "<p>The convergence of Internet of Things (IoT) and deep learning is creating transformative opportunities in precision agriculture.</p><p>By deploying smart sensors across farmlands and analyzing the data through advanced neural networks, farmers can now make data-driven decisions about irrigation, fertilization, and pest control.</p><p>Our research on the agro-deep learning framework demonstrates how these technologies can significantly improve crop yields while reducing resource consumption.</p>",
    author: "Dr. Logeshwaran J",
    date: "October 15, 2024",
    thumbnail: "/assets/images/blog/blog-img-2.jpg",
    tags: ["IoT", "Agriculture", "Deep Learning"],
  },
  {
    id: "3",
    title: "Edge Computing and Fog Layers: Optimizing Resource Management for IoT",
    slug: "edge-computing-fog-layers-optimization",
    excerpt: "Understanding the role of fog computing in edge computing architectures and how hybrid metaheuristic algorithms optimize resource allocation.",
    content: "<p>As IoT devices proliferate, the need for efficient edge computing architectures becomes increasingly critical.</p><p>Fog computing provides an intermediate layer between cloud data centers and IoT endpoints, enabling faster processing and reduced bandwidth consumption.</p><p>In this article, we discuss our recent work on hybrid metaheuristic algorithms for fog layer design that achieve significant improvements in resource utilization and response times.</p>",
    author: "Dr. Logeshwaran J",
    date: "June 11, 2025",
    thumbnail: "/assets/images/blog/blog-img-3.jpg",
    tags: ["Edge Computing", "Fog Computing", "IoT"],
  },
];

const mockProjects: PortfolioProject[] = [
  {
    id: "1",
    title: "IoT Healthcare Monitoring & Alert System",
    category: "IoT & Healthcare",
    image: "/assets/images/latest-portfolio/portfoli-img-1.jpg",
    description: "A patented IoT-integrated healthcare monitoring and alert system for real-time patient health tracking.",
    link: "#",
  },
  {
    id: "2",
    title: "AI-Based 5G Low Latency Transmission",
    category: "5G Communication",
    image: "/assets/images/latest-portfolio/portfoli-img-2.jpg",
    description: "An improved AI-based low latency data transmission system for 5G communication networks.",
    link: "#",
  },
  {
    id: "3",
    title: "Solar Powered Air Pollution Monitoring",
    category: "IoT & Environment",
    image: "/assets/images/latest-portfolio/portfoli-img-3.jpg",
    description: "A patented solar-powered air pollution monitoring system using IoT sensors for real-time environmental data.",
    link: "#",
  },
  {
    id: "4",
    title: "Quantum Cryptography for IoT Security",
    category: "Quantum Computing",
    image: "/assets/images/latest-portfolio/portfoli-img-4.jpg",
    description: "Research project on quantum cryptography techniques for secure communication in IoT networks.",
    link: "#",
  },
];

const mockTestimonials: Testimonial[] = [
  {
    id: "1",
    name: "Dr. Shobhit K. Patel",
    role: "Research Collaborator",
    quote: "Working with Dr. Logeshwaran has been an incredible experience. His depth of knowledge in 5G and wireless communication systems is truly inspiring. Our collaborative papers have made significant contributions to the field.",
    image: "/assets/images/testimonial/bg-image-1png.png",
  },
  {
    id: "2",
    name: "Dr. Prabhakar Krishnan",
    role: "Co-Author & Colleague",
    quote: "Dr. Logeshwaran's contributions to our joint research on AI-native network architectures have been invaluable. A brilliant researcher with excellent collaborative skills and deep technical expertise.",
    image: "/assets/images/testimonial/bg-image-2.png",
  },
  {
    id: "3",
    name: "Research Student",
    role: "PhD Scholar, Christ University",
    quote: "As a mentor, Dr. Logeshwaran has guided me through my research journey with patience, wisdom, and unwavering support. His expertise in communication systems is unmatched.",
    image: "/assets/images/testimonial/bg-image-1png.png",
  },
];

const mockBookChapters: BookChapter[] = [
  {
    id: "1",
    title: "An Improved AI-Based Low Latency Data Transmission in 5G Communication Systems",
    bookTitle: "Lecture Notes in Networks and Systems",
    isbn: "978-981-96-3313-5",
    year: 2025,
    month: "Jul 2025",
  },
  {
    id: "2",
    title: "Energy Efficient Smart Scheduling for Multi-path Routing Using Deep Learning",
    bookTitle: "Lecture Notes in Networks and Systems",
    isbn: "978-981-96-2702-8",
    year: 2025,
    month: "May 2025",
  },
];

const mockConferences: ConferenceParticipation[] = [
  {
    id: "1",
    conference: "3rd International Conference on Intelligent Cyber Physical Systems and Internet of Things (ICoICI-2025)",
    role: "Presenter",
    presentationTitle: "Federated Learning for Privacy-Preserving Fraud Detection in Cross-Bank Systems",
    date: "2025-09-17",
    organiser: "JCT College of Engineering and Technology, Coimbatore, Tamil Nadu, India",
    level: "International",
    year: 2025,
  },
  {
    id: "2",
    conference: "Sixteenth International Conference on Computing, Communication and Networking Technologies (ICCCNT 2025)",
    role: "Presenter",
    presentationTitle: "Real-time Stream Processing and Analytics in Cloud-based IoT Systems",
    date: "2025-07-06",
    organiser: "IIT Indore, Madhya Pradesh, India",
    level: "International",
    year: 2025,
  },
  {
    id: "3",
    conference: "Sixteenth International Conference on Computing, Communication and Networking Technologies (ICCCNT 2025)",
    role: "Presenter",
    presentationTitle: "Real-time Traffic Optimization and Route Planning in Smart Cities using Cloud-based IoT Solutions",
    date: "2025-07-06",
    organiser: "IIT Indore, Madhya Pradesh, India",
    level: "International",
    year: 2025,
  },
  {
    id: "4",
    conference: "Sixteenth International Conference on Computing, Communication and Networking Technologies (ICCCNT 2025)",
    role: "Presenter",
    presentationTitle: "Federated Learning for Low-Latency Decision-Making in Distributed IoT Systems",
    date: "2025-07-06",
    organiser: "IIT Indore, Madhya Pradesh, India",
    level: "International",
    year: 2025,
  },
  {
    id: "5",
    conference: "6th International Conference on Intelligent Communication Technologies and Virtual Mobile Networks (ICICV-2025)",
    role: "Presenter",
    presentationTitle: "Artificial Intelligence in Banking Security - Technical Innovations and Challenges",
    date: "2025-06-17",
    organiser: "Francis Xavier Engineering College, Tirunelveli, India",
    level: "International",
    year: 2025,
  },
  {
    id: "6",
    conference: "6th International Conference on Intelligent Communication Technologies and Virtual Mobile Networks (ICICV-2025)",
    role: "Presenter",
    presentationTitle: "Optimizing Disease Diagnosis and Treatment Through AI and Deep Learning Algorithms",
    date: "2025-06-17",
    organiser: "Francis Xavier Engineering College, Tirunelveli, India",
    level: "International",
    year: 2025,
  },
  {
    id: "7",
    conference: "4th International Conference On Networks And Cryptology",
    role: "Presenter",
    presentationTitle: "Integrating Big Data Management with Machine Learning in Cloud Environments",
    date: "2025-05-29",
    organiser: "Jawaharlal Nehru University, New Delhi, India",
    level: "International",
    year: 2025,
  },
  {
    id: "8",
    conference: "4th International Conference On Networks And Cryptology",
    role: "Presenter",
    presentationTitle: "Real-time Monitoring and Anomaly Detection in Cloud-based IoT Networks",
    date: "2025-05-29",
    organiser: "Jawaharlal Nehru University, New Delhi, India",
    level: "International",
    year: 2025,
  },
  {
    id: "9",
    conference: "International Conference on Pervasive Computing and Social Networking (ICPCSN-2025)",
    role: "Presenter",
    presentationTitle: "Leveraging Ant Colony Optimization for Adaptive Load Balancing in Cloud Computing Environments",
    date: "2025-05-14",
    organiser: "R P Sarathy Institute of Technology",
    level: "International",
    year: 2025,
  },
  {
    id: "10",
    conference: "International Conference On Wireless Technologies, Networks And Science-2025",
    role: "Moderator/Chair",
    presentationTitle: "",
    date: "2025-05-10",
    organiser: "Advanced and Innovative Research Laboratory, Dehradun, India",
    level: "International",
    year: 2025,
  },
  {
    id: "11",
    conference: "2024 2nd International Conference on Advances in Computation, Communication and Information Technology (ICAICCIT)",
    role: "Presenter",
    presentationTitle: "Real-Time Credit Card Fraud Detection using Deep Learning based Framework",
    date: "2024-11-28",
    organiser: "Manav Rachna International Institute of Research and Studies",
    level: "International",
    year: 2024,
  },
  {
    id: "12",
    conference: "2024 2nd International Conference on Advances in Computation, Communication and Information Technology (ICAICCIT)",
    role: "Presenter",
    presentationTitle: "Optimizing Logistics Operations through AI-Data Processing Model",
    date: "2024-11-28",
    organiser: "Manav Rachna International Institute of Research and Studies",
    level: "International",
    year: 2024,
  },
  {
    id: "13",
    conference: "2024 2nd International Conference on Advances in Computation, Communication and Information Technology (ICAICCIT)",
    role: "Presenter",
    presentationTitle: "AI-driven Credit Scoring System for Real-Time Credit Card Approval in Banking",
    date: "2024-11-28",
    organiser: "Manav Rachna International Institute of Research and Studies",
    level: "International",
    year: 2024,
  },
  {
    id: "14",
    conference: "International Conference on Renewable Energy and Conservation (ICREC 2024)",
    role: "Presenter",
    presentationTitle: "An improved deep learning framework for energy management in Low-Energy Building Integrated Photovoltaics (LE-BIPV)",
    date: "2024-11-22",
    organiser: "ICREC, Rome, Italy",
    level: "International",
    year: 2024,
  },
  {
    id: "15",
    conference: "2nd World Conference on Communication & Computing (WCONF)",
    role: "Presenter",
    presentationTitle: "Secure Decentralization: Examining the Role of Blockchain in Network Security",
    date: "2024-07-12",
    organiser: "Kalinga University, Raipur",
    level: "International",
    year: 2024,
  },
  {
    id: "16",
    conference: "15th International Conference on Computing Communication and Networking Technologies (ICCCNT)",
    role: "Presenter",
    presentationTitle: "Utilizing Deep Learning Techniques for Lung Cancer Detection",
    date: "2024-06-24",
    organiser: "IIT Mandi, India",
    level: "International",
    year: 2024,
  },
  {
    id: "17",
    conference: "15th International Conference on Computing Communication and Networking Technologies (ICCCNT)",
    role: "Presenter",
    presentationTitle: "Examining the Benefits of AI in Wearable Sensor-based Healthcare Solutions",
    date: "2024-06-24",
    organiser: "IIT Mandi, India",
    level: "International",
    year: 2024,
  },
  {
    id: "18",
    conference: "15th International Conference on Computing Communication and Networking Technologies (ICCCNT)",
    role: "Presenter",
    presentationTitle: "An improved AI-driven Data Analytics model for Modern Healthcare Environment",
    date: "2024-06-24",
    organiser: "IIT Mandi, India",
    level: "International",
    year: 2024,
  },
  {
    id: "19",
    conference: "15th International Conference on Computing Communication and Networking Technologies (ICCCNT)",
    role: "Presenter",
    presentationTitle: "Investigating the Use of Natural Language Processing in Electronic Medical Record",
    date: "2024-06-24",
    organiser: "IIT Mandi, India",
    level: "International",
    year: 2024,
  },
];

const mockPatents: Patent[] = [
  {
    id: "1",
    title: "IOT INTEGRATED HEALTHCARE MONITORING AND ALERT SYSTEM",
    inventors: "Vineetha K R, Dr. Kannan V, Ms. Sangeetha S, Dr. A. Mekala, Dr. Y. Sarojini, Dr. Bright Keswani, Ms. N. Thillainayagi, Dr. A.G. Mythili, Logeshwaran J",
    grantedDate: "22-Nov-2024",
    patentNumber: "429896-001",
    fieldOfInvention: "Electronics & Computer Application",
    year: 2024,
  },
  {
    id: "2",
    title: "DEVICE TO ANALYSE CEMENT QUALITY",
    inventors: "Logeshwaran J, Arati Pradipchougule, G. Sasikumar, R. Vignesh, V. Murugesh, M. Vadivel, J. Logeshwaran",
    grantedDate: "03-Oct-2024",
    patentNumber: "425752-001",
    fieldOfInvention: "Civil Engineering",
    year: 2024,
  },
  {
    id: "3",
    title: "SOLAR POWERED AIR POLLUTION MONITORING SYSTEM",
    inventors: "Logeshwaran J, Dr. S. Boobalan, Dr. R. Kannan, Dr. Kannan Vellingiri, Dr. Muthuraman Subbiah, Dr. Anjay Kumar Mishra, Dr. Deepak Kohli",
    grantedDate: "25-Sep-2024",
    patentNumber: "424827-001",
    fieldOfInvention: "Electrical Systems",
    year: 2024,
  },
  {
    id: "4",
    title: "IMPORTANCE OF MARKETING RESEARCH IN ENHANCING THE SERVICE LEVEL OF MANUFACTURING COMPANY",
    inventors: "Logeshwaran J",
    grantedDate: "02-Aug-2024",
    patentNumber: "202441054693",
    fieldOfInvention: "Computer Science",
    year: 2024,
  },
  {
    id: "5",
    title: "SMART LOGISTICS TRACKING AND MONITORING DEVICE",
    inventors: "Logeshwaran J, Kannan Vellingiri, Parveen Singh Kalsi, Harish M, Anjay Kumar Mishra, Athar Javed Ali, Abhijit R. Gajghate",
    grantedDate: "14-Aug-2024",
    patentNumber: "422253-001",
    fieldOfInvention: "Computer Science",
    year: 2024,
  },
  {
    id: "6",
    title: "IOT Weather Station Airship",
    inventors: "Kirubanand V B, Rohini V, Vinay M, Jayapriya J, S Umarani, Mrs. Menda Sreevani, Rajesh Kanna R, Sunitha Abhay Jain, Logeshwaran J",
    grantedDate: "03-Jul-2025",
    patentNumber: "203548",
    fieldOfInvention: "Airship",
    year: 2024,
  },
  {
    id: "7",
    title: "IOT BASED HEART MONITORING SYSTEM",
    inventors: "Logeshwaran J",
    grantedDate: "24-Jul-2024",
    patentNumber: "419243-001",
    fieldOfInvention: "Computer Science (Healthcare Application)",
    year: 2024,
  },
  {
    id: "8",
    title: "DEVICE FOR MEASURING PH VALUE OF FLUID",
    inventors: "Logeshwaran J, Dr. Wasudeo Balaji Gurnule, Dr. Rajesh H. Gupta, Dr. Punam G. Gupta, Dr. Rashmi Ramesh Dubey, Dr. V. Sabareeshwari, Menda Sreevani, Dr. Vinod Kumar Singh, Dr. V. Kannan",
    grantedDate: "30-Jul-2024",
    patentNumber: "419244-001",
    fieldOfInvention: "Healthcare",
    year: 2024,
  },
  {
    id: "9",
    title: "NOISE POLLUTION AND LIGHT POLLUTION CONTROL SYSTEM",
    inventors: "Logeshwaran J",
    grantedDate: "15-Jul-2024",
    patentNumber: "417007-001",
    fieldOfInvention: "Design Patent",
    year: 2024,
  },
  {
    id: "10",
    title: "AI BASED BRAIN CANCER DETECTION DEVICE",
    inventors: "Logeshwaran J",
    grantedDate: "11-Jul-2024",
    patentNumber: "415897-001",
    fieldOfInvention: "Computer Science (Healthcare Application)",
    year: 2024,
  },
];

const mockWorkshops: Workshop[] = [
  {
    id: "1",
    title: "Machine Learning from Data to Decisions",
    organiser: "EICT Academy IIT Roorkee",
    level: "National",
    role: "Participant",
    date: "2025-09-17",
    year: 2025,
  },
  {
    id: "2",
    title: "Foundations of Artificial Intelligence: Concepts, Techniques, and Applications",
    organiser: "EICT Academy IIT Roorkee",
    level: "National",
    role: "Participant",
    date: "2025-07-09",
    year: 2025,
  },
  {
    id: "3",
    title: "Exploring IoT in the Digital Era: From Smart Devices to Intelligent Systems",
    organiser: "National Institute of Technology Warangal (T.S), India",
    level: "National",
    role: "Participant",
    date: "2025-06-09",
    year: 2025,
  },
  {
    id: "4",
    title: "Faculty Development Programme 2025",
    organiser: "HRDC, CHRIST University",
    level: "Institutional",
    role: "Participant",
    date: "2025-05-19",
    year: 2025,
  },
  {
    id: "5",
    title: "Internet of Things and its Industrial Applications",
    organiser: "Indian Institute of Technology, Roorkee",
    level: "National",
    role: "Participant",
    date: "2025-04-02",
    year: 2025,
  },
  {
    id: "6",
    title: "Internet of Things",
    organiser: "Infosys Springboard",
    level: "International",
    role: "Participant",
    date: "2025-02-11",
    year: 2025,
  },
];

const mockAwards: Award[] = [
  {
    id: "1",
    title: "Associate Reviewer",
    description: "Associate Reviewer in Concurrency and Computation: Practice and Experience Journal in Wiley",
    organisation: "Wiley",
    date: "23 April 2025",
    year: 2025,
  },
  {
    id: "2",
    title: "World Top 2% Scientist (in 2025)",
    description: "World Top 2% Scientist in 2025 and secured 16606th Global Rank",
    organisation: "Stanford University with Elsevier",
    date: "20 September 2025",
    year: 2025,
  },
  {
    id: "3",
    title: "Top Viewed Article",
    description: "Top viewed Article in 2024",
    organisation: "Wiley",
    date: "16 April 2025",
    year: 2025,
  },
  {
    id: "4",
    title: "Reviewer",
    description: "Associate Reviewer for Wiley - Transactions on Emerging Telecommunications Technologies",
    organisation: "Wiley",
    date: "13 February 2025",
    year: 2025,
  },
  {
    id: "5",
    title: "Session Chair",
    description: "Serving as a Session chair for 16th ICCCNT 2025 held at IIT Indore, Madhya Pradesh",
    organisation: "IIT Indore",
    date: "11 July 2025",
    year: 2025,
  },
  {
    id: "6",
    title: "Research Leadership Award-2025",
    description: "CHRIST Research Awards - 2025",
    organisation: "Christ University",
    date: "04 September 2025",
    year: 2025,
  },
  {
    id: "7",
    title: "Reviewer",
    description: "Associate Reviewer in Journal of Grid Computing associated with Springer Nature",
    organisation: "Springer Nature",
    date: "03 January 2025",
    year: 2025,
  },
  {
    id: "8",
    title: "Reviewer",
    description: "Associate Reviewer in Wireless Personal Communications Journal associated with Springer Nature",
    organisation: "Springer Nature",
    date: "25 July 2024",
    year: 2024,
  },
  {
    id: "9",
    title: "Reviewer",
    description: "Associate Reviewer in Discover Computing Journal associated with Springer Nature",
    organisation: "Springer Nature",
    date: "18 October 2024",
    year: 2024,
  },
  {
    id: "10",
    title: "Reviewer",
    description: "Associate Reviewer in Scientific Reports Journal associated with Springer Nature",
    organisation: "Springer Nature",
    date: "18 October 2024",
    year: 2024,
  },
  {
    id: "11",
    title: "World Top 2% Scientist (in 2024)",
    description: "World Top 2% Scientist in 2024",
    organisation: "Stanford University",
    date: "16 September 2024",
    year: 2024,
  },
  {
    id: "12",
    title: "Guest Editor",
    description: "Guest Editor in Scopus Journal - International Journal of Advanced Technology and Engineering Exploration (IJATEE)",
    organisation: "ACCENTS Publishers",
    date: "05 October 2024",
    year: 2024,
  },
];

// ============================================================
// DATA FETCHING FUNCTIONS (STUBS)
// ============================================================

export async function getProfile(): Promise<Profile> {
  // TODO: Replace with Firestore call: doc(db, 'profile', 'main')
  return mockProfile;
}

export async function getSkills(): Promise<Skill[]> {
  // TODO: Replace with Firestore call: collection(db, 'skills')
  return mockSkills;
}

export async function getEducation(): Promise<Education[]> {
  // TODO: Replace with Firestore call: collection(db, 'education')
  return mockEducation;
}

export async function getExperience(): Promise<Experience[]> {
  // TODO: Replace with Firestore call: collection(db, 'experience')
  return mockExperience;
}

export async function getResearchPapers(options?: { isPrivate?: boolean }): Promise<ResearchPaper[]> {
  // TODO: Replace with Firestore call: collection(db, 'research_papers')
  let papers = mockResearchPapers;
  if (options?.isPrivate !== undefined) {
    papers = papers.filter(p => p.is_private === options.isPrivate);
  }
  return papers;
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  // TODO: Replace with Firestore call: collection(db, 'blog_posts')
  return mockBlogPosts;
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  // TODO: Replace with Firestore query: where('slug', '==', slug)
  return mockBlogPosts.find(p => p.slug === slug) || null;
}

export async function getProjects(): Promise<PortfolioProject[]> {
  // TODO: Replace with Firestore call: collection(db, 'projects')
  return mockProjects;
}

export async function getTestimonials(): Promise<Testimonial[]> {
  // TODO: Replace with Firestore call: collection(db, 'testimonials')
  return mockTestimonials;
}

export async function getBookChapters(): Promise<BookChapter[]> {
  // TODO: Replace with Firestore call: collection(db, 'book_chapters')
  return mockBookChapters;
}

export async function getConferences(): Promise<ConferenceParticipation[]> {
  // TODO: Replace with Firestore call: collection(db, 'conferences')
  return mockConferences;
}

export async function getPatents(): Promise<Patent[]> {
  // TODO: Replace with Firestore call: collection(db, 'patents')
  return mockPatents;
}

export async function getWorkshops(): Promise<Workshop[]> {
  // TODO: Replace with Firestore call: collection(db, 'workshops')
  return mockWorkshops;
}

export async function getAwards(): Promise<Award[]> {
  // TODO: Replace with Firestore call: collection(db, 'awards')
  return mockAwards;
}

export async function submitContactForm(data: ContactFormData): Promise<{ success: boolean }> {
  // TODO: Replace with Firestore call: addDoc(collection(db, 'contact_submissions'), data)
  console.log("Contact form submitted:", data);
  return { success: true };
}
