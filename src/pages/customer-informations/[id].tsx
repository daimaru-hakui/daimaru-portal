import { Box, Button, Container, Flex, Text } from "@chakra-ui/react";
import { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { CustomerInformation } from "../../../types";
import { doc, getDoc } from "firebase/firestore";
import { BsEmojiLaughing, BsEmojiNeutral } from "react-icons/bs";
import { FaRegFaceTired } from "react-icons/fa6";
import { db } from "../../../firebase";

const CustomerInfoById: NextPage = () => {
  const router = useRouter();
  const pathname = router.asPath.split("/").pop();
  const [data, setData] = useState<CustomerInformation>();
  console.log(pathname);

  useEffect(() => {
    const getCustomerInformation = async (pathname: string) => {
      const docRef = doc(db, "customerInformations", pathname);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        throw new Error("記事がありません。");
      }
      setData({
        ...docSnap.data(),
        id: docSnap.id,
      } as CustomerInformation);
    };
    getCustomerInformation(pathname || "");
  }, [pathname]);

  const getEmotion = (str: string = "") => {
    switch (str) {
      case "good":
        return <BsEmojiLaughing />;
      case "normal":
        return <BsEmojiNeutral />;
      case "bad":
        return <FaRegFaceTired />;
      default:
        return "no image";
    }
  };

  return (
    <Container maxW="500px" bg="white" p={6} boxShadow="md" rounded="md">
      <Flex w="full" justifyContent="space-between" align="center">
        <Box as="h1" fontSize="lg" fontWeight="bold">
          お客様情報入力
        </Box>
        <Link href="/customer-informations" passHref>
          <Button size="sm">一覧へ戻る</Button>
        </Link>
      </Flex>

      <Box mt={6}>
        <Text>顧客名</Text>
        <Box>{data?.customer}</Box>
      </Box>
      <Box mt={6}>
        <Text>タイトル</Text>
        <Box>{data?.title}</Box>
      </Box>
      <Box mt={6}>
        <Text>感情</Text>
        <Box>{getEmotion(data?.emotion)}</Box>
      </Box>

      <Box mt={6}>
        <Text>内容</Text>
        <Box>{data?.content}</Box>
      </Box>
      {data?.link && (
        <Box mt={6}>
          <Text>リンク先</Text>
          <Box>{data?.link}</Box>
        </Box>
      )}
      <Box mt={6}>
        <Box></Box>
      </Box>
    </Container>
  );
};

export default CustomerInfoById;
