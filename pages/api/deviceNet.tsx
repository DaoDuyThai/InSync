import { NextApiRequest, NextApiResponse } from 'next';
import { exec } from 'child_process';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    exec('arp -a', (error, stdout, stderr) => {
        if (error) {
            console.error('Error executing arp command:', error);
            return res.status(500).json({ error: 'Failed to execute arp command' });
        }
    
        const output = [];
        const devices = stdout.split('\n');
        let isReadingDevices = false; // Flag to indicate when to start reading devices
    
        for (const device of devices) {
            const cols = device.trim().split(/\s+/); // Split by whitespace
    
            // Check if we have reached the device listing section
            if (cols[0] === 'Internet') {
                isReadingDevices = true; // Start reading devices from the next line
                continue; // Skip this line
            }
    
            // If we are in the device listing section, process the data
            if (isReadingDevices && cols.length >= 3) {
                const ip = cols[0]; // IP is in the first column
                const mac = cols[1]; // MAC is in the second column
    
                // Validate the IP and MAC address format
                const ipRegex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){2}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
                const macRegex = /^([0-9a-f]{2}[:-]){5}([0-9a-f]{2})$/i;
    
                if (ipRegex.test(ip) && macRegex.test(mac)) {
                    output.push({ ip, mac });
                }
            }
            
            // Stop reading if we hit the next interface header
            if (cols[0].startsWith('Interface:')) {
                isReadingDevices = false; // Stop reading devices for the next interface
            }
        }
    
        // Return the output array directly
        res.status(200).json(output);
    });
    
    
}

