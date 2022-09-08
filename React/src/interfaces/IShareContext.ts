import { Dispatch, SetStateAction } from 'react';

export interface IShareContext {
  isShareOpen: boolean;
  handleShareOpen: () => void;
  handleShareClose: () => void;

  shareItemUrl: string | undefined;
  setShareItemUrl: Dispatch<SetStateAction<string | undefined>>;

  shareItemName: string | undefined;
  setShareItemName: Dispatch<SetStateAction<string | undefined>>;
}
