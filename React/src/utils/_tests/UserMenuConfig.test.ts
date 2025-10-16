import { userMenus } from '../../bootstrap/config';

describe('UserMenu Configuration', () => {
  describe('userMenus array', () => {
    it('should have correct number of menu items', () => {
      expect(userMenus).toHaveLength(4);
    });

    it('should have all required properties for each menu item', () => {
      userMenus.forEach((menuItem) => {
        expect(menuItem).toHaveProperty('label');
        expect(menuItem).toHaveProperty('url');
        expect(menuItem).toHaveProperty('icon');
        expect(typeof menuItem.label).toBe('string');
        expect(typeof menuItem.url).toBe('string');
        expect(typeof menuItem.icon).toBe('string');
      });
    });

    it('should have correct menu items', () => {
      const expectedMenus = [
        {
          label: 'Notification settings',
          url: '/notification-settings',
          icon: 'NotificationIcon',
        },
        {
          label: 'Terms and conditions',
          url: '/terms-and-conditions',
          icon: 'DocumentIcon',
        },
        {
          label: 'Privacy policy',
          url: '/privacy-policy',
          icon: 'ShieldIcon',
        },
        {
          label: 'Help & support',
          url: '/help',
          icon: 'HelpSupportIcon',
        },
      ];

      expect(userMenus).toEqual(expectedMenus);
    });

    it('should have valid URLs for each menu item', () => {
      userMenus.forEach((menuItem) => {
        expect(menuItem.url).toMatch(/^\//); // Should start with /
        expect(menuItem.url.length).toBeGreaterThan(1); // Should not be just /
      });
    });

    it('should have valid icon names for each menu item', () => {
      const validIconNames = ['NotificationIcon', 'DocumentIcon', 'ShieldIcon', 'HelpSupportIcon', 'LogoutIcon'];

      userMenus.forEach((menuItem) => {
        expect(validIconNames).toContain(menuItem.icon);
      });
    });

    it('should have unique labels', () => {
      const labels = userMenus.map((item) => item.label);
      const uniqueLabels = [...new Set(labels)];
      expect(labels).toHaveLength(uniqueLabels.length);
    });

    it('should have unique URLs', () => {
      const urls = userMenus.map((item) => item.url);
      const uniqueUrls = [...new Set(urls)];
      expect(urls).toHaveLength(uniqueUrls.length);
    });

    it('should have unique icons', () => {
      const icons = userMenus.map((item) => item.icon);
      const uniqueIcons = [...new Set(icons)];
      expect(icons).toHaveLength(uniqueIcons.length);
    });
  });

  describe('Menu item structure', () => {
    it('should not have permission property for regular menu items', () => {
      userMenus.forEach((menuItem) => {
        expect(menuItem).not.toHaveProperty('permission');
      });
    });

    it('should have consistent naming convention for labels', () => {
      userMenus.forEach((menuItem) => {
        // Labels should be title case or sentence case
        expect(menuItem.label).toMatch(/^[A-Z]/);
        expect(menuItem.label).not.toMatch(/[A-Z]{2,}/); // No consecutive uppercase letters
      });
    });

    it('should have consistent URL structure', () => {
      userMenus.forEach((menuItem) => {
        // URLs should be kebab-case
        expect(menuItem.url).toMatch(/^\/[a-z-]+$/);
      });
    });

    it('should have consistent icon naming', () => {
      userMenus.forEach((menuItem) => {
        // Icon names should be PascalCase
        expect(menuItem.icon).toMatch(/^[A-Z][a-zA-Z]*Icon$/);
      });
    });
  });

  describe('Menu item content', () => {
    it('should have meaningful labels', () => {
      const meaningfulLabels = ['Notification settings', 'Terms and conditions', 'Privacy policy', 'Help & support'];

      userMenus.forEach((menuItem) => {
        expect(meaningfulLabels).toContain(menuItem.label);
      });
    });

    it('should have appropriate URLs for each menu item', () => {
      const urlMappings = {
        'Notification settings': '/notification-settings',
        'Terms and conditions': '/terms-and-conditions',
        'Privacy policy': '/privacy-policy',
        'Help & support': '/help',
      };

      userMenus.forEach((menuItem) => {
        expect(menuItem.url).toBe(urlMappings[menuItem.label]);
      });
    });

    it('should have appropriate icons for each menu item', () => {
      const iconMappings = {
        'Notification settings': 'NotificationIcon',
        'Terms and conditions': 'DocumentIcon',
        'Privacy policy': 'ShieldIcon',
        'Help & support': 'HelpSupportIcon',
      };

      userMenus.forEach((menuItem) => {
        expect(menuItem.icon).toBe(iconMappings[menuItem.label]);
      });
    });
  });
});
