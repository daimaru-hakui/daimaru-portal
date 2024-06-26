import React, { FC } from "react";
import {
  Box,
  Radio,
  RadioGroup,
  Stack,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  ModalBody,
  ModalFooter,
  Button,
} from "@chakra-ui/react";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { useForm, SubmitHandler } from "react-hook-form";
import { db } from "../../../firebase";
import { format } from "date-fns";
import { useAuthStore } from "../../../store/useAuthStore";
import { useParams } from "next/navigation";

type Inputs = {
  alcoholCheck1: string;
  alcoholCheck2: string;
  alcoholCheckValue: number;
};

type Props = {
  onClose: () => void;
  pageType: "NEW" | "EDIT";
  defaultValues: Inputs;
  // dateId?: string;
  userId?: string;
};

export const AlcoholCheckForm: FC<Props> = ({
  onClose,
  pageType,
  defaultValues,
  // dateId,
  userId,
}) => {
  const currentUser = useAuthStore((state) => state.currentUser);
  const todayDate = format(new Date(), "yyyy-MM-dd");
  const  dateId  = useParams();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: {
      ...defaultValues,
      alcoholCheck1: String(defaultValues.alcoholCheck1),
      alcoholCheck2: String(defaultValues.alcoholCheck2),
    },
  });
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    switch (pageType) {
      case "NEW":
        await setAlcoholCheckList(data);
        break;
      case "EDIT":
        updateAlcoholChecker(data);
    }
    onClose();
  };

  //アルコールチェック登録
  const setAlcoholCheckList = async (data: Inputs) => {
    try {
      const docListRef = doc(db, "alcoholCheckList", todayDate);
      const docSnap = await getDoc(docListRef);

      if (docSnap.exists()) {
        await updateDoc(docListRef, {
          member: arrayUnion(currentUser),
        });
      } else {
        await setDoc(docListRef, {
          id: todayDate,
          member: arrayUnion(currentUser),
        });
      }
      if (docSnap.data()?.member.includes(currentUser)) return;
      // // 2024年3月まで
      // await addDoc(collection(db, "alcoholCheckData"), {
      //   date: todayDate,
      //   uid: currentUser,
      //   createdAt: serverTimestamp(),
      //   alcoholCheck1: data.alcoholCheck1,
      //   alcoholCheck2: data.alcoholCheck2,
      //   alcoholCheckValue: Number(data.alcoholCheckValue) || 0,
      // });
      // 2024年3月以降
      const userRef = doc(db, "users", currentUser);
      const user = await getDoc(userRef);
      await setDoc(
        doc(db, "alcoholCheckList", todayDate, "alcoholCheckData", currentUser),
        {
          date: todayDate,
          uid: currentUser,
          createdAt: serverTimestamp(),
          alcoholCheck1: Number(data.alcoholCheck1),
          alcoholCheck2: Number(data.alcoholCheck2),
          alcoholCheckValue: Number(data.alcoholCheckValue) || 0,
          userRef: userRef,
          username: user.data()?.name,
        }
      );
    } catch (e) {
      console.error(e);
    }
  };

  const updateAlcoholChecker = (data: Inputs) => {
    console.log(dateId, userId);
    if (!dateId) return;
    const documentRef = doc(
      db,
      "alcoholCheckList",
      `${dateId}`,
      "alcoholCheckData",
      `${userId}`
    );
    updateDoc(documentRef, {
      alcoholCheck1: Number(data.alcoholCheck1),
      alcoholCheck2: Number(data.alcoholCheck2),
      alcoholCheckValue: Number(data.alcoholCheckValue) || 0,
      updatedAt: serverTimestamp(),
    });
  };

  const focusHandler = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <ModalBody>
        <Box>
          <Box>アルコールの検査はしましたか？</Box>
          <RadioGroup defaultValue={defaultValues.alcoholCheck1}>
            <Stack spacing={8} direction="row" mt={1}>
              <Radio colorScheme="red" value="0" {...register("alcoholCheck1")}>
                No
              </Radio>
              <Radio
                colorScheme="green"
                value="1"
                {...register("alcoholCheck1")}
              >
                Yes
              </Radio>
            </Stack>
          </RadioGroup>
        </Box>
        <Box mt={3}>
          <Box>酒気帯び</Box>
          <RadioGroup mt={1} defaultValue={defaultValues.alcoholCheck2}>
            <Stack spacing={9} direction="row">
              <Radio colorScheme="red" value="0" {...register("alcoholCheck2")}>
                有
              </Radio>
              <Radio
                colorScheme="green"
                value="1"
                {...register("alcoholCheck2")}
              >
                無
              </Radio>
            </Stack>
          </RadioGroup>
        </Box>
        <Box mt={3}>
          <Box>測定結果（mg）</Box>
          <NumberInput defaultValue={0} min={0} max={100} step={0.01}>
            <NumberInputField
              mt={1}
              {...register("alcoholCheckValue")}
              onFocus={focusHandler}
            />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </Box>
      </ModalBody>
      <ModalFooter>
        <Button width="100px" colorScheme="facebook" type="submit">
          {pageType === "NEW" ? "提出" : "更新"}
        </Button>
      </ModalFooter>
    </form>
  );
};
