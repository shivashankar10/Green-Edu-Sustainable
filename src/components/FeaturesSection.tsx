
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Play, CheckCircle, Award, Users, BookOpen, GraduationCap } from 'lucide-react';

const FeaturesSection = () => {
  const features = [
    {
      icon: Play,
      title: "Interactive Video Lessons",
      description: "Engage with high-quality video content designed by sustainability experts to make learning both informative and enjoyable.",
      color: "text-green-600"
    },
    {
      icon: CheckCircle,
      title: "Knowledge Assessment",
      description: "Test your understanding with interactive quizzes after each lesson to reinforce learning and track your progress.",
      color: "text-blue-600"
    },
    {
      icon: Award,
      title: "Instant Certification",
      description: "Earn certificates automatically when you score 80% or higher on quizzes, showcasing your sustainability knowledge.",
      color: "text-yellow-600"
    },
    {
      icon: Users,
      title: "Global Learning Community",
      description: "Join thousands of learners worldwide who are committed to creating a more sustainable future through education.",
      color: "text-purple-600"
    },
    {
      icon: BookOpen,
      title: "Expert-Curated Content",
      description: "Learn from carefully selected educational materials that align with UN Sustainable Development Goals and current research.",
      color: "text-emerald-600"
    },
    {
      icon: GraduationCap,
      title: "Flexible Learning Path",
      description: "Study at your own pace with lifetime access to all course materials, making sustainable education accessible to everyone.",
      color: "text-indigo-600"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Why Choose <span className="gradient-text">GreenEdu</span>?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our platform combines cutting-edge technology with expert knowledge to deliver 
            an unparalleled sustainability learning experience.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md hover:-translate-y-1 bg-white">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4 p-3 rounded-full bg-gray-50 group-hover:bg-green-50 transition-colors duration-300 w-fit">
                  <feature.icon className={`h-8 w-8 ${feature.color} group-hover:scale-110 transition-transform duration-300`} />
                </div>
                <CardTitle className="text-xl mb-2 group-hover:text-green-600 transition-colors">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-gray-600 leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-20 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-8 text-white">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold mb-2">15,000+</div>
              <div className="text-green-100">Students Enrolled</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">500+</div>
              <div className="text-green-100">Video Lessons</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">8,500+</div>
              <div className="text-green-100">Certificates Issued</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">4.9</div>
              <div className="text-green-100">Average Rating</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
