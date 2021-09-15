import { CheckIcon, CloseIcon } from "@chakra-ui/icons";
import { Avatar, Box, ButtonGroup, Editable, EditableInput, EditablePreview, Flex, IconButton, Tooltip } from "@chakra-ui/react";
import { useState } from "react";

import Header from "../../components/Header";
import { Eye } from "../../icons";
import Pencil from "../../icons/Pencil";
import { IUser } from "../../interfaces/IUser";

interface IEditableControls {
  isEditing: boolean, 
  onSubmit: any, 
  onCancel: any, 
  onEdit: any, 
  user: IUser
}

const Users = () => {
  const [itemCount] = useState<any[]>([]);
  const users: IUser[] = [{
    displayName: "displayName",
    email:"email",
    firstName:"firstName",
    id:"id",
    jobTitle:"jobTitle",
    lastName:"lastName",
    role:"reader"
  }]

  const EditableControls = ({ isEditing, onSubmit, onCancel, onEdit, user }: IEditableControls) => {
    return isEditing ? (
      <ButtonGroup justifyContent="center" size="sm" px={3}>
        <IconButton name={user.id} aria-label='' icon={<CheckIcon name={user.id} />}
          onClick={() => {
            onSubmit();
            // updateDefaultPageDropdown(user);
          }} _hover={{ bg: "#018587", color: "#FFFFFF" }} />
        <Box onClick={onCancel}>
          <IconButton aria-label='' icon={<CloseIcon />} 
          // onClick={() => onCancell(user)} 
          _hover={{ bg: "brand.primary", color: "#FFFFFF" }} />
        </Box>
      </ButtonGroup>
    ) : (
      <Flex justifyContent="center" px={2}>
        <IconButton _hover={{ color: "#018587" }} variant="ghost" aria-label='' size="md" icon={<Pencil mt="2px" />} onClick={onEdit} />
      </Flex>
    )
  };

  const getDefaultPageName = (defaultPage: string | undefined) => {
    let name = 'Homepage';
    switch (defaultPage) {
      case '/admin/compliance-items':
        name = 'Admin page'
        break;
      default:
        name = 'Home page'
    }
    return name;
  };

  const renderUserRow = (user: IUser, i: number) => (
    <Flex key={user.id} w='full' h='73px' bg='#FFFFFF' mb="1px" alignItems='center' borderTopRadius={i === 0 ? [0, 'lg'] : ''} borderBottomRadius={(i === users.length - 1) ? [0, 'lg'] : ''} boxShadow="sm">
      <Box w='35%' lineHeight="32px" fontWeight="bold" pl={3} pr={2}>
        <Avatar
          borderColor='brand.active'
          rounded='full'
          name={user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : `${user.displayName}`}
          size='sm'
          src={user.imgUrl}
          mx={3}
        />
        {user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : `${user.displayName}`}
      </Box>
      <Box w='20%'>{user.jobTitle ? user.jobTitle : 'Not specified'}</Box>
      <Box w='15%'>
        {user.role?.charAt(0).toUpperCase() + user.role?.slice(1)}
      </Box>
      <Box w='20%'>
        <Editable
          value={getDefaultPageName(user.defaultPage) || 'Homepage'}
          isPreviewFocusable={false}
          submitOnBlur={false}
        >
          {(props) => (
            <Flex align="center">
              <EditablePreview />
              <EditableInput {...props} user={user} />
              <EditableControls {...props} user={user} />
            </Flex>
          )}
        </Editable>
      </Box>

      <Flex w='10%' align='center' justifyContent="flex-end" pr="30px">{getItemCount(user.id)}
        <Tooltip label="Show Items" fontSize="md">
          <Eye color='#018587' cursor='pointer' ml={4} mt='2px' 
          // onClick={() => onEyeClick(user.id)} 
          />
        </Tooltip>
        </Flex>
    </Flex>
  );
  
  const getItemCount = (id: string) => {
    const userItemCount = itemCount[id];

    if (userItemCount) {
      return userItemCount;
    }
    return 0;
  };

  return (
    <>
      <Header breadcrumbs={["Admin", "Users"]} hideBreadcrumbsOnMobile />
      <Flex h='calc(100vh - 150px)'>
          <Box w='full' h='full' overflow='auto' p={[0, 8]}>
            <Flex pb={4} w='full' color="#9A9EA1" display={["none", "flex"]}>
              <Box w='35%'>User name</Box>
              <Box w='20%'>Job title</Box>
              <Box w='15%'>Role/permissions</Box>
              <Box w='20%'>Default page</Box>
              <Flex w='10%' justifyContent="flex-end">Items by user</Flex>
            </Flex>
            <Box w='full'>
              {users?.map((user, i) => renderUserRow(user, i))}
            </Box>
          </Box>
        </Flex>
    </>
  );
};

export default Users;
