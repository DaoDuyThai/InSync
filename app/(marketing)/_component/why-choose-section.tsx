import { Card, CardContent, CardHeader, CardTitle, } from "@/components/ui/card"
import Image from "next/image"

export default function WhyChooseSection() {
    return (
        <section className="w-full h-full container mt-40">
            <h2 className="text-2xl md:text-4xl font-bold text-center">Why choosing InSync?</h2>
            <div className="grid md:grid-cols-3 gap-10 my-10">

                <Card className="shadow-sm shadow-slate-300">
                    <CardHeader>
                        <Image src="/eyes.svg" width={75} height={75} alt="hero" />
                    </CardHeader>
                    <CardHeader>
                        <CardTitle>Visual Script Customization</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-neutral-600">Our web service offers a user-friendly platform to visually create and customize automation scripts, making the process faster and more accessible.</p>
                    </CardContent>
                </Card>

                <Card className="shadow-sm shadow-slate-300">
                    <CardHeader>
                        <Image src="/android.svg" width={75} height={75} alt="hero" />
                    </CardHeader>
                    <CardHeader>
                        <CardTitle>No ADB Required</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-neutral-600">Unlike traditional tools, InSync uses Android&apos;s accessibility services, eliminating the need for complex ADB setups.</p>
                    </CardContent>
                </Card>

                <Card className="shadow-sm shadow-slate-300">
                    <CardHeader>
                        <Image src="/sync.svg" width={75} height={75} alt="hero" />
                    </CardHeader>
                    <CardHeader>
                        <CardTitle>Real-Time Execution</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-neutral-600">Experience seamless script execution directly on your Android device, with real-time logs to monitor every action.</p>
                    </CardContent>
                </Card>
            </div>

        </section>
    )
}