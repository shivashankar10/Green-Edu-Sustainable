import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  GraduationCap, 
  Award, 
  Building2, 
  Globe, 
  TrendingUp, 
  Users, 
  CheckCircle,
  Leaf,
  Target,
  Lightbulb
} from 'lucide-react';

const BusinessModelPage = () => {
  const skills = [
    { category: 'Frontend Development', skills: 'React, TypeScript, Component Architecture, State Management' },
    { category: 'Backend Integration', skills: 'REST APIs, Database Design, Authentication Systems' },
    { category: 'Security', skills: 'JWT Tokens, Row Level Security, Input Validation' },
    { category: 'Database Design', skills: 'PostgreSQL, Relational Schema, Foreign Keys' },
    { category: 'Modern Tools', skills: 'Git, Vite, Tailwind CSS, Supabase BaaS' },
    { category: 'Problem Solving', skills: 'Quiz Logic, Certificate Generation, QR Verification' },
  ];

  const revenueStreams = [
    { source: 'Premium Subscriptions', calculation: '100 users × ₹499', amount: '₹49,900' },
    { source: 'Certificate Sales', calculation: '200 × ₹199', amount: '₹39,800' },
    { source: 'College License', calculation: '2 colleges', amount: '₹8,333' },
  ];

  const sdgGoals = [
    { number: 4, title: 'Quality Education', description: 'Ensuring inclusive and equitable quality education' },
    { number: 13, title: 'Climate Action', description: 'Taking urgent action to combat climate change' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <Badge className="bg-green-100 text-green-800 mb-4">Business Model & Benefits</Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            GreenEdu <span className="text-green-600">Value Proposition</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            A sustainable education platform with multiple revenue streams and measurable social impact
          </p>
        </div>

        {/* Personal Benefits Section */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <Lightbulb className="h-8 w-8 text-yellow-500" />
            <h2 className="text-3xl font-bold text-gray-900">Personal Benefits & Skills Gained</h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {skills.map((item, index) => (
              <Card key={index} className="border-l-4 border-l-green-500 hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg text-green-700">{item.category}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm">{item.skills}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Business Models Section */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <TrendingUp className="h-8 w-8 text-green-600" />
            <h2 className="text-3xl font-bold text-gray-900">Revenue Models</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Freemium Model */}
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Users className="h-6 w-6 text-blue-600" />
                  <CardTitle className="text-blue-800">Freemium</CardTitle>
                </div>
                <Badge variant="secondary">Most Popular</Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="font-semibold text-gray-700 mb-2">Free Tier:</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" /> 2-3 basic courses</li>
                    <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" /> Limited quiz attempts</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold text-gray-700 mb-2">Premium (₹499/mo):</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" /> All courses</li>
                    <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" /> Downloadable certificates</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Pay-Per-Certificate */}
            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Award className="h-6 w-6 text-purple-600" />
                  <CardTitle className="text-purple-800">Per Certificate</CardTitle>
                </div>
                <Badge variant="secondary">Simple</Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="font-semibold text-gray-700 mb-2">Course Access: FREE</p>
                  <p className="font-semibold text-gray-700 mb-2">Certificate: ₹199 each</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" /> QR verified</li>
                    <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" /> LinkedIn shareable</li>
                    <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" /> Employer portal</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* B2B Model */}
            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Building2 className="h-6 w-6 text-orange-600" />
                  <CardTitle className="text-orange-800">B2B / College</CardTitle>
                </div>
                <Badge variant="secondary">Enterprise</Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="font-semibold text-gray-700 mb-2">₹50,000/year</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" /> Unlimited students</li>
                    <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" /> Custom branding</li>
                    <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" /> Admin dashboard</li>
                    <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" /> Analytics & reports</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Government/CSR */}
            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Globe className="h-6 w-6 text-green-600" />
                  <CardTitle className="text-green-800">Govt/CSR</CardTitle>
                </div>
                <Badge variant="secondary">Partnership</Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="font-semibold text-gray-700 mb-2">Partners:</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" /> Ministry of Environment</li>
                    <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" /> Corporate CSR</li>
                    <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" /> Environmental NGOs</li>
                  </ul>
                  <p className="mt-2 font-semibold text-gray-700">Revenue: Grants + Sponsorships</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Revenue Projection */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <Target className="h-8 w-8 text-green-600" />
            <h2 className="text-3xl font-bold text-gray-900">Monthly Revenue Projection</h2>
          </div>

          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-green-600 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left">Revenue Stream</th>
                    <th className="px-6 py-4 text-left">Calculation</th>
                    <th className="px-6 py-4 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {revenueStreams.map((item, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium">{item.source}</td>
                      <td className="px-6 py-4 text-gray-600">{item.calculation}</td>
                      <td className="px-6 py-4 text-right font-semibold text-green-600">{item.amount}</td>
                    </tr>
                  ))}
                  <tr className="bg-green-50">
                    <td className="px-6 py-4 font-bold text-lg" colSpan={2}>Total Monthly Revenue</td>
                    <td className="px-6 py-4 text-right font-bold text-xl text-green-700">₹98,033</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>
        </section>

        {/* Social Impact Section */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <Leaf className="h-8 w-8 text-green-600" />
            <h2 className="text-3xl font-bold text-gray-900">Social Impact & SDG Alignment</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {sdgGoals.map((goal) => (
              <Card key={goal.number} className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="bg-white/20 rounded-full p-4">
                      <span className="text-3xl font-bold">{goal.number}</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">SDG {goal.number}: {goal.title}</h3>
                      <p className="text-green-100">{goal.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="bg-gradient-to-br from-emerald-50 to-green-50 border-green-200">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-green-800 mb-6 flex items-center gap-2">
                <GraduationCap className="h-7 w-7" />
                Environmental Education Impact
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                  <p className="text-gray-700">Spreading awareness about sustainability and environmental conservation</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                  <p className="text-gray-700">Training future environmental professionals with verified credentials</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                  <p className="text-gray-700">Providing QR-verified certifications for job applications</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                  <p className="text-gray-700">Contributing to global climate action through education</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Key Takeaway */}
        <section className="text-center">
          <Card className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
            <CardContent className="p-10">
              <h2 className="text-3xl font-bold mb-4">Key Takeaway</h2>
              <p className="text-xl text-green-100 max-w-4xl mx-auto leading-relaxed">
                "This project demonstrates full-stack development skills using industry-standard tools 
                (React, TypeScript, Supabase) while creating a sustainable business model that generates 
                revenue through freemium subscriptions, certificate sales, and enterprise licensing - 
                all while contributing to environmental education and climate action."
              </p>
            </CardContent>
          </Card>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default BusinessModelPage;
