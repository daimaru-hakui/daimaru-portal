import {
  Box,
  Button,
  CircularProgress,
  CircularProgressLabel,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Progress,
  Stack,
  Switch,
  Text,
} from '@chakra-ui/react';
import { collection, getDocs } from 'firebase/firestore';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { db } from '../../../firebase';

const ProgressIndex = () => {
  const [items, setItems] = useState<any>({});
  const [progresses, setProgresses] = useState<any>();

  const handleSwitchChange = (prop: string) => {
    const value = items[prop] ? false : true;
    setItems({ ...items, [prop]: value });
  };

  useEffect(() => {
    const getProgresses = async () => {
      const progressesRef = collection(db, 'progresses');
      const querySnapshot = await getDocs(progressesRef);
      setProgresses(
        querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
      );
    };
    getProgresses();
  }, []);

  // 達成率の取得（％）
  const getAchieveRate = (array: any) => {
    const newArray = array.map((content: { result: boolean }) => {
      return content.result;
    });
    let total = newArray?.filter((a: any) => a == true && a);
    const MAX = 100 / array?.length;
    return Math.round(total?.length * MAX);
  };

  // 残日数
  const getRemainingDays = (startDate: string, endDate: string) => {
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    const now = new Date().getTime();
    const nowTime = now - start;
    const sumTime = end - start;
    const result = Math.floor((sumTime - nowTime) / (1000 * 60 * 60 * 24));
    return result;
  };

  // progressバーの進捗
  const getDeadLineProgress = (startDate: string, endDate: string) => {
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    const now = new Date().getTime();
    let nowTime = now - start;
    nowTime = Math.floor(nowTime / (1000 * 60 * 60 * 24));
    let totalTime = end - start;
    totalTime = Math.floor(totalTime / (1000 * 60 * 60 * 24));
    const deadline = (nowTime / totalTime) * 100;
    return deadline;
  };

  return (
    <Box w='100%' bg='#f7f7f7' paddingBottom='50px' minH='100vh' p={6}>
      <Container maxW='1000px' bg='white' p={6}>
        <Flex justifyContent='space-between'>
          <Box as='h1' fontSize='2xl'>
            進捗状況
          </Box>
          <Link href='/progress/new'>
            <a>
              <Button size='sm'>新規登録</Button>
            </a>
          </Link>
        </Flex>
      </Container>
      <Container maxW='1000px' mt={3} p={0}>
        <Flex gap={6}>
          {progresses?.map((progress: any) => (
            <>
              <Box w='50%' bg='white' mt={3} p={6}>
                <Box>
                  <Flex justifyContent='space-between'>
                    <Text fontSize='xl'>{progress.title}</Text>
                    <Link href={`/progress/edit/${progress.id}`}>
                      <a>
                        <Button size='sm'>編集</Button>
                      </a>
                    </Link>
                  </Flex>
                  <Flex
                    mt={6}
                    flexDirection={{ base: 'column', md: 'row' }}
                    justifyContent='space-between'
                  >
                    <Flex gap={6}>
                      <Text>開始： {progress.startDate}</Text>
                      <Text>終了： {progress.endDate}</Text>
                    </Flex>
                    <Text>
                      残日数
                      {getRemainingDays(progress.startDate, progress.endDate)}日
                    </Text>
                  </Flex>
                  <Progress
                    mt={1}
                    isAnimated
                    hasStripe
                    value={getDeadLineProgress(
                      progress.startDate,
                      progress.endDate
                    )}
                  />

                  <Flex
                    mt={6}
                    alignItems='center'
                    justifyContent='space-between'
                  >
                    <Stack spacing={3}>
                      {progress?.contents.map((content: any, index: number) => (
                        <Flex key={index} justifyContent='space-between'>
                          <FormControl display='flex' alignItems='center'>
                            <FormLabel htmlFor={content.title} minW={12} mb='0'>
                              {content.title}
                            </FormLabel>
                            <Switch
                              id={content.result}
                              isChecked={content.result}
                              onChange={() =>
                                handleSwitchChange(content.result)
                              }
                            />
                          </FormControl>
                        </Flex>
                      ))}
                    </Stack>
                    <Flex flexDirection='column' justifyContent='center'>
                      <Box textAlign='center'>達成率</Box>
                      <Box>
                        <CircularProgress
                          value={getAchieveRate(progress?.contents)}
                          color='blue.400'
                          size='180px'
                          thickness='12px'
                        >
                          <CircularProgressLabel>
                            {getAchieveRate(progress?.contents)}%
                          </CircularProgressLabel>
                        </CircularProgress>
                      </Box>
                    </Flex>
                  </Flex>
                </Box>
              </Box>
            </>
          ))}
        </Flex>
      </Container>
    </Box>
  );
};

export default ProgressIndex;
