import React, { ReactNode } from 'react';
import {
  Box,
  CloseButton,
  Flex,
  useColorModeValue,
  Link,
  Text,
  FlexProps,
  Avatar,
  BoxProps,
  Heading,
} from '@chakra-ui/react';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import ResumeIcon from './icons/ResumeIcon';
import LogoutIcon from './icons/LogoutIcon';

interface LinkItemProps {
  name: string;
  icon: JSX.Element;
  link: string;
}
const LinkItems: Array<LinkItemProps> = [
  { name: 'Home', icon: (<ResumeIcon />), link: "/app" },
];

export default function SimpleSidebar({ children }: { children: ReactNode }) {
  const session = useSession();
  const router = useRouter()
  const username = session?.data?.username && session?.data?.username?.length > 18 ? session?.data?.username.substring(0, 15) + "..." : session?.data?.username

  const onSignOut = async () => {
    await signOut({ redirect: false })
    router.push("/auth/login")
  }
  return (
    <Box minH="100vh" w="100%" bg={useColorModeValue('gray.100', 'gray.900')}>
      <SidebarContent
        onSignOut={onSignOut}
        username={username || ''}
        display={{ base: 'none', md: 'block' }}
      />
      <MobileNav onSignOut={onSignOut} display={{ base: 'flex', md: 'none' }} username={username || ''} />
      <Box ml={{ base: 0, md: 60 }}>
        {children}
      </Box>
    </Box>
  );
}

interface SidebarProps extends BoxProps {
  username: string
  onSignOut: () => {}
}
const SidebarContent = ({ username, onSignOut, ...rest }: SidebarProps) => {
  const router = useRouter()
  return (
    <Box
      bg={useColorModeValue('white', 'gray.900')}
      borderRight="1px"
      borderRightColor={useColorModeValue('gray.200', 'gray.700')}
      w={{ base: 'full', md: 60 }}
      pos="fixed"
      h="full"
      {...rest}>
      <Flex h="20" justifyContent="space-between">
        <Flex background="brand" w="100%" p={3} justifyContent="space-between" alignItems="center">
          <Heading color="white">CV Gen</Heading>
          <CloseButton display={{ base: 'flex', md: 'none' }} />
        </Flex>
      </Flex>
      <Flex alignItems="center" gap={3} p={4}>
        <Avatar bg='gray.300' name={username} size='sm' />
        <Text>{username && username?.length > 18 ? username.substring(0, 15) + "..." : username}</Text>
      </Flex>
      <Flex p={4}>
        <Text fontSize="xs">Sections</Text>
      </Flex>
      {LinkItems.map((link) => (
        <NavItem key={link.name} link={link.link}>
          <>
            <Box mr={2}>
              {link.icon}
            </Box>
            {link.name}
          </>
        </NavItem>
      ))}
      <Flex position="absolute" bottom={3} left={3} alignSelf="flex-end" onClick={onSignOut} alignItems="center" gap={3} cursor="pointer">
        <LogoutIcon fill="#2E2E38" />
        <Text>Log out</Text>
      </Flex>
    </Box>
  );
};

interface NavItemProps extends FlexProps {
  children: JSX.Element;
  link: string
}
const NavItem = ({ children, link, ...rest }: NavItemProps) => {
  return (
    <Link href={link} style={{ textDecoration: 'none' }} _focus={{ boxShadow: 'none' }}>
      <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        {...rest}>
        {children}
      </Flex>
    </Link>
  );
};

interface MobileProps extends FlexProps {
  username: string;
  onSignOut: () => {};
}
const MobileNav = ({ username, onSignOut, ...rest }: MobileProps) => {
  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 24 }}
      height="20"
      alignItems="center"
      backgroundColor="brand"
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
      justifyContent="space-between"
      {...rest}>
      <Flex alignItems="center" justifyContent="space-between" gap={3} cursor="pointer" w="100%">
        <Heading color="white">CV Gen</Heading>
        <Flex alignItems="center" gap={3}>
          <Avatar bg='gray.300' size='sm' name={username} />
          <LogoutIcon onClick={onSignOut} fill='white' />
        </Flex>
      </Flex>
    </Flex>
  );
};