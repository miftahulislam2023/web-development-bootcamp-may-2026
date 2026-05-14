import { FeaturesPageBento } from "./bento";
import { FeaturesPageCta } from "./cta";
import { FeaturesPageHero } from "./hero";

/** `/features` route — hero + bento + CTA (distinct from home `features/home`). */
export function FeaturesPage() {
  return (
    <>
      <FeaturesPageHero />
      <FeaturesPageBento />
      <FeaturesPageCta />
    </>
  );
}
