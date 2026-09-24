import Hero from '../components/Hero.jsx'
import Services from '../components/Services.jsx'
import Menu from '../components/Menu.jsx'
import About from '../components/About.jsx'
import Reviews from '../components/Reviews.jsx'
import CtaBanner from '../components/CtaBanner.jsx'

export default function Home() {
  return (
    <>
      <Hero />
      <Services />
      <Menu />
      <About />
      <Reviews />
      <CtaBanner />
    </>
  )
}
