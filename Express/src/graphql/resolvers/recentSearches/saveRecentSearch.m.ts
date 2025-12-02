import { RecentSearches, Users } from 'app-models';
import { genMetatags } from 'app-utils';
import { MAX_RECENT_SEARCHES } from 'src/constants';
import { v4 as uuidv4 } from 'uuid';
import { ENTITY_TYPES, isEntityType } from 'app-enums';

const saveRecentSearch = async (_, { saveRecentSearchInput }, { authorize, organization }) => {
  try {
    const authUser = await authorize();
    const { term, entityId, entityType, userId } = saveRecentSearchInput;

    if (authUser.userId !== userId) {
      throw new Error('User is not permitted');
    }

    if (!isEntityType(entityType)) {
      throw new Error(`Invalid entityType. Must be one of: ${ENTITY_TYPES.join(', ')}`);
    }

    const user = await Users.customFindById(userId, organization._id);
    if (!user) {
      throw new Error("User doesn't exist or doesn't belong to this organization");
    }

    const allSearchesRaw = await RecentSearches.find({
      userId,
      organizationId: organization._id,
    })
      .lean();
    
    const allSearches = allSearchesRaw.sort((a, b) => {
      const dateA = a.metatags?.addedAt ? new Date(a.metatags.addedAt).getTime() : 0;
      const dateB = b.metatags?.addedAt ? new Date(b.metatags.addedAt).getTime() : 0;
      return dateB - dateA; // Descending order (newest first)
    });

    const duplicateSearch = allSearches.find(
      (search) => search.term === term && search.entityId === entityId && search.entityType === entityType,
    );

    const newMetatags = genMetatags('added', userId);
    let recentSearchNeedToDeleteCheck = false;

    if (duplicateSearch) {
      if (duplicateSearch.metatags?.removedAt) {
        await RecentSearches.updateOne(
          { _id: duplicateSearch._id },
          {
            'metatags.addedAt': newMetatags.addedAt as Date,
            'metatags.addedBy': newMetatags.addedBy as string,
            'metatags.removedAt': null,
            'metatags.removedBy': null,
            'metatags.updatedAt': new Date(),
            'metatags.updatedBy': userId,
          },
        );
        recentSearchNeedToDeleteCheck = true;
      } else {
        await RecentSearches.updateOne(
          { _id: duplicateSearch._id },
          {
            'metatags.addedAt': newMetatags.addedAt as Date,
            'metatags.updatedAt': new Date(),
            'metatags.updatedBy': userId,
          },
        );
      }
    } else {
      const newRecentSearch = {
        _id: uuidv4(),
        userId,
        term,
        entityId,
        entityType,
        organizationId: organization._id,
        metatags: {
          addedBy: newMetatags.addedBy as string,
          addedAt: newMetatags.addedAt as Date,
        },
      };

      await RecentSearches.create(newRecentSearch);
      recentSearchNeedToDeleteCheck = true;
    }

    if (recentSearchNeedToDeleteCheck) {
      const activeSearchesRaw = await RecentSearches.find({
        userId,
        organizationId: organization._id,
        'metatags.removedAt': { $eq: null },
      })
        .lean();
      
      const activeSearches = activeSearchesRaw.sort((a, b) => {
        const dateA = a.metatags?.addedAt ? new Date(a.metatags.addedAt).getTime() : 0;
        const dateB = b.metatags?.addedAt ? new Date(b.metatags.addedAt).getTime() : 0;
        return dateB - dateA; // Descending order (newest first)
      });

      if (activeSearches.length > MAX_RECENT_SEARCHES) {
        const searchesToDelete = activeSearches.slice(MAX_RECENT_SEARCHES);
        const idsToDelete = searchesToDelete.map((search) => search._id);

        await RecentSearches.updateMany(
          { _id: { $in: idsToDelete } },
          {
            'metatags.removedAt': new Date(),
            'metatags.removedBy': userId,
            'metatags.updatedAt': new Date(),
            'metatags.updatedBy': userId,
          },
        );
      }
    }

    const allFinalSearches = await RecentSearches.customFindByUserId(userId, organization._id);
    
    const finalSearches = allFinalSearches
      .sort((a, b) => {
        const dateA = a.metatags?.addedAt ? new Date(a.metatags.addedAt).getTime() : 0;
        const dateB = b.metatags?.addedAt ? new Date(b.metatags.addedAt).getTime() : 0;
        return dateB - dateA; // Descending order (newest first)
      })
      .slice(0, MAX_RECENT_SEARCHES);

    return finalSearches;
  } catch (err: any) {
    throw new Error(err.message || 'Failed to save recent search');
  }
};

export default saveRecentSearch;
