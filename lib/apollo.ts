import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { getToken } from './api';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, '') ?? 'http://10.0.2.2:8080';

const httpLink = createHttpLink({
  uri: `${BASE_URL}/graphql`,
});

const authLink = setContext((_, { headers }) => {
  const token = getToken();
  return {
    headers: {
      ...headers,
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    }
  }
});

export const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          approvedEvents: {
            // Consider events cached as long as they are fetched
            merge(existing, incoming) {
              return incoming;
            },
          },
        },
      },
      // Merge partial User writes into existing cache entries so that
      // queries fetching a subset of User fields (e.g. organizer in event
      // listings) don't clobber fields fetched by the full profile query.
      User: {
        merge(existing, incoming, { mergeObjects }) {
          return mergeObjects(existing, incoming);
        },
      },
    },
  }),
});
