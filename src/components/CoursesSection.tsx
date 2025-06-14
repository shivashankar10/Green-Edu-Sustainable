
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Play, Clock, Users, Award, Star } from 'lucide-react';

const CoursesSection = () => {
  const courses = [
    {
      id: 1,
      title: "Renewable Energy Fundamentals",
      description: "Explore solar, wind, hydro, and other renewable energy sources shaping our sustainable future.",
      duration: "4 hours",
      lessons: 12,
      students: 1234,
      rating: 4.8,
      level: "Beginner",
      image: "bg-gradient-to-br from-yellow-400 to-orange-500",
      category: "Energy"
    },
    {
      id: 2,
      title: "Sustainable Agriculture Practices",
      description: "Learn modern farming techniques that protect the environment while ensuring food security.",
      duration: "6 hours",
      lessons: 18,
      students: 890,
      rating: 4.9,
      level: "Intermediate",
      image: "bg-gradient-to-br from-green-400 to-emerald-600",
      category: "Agriculture"
    },
    {
      id: 3,
      title: "Climate Change Mitigation",
      description: "Understand climate science and discover practical solutions to reduce global warming.",
      duration: "5 hours",
      lessons: 15,
      students: 2156,
      rating: 4.7,
      level: "All Levels",
      image: "bg-gradient-to-br from-blue-400 to-cyan-600",
      category: "Climate"
    },
    {
      id: 4,
      title: "Waste Management & Recycling",
      description: "Master the principles of waste reduction, recycling, and circular economy practices.",
      duration: "3 hours",
      lessons: 10,
      students: 756,
      rating: 4.6,
      level: "Beginner",
      image: "bg-gradient-to-br from-purple-400 to-pink-500",
      category: "Waste"
    },
    {
      id: 5,
      title: "Water Conservation Strategies",
      description: "Discover innovative methods to conserve and manage water resources effectively.",
      duration: "4 hours",
      lessons: 14,
      students: 1089,
      rating: 4.8,
      level: "Intermediate",
      image: "bg-gradient-to-br from-cyan-400 to-blue-600",
      category: "Water"
    },
    {
      id: 6,
      title: "Green Building & Architecture",
      description: "Learn sustainable construction practices and eco-friendly building design principles.",
      duration: "7 hours",
      lessons: 20,
      students: 634,
      rating: 4.9,
      level: "Advanced",
      image: "bg-gradient-to-br from-emerald-400 to-green-600",
      category: "Construction"
    }
  ];

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner':
        return 'bg-green-100 text-green-800';
      case 'Intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'Advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <section id="courses" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Featured <span className="gradient-text">Sustainability Courses</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Dive deep into environmental sustainability with our comprehensive video lessons, 
            interactive quizzes, and earn certificates to showcase your knowledge.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {courses.map((course) => (
            <Card key={course.id} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-white border-0 shadow-lg">
              <CardHeader className="p-0">
                <div className={`h-48 ${course.image} rounded-t-lg flex items-center justify-center relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300"></div>
                  <Play className="h-12 w-12 text-white z-10 group-hover:scale-110 transition-transform duration-300" />
                  <Badge className="absolute top-4 left-4 bg-white/90 text-gray-800 hover:bg-white">
                    {course.category}
                  </Badge>
                </div>
                <div className="p-6 pb-2">
                  <div className="flex items-center justify-between mb-2">
                    <Badge className={getLevelColor(course.level)}>
                      {course.level}
                    </Badge>
                    <div className="flex items-center text-sm text-gray-600">
                      <Star className="h-4 w-4 text-yellow-400 mr-1" />
                      {course.rating}
                    </div>
                  </div>
                  <CardTitle className="text-xl mb-2 group-hover:text-green-600 transition-colors">
                    {course.title}
                  </CardTitle>
                  <CardDescription className="text-gray-600 line-clamp-2">
                    {course.description}
                  </CardDescription>
                </div>
              </CardHeader>
              
              <CardContent className="px-6 pb-2">
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {course.duration}
                  </div>
                  <div className="flex items-center">
                    <Play className="h-4 w-4 mr-1" />
                    {course.lessons} lessons
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    {course.students.toLocaleString()}
                  </div>
                </div>
              </CardContent>

              <CardFooter className="px-6 pt-4">
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white group-hover:bg-green-700">
                  <Award className="h-4 w-4 mr-2" />
                  Start Course
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button size="lg" variant="outline" className="border-green-600 text-green-600 hover:bg-green-50">
            View All Courses
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CoursesSection;
