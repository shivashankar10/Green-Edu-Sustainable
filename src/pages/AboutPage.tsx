
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Leaf, Users, Award, Globe, Heart, Target } from 'lucide-react';

const AboutPage = () => {
  const values = [
    {
      icon: Leaf,
      title: "Environmental Impact",
      description: "We're committed to creating educational content that drives real environmental change and sustainable practices."
    },
    {
      icon: Users,
      title: "Community Learning",
      description: "Building a global community of learners who support each other in their sustainability journey."
    },
    {
      icon: Award,
      title: "Quality Education",
      description: "Providing high-quality, expert-curated content that meets international educational standards."
    },
    {
      icon: Globe,
      title: "Global Accessibility",
      description: "Making sustainability education accessible to everyone, regardless of location or background."
    }
  ];

  const team = [
    {
      name: "Tagore",
      role: "Founder & CEO",
      description: "Environmental scientist with 15+ years of experience in sustainable development and education."
    },
    {
      name: "Supriya",
      role: "Chief Technology Officer",
      description: "Tech innovator passionate about using technology to solve environmental challenges."
    },
    {
      name: "Junaid",
      role: "Head of Curriculum",
      description: "Educational expert specializing in online learning and environmental sciences."
    },
    {
      name: "Shivashankar",
      role: "Sustainability Advisor",
      description: "Former UN advisor with expertise in climate policy and sustainable business practices."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-20 pb-16">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-green-50 via-white to-blue-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-4xl sm:text-5xl font-bold mb-6">
                About <span className="gradient-text">GreenEdu</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                We're on a mission to democratize sustainability education and empower individuals 
                worldwide to create a more sustainable future through knowledge and action.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">15,000+</div>
                  <div className="text-sm text-gray-600">Students Worldwide</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">500+</div>
                  <div className="text-sm text-gray-600">Video Lessons</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">50+</div>
                  <div className="text-sm text-gray-600">Expert Instructors</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">95%</div>
                  <div className="text-sm text-gray-600">Satisfaction Rate</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">
                  Our <span className="gradient-text">Mission</span>
                </h2>
                <p className="text-lg text-gray-600 mb-6">
                  At GreenEdu, we believe that education is the most powerful tool for creating 
                  positive environmental change. Our mission is to make high-quality sustainability 
                  education accessible to everyone, everywhere.
                </p>
                <p className="text-lg text-gray-600 mb-6">
                  We partner with leading environmental experts, scientists, and educators to create 
                  comprehensive learning experiences that not only inform but inspire action towards 
                  a more sustainable world.
                </p>
                <div className="flex items-center space-x-4">
                  <Heart className="h-8 w-8 text-green-600" />
                  <span className="text-lg font-medium">Passionate about planet Earth</span>
                </div>
              </div>
              <div className="relative">
                <div className="bg-gradient-to-br from-green-400 to-emerald-600 rounded-2xl p-8 text-white">
                  <Target className="h-12 w-12 mb-4" />
                  <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
                  <p className="text-lg">
                    A world where every individual has the knowledge and tools to contribute 
                    to a sustainable future, creating lasting positive impact for generations to come.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">
                Our <span className="gradient-text">Values</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                These core values guide everything we do and shape our approach to sustainability education.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <div className="mx-auto mb-4 p-3 rounded-full bg-green-50 w-fit">
                      <value.icon className="h-8 w-8 text-green-600" />
                    </div>
                    <CardTitle className="text-xl">{value.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-600">
                      {value.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">
                Meet Our <span className="gradient-text">Team</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Our diverse team of experts is passionate about sustainability and committed to 
                delivering world-class educational experiences.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {team.map((member, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <span className="text-white text-2xl font-bold">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <CardTitle className="text-xl">{member.name}</CardTitle>
                    <CardDescription className="text-green-600 font-medium">
                      {member.role}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-600">
                      {member.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AboutPage;
