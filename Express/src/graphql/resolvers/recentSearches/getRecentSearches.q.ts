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

    const sortedSearches = allRecentSearches
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

