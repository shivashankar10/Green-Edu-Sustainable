
import { Award, Calendar, CheckCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const SampleCertificate = () => {
  const { user } = useAuth();
  
  // Get user's display name or fallback to email or default
  const getUserName = () => {
    if (user?.user_metadata?.full_name) return user.user_metadata.full_name;
    if (user?.email) return user.email.split('@')[0];
    return 'John Doe';
  };

  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long', 
    day: 'numeric'
  });

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md mx-auto border-4 border-green-100 relative overflow-hidden">
      {/* Certificate Header */}
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Award className="h-8 w-8 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-green-600 mb-2">Certificate of Completion</h3>
        <div className="w-20 h-1 bg-green-600 mx-auto"></div>
      </div>

      {/* Certificate Body */}
      <div className="text-center space-y-4">
        <p className="text-gray-600 text-sm">This is to certify that</p>
        
        <div className="bg-green-50 p-3 rounded-lg">
          <p className="text-xl font-bold text-green-800">{getUserName()}</p>
        </div>
        
        <p className="text-gray-600 text-sm">has successfully completed</p>
        
        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-lg font-semibold text-gray-800">Renewable Energy Fundamentals</p>
          <p className="text-sm text-gray-600">4 hours • 12 lessons</p>
        </div>

        <div className="flex items-center justify-center text-green-600 pt-2">
          <CheckCircle className="h-5 w-5 mr-2" />
          <span className="text-sm font-medium">Score: 85%</span>
        </div>
      </div>

      {/* Certificate Footer */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            {currentDate}
          </div>
          <div className="text-green-600 font-medium">GreenEdu Platform</div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-4 right-4 w-8 h-8 bg-green-200 rounded-full opacity-30"></div>
      <div className="absolute bottom-4 left-4 w-6 h-6 bg-green-300 rounded-full opacity-30"></div>
    </div>
  );
};

export default SampleCertificate;
