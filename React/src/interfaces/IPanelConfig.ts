import React from 'react';

export interface PanelFieldConfig {
  readonly key: string; // Path to the data (e.g., 'auditType.name', 'status')
  readonly label?: string; // Display label
  readonly icon?: React.ComponentType; // Icon component to display
  readonly type: 'text' | 'badge' | 'date' | 'user' | 'custom';
  readonly badgeConfig?: {
    readonly colorScheme?: string;
    readonly variant?: string;
    readonly valueMap?: Record<string, string>; // Map values to display text
    readonly statusConfig?: Record<string, {
      readonly colorScheme?: string;
      readonly bg?: string;
      readonly color?: string;
      readonly icon?: React.ComponentType;
      readonly text?: string;
    }>; // Specific config per status value
  };
  readonly dateFormat?: string;
  readonly fallback?: string; // Default value if data is missing
  readonly userType?: string; // Text label for user count (e.g., "assigned", "members")
  readonly render?: (value: any, item: any) => React.ReactNode; // Custom render function
  readonly textColorMap?: Record<string, string>; // Map values to custom text colors
  readonly textStyle?: {
    readonly color?: string;
    readonly textDecoration?: string;
    readonly cursor?: string;
    readonly fontSize?: string;
    readonly fontWeight?: number | string;
  }; // Custom text styling
}

export interface PanelConfig {
  readonly header?: {
    readonly show: boolean;
    readonly fields: readonly PanelFieldConfig[];
  };
  readonly title: {
    readonly primary: PanelFieldConfig;
    readonly secondary?: PanelFieldConfig;
  };
  readonly status: PanelFieldConfig;
  readonly description?: PanelFieldConfig;
  readonly details: readonly PanelFieldConfig[];
  readonly linkedItem?: {
    readonly show: boolean;
    readonly fieldKey: string; // Key to check for linked item existence
    readonly label: string; // Label to display
    readonly icon?: React.ComponentType; // Icon to display next to label
    readonly render?: (value: any, item: any) => React.ReactNode; // Custom render function
  };
  readonly actions: {
    readonly primary?: {
      readonly label: string;
      readonly icon?: React.ComponentType;
      readonly onClick: (item: any) => void;
    };
    readonly panelClick?: {
      readonly onClick: (item: any) => void;
    };
    readonly secondary?: {
      readonly label: string;
      readonly onClick: (item: any) => void;
    };
    readonly secondaryActions?: readonly {
      readonly label: string;
      readonly icon?: React.ComponentType;
      readonly onClick: (item: any) => void;
    }[];
  };
}

export interface PanelViewProps {
  readonly items: readonly any[];
  readonly config: PanelConfig;
  readonly containerProps?: {
    readonly bg?: string;
    readonly p?: string | number;
    readonly gap?: string | number;
  };
}
