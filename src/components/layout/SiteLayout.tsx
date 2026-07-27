import { Outlet } from 'react-router-dom'
import { Navbar } from './Navbar'
import { Footer } from './Footer'
import { FabricTexture } from '../ui/FabricTexture'

export function SiteLayout() {
  return (
    <>
      <FabricTexture />
      <Navbar />
      <main className="relative z-[2]">
        <Outlet />
      </main>
      <Footer />
    </>
  )
}
