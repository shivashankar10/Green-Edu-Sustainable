
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { supabase } from '@/integrations/supabase/client'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useToast } from "@/components/ui/use-toast"
import { Leaf, AlertCircle, CheckCircle } from 'lucide-react'
import { Alert, AlertDescription } from "@/components/ui/alert"

const AuthPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is already signed in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate('/');
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth event:', event);
      
      if (event === 'SIGNED_IN' && session) {
        toast({
          title: "Successfully signed in!",
          description: "Welcome back to GreenEdu.",
        });
        navigate('/');
      } else if (event === 'PASSWORD_RECOVERY') {
        toast({
          title: "Password recovery email sent",
          description: "Check your email for the password reset link.",
        });
      } else if (event === 'USER_UPDATED') {
        toast({
          title: "Account updated",
          description: "Your account has been successfully updated.",
        });
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
        <Alert className="mb-4 bg-blue-50 border-blue-200">
          <CheckCircle className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            After signing up, you'll receive a verification email. Please check your inbox and spam folder.
          </AlertDescription>
        </Alert>
        
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
            localization={{
              variables: {
                sign_up: {
                  email_label: 'Email address',
                  password_label: 'Create a password',
                  button_label: 'Sign up',
                  loading_button_label: 'Signing up...',
                  social_provider_text: 'Sign up with {{provider}}',
                  link_text: "Don't have an account? Sign up",
                  confirmation_text: 'Check your email for the confirmation link',
                },
                sign_in: {
                  email_label: 'Email address',
                  password_label: 'Your password',
                  button_label: 'Sign in',
                  loading_button_label: 'Signing in...',
                  social_provider_text: 'Sign in with {{provider}}',
                  link_text: 'Already have an account? Sign in',
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
