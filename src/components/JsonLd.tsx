import { Helmet } from 'react-helmet-async'

interface JsonLdProps {
  data: object
}

/** Injects a JSON-LD structured data block into the page head. */
export function JsonLd({ data }: JsonLdProps) {
  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(data)}</script>
    </Helmet>
  )
}
