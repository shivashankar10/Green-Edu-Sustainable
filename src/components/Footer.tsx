
import { Leaf, BookOpen, Users, Award, Play } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="p-2 bg-green-500 rounded-lg">
                <Leaf className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold">GreenEdu</span>
            </div>
            <p className="text-gray-400 mb-4 leading-relaxed">
              Empowering individuals with sustainability knowledge through interactive online learning experiences.
            </p>
            <div className="text-sm text-gray-500">
              Supporting UN SDG 4: Quality Education
            </div>
          </div>

          {/* Learning Column */}
          <div>
            <h3 className="font-semibold mb-4 flex items-center">
              <BookOpen className="h-5 w-5 mr-2 text-green-500" />
              Learning
            </h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-green-400 transition-colors">All Courses</a></li>
              <li><a href="#" className="hover:text-green-400 transition-colors">Beginner Courses</a></li>
              <li><a href="#" className="hover:text-green-400 transition-colors">Advanced Courses</a></li>
              <li><a href="#" className="hover:text-green-400 transition-colors">Certification</a></li>
              <li><a href="#" className="hover:text-green-400 transition-colors">Learning Paths</a></li>
            </ul>
          </div>

          {/* Topics Column */}
          <div>
            <h3 className="font-semibold mb-4 flex items-center">
              <Play className="h-5 w-5 mr-2 text-green-500" />
              Topics
            </h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-green-400 transition-colors">Renewable Energy</a></li>
              <li><a href="#" className="hover:text-green-400 transition-colors">Climate Change</a></li>
              <li><a href="#" className="hover:text-green-400 transition-colors">Sustainable Agriculture</a></li>
              <li><a href="#" className="hover:text-green-400 transition-colors">Water Conservation</a></li>
              <li><a href="#" className="hover:text-green-400 transition-colors">Green Building</a></li>
            </ul>
          </div>

          {/* Community Column */}
          <div>
            <h3 className="font-semibold mb-4 flex items-center">
              <Users className="h-5 w-5 mr-2 text-green-500" />
              Community
            </h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-green-400 transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-green-400 transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-green-400 transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-green-400 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-green-400 transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2024 GreenEdu. All rights reserved. | Supporting sustainable education worldwide.
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <div className="flex items-center">
                <Award className="h-4 w-4 mr-1 text-green-500" />
                <span>UN SDG 4 Aligned</span>
              </div>
              <div className="text-green-400 font-medium">
                Made with 💚 for Earth
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
