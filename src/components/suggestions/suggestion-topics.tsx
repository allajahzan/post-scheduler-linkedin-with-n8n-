import { Check } from "lucide-react";

export const PREDEFINED_TOPICS = [
  "AI",
  "Data Engineering",
  "Web Development",
  "Design",
  "Marketing",
  "SaaS",
  "Startups",
  "Machine Learning",
  "Cloud Computing",
  "Cybersecurity",
  "Productivity",
];

interface SuggestionTopicsProps {
  selectedTopics: string[];
  toggleTopic: (topic: string) => void;
  showOther: boolean;
  setShowOther: (val: boolean) => void;
  customTopic: string;
  setCustomTopic: (val: string) => void;
}

export function SuggestionTopics({
  selectedTopics,
  toggleTopic,
  showOther,
  setShowOther,
  customTopic,
  setCustomTopic,
}: SuggestionTopicsProps) {
  return (
    <>
      <div className="flex flex-wrap gap-2">
        {PREDEFINED_TOPICS.map((topic) => {
          const isSelected = selectedTopics.includes(topic);
          return (
            <button
              key={topic}
              type="button"
              onClick={() => toggleTopic(topic)}
              className={`flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-medium transition-all cursor-pointer ${
                isSelected
                  ? "border-primary bg-primary text-primary-foreground shadow-sm"
                  : "border-border bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              {isSelected && <Check className="size-3.5" />}
              {topic}
            </button>
          );
        })}

        <button
          type="button"
          onClick={() => setShowOther(!showOther)}
          className={`rounded-full border px-3 py-1 text-sm font-medium transition-all cursor-pointer ${
            showOther
              ? "border-primary bg-primary/10 text-primary"
              : "border-border bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground"
          }`}
        >
          Other
        </button>
      </div>

      {showOther && (
        <div className="animate-in slide-in-from-top-2 fade-in duration-200">
          <input
            type="text"
            placeholder="Tell what you wanna get post suggestions about (comma separated)"
            value={customTopic}
            onChange={(e) => setCustomTopic(e.target.value)}
            className="w-full border-b border-border bg-transparent py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors"
            autoFocus
          />
        </div>
      )}
    </>
  );
}
