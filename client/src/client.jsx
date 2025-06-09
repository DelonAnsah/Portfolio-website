import { createClient } from '@sanity/client'

export const client = createClient({
  projectId: 'b15qssiq',
  dataset: 'production',
  useCdn: true,
  apiVersion: '2023-01-01'
})
