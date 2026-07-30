import { Routes, Route } from 'react-router-dom'
import { SiteLayout } from './components/layout/SiteLayout'
import Home from './pages/Home'
import RecWeek from './pages/RecWeek'
import RecWeekMap from './pages/RecWeekMap'
import About from './pages/About'
import Leadership from './pages/Leadership'
import Organizations from './pages/Organizations'
import OrganizationProfile from './pages/OrganizationProfile'
import Events from './pages/Events'
import EventDetail from './pages/EventDetail'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/recweek" element={<RecWeek />} />
        <Route path="/recweek/map" element={<RecWeekMap />} />
        <Route path="/about" element={<About />} />
        <Route path="/leadership" element={<Leadership />} />
        <Route path="/organizations" element={<Organizations />} />
        <Route path="/organizations/:slug" element={<OrganizationProfile />} />
        <Route path="/events" element={<Events />} />
        <Route path="/events/:slug" element={<EventDetail />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
