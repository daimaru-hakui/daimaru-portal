import { ArrowForwardIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { db } from "../../../firebase";
import { authState } from "../../../store";
import useSWR from "swr";
import axios from "axios";

const AlcoholId = () => {
  const currentUser = useRecoilValue(authState);
  const [posts, setPosts] = useState<any>([]);
  const [users, setUsers] = useState<any>([]);
  const [list, setList] = useState<any>([]);
  const [notUsers, setNotUsers] = useState<any>([]);
  const router = useRouter();
  const queryId = router.query.id;

  const features = (url: string) => axios.get(url).then((res) => res.data);
  const { data: alcoholCheckData } = useSWR(
    `/api/alcohol-chekers/data/${queryId}`,
    features
  );
  const { data: alcoholCheckList } = useSWR(
    `/api/alcohol-chekers/data/`,
    features
  );

  //アルコールチェックデータを取得
  // useEffect(() => {
  //   const collectionRef = collection(db, "alcoholCheckData");
  //   const q = query(collectionRef, where("date", "==", `${queryId}`));
  //   getDocs(q).then((querySnapshot) => {
  //     setPosts(
  //       querySnapshot.docs.map((doc) => ({
  //         ...doc.data(),
  //         id: doc.id,
  //       }))
  //     );
  //   });
  // }, [queryId]);

  //user一覧取得
  useEffect(() => {
    const usersRef = collection(db, "authority");
    const q = query(usersRef, orderBy("rank", "asc"));
    getDocs(q).then((querySnapshot) => {
      setUsers(
        querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }))
      );
    });
  }, []);

  //未入力者一覧
  useEffect(() => {
    let newUsers = users.map((user: { uid: string }) => {
      return user.uid;
    });
    let newPosts = alcoholCheckData?.contents?.map((post: { uid: string }) => {
      return post.uid;
    });
    newUsers = newUsers.filter((user: string) => {
      if (!newPosts?.includes(user)) return user;
    });
    setNotUsers(newUsers);
  }, [users, alcoholCheckData]);

  //アルコールチェックリスト
  useEffect(() => {
    const collectionRef = collection(db, "alcoholCheckList");
    getDocs(collectionRef).then((querySnapshot) => {
      setList(
        querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }))
      );
    });
  }, []);

  return (
    <>
      <Flex flexDirection={"column"} alignItems={"center"}>
        <TableContainer bg="white" borderRadius={6} p={6} mt={2}>
          <Link href="/alcohol-checker">
            <a>
              <Button w="100%">一覧へ戻る</Button>
            </a>
          </Link>

          <Flex justifyContent="space-between" mt={6}>
            <Box fontSize="lg">{queryId}</Box>
          </Flex>
          <Table size="sm" mt={6}>
            <Thead>
              <Tr>
                <Th minW="160px">名前</Th>
                <Th minW="50px">アルコールの検査</Th>
                <Th minW="50px">酒気帯び</Th>
                <Th minW="150px">提出時刻</Th>
                <Th></Th>
              </Tr>
            </Thead>
            <Tbody>
              {alcoholCheckData?.contents.map(
                (data: {
                  id: string;
                  uid: string;
                  alcoholCheck1: string;
                  alcoholCheck2: string;
                  createdAt: any;
                }) => (
                  <Tr key={data.id}>
                    <Td>
                      {users.map(
                        (user: { uid: string; name: string }) =>
                          user.uid === data.uid && user.name
                      )}
                    </Td>
                    <Td>{Number(data.alcoholCheck1) === 1 ? "済み" : "未"}</Td>
                    <Td>
                      {Number(data.alcoholCheck2) === 1 ? "なし" : "あり"}
                    </Td>
                    <Td>
                      {/* data?.createdAt?.toDate().toLocaleTimeString("en-US")} */}
                    </Td>
                  </Tr>
                )
              )}
              {notUsers.map((notUser: string) => (
                <Tr key={notUser}>
                  <Td>
                    {users.map(
                      (user: { uid: string; name: string }) =>
                        user.uid === notUser && user.name
                    )}
                  </Td>
                  <Td textAlign="center"></Td>
                  <Td textAlign="center"></Td>
                  <Td textAlign="center"></Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Flex>
    </>
  );
};

export default AlcoholId;
