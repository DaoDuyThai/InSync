"use client";

import Link from "next/link";
import * as React from "react";

const DocsPage = () => {
    return (
        <div className="w-full h-full overflow-y-auto py-4 px-6">
            <h1 className="text-3xl text-center font-bold my-4">Welcome to Insync Documentation</h1>
            <p className="text-md my-6">
                Thank you for choosing Insync! This documentation is designed to guide you through every step of your journey,
                from setting up the platform to leveraging its full potential.
            </p>
            <h2 className="text-2xl font-bold">
                What Is Insync?
            </h2>
            <p className="text-md my-6">
                InSync is a <span className="font-bold">web-based automation platform</span> that enables users to automate workflows on Android devices via API connections. With InSync, you can create, manage, and execute automation scripts effortlessly, whether for testing applications, interacting with apps, or customizing device behaviors.
            </p>
            <h2 className="text-2xl font-bold">
                How to Use This Documentation
            </h2>
            <p className="text-md my-6">
                This documentation is divided into several sections to help you navigate the platform and its features with ease:
            </p>
            <ul className="list-disc list-inside my-4 ml-4">
                <li className="mb-2"><Link href="/docs/getting-started" className="font-bold">Getting Started:</Link> Learn the basics of Insync, including how to set up your account, understand the interface, and get started with your first workflow.</li>
                <li className="mb-2"><Link href="/docs/installation" className="font-bold">Installation:</Link> Follow step-by-step instructions to install Insync on your system and ensure it’s ready to use without any hiccups.</li>
                <li className="mb-2"><Link href="/docs/blocks" className="font-bold">Blocks:</Link> Discover the building blocks of Insync, explore their functions, and learn how to combine them to create powerful workflows.</li>
                <li className="mb-2"><Link href="/docs/examples" className="font-bold">Examples:</Link> Get inspired by real-world examples and templates to help you quickly create workflows tailored to your needs.</li>
            </ul>
            <p className="text-md my-6">
                We’re excited to have you on board and can’t wait to see how Insync helps you streamline your workflow.
            </p>
            <p className="text-md text-center font-semibold">Happy Syncing! — The Insync Team</p>
        </div>
    );
}

export default DocsPage;
