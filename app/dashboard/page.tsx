"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { EmptyProject } from "./_components/empty-project";
import { ScenarioList } from "./_components/scenario-list";
import { useAuth, useUser } from "@clerk/nextjs";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { selectProject } from "@/store/projectSlice";
import { Loading } from "@/components/loading";

type Project = {
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

  const [loading, setLoading] = React.useState(true);
  const [projectList, setProjectList] = React.useState<Project[]>([]);
  const { user, isLoaded } = useUser();
  const searchParams = useSearchParams();
  const search = searchParams ? searchParams.get("search") || undefined : undefined;
  const favorites = searchParams ? searchParams.get("favorites") || undefined : undefined;
  const hasProjects = projectList.length > 0;
  const selectedProjectId = useSelector((state: RootState) => state.project.selectedProject);
  const dispatch = useDispatch<AppDispatch>();

  // Fetch projects when user is loaded
  const fetchProjects = async () => {
    if (user && isLoaded) {
      try {
        
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL!}/api/projects/project-user-clerk-is-publish/${user.id}`,
          {
            headers: {
              "Content-Type": "application/json",
              "api-key": `${process.env.NEXT_PUBLIC_API_KEY!}`,
            }
          }
        );
        const data = await response.json();
        setProjectList(data.data); // Adjust according to the structure of the API response
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  // Load selected project details
  React.useEffect(() => {
    fetchProjects();
  }, [user, isLoaded]);

  // Load selected project from localStorage when component mounts
  React.useEffect(() => {
    const storedProjectId = localStorage.getItem("selectedProjectId");
    if (storedProjectId) {
      dispatch(selectProject(storedProjectId));
    }
  }, [dispatch]);

  if (loading) {
    return <Loading />;
  } else {
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
  }




};

export default DashboardPage;