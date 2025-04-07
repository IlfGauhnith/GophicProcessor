"use client";

import React from "react";
import { useRouter } from "next/navigation";

import { Button, Popover } from "@headlessui/react";
import GoogleLoginButton from "./GoogleLoginButton";
import Image from "next/image";
import { Box, Flex } from "@radix-ui/themes";



export default function Header() {
    const router = useRouter();

    return (
        <header
            className="bg-[#D3951C] flex items-center justify-between w-full p-4 shadow-xl z-10"
        >
            <Box className="flex items-center space-x-2">
                <Image
                    src="/GophicProcessor.png"
                    alt="GophicProcessor Logo"
                    onClick={() => router.push("/")}
                    width={50}
                    height={50}
                    className="
                    hidden
                    cursor-pointer
                    md:w-[176px]
                    md:block
                    h-auto 
                    "
                />
            </Box>

            <Flex className="flex justify-center items-center space-x-4">
                <Button id="resize-button"
                    onClick={() => router.push("/Resize")}
                    className="
                    relative
                    focus:outline-none
                    px-4 
                    py-2 
                    bg-[#D3951C] 
                    text-[#2E0C1F] 
                    rounded 
                    data-[hover]:text-white
                    font-bold
                    transition-transform
                    transform-gpu /* Ensures that the transform is hardware accelerated. */
                    duration-200 /* 200ms duration */
                    data-[hover]:scale-105
                    data-[hover]:translate-0.5
                    data-[hover]:cursor-pointer
                ">
                    Resize
                </Button>

                <Popover className="relative">
                    <Popover.Button
                        className="
                            focus:outline-none
                            px-4 
                            py-2 
                            bg-[#D3951C] 
                            text-[#2E0C1F] 
                            rounded 
                            data-[hover]:text-white
                            font-bold
                            transition-transform
                            transform-gpu /* Ensures that the transform is hardware accelerated. */
                            duration-200 /* 200ms duration */
                            data-[hover]:scale-105
                            data-[hover]:translate-0.5
                            data-[hover]:cursor-pointer
                        "
                    >
                        Conversors
                    </Popover.Button>

                    <Popover.Panel
                        transition
                        anchor="bottom"
                        className="
                        absolute 
                        right-0 
                        z-10 
                        mt-2 
                        w-52 
                        rounded 
                        shadow-lg 
                        bg-[#9C8F8B] 
                        font-bold
                        
                        transition 
                        transform-gpu
                        duration-300 
                        ease-in-out
                        [--anchor-gap:var(--spacing-5)] 
                        data-[closed]:-translate-y-1 
                        data-[closed]:opacity-0
                    "
                    >
                        <div className="p-3">
                            <a className="block rounded-lg py-2 px-3 transition hover:bg-white/5" href="#">
                                <p className="font-semibold text-[#2E0C1F]">jpg</p>
                            </a>
                            <a className="block rounded-lg py-2 px-3 transition hover:bg-white/5" href="#">
                                <p className="font-semibold text-[#2E0C1F]">png</p>
                            </a>
                            <a className="block rounded-lg py-2 px-3 transition hover:bg-white/5" href="#">
                                <p className="font-semibold text-[#2E0C1F]">gif</p>
                            </a>
                            <a className="block rounded-lg py-2 px-3 transition hover:bg-white/5" href="#">
                                <p className="font-semibold text-[#2E0C1F]">tiff</p>
                            </a>
                            <a className="block rounded-lg py-2 px-3 transition hover:bg-white/5" href="#">
                                <p className="font-semibold text-[#2E0C1F]">bmp</p>
                            </a>
                            <a className="block rounded-lg py-2 px-3 transition hover:bg-white/5" href="#">
                                <p className="font-semibold text-[#2E0C1F]">webp</p>
                            </a>
                        </div>
                    </Popover.Panel>
                </Popover>

                <div className="border-l-2 border-[#2E0C1F] h-8" />
                <div className="sm:hidden mr-0">
                    <Button id="login-button"
                        onClick={() => router.push("/Login")}
                        className="
                    relative
                    focus:outline-none
                    px-4 
                    py-2 
                    mr-0
                    bg-[#e5a524] 
                    text-[#2E0C1F] 
                    rounded 
                    data-[hover]:text-white
                    font-bold
                    transition-transform
                    transform-gpu /* Ensures that the transform is hardware accelerated. */
                    duration-200 /* 200ms duration */
                    data-[hover]:scale-105
                    data-[hover]:translate-0.5
                    data-[hover]:cursor-pointer
                    ">
                        Login
                    </Button>
                </div>
                <div className="hidden sm:block">
                    <GoogleLoginButton />
                </div>
            </Flex>
        </header>
    );
}
