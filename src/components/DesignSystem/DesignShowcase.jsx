import React, { useState } from "react";
import LevelBar from "../UserPage/LevelBar";
import StarLevel from "../CustomIcons/StarLevel";
import SignalLevel from "../CustomIcons/SignalLevel";
import Btn from "../common/Btn";
import ThemeToggle from "../common/ThemeToggle";
import {
  mockUser,
  mockQuizzes,
  commonIcons,
  designSystemTabs,
} from "./mockData";

const DesignShowcase = () => {
  const [activeTab, setActiveTab] = useState("typography");

  return (
    <div className="bg-background min-h-screen p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="bg-surface-elevated border-border mb-8 rounded-3xl border p-8 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-text mb-2 text-4xl font-bold">
                🎨 Design System Showcase
              </h1>
              <p className="text-text-muted text-lg">
                Complete visualization of the QuizMaster design system
              </p>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <div className="bg-primary/10 rounded-full p-3">
                <svg
                  className="text-primary h-8 w-8"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 2a2 2 0 00-2 2v11a3 3 0 106 0V4a2 2 0 00-2-2H4zm1 14a1 1 0 100-2 1 1 0 000 2zm5-1.757l4.9-4.9a2 2 0 000-2.828L13.485 5.1a2 2 0 00-2.828 0L10 5.757v8.486zM16 18H9.071l6-6H16a2 2 0 012 2v2a2 2 0 01-2 2z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-surface border-border mb-8 rounded-2xl border p-2">
          <div className="flex flex-wrap gap-2">
            {designSystemTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`rounded-xl px-6 py-3 font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? "bg-primary text-text-inverse shadow-md"
                    : "text-text hover:bg-surface-elevated"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content based on active tab */}
        {activeTab === "typography" && (
          <div className="space-y-8">
            {/* Typography Section */}
            <div className="bg-surface-elevated border-border rounded-3xl border p-8 shadow-lg">
              <h2 className="text-text mb-6 text-3xl font-bold">
                Typography System
              </h2>

              {/* Montserrat - Headings */}
              <div className="mb-8">
                <h3 className="text-primary mb-4 text-xl font-semibold">
                  1. Montserrat - Headings & Titles (Automatic)
                </h3>
                <div className="space-y-4">
                  <h1 className="text-text text-6xl font-bold">
                    H1 - Main Title (6xl, bold)
                  </h1>
                  <h2 className="text-text text-4xl font-bold">
                    H2 - Page Title (4xl, bold)
                  </h2>
                  <h3 className="text-text text-3xl font-semibold">
                    H3 - Section Title (3xl, semibold)
                  </h3>
                  <h4 className="text-text text-2xl font-semibold">
                    H4 - Subsection (2xl, semibold)
                  </h4>
                  <h5 className="text-text text-xl font-medium">
                    H5 - Card Title (xl, medium)
                  </h5>
                  <h6 className="text-text text-lg font-medium">
                    H6 - Small Title (lg, medium)
                  </h6>
                </div>
              </div>

              {/* Hind - Body & UI */}
              <div className="mb-8">
                <h3 className="text-primary mb-4 text-xl font-semibold">
                  2. Hind - Body Text & UI Elements (Automatic)
                </h3>
                <div className="space-y-3">
                  <p className="text-text text-lg">
                    Large body text (text-lg) - Used for important descriptions
                    and lead paragraphs in Hind font.
                  </p>
                  <p className="text-text text-base">
                    Standard body text (text-base) - The most commonly used text
                    size throughout the application, optimized for readability.
                  </p>
                  <p className="text-text-muted text-sm">
                    Small helper text (text-sm) in muted color for secondary
                    information and captions.
                  </p>
                  <p className="text-text-muted text-xs">
                    Extra small text (text-xs) for fine print and micro-copy.
                  </p>
                  <button className="bg-primary hover:bg-primary/85 text-text-inverse rounded-lg px-4 py-2 transition-colors">
                    Button with Hind font (automatic)
                  </button>
                  <label className="text-text block text-sm font-medium">
                    Form label with Hind font (automatic)
                  </label>
                </div>
              </div>

              {/* PT Serif - Accents */}
              <div>
                <h3 className="text-primary mb-4 text-xl font-semibold">
                  3. PT Serif - Accents & Quotes (Automatic)
                </h3>
                <div className="space-y-4">
                  <blockquote className="text-text border-accent bg-accent/5 border-l-4 pl-4 text-lg italic">
                    "Education is the most powerful weapon which you can use to
                    change the world." - Nelson Mandela
                  </blockquote>
                  <blockquote className="text-accent text-2xl font-medium italic">
                    QuizMaster - Learning through Interactive Challenges
                  </blockquote>
                  <p className="text-text-muted text-sm">
                    PT Serif used automatically for blockquotes, citations, and
                    special accents
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "colors" && (
          <div className="space-y-8">
            {/* Color Palette */}
            <div className="bg-surface-elevated border-border rounded-3xl border p-8 shadow-lg">
              <h2 className="text-text mb-6 text-3xl font-bold">
                Color Palette
              </h2>

              {/* Brand Colors */}
              <div className="mb-8">
                <h3 className="text-primary mb-4 text-xl font-semibold">
                  Brand Colors
                </h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="text-center">
                    <div className="bg-primary mx-auto mb-3 h-20 w-20 rounded-xl shadow-lg"></div>
                    <p className="text-text font-medium">Primary</p>
                    <p className="text-text-muted text-sm">#6145ae</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-secondary mx-auto mb-3 h-20 w-20 rounded-xl shadow-lg"></div>
                    <p className="text-text font-medium">Secondary</p>
                    <p className="text-text-muted text-sm">#6b7280</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-accent mx-auto mb-3 h-20 w-20 rounded-xl shadow-lg"></div>
                    <p className="text-text font-medium">Accent</p>
                    <p className="text-text-muted text-sm">#f59e0b</p>
                  </div>
                </div>
              </div>

              {/* Surface Colors */}
              <div className="mb-8">
                <h3 className="text-primary mb-4 text-xl font-semibold">
                  Surface Colors
                </h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="text-center">
                    <div className="bg-background border-border mx-auto mb-3 h-20 w-20 rounded-xl border shadow-lg"></div>
                    <p className="text-text font-medium">Background</p>
                    <p className="text-text-muted text-sm">Base surface</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-surface border-border mx-auto mb-3 h-20 w-20 rounded-xl border shadow-lg"></div>
                    <p className="text-text font-medium">Surface</p>
                    <p className="text-text-muted text-sm">Card background</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-surface-elevated border-border mx-auto mb-3 h-20 w-20 rounded-xl border shadow-lg"></div>
                    <p className="text-text font-medium">Surface Elevated</p>
                    <p className="text-text-muted text-sm">Elevated elements</p>
                  </div>
                </div>
              </div>

              {/* Semantic Colors */}
              <div>
                <h3 className="text-primary mb-4 text-xl font-semibold">
                  Semantic Colors
                </h3>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  <div className="text-center">
                    <div className="bg-correct mx-auto mb-3 h-16 w-16 rounded-xl shadow-lg"></div>
                    <p className="text-text font-medium">Correct</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-incorrect mx-auto mb-3 h-16 w-16 rounded-xl shadow-lg"></div>
                    <p className="text-text font-medium">Incorrect</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-warning mx-auto mb-3 h-16 w-16 rounded-xl shadow-lg"></div>
                    <p className="text-text font-medium">Warning</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-info mx-auto mb-3 h-16 w-16 rounded-xl shadow-lg"></div>
                    <p className="text-text font-medium">Info</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "components" && (
          <div className="space-y-8">
            {/* Buttons */}
            <div className="bg-surface-elevated border-border rounded-3xl border p-8 shadow-lg">
              <h2 className="text-text mb-6 text-3xl font-bold">
                Button Components
              </h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-primary mb-4 text-xl font-semibold">
                    Button Variants
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    <Btn variant="primary">Primary Button</Btn>
                    <Btn variant="secondary">Secondary Button</Btn>
                    <Btn variant="accent">Accent Button</Btn>
                    <Btn variant="outline">Outline Button</Btn>
                    <Btn variant="surface">Surface Button</Btn>
                    <Btn variant="elevated">Elevated Button</Btn>
                    <Btn variant="ghost">Ghost Button</Btn>
                    <Btn variant="link">Link Button</Btn>
                  </div>
                </div>

                <div>
                  <h3 className="text-primary mb-4 text-xl font-semibold">
                    Quiz-Specific Variants
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    <Btn variant="correct">Correct Answer</Btn>
                    <Btn variant="incorrect">Incorrect Answer</Btn>
                    <Btn variant="selected">Selected Option</Btn>
                    <Btn variant="neutral">Neutral Option</Btn>
                  </div>
                </div>

                <div>
                  <h3 className="text-primary mb-4 text-xl font-semibold">
                    Functional Variants
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    <Btn variant="warning">Warning Button</Btn>
                    <Btn variant="info">Info Button</Btn>
                  </div>
                </div>

                <div>
                  <h3 className="text-primary mb-4 text-xl font-semibold">
                    Button Sizes
                  </h3>
                  <div className="flex flex-wrap items-center gap-3">                    <Btn size="sm">Small</Btn>
                    <Btn size="md">Medium</Btn>
                    <Btn size="lg">Large</Btn>
                    <Btn size="xl">Extra Large</Btn>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Elements */}
            <div className="bg-surface-elevated border-border rounded-3xl border p-8 shadow-lg">
              <h2 className="text-text mb-6 text-3xl font-bold">
                Form Elements
              </h2>

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="text-text mb-2 block text-sm font-medium">
                    Text Input
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your text here..."
                    className="border-border bg-surface text-text focus:border-border-focus focus:ring-primary/20 w-full rounded-xl border px-4 py-3 transition-all duration-200 focus:ring-2 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-text mb-2 block text-sm font-medium">
                    Select Dropdown
                  </label>
                  <select className="border-border bg-surface text-text focus:border-border-focus focus:ring-primary/20 w-full rounded-xl border px-4 py-3 transition-all duration-200 focus:ring-2 focus:outline-none">
                    <option>Choose an option...</option>
                    <option>Option 1</option>
                    <option>Option 2</option>
                    <option>Option 3</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="text-text mb-2 block text-sm font-medium">
                    Textarea
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Enter your message here..."
                    className="border-border bg-surface text-text focus:border-border-focus focus:ring-primary/20 w-full rounded-xl border px-4 py-3 transition-all duration-200 focus:ring-2 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Progress & Level Bar */}
            <div className="bg-surface-elevated border-border rounded-3xl border p-8 shadow-lg">
              <h2 className="text-text mb-6 text-3xl font-bold">
                Progress Components
              </h2>

              <div>
                <h3 className="text-primary mb-4 text-xl font-semibold">
                  Level Bar
                </h3>
                <LevelBar currentUser={mockUser} />
              </div>
            </div>
          </div>
        )}

        {activeTab === "layouts" && (
          <div className="space-y-8">
            {/* Card Layouts */}
            <div className="bg-surface-elevated border-border rounded-3xl border p-8 shadow-lg">
              <h2 className="text-text mb-6 text-3xl font-bold">
                Layout Patterns
              </h2>

              {/* Cards Grid */}
              <div className="mb-8">
                <h3 className="text-primary mb-4 text-xl font-semibold">
                  Card Layouts
                </h3>
                <div className="grid gap-6 md:grid-cols-3">
                  {mockQuizzes.map((quiz) => (
                    <div
                      key={quiz.id}
                      className="group bg-surface border-border hover:bg-surface-elevated rounded-xl border p-6 transition-all duration-200 hover:shadow-md"
                    >
                      <div className="mb-4 flex items-center gap-3">
                        <div className="bg-primary/10 group-hover:bg-primary/20 flex h-12 w-12 items-center justify-center rounded-full transition-colors duration-200">
                          <svg
                            className="text-primary h-6 w-6"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="text-text group-hover:text-primary truncate font-medium transition-colors duration-200">
                            {quiz.title}
                          </h4>
                          <p className="text-text-muted text-sm">
                            {quiz.category}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span
                          className={`rounded-full px-3 py-1 text-sm font-medium ${
                            quiz.score >= 90
                              ? "bg-correct/10 text-correct"
                              : quiz.score >= 70
                                ? "bg-accent/10 text-accent"
                                : "bg-incorrect/10 text-incorrect"
                          }`}
                        >
                          {quiz.score}%
                        </span>
                        <svg
                          className="text-text-muted group-hover:text-primary h-4 w-4 transition-colors duration-200"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* List Layout */}
              <div>
                <h3 className="text-primary mb-4 text-xl font-semibold">
                  List Layout
                </h3>
                <div className="space-y-3">
                  {mockQuizzes.map((quiz) => (
                    <div
                      key={quiz.id}
                      className="group bg-surface border-border hover:bg-surface-elevated flex items-center justify-between rounded-xl border p-4 transition-all duration-200 hover:shadow-sm"
                    >
                      <div className="flex items-center gap-3">
                        <div className="bg-info/10 group-hover:bg-info/20 flex h-10 w-10 items-center justify-center rounded-lg transition-colors duration-200">
                          <svg
                            className="text-info h-5 w-5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-text group-hover:text-primary font-medium transition-colors duration-200">
                            {quiz.title}
                          </p>
                          <p className="text-text-muted text-sm">
                            {quiz.category}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-text-muted text-sm">
                          {quiz.score}%
                        </span>
                        <svg
                          className="text-text-muted group-hover:text-primary h-4 w-4 transition-colors duration-200"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "icons" && (
          <div className="space-y-8">
            {/* Custom Icons */}
            <div className="bg-surface-elevated border-border rounded-3xl border p-8 shadow-lg">
              <h2 className="text-text mb-6 text-3xl font-bold">
                Icon Components
              </h2>

              <div className="space-y-8">
                {/* Star Ratings */}
                <div>
                  <h3 className="text-primary mb-4 text-xl font-semibold">
                    Star Ratings
                  </h3>
                  <div className="flex flex-wrap items-center gap-6">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <div key={rating} className="text-center">
                        <StarLevel rating={rating} />
                        <p className="text-text-muted mt-2 text-sm">
                          {rating}/5
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Signal Levels */}
                <div>
                  <h3 className="text-primary mb-4 text-xl font-semibold">
                    Signal Levels
                  </h3>
                  <div className="flex flex-wrap items-center gap-6">
                    {[0, 5, 50, 500, 5000].map((count) => (
                      <div key={count} className="text-center">
                        <SignalLevel count={count} />
                        <p className="text-text-muted mt-2 text-sm">
                          {count} plays
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Common SVG Icons */}
                <div>
                  <h3 className="text-primary mb-4 text-xl font-semibold">
                    Common Icons
                  </h3>
                  <div className="grid grid-cols-4 gap-6 sm:grid-cols-8">
                    {commonIcons.map((icon) => (
                      <div key={icon.name} className="text-center">
                        <div className="bg-surface border-border hover:bg-surface-elevated mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-xl border transition-colors duration-200">
                          <svg
                            className="text-text h-5 w-5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d={icon.path}
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <p className="text-text-muted text-xs">{icon.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="bg-surface-elevated border-border rounded-3xl border p-8 text-center shadow-lg">
          <div className="mb-4 flex items-center justify-center gap-2">
            <div className="bg-primary/10 rounded-full p-2">
              <svg
                className="text-primary h-5 w-5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h3 className="text-text text-lg font-semibold">
              Design System Guidelines
            </h3>
          </div>
          <p className="text-text-muted mx-auto max-w-2xl">
            This design system showcases the complete visual language of
            QuizMaster, featuring **Montserrat** for headings, **Hind** for body
            text and UI elements, and **PT Serif** for special accents and
            quotes.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <span className="bg-primary/10 text-primary rounded-full px-3 py-1 text-sm font-medium">
              Montserrat + Hind
            </span>
            <span className="bg-accent/10 text-accent rounded-full px-3 py-1 text-sm font-medium">
              Semantic Colors
            </span>
            <span className="bg-info/10 text-info rounded-full px-3 py-1 text-sm font-medium">
              Consistent Components
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignShowcase;
