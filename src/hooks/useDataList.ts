import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import { db } from "../../firebase";
import { useAuthStore } from "../../store/useAuthStore";
import { Claim, Request, User } from "../../types";
import { useUtils } from "./useUtils";
import { useRequestStore } from "../../store/useRequestStore";

export const useDataList = () => {
  const setUsers = useAuthStore((state) => state.setUsers);
  const setFullUsers = useAuthStore((state) => state.setFullUsers);
  const setRequests = useRequestStore((state) => state.setRequests);
  const { getYearMonth } = useUtils();

  const getUsers = async () => {
    const usersCollectionRef = collection(db, "users");
    const q = query(usersCollectionRef, orderBy("rank", "asc"));
    onSnapshot(q, {
      next: (querySnapshot) => {
        setUsers(
          querySnapshot.docs
            .map(
              (doc) =>
                ({
                  ...doc.data(),
                  id: doc.id,
                } as User)
            )
            .filter((doc) => doc.rank !== 1000)
        );
      },
      error: () => {
        console.log("失敗しました");
      },
    });
  };

  const getFullUsers = async () => {
    const usersCollectionRef = collection(db, "users");
    const q = query(usersCollectionRef, orderBy("rank", "asc"));
    onSnapshot(q, (querySnapshot) => {
      setFullUsers(
        querySnapshot.docs.map(
          (doc) =>
            ({
              ...doc.data(),
              id: doc.id,
            } as User)
        )
      );
    });
  };

  const getRequests = async () => {
    const requestsRef = collection(db, "requestList");
    const q = query(
      requestsRef,
      orderBy("createdAt", "desc"),
      where("display", "==", true)
    );
    onSnapshot(q, (querySnapshot) => {
      setRequests(
        querySnapshot.docs.map(
          (doc) =>
            ({
              ...doc.data(),
              id: doc.id,
            } as Request)
        )
      );
    });
  };

  const createPaymentConfirm = async () => {
    const { year, monthStr } = getYearMonth();
    const docSnap = await getDoc(
      doc(db, "paymentConfirms", `${year}_${monthStr}`)
    );
    if (!docSnap.exists()) {
      try {
        await setDoc(doc(db, "paymentConfirms", `${year}_${monthStr}`), {
          checkList: arrayUnion(),
          checkListRef: arrayUnion(),
          createdAt: serverTimestamp(),
        });
      } catch (error) {
        console.log(error);
      }
    }
  };

  return {
    getUsers,
    getFullUsers,
    getRequests,
    createPaymentConfirm,
  };
};
