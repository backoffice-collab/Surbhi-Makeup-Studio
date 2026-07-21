import Hero from '@/components/sections/Hero'
import CtaBand from '@/components/ui/CtaBand'
import {
  FeaturedServices,
  WhyChoose,
  FeaturedWork,
  AcademyPreview,
  TestimonialsPreview,
  InstagramStrip,
} from '@/components/sections/HomeSections'

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedServices />
      <WhyChoose />
      <FeaturedWork />
      <AcademyPreview />
      <TestimonialsPreview />
      <InstagramStrip />
      <CtaBand
        eyebrow="Your day deserves the best"
        heading="Let's create your bridal look"
        body="Book a consultation or reserve your wedding date with Surbhi Makeup Studio."
      />
    </>
  )
}
