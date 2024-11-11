"use client"

import qs from "query-string"
import { Search } from "lucide-react"
import { useDebounceValue } from "usehooks-ts"
import { useRouter } from "next/navigation"
import * as React from "react"
import { Input } from "@/components/ui/input"

interface SearchInputProps {
    searchLink?: string;
    searchEntity?: string;
}

export const SearchInput = (
    { searchLink, searchEntity }: SearchInputProps
) => {
    const [value, setValue] = React.useState("");
    const [debouncedValue] = useDebounceValue(value, 500);

    const router = useRouter();

    React.useEffect(() => {
        const url = qs.stringifyUrl({
            url: "/" + searchLink,
            query: {
                search: debouncedValue
            },
        }, { skipEmptyString: true, skipNull: true });
        router.push(url);
    }, [debouncedValue, router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
    };

    return (
        <div className="w-full relative">
            <Search className="absolute top-1/2 left-3 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input onChange={handleChange} value={value} className="w-full max-w-[900px] pl-9 " placeholder={"Search " + searchEntity} />
        </div>
    )
}