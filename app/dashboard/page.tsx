"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { EmptyProject } from "./_components/empty-project";
import { ScenarioList } from "./_components/scenario-list";
import { useUser } from "@clerk/nextjs";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { selectProject } from "@/store/projectSlice";

interface Project {
  id: string;
  projectName: string;
  description: string | null;
  userId: string;
  displayName: string | null;
  dateCreated: string | null;
  dateUpdated: string | null;
  isPublish: boolean | null;
}

const DashboardPage = () => {

  const { user, isLoaded } = useUser();

  const [projectList, setProjectList] = React.useState<Project[]>([]);

  // Fetch projects when user is loaded
  React.useEffect(() => {
    if (user && isLoaded) {
      const fetchProjects = async () => {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL!}/api/projects/project-user-clerk-is-publish/${user.id}`);
          const data = await response.json();
          setProjectList(data.data); // Adjust according to the structure of the API response
        } catch (error) {
          console.error("Error fetching projects:", error);
        }
      };
      fetchProjects();
    }
  }, [user, isLoaded]);


  const searchParams = useSearchParams();
  const search = searchParams.get("search") || undefined;
  const favorites = searchParams.get("favorites") || undefined

  const hasProjects = projectList.length > 0;

  const selectedProjectId = useSelector((state: RootState) => state.project.selectedProject);
  const dispatch = useDispatch<AppDispatch>();

  // Load selected project from localStorage when component mounts
  React.useEffect(() => {
    const storedProjectId = localStorage.getItem("selectedProjectId");
    if (storedProjectId) {
      dispatch(selectProject(storedProjectId));
    }
  }, [dispatch]);

  return (


    <div className="w-full flex flex-col p-6 h-full overflow-y-auto pb-10">

      {!hasProjects ? (
        <EmptyProject />
      ) : (
        <ScenarioList
          projectId={selectedProjectId || ""}
          query={{ search, favorites }}
        />
      )}
    </div>
  );
};

export default DashboardPage;