import React from 'react';
import { format } from 'date-fns';

import { Box, Text } from '@chakra-ui/react';
import { PanelConfig } from '../../../interfaces/IPanelConfig';
import { EditIcon, Trashcan } from '../../../icons';

const ACTION_CATEGORY_DEFAULT_USED_COUNT = 0;

const actionCategoryPanelConfig: PanelConfig = {
  title: {
    primary: {
      key: 'name',
      type: 'custom',
      fallback: 'No Name',
      render: (value: string) => {
        return React.createElement(
          Text,
          {
            color: '#1A202C',
            fontSize: '17px',
            fontWeight: 600,
            lineHeight: '100%',
            noOfLines: 2,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          },
          value || 'No Name',
        );
      },
    },
  },
  status: {
    key: '_id',
    type: 'text',
    fallback: '',
    render: () => null,
  },
  details: [
    {
      key: 'used',
      type: 'custom',
      fallback: '0 Actions',
      render: (value: number) => {
        const count = value || ACTION_CATEGORY_DEFAULT_USED_COUNT;
        const text = `${count} ${count === 1 ? 'Action' : 'Actions'}`;
        return React.createElement(
          Box,
          {
            key: 'used-detail',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
          },
          [
            React.createElement(
              Text,
              {
                key: 'used-label',
                color: '#4A5568',
                fontSize: '14px',
                fontWeight: 500,
                lineHeight: '100%',
                letterSpacing: '0%'
              },
              'Used',
            ),
            React.createElement(
              Text,
              {
                key: 'used-value',
                color: '#1A202C',
                fontSize: '14px',
                fontWeight: 500,
                lineHeight: '100%',
                letterSpacing: '-1%'
              },
              text,
            ),
          ],
        );
      },
    },
    {
      key: 'metatags',
      type: 'custom',
      fallback: 'No Date',
      render: (value: any) => {
        let formatted = 'No Date';
        const dateToUse = value?.updatedAt || value?.addedAt;
        if (dateToUse) {
          try {
            formatted = format(new Date(dateToUse), 'd MMMM yyyy HH:mm');
          } catch {
            formatted = 'No Date';
          }
        }
        return React.createElement(
          Box,
          {
            key: 'last-modified-detail',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '4px',
          },
          [
            React.createElement(
              Text,
              {
                key: 'last-modified-label',
                color: '#4A5568',
                fontSize: '14px',
                fontWeight: 500,
                lineHeight: '100%',
                letterSpacing: '-1%'
              },
              'Last Modified',
            ),
            React.createElement(
              Text,
              {
                key: 'last-modified-value',
                color: '#1A202C',
                fontSize: '14px',
                fontWeight: 500,
                lineHeight: '100%',
                letterSpacing: '-1%'
              },
              formatted,
            ),
          ],
        );
      },
    },
  ],
  actions: {
    primary: {
      label: 'Edit',
      icon: EditIcon,
      onClick: () => {
        // This will be set by the parent component
      },
    },
    panelClick: {
      onClick: () => {
        // This will be set by the parent component
      },
    },
    delete: {
      label: 'Delete',
      icon: Trashcan,
      onClick: () => {
        // This will be set by the parent component
      },
    },
  },
};

export default actionCategoryPanelConfig;

