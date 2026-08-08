import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLogout } from '../../../auth/hooks/use-logout';

export default function DesktopRequired() {
  const navigate = useNavigate();
  const { logout } = useLogout();

  useEffect(() => {
    // Micro-interaction for the button
    const btn = document.querySelector('.sacred-button');
    if (btn) {
      const handleMouseDown = () => {
        (btn as HTMLElement).style.transform = 'scale(0.96)';
      };
      const handleMouseUp = () => {
        (btn as HTMLElement).style.transform = 'scale(1)';
      };
      btn.addEventListener('mousedown', handleMouseDown);
      btn.addEventListener('mouseup', handleMouseUp);
      return () => {
        btn.removeEventListener('mousedown', handleMouseDown);
        btn.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, []);

  useEffect(() => {
    // Subtle parallax for the glow effects on device tilt if supported
    const handleOrientation = (event: DeviceOrientationEvent) => {
      const glows = document.querySelectorAll('.ambient-glow');
      const rotateX = (event.beta || 0) / 10;
      const rotateY = (event.gamma || 0) / 10;
      
      glows.forEach((glow, index) => {
        const factor = index === 0 ? 1 : -1;
        (glow as HTMLElement).style.transform = `translate3d(${rotateY * factor}px, ${rotateX * factor}px, 0)`;
      });
    };

    window.addEventListener('deviceorientation', handleOrientation);
    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] bg-[#121414] text-[#e2e2e2] overflow-hidden select-none font-sans flex flex-col items-center justify-center">
      <style>{`
        .material-symbols-outlined {
          font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24;
        }
        
        .desktop-required-glass-card {
          background: rgba(18, 20, 20, 0.7);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          border-left: 1px solid rgba(255, 255, 255, 0.05);
          border-right: 1px solid rgba(255, 255, 255, 0.02);
          border-bottom: 1px solid rgba(255, 255, 255, 0.02);
        }

        .ambient-glow {
          position: absolute;
          width: 300px;
          height: 300px;
          background: radial-gradient(circle, rgba(212, 175, 55, 0.15) 0%, rgba(18, 20, 20, 0) 70%);
          filter: blur(40px);
          z-index: -1;
        }

        .sacred-button {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 0 0 0 rgba(242, 202, 80, 0);
        }

        .sacred-button:hover {
          box-shadow: 0 0 20px 2px rgba(242, 202, 80, 0.3);
          transform: translateY(-1px);
        }

        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
          100% { transform: translateY(0px); }
        }

        .float-animation {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>

      {/* Ambient background lighting */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="ambient-glow top-[-100px] left-[-100px]"></div>
        <div 
          className="ambient-glow bottom-[-50px] right-[-50px]" 
          style={{ background: 'radial-gradient(circle, rgba(142, 15, 40, 0.1) 0%, rgba(18, 20, 20, 0) 70%)' }}
        ></div>
      </div>

      {/* Main Canvas */}
      <main className="relative h-screen w-full flex flex-col items-center justify-center px-5 text-center">
        {/* Hero Illustration Section */}
        <div className="relative w-full max-w-[320px] mb-12 float-animation">
          <div className="aspect-square relative rounded-full overflow-hidden border border-[#4d4635]/30 desktop-required-glass-card p-4">
            <div className="w-full h-full rounded-full overflow-hidden">
              <img 
                className="w-full h-full object-cover grayscale opacity-80 brightness-110" 
                alt="A cinematic, high-end 3D architectural render of a minimalist tech temple" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDasSbC6RF1PO9vYH3GokDOPfzu0tbkTzO6mYD9_f0B5lIOWLZ_5VLLxwm08dbnAQAMI5SAJ9YDoyocxQziys00plgoE0W1BwVS0JR9jH0JEOiDJUoiKenwtmU7eBA9YlD9dLH-8dmVME8ncwc2vhVuK6QxeSaozmbRJPQpUlir2RcrHXEhzo3XY0zyULT9Cqe0499TSB8uxKXJWTgkjvxYcbmFWWHGbh6Al0nJw5nadGCMFPtZ2_CVjA"
                referrerPolicy="no-referrer"
              />
            </div>
            {/* Decorative Ring */}
            <div className="absolute inset-0 rounded-full border-[0.5px] border-[#f2ca50]/20 scale-110"></div>
          </div>
          {/* Icon Overlay */}
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 desktop-required-glass-card rounded-full p-4 border border-[#f2ca50]/30 flex items-center justify-center shadow-xl">
            <span className="material-symbols-outlined text-[#f2ca50] text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              desktop_windows
            </span>
          </div>
        </div>

        {/* Typography Content */}
        <div className="max-w-md space-y-6">
          <div className="space-y-2">
            <span 
              className="text-xs uppercase tracking-[0.2em] opacity-80 text-[#f2ca50]" 
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              Access Restricted
            </span>
            <h1 
              className="text-3xl font-semibold text-[#e2e2e2]" 
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Desktop Required
            </h1>
          </div>
          <p 
            className="text-sm text-[#d0c5af] px-2 leading-relaxed" 
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            The SacredStories Admin Dashboard is designed for large screens. Please access this page from a desktop or laptop for the best experience.
          </p>
          
          {/* CTA Section */}
          <div className="pt-8 flex flex-col items-center gap-4">
            <button 
              onClick={async () => {
                await logout();
                // navigate('/');
              }}
              className="sacred-button px-10 py-4 bg-[#f2ca50] text-[#3c2f00] font-semibold rounded-lg flex items-center gap-2 group cursor-pointer"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Go Back
              <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">
                arrow_back
              </span>
            </button>
            
            <div className="flex items-center gap-2 opacity-40">
              <div className="h-[0.5px] w-8 bg-[#99907c]"></div>
              <span 
                className="text-xs tracking-[0.1em]" 
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                SacredStories Admin Sanctuary
              </span>
              <div className="h-[0.5px] w-8 bg-[#99907c]"></div>
            </div>
          </div>
        </div>

        {/* Bottom Decorative Element */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-t from-[#f2ca50]/50 to-transparent"></div>
      </main>
    </div>
  );
}
