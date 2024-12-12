import {
  Container,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import { GetStaticProps, NextPage } from "next";
import Image from "next/image";

type Props = {
  calendarData: {
    imageDaimaruArray: { url: string }[];
    imageTokushimaArray: { url: string }[];
    imageWillfitArray: { url: string }[];
  };
};

const Calendar: NextPage<Props> = ({ calendarData }) => {
  return (
    <Container maxW="900px" p={6} rounded="md" bg="white" boxShadow="xs">
      <Tabs variant="enclosed">
        <TabList>
          <Tab _focus={{ outline: "none" }}>本社・神戸</Tab>
          <Tab _focus={{ outline: "none" }}>徳島工場</Tab>
          <Tab _focus={{ outline: "none" }}>ウィルフィット</Tab>
        </TabList>

        <TabPanels mt={1}>
          <TabPanel p={0}>
            {calendarData.imageDaimaruArray.map((image) => (
              <Image
                key={image?.url}
                src={image?.url}
                width={800}
                height={500}
                alt={"大丸白衣"}
                style={{
                  width: "100%",
                  height: "auto",
                }}
              />
            ))}
          </TabPanel>
          <TabPanel p={0}>
            {calendarData.imageTokushimaArray.map((image) => (
              <Image
                key={image?.url}
                src={image?.url}
                width={800}
                height={500}
                alt={"徳島工場"}
                style={{
                  width: "100%",
                  height: "auto",
                }}
              />
            ))}
          </TabPanel>
          <TabPanel p={0}>
            {calendarData.imageWillfitArray.map((image) => (
              <Image
                key={image?.url}
                src={image?.url}
                width={800}
                height={500}
                alt={"ウィルフィット"}
                style={{
                  width: "100%",
                  height: "auto",
                }}
              />
            ))}
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Container>
  );
};

export default Calendar;

export const getStaticProps: GetStaticProps = async () => {
  const accessPoint = "https://portal-sub.microcms.io/api/v1";
  const options = {
    headers: {
      "X-MICROCMS-API-KEY": "O0RwlD3WSeGgUj5stjZze9mfZEHwh5yAIKOX",
    },
  };

  const calendarRes = await fetch(`${accessPoint}/calendar`, options);
  const calendarData = await calendarRes.json();

  return {
    props: {
      calendarData,
    },
  };
};
