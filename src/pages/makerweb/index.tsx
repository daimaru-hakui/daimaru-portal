import {
  Box,
  Container,
  Flex,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRecoilValue } from "recoil";
import { auth } from "../../../firebase";
import { authState } from "../../../store/authState";

type Props = {
  posts: {
    id: string;
    name: string;
    url: string;
    userId: string;
    password: string;
    code: string;
  }[];
};

const MakerWeb: NextPage<Props> = ({ posts }) => {
  const router = useRouter();
  const [user] = useAuthState(auth);
  const currentUser = useRecoilValue(authState);
  useEffect(() => {
    if (user === null) {
      router.push("/login");
    }
  }, [router, user]);
  return (
    <>
      <Box backgroundColor={"#f7f7f7"}>
        {currentUser && (
          <Box as="main">
            <Flex
              w="100%"
              mx="auto"
              px={6}
              flexDirection="column"
              alignItems="center"
            >
              <Container
                maxW="900px"
                my={6}
                p={6}
                rounded="md"
                bg="white"
                boxShadow="xs"
              >
                <TableContainer>
                  <Box as="h1" fontSize="2xl">
                    メーカーWEB発注リスト
                  </Box>
                  <Table variant="simple" mt={6}>
                    <TableCaption>メーカー名（順不同・敬称略）</TableCaption>
                    <Thead>
                      <Tr>
                        <Th>メーカー名</Th>
                        <Th>ID</Th>
                        <Th>password</Th>
                        <Th>取引コード</Th>
                      </Tr>
                    </Thead>

                    <Tbody>
                      {posts.map((post) => (
                        <Tr key={post.id}>
                          <Td>
                            <Link href={post.url}>
                              <a target="_blank" rel="noopener noreferrer">
                                <Box
                                  textDecoration="underline"
                                  _hover={{ opacity: "0.8" }}
                                >
                                  {post.name}
                                </Box>
                              </a>
                            </Link>
                          </Td>
                          <Td>{post.userId}</Td>
                          <Td>{post.password}</Td>
                          <Td>{post.code}</Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              </Container>
            </Flex>
          </Box>
        )}
      </Box>
    </>
  );
};

export default MakerWeb;

export async function getStaticProps() {
  const params = {
    headers: {
      "X-MICROCMS-API-KEY": "5cb4353cc17045be9dc39f4dd1cac7ff7fc9",
    },
  };

  const res = await fetch(
    `https://makerweb.microcms.io/api/v1/posts?limit=100`,
    params
  );
  const resJson = await res.json();
  const posts = resJson.contents;

  // Pass post data to the page via props
  return { props: { posts } };
}
