'use client';
import fetchScenarios from "@/firebase/database-firebase";
import { useEffect, useRef, useState } from "react";

interface Scenario {
    id: string;
    log_sessions: any;
}

interface LogSession {
    id: string;
    log_entries: Array<any>;
}

export default function LogPage() {
    const [scenarios, setScenarios] = useState<Array<Scenario>>();
    const mount = useRef(false);
    useEffect(() => {
        if (mount.current === false) {
            fetchScenarios().then((data: Array<Scenario>) => {
                console.log(`data: ${data.map(scenario => {
                    const { log_sessions } = scenario;
                    console.log(`Log sessions: ${Object.keys(log_sessions)}`);


                })}`);

                setScenarios(data);
            }).catch(error => {
                console.error("Error fetching scenarios:", error);
            });
            console.log(scenarios);
        }

        return () => {
            mount.current = true;
        }
    }, [])


    return (
        <div className="container">
            {scenarios?.map(scenario => (
                <div key={scenario.id}>
                    {scenario.log_sessions.length}
                </div>
            ))}
        </div>
    )
}