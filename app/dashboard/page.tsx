"use client";

// import { BoardList } from "./_components/board-list";
import { useSearchParams } from "next/navigation";
import { EmptyProject } from "./_components/empty-project";

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
        // <BoardList
        //   orgId={organization.id}
        //   query={{search, favorites }}
        // />
        <>Scenario List</>
      )}
    </div>
  );
};

export default DashboardPage;