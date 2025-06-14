
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { supabase } from '@/integrations/supabase/client'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useToast } from "@/components/ui/use-toast"
import { Leaf } from 'lucide-react'

const AuthPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        toast({
          title: "Successfully signed in!",
          description: "Welcome back to GreenEdu.",
        });
        navigate('/');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="flex flex-col items-center">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/')}>
            <div className="p-2 bg-green-500 rounded-lg">
              <Leaf className="h-8 w-8 text-white" />
            </div>
            <span className="text-3xl font-bold gradient-text">GreenEdu</span>
          </div>
          <h2 className="mt-6 text-center text-2xl font-bold text-gray-900">
            Join our community of learners
          </h2>
        </div>
        <div className="bg-white p-8 rounded-2xl shadow-lg">
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#16a34a',
                    brandAccent: '#15803d',
                  },
                },
              },
             }}
            providers={['google', 'github']}
            theme="light"
            socialLayout="horizontal"
            redirectTo={`${window.location.origin}`}
          />
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
