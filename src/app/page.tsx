'use client'
import { ThemeTogler } from "@/components/ThemeTogler";
import { useAppSelector } from "@/store/hooks";
import { BookCopy, LayoutDashboard, Proportions } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  // This is the main page of the application, which serves as the landing page.
  const user = useAppSelector((state) => state.auth.user);
  return (
    <div className="grid grid-rows-[20px_1fr_20px] bg-background text-card-foreground items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <div className="flex flex-row items-center justify-center gap-4">

            <Image
              className="dark:invert rounded-2xl"
              src="/logo.jpg"
              alt="Project logo"
              width={100}
              height={100}
              priority
            />
          <h1 className="text-4xl md:text-6xl font-extrabold text-foreground relative inline-block  hover:scale-105 transition-transform duration-300">
          <span className="relative z-10 text- text-nowrap transition duration-300">
            Mint Slot
          </span>
          
        </h1>
        </div>
       
        <div className="absolute bottom-2 right-2">
          <ThemeTogler />
        </div>
        

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <Link
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
            href="/"
          ><BookCopy size={20} />
            Book Now
          </Link>
          <Link
            className="rounded-full border border-solid gap-1 border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px]"
            href="/"
          >
            <Proportions />
             Availablity
          </Link>
          {
            !user && (
              <Link
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
            href="/dashoard"
           
          ><LayoutDashboard size={20} />
            Dashboard
          </Link>
            )
          }
        </div>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <Link
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="/sign-in"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Login
        </Link>
        <Link
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="/sign-up"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Register
        </Link>
        <Link
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </Link>
      </footer>
    </div>
  );
}
