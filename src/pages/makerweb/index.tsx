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
import { GetStaticProps, NextPage } from "next";
import Link from "next/link";
import { type MakerWeb } from "../../../types";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";

type Props = {
  posts: MakerWeb[];
  makerReturn: string;
};

const MakerWeb: NextPage<Props> = ({ posts }) => {

  return (
    <Container maxW="900px" p={6} rounded="md" bg="white" boxShadow="xs">
      <Tabs>
        <TabList>
          <Tab>メーカーWEB発注リスト</Tab>
          <Tab>メーカー返品詳細</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
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
                  {posts.map(({ id, url, name, userId, password, code }) => (
                    <Tr key={id}>
                      <Td>
                        <Link
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          passHref
                        >
                          <Box
                            textDecoration="underline"
                            _hover={{ opacity: "0.8" }}
                          >
                            {name}
                          </Box>
                        </Link>
                      </Td>
                      <Td>{userId}</Td>
                      <Td>{password}</Td>
                      <Td>{code}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          </TabPanel>
          <TabPanel minH="100vh">
            <Flex minH="100vh">
              <iframe src="/maker-return.pdf" width="100%" min-height="800" />
            </Flex>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Container>
  );
};

export default MakerWeb;

export const getStaticProps: GetStaticProps = async () => {
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
  let posts: MakerWeb[] = resJson.contents;
  posts.sort((a, b) => {
    if (a.kana < b.kana) {
      return -1;
    } else {
      return 1;
    }
  });
  return { props: { posts } };
};
