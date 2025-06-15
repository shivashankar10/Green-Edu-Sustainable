import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Play, BookOpen } from 'lucide-react';
import SampleCertificate from './SampleCertificate';

const HeroSection = () => {
  const navigate = useNavigate();

  const handleExploreClick = () => {
    const coursesElement = document.querySelector('#courses');
    if (coursesElement) {
      coursesElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="pt-20 pb-16 bg-gradient-to-br from-green-50 via-white to-blue-50 overflow-hidden">
      <style>{`
        .hero-text-shadow {
          text-shadow: 0 2px 8px rgba(34,197,94,0.18), 0 1px 0 #fff;
        }
      `}</style>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div className="animate-fade-in">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight hero-text-shadow">
              <span className="text-green-700 hero-text-shadow">Learn </span>
              <span className="text-green-700 hero-text-shadow">Sustainability</span>
              <br />
              <span className="text-green-700 hero-text-shadow">Shape the Future</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Empower yourself with knowledge about environmental sustainability through our interactive online learning platform. Join thousands of learners committed to creating a greener tomorrow.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg" onClick={() => navigate('/courses')}>
                <Play className="h-5 w-5 mr-2" />
                Start Learning Now
              </Button>
              <Button size="lg" variant="outline" className="border-green-600 text-green-600 hover:bg-green-50 px-8 py-3 text-lg" onClick={handleExploreClick}>
                <BookOpen className="h-5 w-5 mr-2" />
                Explore Courses
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 mb-1">10+</div>
                <div className="text-sm text-gray-600">Video Lessons</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 mb-1">1k+</div>
                <div className="text-sm text-gray-600">Active Learners</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 mb-1">1,256+</div>
                <div className="text-sm text-gray-600">Certificates Issued</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 mb-1">2,000+</div>
                <div className="text-sm text-gray-600">Students Enrolled</div>
              </div>
            </div>
          </div>

          {/* Right Column - Sample Certificate */}
          <div className="relative lg:pl-8">
            <div className="relative z-10 float-animation">
              <div className="mb-4 text-center">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Earn Your Certificate</h3>
                <p className="text-sm text-gray-600">Complete courses and showcase your sustainability knowledge</p>
              </div>
              {/* Demo certificate sample props */}
              <SampleCertificate
                courseTitle="Sustainable Agriculture Practices"
                lessons={12}
                hours={6}
                score={95}
                completed={true}
                certificateCode="CERT-0001-ABCD"
              />
            </div>
            
            {/* Background decoration */}
            <div className="absolute top-4 right-4 w-32 h-32 bg-green-200 rounded-full opacity-20 -z-10"></div>
            <div className="absolute bottom-8 left-8 w-24 h-24 bg-blue-200 rounded-full opacity-20 -z-10"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
