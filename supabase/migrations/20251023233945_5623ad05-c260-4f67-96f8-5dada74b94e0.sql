-- Create app_role enum
CREATE TYPE public.app_role AS ENUM ('patient', 'medecin', 'pharmacien', 'admin');

-- Create ordonnance_statut enum
CREATE TYPE public.ordonnance_statut AS ENUM ('active', 'delivree', 'expiree', 'annulee');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  nom TEXT NOT NULL,
  prenom TEXT NOT NULL,
  date_naissance DATE,
  telephone TEXT,
  qr_id TEXT UNIQUE NOT NULL,
  antecedents TEXT,
  allergies TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, role)
);

-- Create consultations table
CREATE TABLE public.consultations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  medecin_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  symptomes TEXT NOT NULL,
  examens TEXT,
  diagnostic TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create ordonnances table
CREATE TABLE public.ordonnances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  consultation_id UUID REFERENCES public.consultations(id) ON DELETE CASCADE,
  prescripteur_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  patient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  contenu JSONB NOT NULL,
  signature_electronique TEXT NOT NULL,
  statut ordonnance_statut DEFAULT 'active',
  qr_code TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create delivrances table
CREATE TABLE public.delivrances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ordonnance_id UUID NOT NULL REFERENCES public.ordonnances(id) ON DELETE CASCADE,
  pharmacien_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  date_delivrance TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  quantite INTEGER NOT NULL,
  lot TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create documents table
CREATE TABLE public.documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  nom TEXT NOT NULL,
  url TEXT NOT NULL,
  hash TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create audit_logs table
CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  target_id UUID,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  details JSONB
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ordonnances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delivrances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Create function to check user role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Create function to generate QR ID
CREATE OR REPLACE FUNCTION public.generate_qr_id()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN 'QR-' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 12));
END;
$$;

-- Create function to handle new user
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_role app_role;
BEGIN
  user_role := COALESCE((NEW.raw_user_meta_data->>'role')::app_role, 'patient');
  
  INSERT INTO public.profiles (user_id, nom, prenom, qr_id)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'nom', 'Nom'),
    COALESCE(NEW.raw_user_meta_data->>'prenom', 'Prénom'),
    generate_qr_id()
  );
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, user_role);
  
  RETURN NEW;
END;
$$;

-- Create trigger for new users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create update timestamp function
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_consultations_updated_at BEFORE UPDATE ON public.consultations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_ordonnances_updated_at BEFORE UPDATE ON public.ordonnances
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Medecins can view all profiles"
  ON public.profiles FOR SELECT
  USING (public.has_role(auth.uid(), 'medecin'));

CREATE POLICY "Pharmaciens can view all profiles"
  ON public.profiles FOR SELECT
  USING (public.has_role(auth.uid(), 'pharmacien'));

-- RLS Policies for user_roles
CREATE POLICY "Users can view own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

-- RLS Policies for consultations
CREATE POLICY "Patients can view own consultations"
  ON public.consultations FOR SELECT
  USING (patient_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

CREATE POLICY "Medecins can view all consultations"
  ON public.consultations FOR SELECT
  USING (public.has_role(auth.uid(), 'medecin'));

CREATE POLICY "Medecins can create consultations"
  ON public.consultations FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'medecin'));

CREATE POLICY "Medecins can update own consultations"
  ON public.consultations FOR UPDATE
  USING (medecin_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

-- RLS Policies for ordonnances
CREATE POLICY "Patients can view own ordonnances"
  ON public.ordonnances FOR SELECT
  USING (patient_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

CREATE POLICY "Medecins can view all ordonnances"
  ON public.ordonnances FOR SELECT
  USING (public.has_role(auth.uid(), 'medecin'));

CREATE POLICY "Pharmaciens can view ordonnances"
  ON public.ordonnances FOR SELECT
  USING (public.has_role(auth.uid(), 'pharmacien'));

CREATE POLICY "Medecins can create ordonnances"
  ON public.ordonnances FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'medecin'));

CREATE POLICY "Medecins can update own ordonnances"
  ON public.ordonnances FOR UPDATE
  USING (prescripteur_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

-- RLS Policies for delivrances
CREATE POLICY "Users can view related delivrances"
  ON public.delivrances FOR SELECT
  USING (
    pharmacien_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
    OR ordonnance_id IN (SELECT id FROM public.ordonnances WHERE patient_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()))
  );

CREATE POLICY "Pharmaciens can create delivrances"
  ON public.delivrances FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'pharmacien'));

-- RLS Policies for documents
CREATE POLICY "Users can view own documents"
  ON public.documents FOR SELECT
  USING (owner_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

CREATE POLICY "Medecins can view all documents"
  ON public.documents FOR SELECT
  USING (public.has_role(auth.uid(), 'medecin'));

CREATE POLICY "Users can create own documents"
  ON public.documents FOR INSERT
  WITH CHECK (owner_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

-- RLS Policies for audit_logs
CREATE POLICY "Admins can view all logs"
  ON public.audit_logs FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));