"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer } from "@/components/ui/chart"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { useState, useEffect } from "react"

type DailyData = {
    date: string
    gross: number
    net: number
    newCustomers: number
    mrr: number
    churnRate: number
    avgRevenuePerCustomer: number
    activeSubscriptions: number
    canceledSubscriptions: number
}

type RevenueData = {
    dailyData: DailyData[]
    totals: {
        gross: number
        net: number
        newCustomers: number
        currentMRR: number
        avgChurnRate: number
        customerLifetimeValue: number
        activeSubscriptions: number
    }
}

export default function RevenueChart() {
    const [revenueData, setRevenueData] = useState<RevenueData | null>(null)

    useEffect(() => {
        const fetchRevenueData = async () => {
            try {
                const response = await fetch('/api/stripe-volumes')
                if (response.ok) {
                    const data = await response.json()
                    setRevenueData(data)
                } else {
                    console.error('Error fetching revenue data:', response.statusText)
                }
            } catch (error) {
                console.error('Error:', error)
            }
        }

        fetchRevenueData()
    }, [])

    const chartConfig = {
        gross: {
            label: "Gross Revenue",
            color: "hsl(var(--chart-1))",
        },
        net: {
            label: "Net Revenue",
            color: "hsl(var(--chart-2))",
        },
    }

    if (!revenueData) {
        return <div>Loading...</div>
    }

    return (
        <Card className="w-full" >
            <CardHeader>
                <CardTitle className="flex justify-between items-center">
                    <div>
                        Last 30-days Revenue
                    </div>
                    <div>
                        <div className="text-xl font-normal text-[hsl(var(--chart-1))]">
                            Total Gross: ${revenueData.totals.gross.toFixed(2)}
                        </div>
                        <div className="text-xl font-normal text-[hsl(var(--chart-2))]">
                            Total Net: ${revenueData.totals.net.toFixed(2)}
                        </div>
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent className="w-full">
                <ChartContainer config={chartConfig} className="h-[400px] w-full" >
                    <ResponsiveContainer width="100%" height="100%" >
                        <LineChart data={revenueData.dailyData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                                dataKey="date"
                                tickFormatter={(value) => new Date(value).toLocaleDateString()
                                }
                            />
                            < YAxis />
                            <Tooltip
                                content={
                                    ({ active, payload, label }) => {
                                        if (active && payload && payload.length) {
                                            return (
                                                <div className="bg-background p-2 border rounded shadow" >
                                                    <p className="font-bold" > {new Date(label).toLocaleDateString()} </p>
                                                    < p className="text-[var(--color-gross)]" > Gross: ${typeof payload[0]?.value === 'number' ? payload[0].value.toFixed(2) : 'N/A'} </p>
                                                    < p className="text-[var(--color-net)]" > Net: ${typeof payload[1]?.value === 'number' ? payload[1].value.toFixed(2) : 'N/A'} </p>
                                                </div>
                                            )
                                        }
                                        return null
                                    }
                                }
                            />
                            < Line
                                type="monotone"
                                dataKey="gross"
                                stroke="var(--color-gross)"
                                strokeWidth={2}
                                dot={false}
                            />
                            <Line
                                type="monotone"
                                dataKey="net"
                                stroke="var(--color-net)"
                                strokeWidth={2}
                                dot={false}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}