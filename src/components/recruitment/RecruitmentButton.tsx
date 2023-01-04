import React from "react";
import { NextPage } from "next";
import { Button } from "@chakra-ui/react";
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRecoilValue } from "recoil";
import { auth, db } from "../../../firebase";
import { authState } from "../../../store";
import { RequestTypes } from "../../../types/RequestTypes";

type Props = {
  request: RequestTypes;
};

const RecruitmentButton: NextPage<Props> = ({ request }) => {
  const [user] = useAuthState(auth);
  const currentUser = useRecoilValue(authState);

  //参加する
  const addRequest = async (id: string) => {
    const docRef = doc(db, "requestList", id);
    await updateDoc(docRef, {
      member: arrayUnion(user && user.uid),
    });
  };

  //参加を取り消す
  const removeRequest = async (id: string) => {
    const docRef = doc(db, "requestList", id);
    await updateDoc(docRef, {
      member: arrayRemove(user && user.uid),
    });
  };

  return (
    <>
      {request.recruitment && (
        <Button
          mt={{ base: "10px", md: "0" }}
          color="white"
          fontSize={{ base: "sm" }}
          bg={request.member.includes(currentUser) ? "#17a6ca" : "orange"}
          _focus={{ outline: "none" }}
          _hover={{
            bg: request.member.includes(currentUser) ? "#17a6ca" : "orange",
          }}
          onClick={() => {
            request.member.includes(currentUser)
              ? removeRequest(request.id)
              : addRequest(request.id);
          }}
        >
          {request.member.includes(currentUser) ? "参加を取り消す" : "参加する"}
        </Button>
      )}
    </>
  );
};

export default RecruitmentButton;