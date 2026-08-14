import { useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { resolveHashRedirect } from "../../config/hashRedirects"

const HashRedirect: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const target = resolveHashRedirect(
      location.pathname,
      location.hash,
      location.search
    )
    if (target) {
      navigate(target, { replace: true })
    }
  }, [location.hash, location.pathname, location.search, navigate])

  return null
}

export default HashRedirect
