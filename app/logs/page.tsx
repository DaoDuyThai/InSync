'use client';
import { Loading } from "@/components/loading";
import { fetchScenarios } from "@/firebase/database-firebase";
import { useEffect, useRef, useState } from "react";


interface LogsContainer {
    log_sessions: LogsSessions,
    logs: Logs
}

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



export default function LogPage() {
    const [logsContainer, setLogsContainer] = useState<LogsContainer | null>(null);
    const [logsSession, setLogsSession] = useState<Array<LogsSessionsObject> | null>(null);
    const [logs, setLogs] = useState<Array<LogObject> | null>(null);
    const logSessionsRef = useRef<[]>(null);
    useEffect(() => {


        const value = fetchScenarios();
        value.then(data => setLogsContainer(data)).catch(err => console.log(err));
        if (logsContainer?.log_sessions) {
            const sessionsArray = Object.keys(logsContainer.log_sessions).map(key => {
                return {
                    ...logsContainer.log_sessions[key]
                };
            });
            setLogsSession(sessionsArray)
        }

        if (logsContainer?.logs) {
            const logsArray = Object.keys(logsContainer.logs).map(logsId => {
                return {
                    ...logsContainer.logs[logsId]
                };
            });
            setLogs(logsArray);
        }

        const logSessionsRef = document.querySelectorAll(".log-sessions");
        const logsRef = document.querySelectorAll(".logs");
        logSessionsRef.forEach((logSession, index) => {
            logSession.addEventListener("click", () => {
                if (logs) {
                    logsRef[index].classList.toggle("hidden");
                }
            });
        });


    }, [logsContainer])

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

    function handleClick() {

    }


    const render = () => {
        const [currentPage, setCurrentPage] = useState(1);
        const itemsPerPage = 6;

        const handlePageChange = (pageNumber: number) => {
            setCurrentPage(pageNumber);
        };

        if (logsSession && logs) {
            const indexOfLastItem = currentPage * itemsPerPage;
            const indexOfFirstItem = indexOfLastItem - itemsPerPage;
            const currentSessions = logsSession.slice(indexOfFirstItem, indexOfLastItem);

            const pageNumbers = [];
            for (let i = 1; i <= Math.ceil(logsSession.length / itemsPerPage); i++) {
                pageNumbers.push(i);
            }

            return (
                <div className="max-w-[1500px] container">
                   
                    <div className="flex flex-wrap gap-1">
                        {/* <div> */}
                        {currentSessions.map(session => (
                            <div key={session.session_id} className=" w-[48%] mt-5 log-sessions">
                                <div className="border-[1px] border-[#e6e6e8] rounded-lg p-[10px] ">
                                    <strong>{session.session_name}</strong>
                                    <div className="float-right">{formatDate(session.date_created)}</div>
                                    <div><strong>Device: </strong>{session.device_name}</div>
                                    <div>{session.session_id}</div>
                                </div>

                                <div className="logs hidden overflow-y-auto h-[300px] bg-white rounded shadow-lg transform scale-95 transition-all duration-200 ease-out origin-top">
                                    {logs.filter(log => log.session_id === session.session_id).map(log => (
                                        <div key={log.session_id} className="ml-[50px] mt-5 flex gap-2 ">
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


            )
        } else {
            return <Loading />
        }
    }


    return (
        <>
            {render()}
        </>
    )
}