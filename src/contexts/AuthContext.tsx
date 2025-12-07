import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        // When user signs in, create/update their profile
        if (event === "SIGNED_IN" && session?.user) {
          setTimeout(() => {
            upsertUserProfile(session.user);
          }, 0);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const upsertUserProfile = async (user: User) => {
    const email = user.email;
    const displayName = user.user_metadata?.full_name || user.user_metadata?.name || email?.split("@")[0];

    try {
      // Check if profile exists
      const { data: existingProfile } = await supabase
        .from("user_tryon_profiles")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (existingProfile) {
        // Update existing profile with email/name
        await supabase
          .from("user_tryon_profiles")
          .update({
            email,
            display_name: displayName,
          })
          .eq("user_id", user.id);
      } else {
        // Create new profile
        await supabase
          .from("user_tryon_profiles")
          .insert({
            user_id: user.id,
            email,
            display_name: displayName,
            height_cm: 170, // Default value required by schema
          });
      }
    } catch (error) {
      console.error("Error upserting user profile:", error);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
