// app/page.tsx
'use client';
import { useEffect, useState } from "react";

type Device = {
    ip: string;
    mac: string;
};

export default function Page() {
    const [devices, setDevices] = useState<Device[]>([]);
    const [error, setError] = useState<string | null>(null); // State for error messages

    useEffect(() => {
        const fetchDevices = async () => {
            try {
                const response = await fetch('/api/deviceNet');
                if (!response.ok) {
                    throw new Error('Failed to fetch devices');
                }
                const data = await response.json();
                setDevices(data); // Set devices if found
                setError(null); // Clear any existing error
            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message); // Set error message if fetch fails
                } else {
                    setError('An unknown error occurred'); // Handle unknown error type
                }
            }
        };

        fetchDevices(); // Call the fetch function
    }, []);

    return (
        <div className="p-10">
            <h1>Devices Page</h1>
            <div>
                <h2>Available Devices:</h2>
                {error ? ( // Render error message if it exists
                    <p className="text-red-500">{error}</p>
                ) : (
                    <ul>
                        {devices.map((device, index) => (
                            <li key={index}>
                                IP: {device.ip} - MAC: {device.mac}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
