"use client";

interface CompanyLogo {
  id?: string;
  order?: number;
  imageUrl: string;
  name?: string;
}

interface CompanyLogosProps {
  logos: CompanyLogo[];
}

export default function CompanyLogos({ logos }: CompanyLogosProps) {
  if (!logos || logos.length === 0) return null;

  return (
    <div className="tmp-section-gapTop">
      <div className="container">
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '40px',
          padding: '40px 0',
        }}>
          {logos.map((logo, index) => (
            <div
              key={logo.id || index}
              className={`tmp-scroll-trigger tmp-fade-in animation-order-${(index % 8) + 1}`}
              style={{
                opacity: 0.5,
                transition: 'opacity 0.3s ease, transform 0.3s ease',
                cursor: 'default',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = '1';
                e.currentTarget.style.transform = 'scale(1.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = '0.5';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <img
                src={logo.imageUrl}
                alt={logo.name || "Company Logo"}
                style={{ maxHeight: '40px', maxWidth: '120px' }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
