'use client';
import { Loading } from "@/components/loading";
import { useAuth } from "@clerk/nextjs";
import { MouseEvent, useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import 'firebase/database'
import { db } from "@/firebase/database-firebase";
import { ArrowDownWideNarrowIcon, ArrowUpWideNarrowIcon } from "lucide-react";
import { useSearchParams } from "next/navigation";

interface LogsSessions {
    [key: string]: LogsSessionsObject
}

interface LogsSessionsObject {
    date_created: string,
    device_name: string,
    need_resolve: boolean,
    scenario_id: string,
    session_id: string,
    session_name: string
}

interface Logs {
    [logsId: string]: LogObject
}

interface LogObject {
    date_created: string,
    description: string,
    log_scenarios_id: boolean,
    note: string,
    session_id: string,
    status: boolean
}

interface Scenarios {
    "id": string,
    "projectId": string,
    "projectName": string,
    "title": string,
    "description": string,
    "createdAt": string,
    "updatedAt": string,
    "stepsWeb": string,
    "stepsAndroid": string,
    "isFavorites": string,
    "imageUrl": string,
    "authorId": string,
    "authorIdGuid": string,
    "authorName": string
}

export default function LogPage() {
    const [logsSession, setLogsSession] = useState<Array<LogsSessionsObject> | null>(null);
    const [logs, setLogs] = useState<Array<LogObject> | null>(null);
    const [scenarios, setScenarios] = useState<Array<Scenarios> | null>(null);
    const { userId } = useAuth();
    const [projectId, setProjectId] = useState<string | null>(null);
    const [isReverse, setIsReverse] = useState<boolean>(false);
    const searchParams = useSearchParams();
    const [searchKey, setSearchKey] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);


    useEffect(() => {
        setInterval(() => {
            const projectId = localStorage.getItem("selectedProjectId");
            if (projectId)
                setProjectId(projectId);
        }, 500);
        if (projectId) {
            if (searchParams) {
                setSearchKey(searchParams.get("search"));
            }
            const fetchScenariosId = async () => {
                if (projectId === '') return;
                console.log(`${process.env.NEXT_PUBLIC_API_URL}/api/scenarios/scenarios-project-useridclerk/${projectId}?userIdClerk=${userId}`);
                await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/scenarios/scenarios-project-useridclerk/${projectId}?userIdClerk=${userId}`)
                    .then(response => response.json())
                    .then(data => {
                        setScenarios(data.data);
                    })
                    .catch(err => console.log(err));
            }

            fetchScenariosId();


            const logsRef = ref(db, 'logs');
            const logSessionsRef = ref(db, 'log_sessions');

            onValue(logsRef, (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    setLogs(Object.keys(data).map(logId => ({
                        ...data[logId]
                    })).sort((a, b) => new Date(b.date_created).getTime() - new Date(a.date_created).getTime()));
                }
            });

            onValue(logSessionsRef, (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    setLogsSession(Object.keys(data).map(sessionId => ({
                        ...data[sessionId]
                    })).sort((a, b) => new Date(b.date_created).getTime() - new Date(a.date_created).getTime()));
                }
            });
        }



    }, [projectId, searchParams]);

    function formatDate(dateString: string) {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        return `${day}-${month}-${year} ${hours}:${minutes}`;
    }

    function formatTime(dateString: string) {
        const date = new Date(dateString);
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');

        return `${hours}:${minutes}:${seconds}`;
    }

    const Render = () => {
        const itemsPerPage = 6;

        const handlePageChange = (pageNumber: number) => {
            setCurrentPage(pageNumber);
        };

        const handleClick = (e: MouseEvent) => {
            try {
                const target = e.target as HTMLDivElement;
                const parentTarget = target.parentElement;
                console.log(parentTarget);

                const logSessionsRef = document.querySelectorAll(".log-sessions");
                const logsRef = document.querySelectorAll(".logs");
                if (parentTarget) {
                    const index = Array.from(logSessionsRef).indexOf(parentTarget);
                    if (index !== -1) {
                        logsRef[index].classList.toggle("hidden");
                    }
                }

            } catch (error) {
                console.warn(error);
            }
        }

        if (logsSession && logs) {
            const scenariosId = scenarios?.map(scenario => scenario.id);
            const totalLogSession = logsSession.filter((logSess) => scenariosId?.includes(logSess.scenario_id) && (searchKey === null || logSess.session_name.toLowerCase().includes(searchKey.toLowerCase())));
            const indexOfLastItem = currentPage * itemsPerPage;
            const indexOfFirstItem = indexOfLastItem - itemsPerPage;
            let currentSessions = totalLogSession.slice(indexOfFirstItem, indexOfLastItem);
            if (!isReverse) {
                currentSessions = totalLogSession.slice(indexOfFirstItem, indexOfLastItem);
            } else {
                currentSessions = totalLogSession.slice(indexOfFirstItem, indexOfLastItem).reverse();
            }
            const pageNumbers = [];
            for (let i = 1; i <= Math.ceil(totalLogSession.length / itemsPerPage); i++) {
                pageNumbers.push(i);
            }

            return (
                <div className="h-[calc(100vh - 100px)] w-auto max-w-[3000px] px-[2vw] select-none">
                    {
                        currentSessions.length > 0 ? (
                            <div>
                                <div className="flex justify-end gap-2">
                                    <div
                                        role="tablist"
                                        aria-orientation="horizontal"
                                        className="inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground"
                                        tabIndex={0}
                                        data-orientation="horizontal"
                                        style={{ "outline": "none" }}>
                                        <button
                                            type="button"
                                            role="tab"
                                            aria-selected="false"
                                            aria-controls="radix-:r6j:-content-podcasts"
                                            data-state="inactive" id="radix-:r6j:-trigger-podcasts"
                                            className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow"
                                            tabIndex={-1}
                                            data-orientation="horizontal"
                                            data-radix-collection-item="">Date</button>
                                        <button
                                            type="button"
                                            role="tab"
                                            onClick={() => { setIsReverse(!isReverse) }}
                                            aria-selected="true"
                                            aria-controls="radix-:r6j:-content-music"
                                            data-state="active" id="radix-:r6j:-trigger-music"
                                            className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow relative"
                                            tabIndex={0}
                                            data-orientation="horizontal"
                                            data-radix-collection-item="">{!isReverse ? <ArrowDownWideNarrowIcon size={15} /> : <ArrowUpWideNarrowIcon size={15} />}</button>

                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-[2%]">
                                    {currentSessions.filter(currentSession =>
                                        scenariosId?.includes(currentSession.scenario_id as string) &&
                                        (searchKey === null || currentSession.session_name.toLowerCase().includes(searchKey.toLowerCase()))
                                    ).map(session => (
                                        <div
                                            onClick={e => handleClick(e)}
                                            key={session.session_id} className=" w-[49%] mt-5 relative">
                                            <div className="border-[1px] border-[#e6e6e8] rounded-lg p-[10px] log-sessions z-0">
                                                <strong>{session.session_name}</strong>
                                                <div className="float-right">{formatDate(session.date_created)}</div>
                                                <div><strong>Scenario: </strong>{scenarios?.filter(scenario => scenario.id == session.scenario_id)[0].title}</div>
                                                <div><strong>Device: </strong>{session.device_name}</div>
                                                <div>{session.session_id}</div>
                                            </div>

                                            <div className="logs border-[#e1e8f0] border-[1px] hidden overflow-y-auto h-[300px] bg-white rounded shadow-lg transform
                                 scale-95 transition-all duration-200 ease-out origin-top mt-2 z-10 absolute top-full left-0 w-full">
                                                {logs.filter(log => log.session_id === session.session_id).map(log => (
                                                    <div key={log.session_id} className="ml-[50px] mt-5 flex gap-2 z-10">
                                                        <div>{formatTime(log.date_created)}</div>
                                                        <div className="w-[1px] h-[100px] border-black border-2"></div>
                                                        <div>
                                                            <div>{log.description}</div>
                                                            <div>{log.log_scenarios_id}</div>
                                                            <div>{log.note}</div>
                                                            <div>{log.status}</div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                        </div>
                                    ))}
                                </div>
                                <div className="pagination flex justify-center gap-2 mt-5 mb-5">
                                    {pageNumbers.map(number => (
                                        <button key={number} onClick={() => handlePageChange(number)} className={`page-number ${currentPage === number ? 'active bg-gray-300' : 'bg-white'} border-[1px] border-[#e6e6e8] rounded-lg px-[10px] hover:bg-gray-300`}>
                                            {number}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="flex justify-center items-center h-[calc(100vh - 70px)]">
                                <div className="text-center">
                                    <img src="/logs-loading.svg" alt="empty" className="w-auto h-[400px] mx-auto" />
                                    <h1 className="text-2xl">Logs - Insync</h1>
                                </div>
                            </div>
                        )
                    }
                </div>


            )
        } 
        // else {
        //     return <Loading />
        // }
    }


    return (
        <>
            <Render />
        </>
    )
}