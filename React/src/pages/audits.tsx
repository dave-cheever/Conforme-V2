import { gql, useQuery } from '@apollo/client';
import { Modal, ModalOverlay } from '@chakra-ui/react';

import AuditModal from '../components/AuditModal/AuditModal';
import { useAdminContext } from '../contexts/AdminProvider';
import AuditModalProvider, {
  useAuditModalContext,
} from '../contexts/AuditModalProvider';
import AuditTeamProvider from '../contexts/AuditTeamProvider';
import useDevice from '../hooks/useDevice';

const GET_AUDITS = gql`
  query ($auditQueryInput: AuditQueryInput) {
    audits(auditQueryInput: $auditQueryInput) {
      _id
      auditTypeId
      walkType
      siteId
      areaId
      metatags {
        addedAt
        addedBy
      }
    }
  }
`;

const Audits = () => {
  const device = useDevice();
  const { adminModalState, setAdminModalState } = useAdminContext();
  const { reset, trigger } = useAuditModalContext();
  const { refetch } = useQuery(GET_AUDITS);
  const { audit } = useAuditModalContext();

  const onCloseModal = async () => {
    await trigger();
    reset();
    setAdminModalState('closed');
  };

  return (
    <>
      <Modal
        isOpen={adminModalState !== 'closed'}
        key={audit._id}
        onClose={onCloseModal}
        size={
          device === 'desktop' ||
          device === 'tablet' ||
          adminModalState === 'delete'
            ? '2xl'
            : 'full'
        }
        variant={adminModalState === 'delete' ? 'deleteModal' : 'conformeModal'}
      >
        <ModalOverlay />
        <AuditModal refetch={refetch} />
      </Modal>
    </>
  );
};

const AuditsWithContext = () => (
  <AuditTeamProvider>
    <AuditModalProvider>
      <Audits />
    </AuditModalProvider>
  </AuditTeamProvider>
);

export default AuditsWithContext;

export const auditsStyles = {
  auditsItems: {
    header: {
      menuButtonBg: 'white',
      rightIcon: '#9A9EA1',
      menuItemFocus: '#462AC4',
      menuItemFontSelected: '#462AC4',
      menuItemFont: '#9A9EA1',
    },
  },
};
