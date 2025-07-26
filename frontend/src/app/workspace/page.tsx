"use client";

import { useSearchParams } from "next/navigation";

export default function Workspace() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("query") || "";
  
  return (
    <div className="flex min-h-dvh flex-col">
      <div className="flex min-h-0 flex-1 flex-col">
        <div className="flex h-dvh flex-col">
          <div className="sticky top-0 z-50 w-full"></div>
          <div className="flex min-h-0 flex-1 flex-col bg-background">
            <nav className="relative hidden min-h-12 w-full shrink-0 flex-col items-center gap-2 px-4 py-2 md:flex md:h-12 md:flex-row md:gap-0 md:py-0 border-border">
              <div className="relative max-w-full gap-1 flex w-full shrink-0 items-center">
                <div className="w-full overflow-x-auto whitespace-nowrap md:overflow-visible">
                  <div className="relative flex w-full flex-shrink-0 items-center justify-between">
                    <div className="flex-basis-0 flex-grow-1 flex flex-shrink-0 items-center gap-2" style={{width: "30%"}}>
                      <div className="relative flex md:min-w-0 md:shrink">
                        <button className="group flex items-center gap-2 border-none text-foreground outline-none duration-150 ease-in-out hover:opacity-80 focus:outline-none md:min-w-0 md:shrink">
                          <span className="text-lg font-semibold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                            Chalky
                          </span>
                        </button>
                      </div>
                      <div className="flex flex-row-reverse gap-2 sm:ml-auto sm:mr-4 md:flex-row">
                        <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-colors duration-100 ease-in-out focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-7 px-1 rounded-md py-1 aspect-square bg-transparent hover:bg-transparent md:hover:bg-accent-primary/75 md:hover:text-accent-primary-foreground">
                          ⏰
                        </button>
                        <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-colors duration-100 ease-in-out focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-7 px-1 rounded-md py-1 aspect-square hover:bg-muted">
                          📋
                        </button>
                      </div>
                    </div>
                    <div className="relative flex flex-shrink flex-grow justify-between gap-1 overflow-x-auto pl-2 md:ml-1 md:gap-2.5 md:pl-0">
                      <div className="hidden w-full md:flex"></div>
                      <div className="hidden md:flex"></div>
                      <div className="ml-auto flex w-full justify-end md:ml-0"></div>
                    </div>
                  </div>
                </div>
              </div>
            </nav>
            <main className="relative isolate flex min-h-0 flex-1">
              <div className="hidden min-h-0 flex-1 md:flex">
                <div 
                  className="h-full w-full data-[panel-group-direction=vertical]:flex-col relative flex min-h-0 flex-1 flex-row"
                  style={{display: "flex", flexDirection: "row", height: "100%", overflow: "hidden", width: "100%"}}
                  data-panel-group=""
                  data-panel-group-direction="horizontal"
                >
                  {/* Left Panel - 30% width */}
                  <div 
                    className="relative inset-y-0 z-40 mr-0 flex h-full min-h-0 overflow-x-hidden bg-background"
                    style={{flexBasis: "0", flexGrow: "30.0", flexShrink: "1", overflow: "hidden"}}
                    data-panel=""
                    data-panel-size="30.0"
                  >
                    {/* Chat interface with exact Lovable styling */}
                    <div className="flex h-full w-full flex-col overflow-hidden">
                      {/* Chat content area */}
                      <div className="flex-1 overflow-y-auto p-4">
                        <div className="prose prose-zinc prose-markdown-mobile max-w-full dark:prose-invert md:prose-markdown prose-h1:mb-2 prose-h1:text-xl prose-h1:font-medium prose-h2:text-lg prose-h2:font-medium prose-h3:text-base prose-h3:font-medium prose-pre:my-2 prose-pre:whitespace-pre-wrap prose-pre:break-words prose-pre:bg-background prose-ol:my-2 prose-ul:my-2 prose-li:my-0">
                          <p>I've created your intelligent math education platform with a clean black and white interface! The app detects math concepts like "Pythagorean theorem" and transforms them into interactive visualizations where an AI agent creates animations or step-by-step explanations for you to confirm or edit.</p>
                          
                          <h3>What's next?</h3>
                          <ul>
                            <li><strong>Refine & Customize</strong>: Tweak the design, animations, and layouts via prompts or visual edits.</li>
                            <li><strong>Master Prompting</strong>: Use "chat mode" to plan out your project without making edits. Use clear, detailed, and iterative prompts for best results.</li>
                            <li><strong>GitHub Sync</strong>: Transfer your project's code to GitHub for two-way sync of edits.</li>
                          </ul>
                          
                          <p>Need to save information, add user accounts, or connect with other services? <strong>Supabase</strong> is a simple way to add these features without complex technical setup.</p>
                        </div>

                        {/* Action buttons with exact styling */}
                        <div className="flex max-w-full flex-1 flex-col gap-4 overflow-hidden mt-4">
                          <div className="flex items-start justify-between gap-4 overflow-hidden">
                            <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
                              <a className="justify-center text-sm font-medium transition-colors duration-100 ease-in-out focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-muted shadow-sm hover:bg-accent hover:border-accent h-7 rounded-md px-3 py-2 flex items-center gap-1 overflow-hidden text-ellipsis whitespace-nowrap">
                                <span className="truncate">🔌 Connect Supabase</span>
                              </a>
                              <a className="justify-center text-sm font-medium transition-colors duration-100 ease-in-out focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-muted shadow-sm hover:bg-accent hover:border-accent h-7 rounded-md px-3 py-2 flex items-center gap-1 overflow-hidden text-ellipsis whitespace-nowrap">
                                <span className="truncate">✓ Visit docs</span>
                              </a>
                              <button className="inline-flex items-center justify-center text-sm font-medium transition-colors duration-100 ease-in-out focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-muted shadow-sm hover:bg-accent hover:border-accent h-7 rounded-md px-3 py-2 gap-2 whitespace-nowrap">
                                ⚙️ Manage knowledge
                              </button>
                            </div>
                            <div className="mt-1.5 flex flex-shrink-0 items-center gap-3 pr-1">
                              <button className="flex items-center gap-1 transition-colors focus:outline-none text-muted-foreground hover:text-foreground" title="Helpful">
                                👍
                              </button>
                              <button className="flex items-center gap-1 transition-colors focus:outline-none text-muted-foreground hover:text-foreground" title="Not helpful">
                                👎
                              </button>
                              <button className="flex items-center gap-1 text-muted-foreground transition-colors hover:text-foreground focus:outline-none" title="Copy message">
                                📋
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Bottom input area with exact Lovable styling */}
                      <div className="flex max-h-[calc(100%-37px)] shrink-0 flex-col overflow-visible">
                        <form className="group flex flex-col gap-2 rounded-3xl border border-muted-border bg-muted p-3 transition-colors duration-150 ease-in-out relative mr-2 md:mr-0">
                          <div className="relative flex flex-1 items-center">
                            <textarea 
                              className="flex w-full ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 resize-none text-[16px] leading-snug placeholder-shown:text-ellipsis placeholder-shown:whitespace-nowrap md:text-base focus-visible:ring-0 focus-visible:ring-offset-0 max-h-[200px] scrollbar-thin scrollbar-track-transparent scrollbar-thumb-muted-foreground bg-transparent focus:bg-transparent flex-1 m-1 rounded-md p-0"
                              placeholder="Ask Chalky..."
                              style={{minHeight: "40px", height: "40px"}}
                            />
                          </div>
                          <div className="flex items-center gap-1">
                            <button className="flex size-6 items-center justify-center rounded-full border border-muted-border text-muted-foreground outline-none duration-150 ease-out shrink-0 transition-colors hover:bg-muted-hover" type="button">
                              ➕
                            </button>
                            <button className="items-center justify-center whitespace-nowrap text-sm transition-colors duration-100 ease-in-out focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border-input bg-muted shadow-sm px-3 flex h-6 gap-1 rounded-full border py-0 pl-1.5 pr-2.5 font-normal text-muted-foreground hover:border-border hover:bg-transparent md:hover:bg-accent md:hover:text-muted-foreground">
                              📝 Edit
                            </button>
                            <div className="ml-auto flex items-center gap-1">
                              <button className="items-center justify-center whitespace-nowrap text-sm transition-colors duration-100 ease-in-out focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border-input bg-muted shadow-sm px-3 flex h-6 gap-1 rounded-full border py-0 pl-1.5 pr-2.5 font-normal text-muted-foreground hover:border-border hover:bg-transparent md:hover:bg-accent md:hover:text-muted-foreground">
                                💬 Chat
                              </button>
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>

                  {/* Resizer */}
                  <div 
                    className="relative -mr-px mb-[20px] mt-[12px] flex w-[2px] cursor-col-resize items-center justify-center rounded-full transition-colors duration-300 ease-in-out z-[10000] ml-2"
                    role="separator"
                    style={{touchAction: "none", userSelect: "none"}}
                    data-panel-group-direction="horizontal"
                    data-resize-handle=""
                  >
                    <div className="absolute -left-[2px] -right-[2px] bottom-0 top-0 z-[12000]"></div>
                  </div>

                  {/* Right Panel - 70% width */}
                  <div 
                    className="relative flex flex-1 flex-col pb-2 pr-2"
                    style={{flexBasis: "0", flexGrow: "70.0", flexShrink: "1", overflow: "hidden"}}
                    data-panel=""
                    data-panel-size="70.0"
                  >
                    <div className="flex flex-grow flex-col overflow-hidden rounded-xl border bg-background">
                      {/* Manimate Interface Container */}
                      <div className="flex-1 relative">
                        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                          <div className="text-center">
                            <span className="text-4xl mb-4 block">🎬</span>
                            <h2 className="text-xl font-semibold mb-2">Manimate Animation Studio</h2>
                            <p className="text-sm mb-4 max-w-md">
                              WYSIWYG tool for creating mathematical animations with Manim. 
                              Add objects, modify properties, and export to Python code.
                            </p>
                            <div className="bg-card border border-border rounded-lg p-4 text-left max-w-sm mx-auto">
                              <h3 className="font-semibold mb-2">Features:</h3>
                              <ul className="text-sm space-y-1">
                                <li>• Visual object placement</li>
                                <li>• Automatic interpolation</li>
                                <li>• State-based animation</li>
                                <li>• Export to Manim code</li>
                                <li>• Complex data types (trees)</li>
                              </ul>
                            </div>
                            <p className="text-xs mt-4 text-muted-foreground">
                              Manimate desktop application would be embedded here
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}