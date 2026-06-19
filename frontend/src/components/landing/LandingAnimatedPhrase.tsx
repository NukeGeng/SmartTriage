// LandingAnimatedPhrase.tsx - Color-accented rotating hero phrase.
type LandingAnimatedPhraseProps = {
  words: string[];
};

export function LandingAnimatedPhrase({ words }: LandingAnimatedPhraseProps) {
  const longestWord = words.reduce((longest, word) => (word.length > longest.length ? word : longest), "");

  return (
    <span className="st-landing-word-rotator">
      <span className="sr-only">{words[0]}</span>
      <span className="st-landing-word-ghost" aria-hidden="true">
        {longestWord}
      </span>
      {words.map((word, index) => (
        <span
          key={word}
          className={index === 0 ? "st-landing-word st-landing-word-active" : "st-landing-word"}
          style={{ animationDelay: `${index * 2400}ms` }}
          aria-hidden="true"
        >
          {word}
        </span>
      ))}
    </span>
  );
}
