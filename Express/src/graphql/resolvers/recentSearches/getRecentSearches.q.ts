import { RecentSearches } from 'app-models';
import { MAX_RECENT_SEARCHES } from 'src/constants';

const getRecentSearches = async (_, { getRecentSearchesInput }, { authorize, organization }) => {
  try {
    const authUser = await authorize();
    const { userId } = getRecentSearchesInput;

    if (authUser.userId !== userId) {
      throw new Error('User is not permitted');
    }

    const allRecentSearches = await RecentSearches.customFindByUserId(userId, organization._id);

    // Filter out records with null, undefined, or empty text values
    // This prevents GraphQL errors since text is a non-nullable field
    const validSearches = allRecentSearches.filter(
      (search) => search && search.text && typeof search.text === 'string' && search.text.trim().length > 0
    );

    const sortedSearches = validSearches
      .sort((a, b) => {
        const dateA = a.metatags?.addedAt ? new Date(a.metatags.addedAt).getTime() : 0;
        const dateB = b.metatags?.addedAt ? new Date(b.metatags.addedAt).getTime() : 0;
        return dateB - dateA; // Descending order (newest first)
      })
      .slice(0, MAX_RECENT_SEARCHES);

    return sortedSearches;
  } catch (err: any) {
    throw new Error(err.message || 'Failed to get recent searches');
  }
};

export default getRecentSearches;

