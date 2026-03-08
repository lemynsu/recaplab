
-- Drop the overly permissive policy and replace with a more specific one
DROP POLICY "Anyone can upload photos" ON public.photos;
CREATE POLICY "Users can upload photos to active events" ON public.photos FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.events WHERE id = event_id AND status = 'active')
);
