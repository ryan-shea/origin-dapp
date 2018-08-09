import { makeExecutableSchema } from 'graphql-tools';
import { SchemaLink } from 'apollo-link-schema';
import { InMemoryCache } from 'apollo-cache-inmemory';
import ApolloClient from 'apollo-client';

import origin from './origin'

const typeDefs = `
  type ListingData {
    name: String
  }
  type Event {
    name: String
  }
  type Listing {
    id: String!
    ipfsHash: String
    ipfs: ListingData
    events: [Event]
  }
  type Query {
    listingIds: [String]
    listing(id: String!): Listing
    listings: [Listing]
  }
  type User {
    address: String!
  }
`;

const resolvers = {
  Query: {
    listingIds: async () => {
      return await origin.marketplace.getListings()
    },
    listing: async (_, { id }) => {
      return await origin.marketplace.getListing2(id)
    },
    listings: async () => {
      const listingIds = await origin.marketplace.getListings()
      const listings = []
      for (const id of listingIds) {
        const listing = await origin.marketplace.getListing2(id)
        listings.push(listing)
      }
      return listings
    }
  },
  Listing: {
    ipfs: async (listing) => {
      const ipfsHash = origin.contractService.getIpfsHashFromBytes32(listing.ipfsHash)
      const file = await origin.ipfsService.getFile(ipfsHash)
      return file.data
    }
  }
};

const schema = makeExecutableSchema({
  typeDefs,
  resolvers
});

const client = new ApolloClient({
  link: new SchemaLink({ schema }),
  cache: new InMemoryCache()
})

export default client
