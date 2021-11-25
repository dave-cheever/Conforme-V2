import { CheckIcon, CloseIcon } from "@chakra-ui/icons";
import { 
  Avatar, 
  Box, 
  ButtonGroup, 
  Editable, 
  EditableInput, 
  EditablePreview, 
  Flex, 
  IconButton, 
  Tooltip, 
} from "@chakra-ui/react";
import { useState } from "react";
import AdminTableHeader from "../../components/Admin/AdminTableHeader";
import AdminTableHeaderElement from "../../components/Admin/AdminTableHeaderElement";

import Header from "../../components/Header";
import { ArrowCount, ArrowRight } from "../../icons";
import { IUser } from "../../interfaces/IUser";

interface IEditableControls {
  isEditing: boolean, 
  onSubmit: any, 
  onCancel: any, 
  user: IUser
}

const Users = () => {
  const [itemCount] = useState<any[]>([]);
  const users: IUser[] = [{
    displayName: "displayName",
    email:"email",
    firstName:"first",
    _id:"id",
    jobTitle:"jobTitle",
    lastName:"last",
    role:"reader"
  }]

  const EditableControls = ({ isEditing, onSubmit, onCancel, user }: IEditableControls) => {
    return isEditing ? (
      <ButtonGroup justifyContent="center" size="sm" px={3}>
        <IconButton name={user._id} aria-label='' icon={<CheckIcon name={user._id} />}
          onClick={() => {
            onSubmit();
          }} _hover={{ bg: "#018587", color: "#FFFFFF" }} />
        <Box onClick={onCancel}>
          <IconButton aria-label='' icon={<CloseIcon />} 
          _hover={{ bg: "brand.primary", color: "#FFFFFF" }} />
        </Box>
      </ButtonGroup>
    ) : (
      <Flex justifyContent="center" px={2}>
        <IconButton _hover={{ color: "#018587" }} variant="ghost" aria-label='' size="md" icon={<ArrowRight stroke="#282F36" transform="rotate(90deg)" />} />
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
    <Flex 
      key={user._id} 
      w='full' 
      h='73px' 
      flexShrink={0}
      bg='#FFFFFF' 
      px="25px"
      mb="1px" 
      fontSize="smm"
      alignItems='center' 
      borderBottomRadius={(i === users.length - 1) ? [0, 'lg'] : ''} 
      boxShadow="sm"
    >
      <Box w='20%' lineHeight="32px">
        <Avatar
          borderColor='brand.active'
          rounded='full'
          name={user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : `${user.displayName}`}
          size='sm'
          src={user.imgUrl}
          mr={3}
        />
        {user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : `${user.displayName}`}
      </Box>
      <Box w='20%'>{user.jobTitle ? user.jobTitle : 'Not specified'}</Box>
      <Box w='20%'>
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

      <Flex w='20%' align='center'>{getItemCount(user._id)}
        <Tooltip label="Show Items" fontSize="md">
          <ArrowCount w="10px" h="10px" stroke="#282F36" cursor="pointer" ml="13px" />
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
      <Flex h='calc(100vh - 160px)'>
        <Box w='full' h='calc(100% - 35px)' p={[0, "0 25px 30px 30px"]}>
          <AdminTableHeader>
            <AdminTableHeaderElement w="20%" label="Name" />
            <AdminTableHeaderElement w="20%" label="Job title" />
            <AdminTableHeaderElement w="20%" label="Role" />
            <AdminTableHeaderElement w="20%" label="Default page" />
            <AdminTableHeaderElement w="20%" label="Items per user" />
          </AdminTableHeader>
          <Flex w='full' flexDir="column" h="full" bg="white" borderBottomRadius="10px" overflow="auto">
            {users?.map((user, i) => renderUserRow(user, i))}
          </Flex>
        </Box>
      </Flex>
    </>
  );
};

export default Users;
