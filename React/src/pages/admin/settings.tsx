import {
  Box,
  Flex,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";

import Header from "../../components/Header";

const style = {
  bgColor: "settings.header.tabPanels",
  fontSize: "14px",
  mr: "2px",
  _selected: {
    color: "white",
    bg: "settings.header.selectedTab",
    fontWeight: "bold",
  },
};

const Settings = () => {
  return (
    <Box w="full" overflow="hidden">
      <Header
        breadcrumbs={["Admin", "Other settings"]}
        hideBreadcrumbsOnMobile
      />
      <Flex flexDirection="column" h="full" overflow="none">
        <Tabs
          color="white"
          variant="unstyled"
          width="calc(100vw - 270px)"
          h="full"
        >
          <TabList
            pl={["0px", "30px"]}
            ml={["15px", 0]}
            bg="settings.header.bg"
            w="calc(100vw - 240px)"
          >
            <Tab
              {...style}
              position="relative"
              borderTopLeftRadius="10px"
              css={{
                "&[aria-selected=true]": {
                  "&:after": {
                    content: "''",
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    right: 0,
                    margin: "0 auto",
                    width: 0,
                    height: 0,
                    borderTop: "solid 9px #A2171E",
                    borderLeft: "solid 9px transparent",
                    borderRight: "solid 9px transparent",
                    zIndex: 1,
                  },
                },
              }}
            >
              Settings
            </Tab>
            <Tab
              {...style}
              borderTopRightRadius="10px"
              position="relative"
              css={{
                "&[aria-selected=true]": {
                  "&:after": {
                    content: "''",
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    right: 0,
                    margin: "0 auto",
                    width: 0,
                    height: 0,
                    borderTop: "solid 9px #A2171E",
                    borderLeft: "solid 9px transparent",
                    borderRight: "solid 9px transparent",
                  },
                },
              }}
            >
              Email templates
            </Tab>
          </TabList>
          <TabPanels
            color="settings.header.tabPanels"
            roundedBottomLeft="7px"
            h="full"
            ml="30px"
            overflow="auto"
          >
            <TabPanel
              pl="30px"
              bg="white"
              w="50%"
              h="calc(100vh - 200px)"
              roundedBottom="10px"
              overflow="auto"
            >
              {/* {settings?.map((setting) => (
              <Flex key={setting.id} flexDirection={["column", "row"]}>
                <Flex w={["full", "320px"]} flexDirection="column" mb="30px">
                  <Box fontSize="md" color="brand.darkGrey">
                    {setting.label}
                  </Box>
                  <Flex mt="8px" mb="10px">
                    <Icon aria-label="view" name="info" mr="10px" />
                    <Box fontSize="sm" color="brand.paleGrey">
                      {setting.description}
                    </Box>
                  </Flex>
                  <Field
                    key={setting.name}
                    field={fields.find((field) => field.name === setting.name)}
                    form={form}
                    onChange={form.handleChange.bind(form)}
                  />
                </Flex>
                <Box alignSelf={["end", "flex-end"]}>
                  {wasFieldChanged(setting.name) &&
                    EditableControls(
                      form.values[setting.name],
                      settings?.find((s) => s.name === setting.name).value,
                      setting.id,
                      setting.name
                    )}
                </Box>
              </Flex>
            ))} */}
            </TabPanel>
            <TabPanel
              w="100%"
              pl={0}
              py={0}
              h="calc(100vh - 210px)"
              pr={0}
              rounded="lg"
            >
              <Flex w="full" h="full" bg="#E5E5E5">
                <Flex
                  pl="15px"
                  direction="column"
                  w="45%"
                  flexShrink={0}
                  pt={4}
                  h="full"
                  borderBottomRadius="10px"
                  bg="white"
                  boxShadow="0px 4px 10px rgba(0, 0, 0, 0.05)"
                >
                  <Box pb={3}>Manage email templates</Box>
                  <Flex>
                    {/* {emailTemplates?.map((template, i) => (
                    <Flex
                      direction="column"
                      w="155px"
                      mr={5}
                      key={i}
                      onClick={() => {
                        setSelectedTemplate(template);
                        setEditMode(false);
                      }}
                    >
                      <Box
                        cursor="pointer"
                        h="180px"
                        borderWidth={2}
                        borderColor={
                          selectedTemplate?.name === template.name
                            ? "#000000"
                            : "brand.borderColor"
                        }
                        rounded="10px"
                        mb={3}
                      >
                        {loading === template.name ? (
                          <Flex h="full">
                            <Loader center={true} />
                          </Flex>
                        ) : (
                          <Image
                            h="176px"
                            w="155px"
                            fit="contain"
                            rounded="10px"
                            src={`${process.env.REACT_APP_API_URL}/images/thumbnails/${template.name}.png?preventCache=${updateImage}`}
                          />
                        )}
                      </Box>
                      <Flex justify="center">{template.label}</Flex>
                    </Flex>
                  ))} */}
                  </Flex>
                </Flex>
                <Flex h="full" w="full" bg="#E5E5E5" pt={4}>
                  {/* {selectedTemplate &&
                  (editMode ? (
                    renderEmailEditor()
                  ) : (
                    <Flex direction="column" w="full" justify="flex-start">
                      <Flex
                        pb={3}
                        pl={5}
                        color="theme.darkGrey"
                        fontSize="16px"
                      >
                        Template preview
                      </Flex>
                      <Flex w="full" px={5}>
                        {loading === selectedTemplate.name ? (
                          <Flex h="full" minH="300px" w="full">
                            <Loader center={true} />
                          </Flex>
                        ) : (
                          <Image
                            rounded="10px"
                            fit="contain"
                            src={`${process.env.REACT_APP_API_URL}/images/thumbnails/${selectedTemplate.name}.png?preventCache=${updateImage}`}
                          />
                        )}
                      </Flex>
                      <Stack
                        direction="row"
                        justify="space-between"
                        mt={3}
                        px={5}
                        spacing={2}
                      >
                        <Button
                          _hover={{ opacity: 0.7 }}
                          bg="brand.paleGrey"
                          color="#FFFFFF"
                          onClick={sendEmail}
                        >
                          Send email
                        </Button>
                        <Button
                          _hover={{ opacity: 0.7 }}
                          bg="brand.primary"
                          color="#FFFFFF"
                          onClick={() => setEditMode(true)}
                        >
                          Edit
                        </Button>
                      </Stack>
                    </Flex>
                  ))} */}
                </Flex>
              </Flex>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Flex>
    </Box>
  );
};

export default Settings;
