-- =====================================================
-- SCRIPT SQL POUR SUPABASE - CVY (Communaute Virtuelle de Yopougon)
-- =====================================================
-- Executez ce script dans: Supabase Dashboard > SQL Editor
-- =====================================================

-- =====================================================
-- TABLE: profiles (Extension de auth.users)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Informations personnelles
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  phone VARCHAR(20),
  quartier VARCHAR(100),
  bio TEXT,
  avatar_url TEXT,
  
  -- Donnees academiques/professionnelles
  etablissement VARCHAR(200),
  departement VARCHAR(200),
  poste VARCHAR(50),
  niveau_etudes VARCHAR(50),
  specialite VARCHAR(200),
  
  -- Parcours et interets
  formations_suivies TEXT[] DEFAULT '{}',
  cours_actuels TEXT[] DEFAULT '{}',
  centres_interet TEXT[] DEFAULT '{}',
  projets_en_cours TEXT[] DEFAULT '{}',
  
  -- Systeme
  role VARCHAR(20) DEFAULT 'membre',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- TABLE: events (Calendrier des activites)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(200) NOT NULL,
  description TEXT,
  type VARCHAR(50) NOT NULL, -- 'cours', 'formation', 'sport', 'detente'
  date DATE NOT NULL,
  time_start TIME,
  time_end TIME,
  location VARCHAR(200),
  max_participants INTEGER,
  
  -- Relations
  created_by UUID REFERENCES public.profiles(id),
  
  -- Systeme
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- TABLE: event_registrations (Inscriptions aux evenements)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.event_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'inscrit', -- 'inscrit', 'present', 'absent'
  registered_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(event_id, user_id)
);

-- =====================================================
-- TABLE: resources (Ressources partagees)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(200) NOT NULL,
  description TEXT,
  file_url TEXT,
  file_type VARCHAR(50), -- 'pdf', 'video', 'image', 'document'
  category VARCHAR(100),
  
  -- Relations
  author_id UUID REFERENCES public.profiles(id),
  
  -- Stats
  downloads_count INTEGER DEFAULT 0,
  likes_count INTEGER DEFAULT 0,
  
  -- Moderation
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
  
  -- Systeme
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- TABLE: resource_likes (Likes sur ressources)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.resource_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_id UUID REFERENCES public.resources(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(resource_id, user_id)
);

-- =====================================================
-- TABLE: discussions (Forum de discussion)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.discussions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(300) NOT NULL,
  content TEXT NOT NULL,
  category VARCHAR(100),
  
  -- Relations
  author_id UUID REFERENCES public.profiles(id),
  
  -- Stats
  views_count INTEGER DEFAULT 0,
  replies_count INTEGER DEFAULT 0,
  
  -- Moderation
  is_pinned BOOLEAN DEFAULT false,
  is_locked BOOLEAN DEFAULT false,
  status VARCHAR(20) DEFAULT 'active', -- 'active', 'closed', 'deleted'
  
  -- Systeme
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- TABLE: discussion_replies (Reponses aux discussions)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.discussion_replies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  discussion_id UUID REFERENCES public.discussions(id) ON DELETE CASCADE,
  author_id UUID REFERENCES public.profiles(id),
  content TEXT NOT NULL,
  
  -- Moderation
  status VARCHAR(20) DEFAULT 'active', -- 'active', 'deleted'
  
  -- Systeme
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- TABLE: notifications (Notifications)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  type VARCHAR(50), -- 'event', 'resource', 'discussion', 'system'
  title VARCHAR(200),
  message TEXT,
  link VARCHAR(500),
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Activer RLS sur toutes les tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resource_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discussions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discussion_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- POLICIES: profiles
-- =====================================================
CREATE POLICY "profiles_select_all" ON public.profiles 
  FOR SELECT USING (true);

CREATE POLICY "profiles_insert_own" ON public.profiles 
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_own" ON public.profiles 
  FOR UPDATE USING (auth.uid() = id);

-- =====================================================
-- POLICIES: events
-- =====================================================
CREATE POLICY "events_select_active" ON public.events 
  FOR SELECT USING (is_active = true);

