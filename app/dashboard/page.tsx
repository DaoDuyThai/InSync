"use client";

// import { BoardList } from "./_components/board-list";
import { useSearchParams } from "next/navigation";
import { EmptyProject } from "./_components/empty-project";
import { ScenarioList } from "./_components/scenario-list";

const DashboardPage = () => {

  const searchParams = useSearchParams();
  const search = searchParams.get("search") || undefined;
  const favorites = searchParams.get("favorites") || undefined

  const projects = false;

  return (


    <div className="w-full flex flex-col p-6">

      {projects ? (
        <EmptyProject />
      ) : (
        <ScenarioList
          projectId=""
          query={{ search, favorites }}
        />
      )}
    </div>
  );
};

export default DashboardPage;