
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Leaf, Menu, User, BookOpen, GraduationCap, Shield } from 'lucide-react';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        checkAdminStatus(session.user.id);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        checkAdminStatus(session.user.id);
      } else {
        setIsAdmin(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkAdminStatus = async (userId: string) => {
    try {
      const { data } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .single();

      setIsAdmin(data?.role === 'admin');
    } catch (error) {
      setIsAdmin(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsOpen(false);
    navigate('/');
  };

  const navigationItems = [
    { name: 'Home', href: '/' },
    { name: 'Courses', href: '/courses' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  const handleLogin = () => {
    setIsOpen(false);
    navigate('/auth');
  }

  const handleNavigation = (href: string) => {
    if (href.startsWith('#')) {
      // Handle anchor links for home page
      if (window.location.pathname !== '/') {
        navigate('/');
        setTimeout(() => {
          const element = document.querySelector(href);
          element?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        const element = document.querySelector(href);
        element?.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate(href);
    }
    setIsOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-green-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/')}>
            <div className="p-2 bg-green-500 rounded-lg">
              <Leaf className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">GreenEdu</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavigation(item.href)}
                className="text-gray-600 hover:text-green-600 transition-colors duration-200 font-medium"
              >
                {item.name}
              </button>
            ))}
          </nav>

          {/* Desktop CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {session ? (
                <>
                  <span className="text-sm font-medium text-gray-700 hidden sm:block">{session.user.email}</span>
                  {isAdmin && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => navigate('/admin')} 
                      className="text-purple-600 border-purple-600 hover:bg-purple-50 hover:text-purple-700"
                    >
                      <Shield className="h-4 w-4 mr-2" />
                      Admin
                    </Button>
                  )}
                  <Button variant="outline" size="sm" onClick={handleLogout} className="text-green-600 border-green-600 hover:bg-green-50 hover:text-green-700">
                    Logout
                  </Button>
                </>
            ) : (
              <>
                <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-700 hover:bg-green-50" onClick={handleLogin}>
                  <User className="h-4 w-4 mr-2" />
                  Login
                </Button>
                <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" onClick={handleLogin}>
                  <GraduationCap className="h-4 w-4 mr-2" />
                  Start Learning
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="sm">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col space-y-4 mt-8">
                {navigationItems.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => handleNavigation(item.href)}
                    className="text-lg font-medium text-gray-600 hover:text-green-600 transition-colors duration-200 py-2 text-left"
                  >
                    {item.name}
                  </button>
                ))}
                <div className="pt-4 border-t border-gray-200">
                  {session ? (
                      <>
                        <div className="px-4 py-2 text-sm text-gray-600 truncate">{session.user.email}</div>
                        {isAdmin && (
                          <Button 
                            variant="ghost" 
                            className="w-full justify-start text-purple-600 hover:text-purple-700 hover:bg-purple-50 mb-2" 
                            onClick={() => {
                              setIsOpen(false);
                              navigate('/admin');
                            }}
                          >
                            <Shield className="h-4 w-4 mr-2" />
                            Admin Dashboard
                          </Button>
                        )}
                        <Button variant="ghost" className="w-full justify-start text-green-600 hover:text-green-700 hover:bg-green-50" onClick={handleLogout}>
                          Logout
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button variant="ghost" className="w-full justify-start text-green-600 hover:text-green-700 hover:bg-green-50 mb-2" onClick={handleLogin}>
                          <User className="h-4 w-4 mr-2" />
                          Login
                        </Button>
                        <Button className="w-full bg-green-600 hover:bg-green-700 text-white" onClick={handleLogin}>
                          <GraduationCap className="h-4 w-4 mr-2" />
                          Start Learning
                        </Button>
                      </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
