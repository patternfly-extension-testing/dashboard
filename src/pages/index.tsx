import Head from "next/head";
import { Inter } from "next/font/google";
import { useEffect, useState } from "react";
import { Data } from "@/getters";
import { Layout, StatusTable, StatusItem } from "@/app";
import axios from "axios";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [repoStatuses, setRepoStatuses] = useState<Data>({
    repos: [],
    statuses: {},
  });
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const refresh = () =>
    axios.get("/api/status").then((res) => setRepoStatuses(res.data));

  useEffect(() => {
    refresh();
  }, []);

  const syncRepos = () => {
    selectedItems.forEach((repoName) => {
      // syncRepo(repoName).then(res => console.log(res))
      axios
        .post("/api/sync", null, { params: { repo: repoName } })
        .then((res) => console.log(res));
    });
    refresh();
  };

  const statusItems: StatusItem[] = repoStatuses.repos.map((repoName) => {
    const { workflowStatus, syncStatus } = repoStatuses.statuses[repoName];

    return { name: repoName, status: workflowStatus, syncStatus };
  });

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <StatusTable
          statusItems={statusItems}
          selectedItems={selectedItems}
          setSelectedItems={setSelectedItems}
          refresh={refresh}
          submit={syncRepos}
        />
      </Layout>
    </>
  );
}