CREATE POLICY "events_insert_admin" ON public.events 
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "events_update_admin" ON public.events 
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "events_delete_admin" ON public.events 
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- =====================================================
-- POLICIES: event_registrations
-- =====================================================
CREATE POLICY "event_registrations_select_own" ON public.event_registrations 
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "event_registrations_insert_own" ON public.event_registrations 
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "event_registrations_delete_own" ON public.event_registrations 
  FOR DELETE USING (user_id = auth.uid());

-- =====================================================
-- POLICIES: resources
-- =====================================================
CREATE POLICY "resources_select_approved" ON public.resources 
  FOR SELECT USING (status = 'approved' OR author_id = auth.uid());

CREATE POLICY "resources_insert_authenticated" ON public.resources 
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "resources_update_own" ON public.resources 
  FOR UPDATE USING (author_id = auth.uid());

CREATE POLICY "resources_delete_own_or_admin" ON public.resources 
  FOR DELETE USING (
    author_id = auth.uid() OR 
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- =====================================================
-- POLICIES: resource_likes
-- =====================================================
CREATE POLICY "resource_likes_select_all" ON public.resource_likes 
  FOR SELECT USING (true);

CREATE POLICY "resource_likes_insert_own" ON public.resource_likes 
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "resource_likes_delete_own" ON public.resource_likes 
  FOR DELETE USING (user_id = auth.uid());

-- =====================================================
-- POLICIES: discussions
-- =====================================================
CREATE POLICY "discussions_select_active" ON public.discussions 
  FOR SELECT USING (status = 'active' OR author_id = auth.uid());

CREATE POLICY "discussions_insert_authenticated" ON public.discussions 
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "discussions_update_own" ON public.discussions 
  FOR UPDATE USING (author_id = auth.uid());

CREATE POLICY "discussions_delete_own_or_admin" ON public.discussions 
  FOR DELETE USING (
    author_id = auth.uid() OR 
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- =====================================================
-- POLICIES: discussion_replies
-- =====================================================
CREATE POLICY "discussion_replies_select_active" ON public.discussion_replies 
  FOR SELECT USING (status = 'active' OR author_id = auth.uid());

CREATE POLICY "discussion_replies_insert_authenticated" ON public.discussion_replies 
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "discussion_replies_update_own" ON public.discussion_replies 
  FOR UPDATE USING (author_id = auth.uid());

CREATE POLICY "discussion_replies_delete_own_or_admin" ON public.discussion_replies 
  FOR DELETE USING (
    author_id = auth.uid() OR 
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- =====================================================
-- POLICIES: notifications
-- =====================================================
CREATE POLICY "notifications_select_own" ON public.notifications 
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "notifications_update_own" ON public.notifications 
  FOR UPDATE USING (user_id = auth.uid());

-- =====================================================
-- TRIGGER: Auto-creation du profil lors de l'inscription
-- =====================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'first_name', NULL),
    COALESCE(NEW.raw_user_meta_data ->> 'last_name', NULL)
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- TRIGGER: Mise a jour automatique de updated_at
-- =====================================================
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON public.events
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_resources_updated_at
  BEFORE UPDATE ON public.resources
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_discussions_updated_at
  BEFORE UPDATE ON public.discussions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_discussion_replies_updated_at
  BEFORE UPDATE ON public.discussion_replies
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

-- =====================================================
-- INDEX pour optimiser les performances
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_events_date ON public.events(date);
CREATE INDEX IF NOT EXISTS idx_events_type ON public.events(type);
CREATE INDEX IF NOT EXISTS idx_resources_status ON public.resources(status);
CREATE INDEX IF NOT EXISTS idx_resources_category ON public.resources(category);
CREATE INDEX IF NOT EXISTS idx_discussions_status ON public.discussions(status);
CREATE INDEX IF NOT EXISTS idx_discussions_category ON public.discussions(category);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON public.notifications(is_read);

-- =====================================================
-- FIN DU SCRIPT
-- =====================================================
-- Apres execution, votre base de donnees est prete!
-- Pour creer un admin, executez:
-- UPDATE public.profiles SET role = 'admin' WHERE id = 'VOTRE_USER_ID';
-- =====================================================
