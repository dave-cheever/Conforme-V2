import { ChakraProvider } from '@chakra-ui/react';
import { render } from '@testing-library/react';

import { DocumentIcon, HelpSupportIcon, LogoutIcon, NotificationIcon, ShieldIcon } from '../../icons';

const renderIcon = (IconComponent: any, props = {}) =>
  render(
    <ChakraProvider data-id="002518">
      <IconComponent data-id="002519" {...props} />
    </ChakraProvider>,
  );

describe('UserMenu Icons', () => {
  describe('NotificationIcon', () => {
    it('renders without crashing', () => {
      const { container } = renderIcon(NotificationIcon);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('has correct viewBox', () => {
      const { container } = renderIcon(NotificationIcon);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('viewBox', '0 0 17 19');
    });

    it('uses currentColor for fill', () => {
      const { container } = renderIcon(NotificationIcon);
      const path = container.querySelector('path');
      expect(path).toHaveAttribute('fill', 'currentColor');
    });
  });

  describe('DocumentIcon', () => {
    it('renders without crashing', () => {
      const { container } = renderIcon(DocumentIcon);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('has correct viewBox', () => {
      const { container } = renderIcon(DocumentIcon);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('viewBox', '0 0 14 18');
    });

    it('uses currentColor for fill', () => {
      const { container } = renderIcon(DocumentIcon);
      const path = container.querySelector('path');
      expect(path).toHaveAttribute('fill', 'currentColor');
    });
  });

  describe('ShieldIcon', () => {
    it('renders without crashing', () => {
      const { container } = renderIcon(ShieldIcon);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('has correct viewBox', () => {
      const { container } = renderIcon(ShieldIcon);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('viewBox', '0 0 16 18');
    });

    it('has two path elements', () => {
      const { container } = renderIcon(ShieldIcon);
      const paths = container.querySelectorAll('path');
      expect(paths).toHaveLength(2);
    });

    it('uses currentColor for fill', () => {
      const { container } = renderIcon(ShieldIcon);
      const paths = container.querySelectorAll('path');
      paths.forEach((path) => {
        expect(path).toHaveAttribute('fill', 'currentColor');
      });
    });
  });

  describe('HelpSupportIcon', () => {
    it('renders without crashing', () => {
      const { container } = renderIcon(HelpSupportIcon);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('has correct viewBox', () => {
      const { container } = renderIcon(HelpSupportIcon);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('viewBox', '0 0 20 21');
    });

    it('has two path elements', () => {
      const { container } = renderIcon(HelpSupportIcon);
      const paths = container.querySelectorAll('path');
      expect(paths).toHaveLength(2);
    });

    it('uses currentColor for fill', () => {
      const { container } = renderIcon(HelpSupportIcon);
      const paths = container.querySelectorAll('path');
      paths.forEach((path) => {
        expect(path).toHaveAttribute('fill', 'currentColor');
      });
    });
  });

  describe('LogoutIcon', () => {
    it('renders without crashing', () => {
      const { container } = renderIcon(LogoutIcon);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('has correct viewBox', () => {
      const { container } = renderIcon(LogoutIcon);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('viewBox', '0 0 20 21');
    });

    it('has two path elements', () => {
      const { container } = renderIcon(LogoutIcon);
      const paths = container.querySelectorAll('path');
      expect(paths).toHaveLength(2);
    });

    it('uses currentColor for fill', () => {
      const { container } = renderIcon(LogoutIcon);
      const paths = container.querySelectorAll('path');
      paths.forEach((path) => {
        expect(path).toHaveAttribute('fill', 'currentColor');
      });
    });
  });

  describe('Icon Integration', () => {
    it('all icons can be rendered with Chakra UI Icon component', () => {
      const icons = [NotificationIcon, DocumentIcon, ShieldIcon, HelpSupportIcon, LogoutIcon];

      icons.forEach((Icon) => {
        const { container } = renderIcon(Icon);
        expect(container.firstChild).toBeInTheDocument();
      });
    });

    it('all icons inherit color from parent', () => {
      const icons = [NotificationIcon, DocumentIcon, ShieldIcon, HelpSupportIcon, LogoutIcon];

      icons.forEach((Icon) => {
        const { container } = renderIcon(Icon);
        const paths = container.querySelectorAll('path');
        paths.forEach((path) => {
          expect(path).toHaveAttribute('fill', 'currentColor');
        });
      });
    });
  });
});
