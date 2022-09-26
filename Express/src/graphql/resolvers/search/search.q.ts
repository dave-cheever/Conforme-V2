import { flatten, uniq } from 'lodash';

import { ISearchResult } from 'app-interfaces';
import { Actions, Answers, AuditLogs, Audits, Responses } from 'app-models';

const search = async (_, { searchQuery }, { authorize, organization }) => {
  try {
    const user = await authorize();
    const { searchText, scopes, moduleId } = searchQuery;
    const data: object[] = await Promise.all(scopes.map(async ({ type, _id }) => {
      let searchResults: ISearchResult[];
      switch (type) {
        case 'audits': {
          searchResults = await Audits.customSearch({ searchText }, user, organization._id);
          break;
        }
        case 'tracker-item-response': {
          searchResults = await Responses.customSearch({ searchText }, user, organization._id);
          break;
        }
        case 'actions': {
          searchResults = await Actions.customSearch({ searchText }, user, organization._id);
          break;
        }
        case 'answers': {
          searchResults = await Answers.customSearch({ searchText, questionsCategoryId: _id }, user, organization._id);
          break;
        }
        default:
          searchResults = [];
      }
      return searchResults.map(searchResult => ({ ...searchResult, scope: { type, _id } }));
    }));

    await AuditLogs.customAudit(
      {
        coll: uniq(scopes.map(({ type }) => type)).join('-'),
        action: 'search',
        element: {
          _id: 'null',
          name: 'search',
        },
        values: {
          searchText: {
            new: {
              value: searchText,
              label: searchText,
            },
          },
        },
      },
      user._id,
      organization._id,
      moduleId,
    );

    return flatten(data);
  } catch (err: any) {
    throw new Error(err);
  }
};

export default search;
