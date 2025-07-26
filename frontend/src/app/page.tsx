"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import Logo from "@/components/Logo";

export default function Home() {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      // Navigate to project workspace with the query
      router.push(`/workspace?query=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-background transition-none">
      {/* Background gradient */}
      <div className="absolute inset-0 w-full overflow-hidden">
        <div className="animate-slideUp absolute inset-0 mt-0 opacity-100 blur-[10px]">
          <div
            className="absolute left-1/2 aspect-square w-[350%] -translate-x-1/2 overflow-hidden md:w-[190%] lg:w-[190%] xl:w-[190%] 2xl:mx-auto"
            style={{
              background: "radial-gradient(ellipse at center, rgba(79, 70, 229, 0.3) 0%, rgba(147, 51, 234, 0.1) 50%, transparent 70%)",
              WebkitMask: "linear-gradient(to bottom, transparent 0%, black 5%, black 100%)",
              mask: "linear-gradient(to bottom, transparent 0%, black 5%, black 100%)",
              WebkitBackfaceVisibility: "hidden",
              backfaceVisibility: "hidden",
              WebkitPerspective: "1000px",
              perspective: "1000px",
              willChange: "transform",
            }}
          />
        </div>
      </div>

      {/* Grain overlay */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.02'/%3E%3C/svg%3E")`,
          backgroundSize: "100px 100px",
          backgroundRepeat: "repeat",
          backgroundBlendMode: "overlay",
          backgroundPosition: "left top",
          mixBlendMode: "overlay",
        }}
      />

      {/* Navigation */}
      <nav className="sticky top-0 z-50 flex w-full flex-col items-center justify-between border-transparent transition-all duration-200 ease-out">
        <div className="container flex h-16 w-full items-center justify-between px-8">
          <div className="flex items-center gap-8">
            <a className="transition-opacity hover:opacity-75" href="/">
              <span className="text-2xl font-semibold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Chalky
              </span>
            </a>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="container mx-auto overflow-x-hidden overflow-y-hidden px-4">
        <div className="relative w-full">
          <section className="mb-[20px] flex w-full flex-col items-center justify-center py-[20vh] md:mb-0 2xl:py-64">
            <div className="mb-4 flex flex-col items-center px-4 text-center md:mb-6">
              <div className="flex w-full flex-col items-center justify-center gap-2"></div>
              <h1 className="mb-2 flex items-center gap-1 text-2xl font-medium leading-none text-foreground sm:text-3xl md:mb-2.5 md:gap-0 md:text-5xl">
                <span className="pt-0.5 tracking-tight md:pt-0">Build something</span>
                <span className="ml-2 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent font-semibold">
                  Mathematical
                </span>
              </h1>
              <p className="text-lg text-muted-foreground md:text-xl">
                Interactive math education with AI-powered explanations
              </p>
            </div>

            {/* Main input form */}
            <div className="flex w-full max-w-2xl flex-col items-center gap-4">
              <form
                onSubmit={handleSubmit}
                className={`group flex flex-col gap-2 p-3 w-full rounded-3xl border ${
                  isFocused ? "border-foreground/20" : "border-muted-foreground/20"
                } bg-muted/50 backdrop-blur text-base shadow-xl transition-all duration-150 ease-in-out hover:border-foreground/10 focus-within:border-foreground/20 focus-within:hover:border-foreground/20`}
              >
                <div className="relative flex flex-1 items-center">
                  <textarea
                    className="flex w-full rounded-md px-2 py-2 ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 resize-none text-[16px] leading-snug placeholder-shown:text-ellipsis placeholder-shown:whitespace-nowrap md:text-base focus-visible:ring-0 focus-visible:ring-offset-0 max-h-[200px] scrollbar-thin scrollbar-track-transparent scrollbar-thumb-muted-foreground bg-transparent focus:bg-transparent flex-1"
                    style={{ minHeight: "80px" }}
                    placeholder='Try "Show me how combinations work with n = 10 and r = 3"'
                    maxLength={50000}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSubmit(e);
                      }
                    }}
                  />
                </div>
                <div className="flex gap-1 flex-wrap items-center">
                  <button
                    type="button"
                    className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors duration-100 ease-in-out focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-muted shadow-sm hover:bg-accent hover:border-accent gap-1.5 h-8 w-8 rounded-full p-0 text-muted-foreground hover:text-foreground"
                  >
                    <Plus className="h-5 w-5" />
                  </button>
                  <button
                    type="submit"
                    className="ml-auto inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors duration-100 ease-in-out focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-8 rounded-full px-4 py-2"
                    disabled={!query.trim()}
                  >
                    Start creating
                  </button>
                </div>
              </form>

              {/* Example prompts */}
              <div className="flex flex-wrap gap-2 justify-center mt-4">
                <button
                  onClick={() => setQuery("Explain the Pythagorean theorem with interactive visuals")}
                  className="text-sm px-3 py-1.5 rounded-full border border-muted-foreground/20 hover:border-foreground/20 transition-colors"
                >
                  Pythagorean theorem
                </button>
                <button
                  onClick={() => setQuery("Show me how derivatives work step by step")}
                  className="text-sm px-3 py-1.5 rounded-full border border-muted-foreground/20 hover:border-foreground/20 transition-colors"
                >
                  Calculus basics
                </button>
                <button
                  onClick={() => setQuery("Create an interactive graph for y = sin(x)")}
                  className="text-sm px-3 py-1.5 rounded-full border border-muted-foreground/20 hover:border-foreground/20 transition-colors"
                >
                  Trigonometry
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}