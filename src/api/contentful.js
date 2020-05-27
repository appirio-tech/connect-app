import { createClient } from "contentful";
import { CONTENTFUL_DELIVERY_KEY, CONTENTFUL_SPACE_ID } from '../config/constants'
console.log(CONTENTFUL_DELIVERY_KEY)
export function getClient() {
  return createClient({
    space: CONTENTFUL_SPACE_ID,
    accessToken: CONTENTFUL_DELIVERY_KEY,
  })
}

export function getEntry(id) {
  const client = getClient();
  return client.getEntry(id, { include: 10 })
}